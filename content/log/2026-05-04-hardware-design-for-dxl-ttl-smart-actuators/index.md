---
date: "2026-05-04T00:00:00.000Z"
title: "Hardware Design for DXL-TTL Smart Actuators"
description: "Pillar deep dive on the hardware behind OpenServoCore's cloned-servo-class smart actuators. Walks the design philosophy, the constraints it produces, the architecture that satisfies them, and the component choices that instantiate the design."
project: open-servo-core
draft: true
tags:
  - hardware
---

[OpenServoCore](https://github.com/OpenServoCore) (OSC) is an effort to turn cheap SG90/MG90S-class hobby servos into smart actuators. This article is the design reference for the hardware: the principles that shape the design, the constraints those principles produce, the architecture that satisfies the constraints, and the specific component choices that instantiate the architecture. The OSC Dev V006 Rev B board is the running reference instantiation throughout.

<!--more-->

## Design philosophy

Four things drive every decision on this board: making smart servos cheap, making them perform "pretty good," making them easy to use, and making the whole thing open source. Almost everything else (the chip choice, the buffer, the connector pinout, the OTA story) is downstream of one of these four.

### Cheap

Smart servos today cost $50+. The cheap end of the hobby market is $2-3 SG90 clones that take PWM and nothing else. Those two worlds don't overlap, and as a result, anyone building a hexapod on a hobbyist budget never gets to feel what closed-loop control actually feels like. The point of OSC is to close that gap. Add about $1-2 of BOM to a stock SG90 clone and you have a smart actuator at $3-5. Cheap enough that "every joint on the robot is smart" stops being a premium decision and starts being a default one.

Most of that BOM is bought back through firmware/hardware co-design, not through cheaper parts of the same kind. The CH32V006 has on-chip programmable opamps and an internal comparator, so the current-sense path costs zero external analog parts. The ADC is fast enough that a low-side shunt plus a software filter replaces a dedicated current-sense amp IC plus a hardware low-pass. A single tristate buffer plus the MCU's UART replaces a discrete RS-485-style transceiver. I didn't pick the chip because it's cheap in isolation. I picked it because its peripherals let me delete other chips.

### "Pretty good"

The mechanical parts of an SG90/MG90-class servo are cheap, and they show it. The pot is non-linear at the ends of travel. The gear train has measurable backlash. The motor cogs and has its own dead zone around zero current. None of those get fixed by upgrading parts on a $1 board, because $1 doesn't buy a better pot or a better gear train.

The board can't fix the mechanical parts, but the firmware on it can compensate for them. Per-unit pot linearization, backlash compensation in the position loop, friction and cogging models in the velocity loop. None of these tricks are exotic. The bet is that paired with the stock mechanicals and a tight cascade controller, they get OSC close to Dynamixel-tier accuracy. The catch is that several depend on per-unit calibration, so calibration itself has to be easy enough that users actually run it.

[Adam Bäckström's ServoProject](https://github.com/adamb314/ServoProject) is the existence proof for how far this approach can be pushed. OSC isn't aiming that high near term, but the encoder header on the dev board is wired for either TIM2 quadrature or ADC analog inputs so that route stays available.

### Easy for the user

Easy breaks down into four pieces: installing the board, integrating with an existing ecosystem, calibrating the servo once it's wired up, and updating the firmware later.

The install is a board swap. The OSC swap board fits inside the stock servo chassis and reuses the original 3-pin servo connector for DATA/+/-. Open the servo, lift the old PCB, drop the new one in, close it up. The wire now carries UART instead of PWM.

The board speaks Dynamixel Protocol 2.0, the same protocol Robotis uses on their Dynamixel servos. There's already a working ecosystem around it: host libraries, GUI tools, ROS packages, sample code, troubleshooting threads. A user who already runs Dynamixels can wire OSC servos onto the same bus and use the same software. A user new to smart servos gets to lean on years of community-written tooling. Inventing a custom protocol would have meant rebuilding that ecosystem for no good reason.

Calibration is the next piece, and most of it can be automatic. The board has the sensors to identify the motor in firmware: current and voltage sensing gives motor resistance from a DC step, terminal voltage sensing gives back-EMF, and high-resolution current sensing gives inductance L from a step response. That's enough to seed the inner current loop's tuning without the user doing anything. Pot linearization, PWM dead-zone, and the friction model are less figured out on the auto-ID side. For the parts that genuinely need a physical fixture, a 3D-printable calibration rig is the obvious answer. None of that is designed yet. The goal is to push as much of calibration into firmware as possible, and the rest into something the user can print at home.

The fourth piece is updates. Without OTA, pushing a firmware update to a servo that's already installed means: unscrew the chassis, pull the servo from its mount, open it up, desolder the board, wire up a programmer, flash it, then reverse the whole thing. Times however many servos are on the robot. Realistically, once a build is done, it doesn't happen. [tinyboot](https://github.com/OpenServoCore/tinyboot) does OTA over the same single-wire UART the servo is already using for control, so a whole chain of OSC servos can be reflashed without unplugging anything.

### Open source everything

Everything that ships with OSC is, and will be, open source. The firmware and bootloader are dual-licensed under MIT or Apache 2.0. The hardware design files (KiCad project, gerbers, BOMs) will be under CERN-OHL.

I'd like people to actually use this thing, and I'd like the project to get better through contributions from people who aren't me. Someone might lay out a variant for a servo class I'm not planning to cover, port the firmware to a chip I don't know exists, or contribute a control-loop trick I wouldn't have thought of.

## Constraints

The four principles produce concrete constraints that the architecture has to satisfy. None are surprising on their own, but the combination rules out a lot of the "natural" design choices.

### From cheap

About $1-2 of BOM, total. That budget covers an MCU, a motor driver, a bus buffer, an LDO, and the passives that go around them, but only if every one of them is at the cheap end of its category. An STM32, or any other name-brand MCU at $1-2, eats the whole budget on its own. There's no room for a separate current-sense amp, a discrete bus transceiver, a dedicated gate driver, or a second MCU for comms. Anything the main MCU's peripherals can replace has to go.

Beyond price, the MCU has to bring on-chip programmable opamps, an analog comparator, a fast ADC, and enough timer hardware to drive a motor and capture an encoder. Without those peripherals on the die, the BOM target doesn't close.

Same logic applies to the motor driver. A basic H-bridge with separate enable and direction lines is a few cents in volume. Drivers with integrated current sensing, current-mirror outputs, fault flags, and SPI configuration cost several times more. The cheap path is the basic H-bridge plus a low-side shunt resistor feeding the MCU's PGA, not a smart driver with current sensing built in. The MCU absorbs the function for the price of a resistor.

### From "pretty good"

The inner current loop has to run in the kHz range. That sets the floor for ADC sample rate and the budget for the firmware loop on each sample. Velocity and position loops sit on top and run an order of magnitude slower.

Sampling has to land at the right phase of the PWM waveform, where motor current equals its average. That requires center-aligned PWM, with the timer triggering the ADC at the center of the on-time and DMA writing samples to RAM. Firmware reads the buffer; it doesn't run on individual conversions. The MCU has to support that whole chain on-chip.

The current loop also requires a hardware fault path. A stall or a short across the motor terminals can dump destructive current through the H-bridge in microseconds, and firmware can't react that fast. The OPA that gains the shunt for the control loop also feeds an on-chip comparator that gates the motor driver's enable directly when current crosses threshold. The MCU has to route the whole chain (shunt → OPA → CMP → driver disable) without going through the CPU.

Auto-ID of motor parameters (R, L, back-EMF) only works if the sensing path is clean enough to see those signals. The shunt connects through a Kelvin trace into a differential PGA, the terminal voltage needs a divider, and the ADC needs enough resolution that an L step response isn't lost in noise. Firmware also has to tare the shunt offset on every boot and run periodic calibration; cheap opamps drift.

The position-sense path stays open-ended. Pot ADC for stock servos, quadrature encoder for upgraded ones. The same board has to cover both cases without a respin. The pot input also keeps a small RC filter on the analog side. Anti-aliasing is one of the things firmware can't do after the sampler, and a resistor and a capacitor are cheap enough to fit.

### From easy

The board has to fit inside a stock SG90/MG90 chassis. The original PCB it replaces is roughly 10x12mm, and the new board has to land in the same envelope, with the original 3-pin servo connector in its original position and mounting holes on the original standoffs.

There's no PCB area for chips the MCU's peripherals can replace, just like there's no BOM headroom for them.

The bus is single-wire half-duplex, multi-drop. TX and RX share one line, so the board needs a hardware mechanism to flip direction without dropping bytes or fighting other servos on the bus. The buffer has to tristate cleanly when not transmitting.

DXL Protocol 2.0 sets the framing. The MCU's UART has to hit the protocol's baud rates with enough jitter margin that CRCs don't false-fail.

OTA puts the bootloader and the application on the same UART. Enough flash for both, a clean handoff between them, and a reset path the app can trigger from a DXL packet.

### From open source

No exotic parts. Anything in the BOM has to be available from multiple distributors at the kind of stocking levels JLCPCB and LCSC carry. Allocation-limited parts, NDA-only chips, and anything requiring a vendor relationship to buy in single-board quantities are out.

Open toolchain. KiCad for schematic and layout, Rust via the ch32-rs ecosystem for firmware, no proprietary IDE in the build chain. A new contributor clones the repo, installs the toolchain off rustup and the standard package manager, and is building.

Rust on this class of MCU is honestly a riskier choice than plain old C. The bet is that Rust's more modern language design balances the risk, and that picking Rust over yet another C codebase makes the project more interesting to work in, which translates into more experimentation and more learning from the people who pick it up. [ch32-rs](https://github.com/ch32-rs) has enough tooling and library support to build on: [ch32-metapac](https://github.com/ch32-rs/ch32-metapac), [qingke, and qingke-rt](https://github.com/ch32-rs/qingke) cover the base, and the no-std crates for embedded are mostly there. The maintainers are open to contributions; I've upstreamed several fixes that came out of writing [tinyboot](https://github.com/OpenServoCore/tinyboot) ([ch32-data #29](https://github.com/ch32-rs/ch32-data/pull/29), [#32](https://github.com/ch32-rs/ch32-data/pull/32); [qingke #17](https://github.com/ch32-rs/qingke/pull/17), [#19](https://github.com/ch32-rs/qingke/pull/19), [#21](https://github.com/ch32-rs/qingke/pull/21)).

### The real conflict

The CH32V006 sits at the edge of good enough. Its ADC is less accurate than what the more-expensive families offer, and the peripheral set, while it covers what the BOM-deletion strategy needs, isn't class-leading at any single thing. Firmware has to close the analog gap with oversampling, taring, and per-unit calibration tables. Anything firmware can absorb, it does.

What firmware can't absorb gets an external part, but only a cheap, small one. The V006 has no on-chip temperature sensor (an STM32 would), so firmware has no internal reference for thermal drift in the shunt or the opamp. An external NTC fills that role: a few cents, a few square millimeters of board, well inside both budgets. The constraint isn't "no external parts." It's "no external parts whose function the MCU could absorb, and only the cheapest possible parts where it can't."

The bus buffer is another conflict, this time easy versus cheap. The MCU's UART supports half-duplex natively, so the buffer could be deleted, saving a few cents and a few square millimeters. Two "easy for the user" wins keep it. First, the board has to run from anything in the 1S-to-2S LiPo range so users get a wide power source choice. 1S nominal is 3.7V, which can't supply a 5V rail without a boost converter, and the boost converter costs more parts and area than the buffer would save. So the MCU runs on 3.3V from a simple LDO that handles the whole 1S-to-2S input range, and there's no 5V rail on the board. Second, OSC servos have to share a bus with 5V Dynamixels, which assert 5V on the wire. A 3.3V MCU GPIO can't take that directly. The OSC bus itself is 3.3V; the buffer is there because its input is 5V-tolerant, protecting the MCU when something else on the bus drives high.

## Architecture

The MCU is the hub, and every other subsystem hangs off it: power conditioning, current and position sensing, motor drive, the bus interface, and the OTA flash channel. Each subsystem is the architectural answer to one or more constraints from the previous section.

### Block diagram

```
Power:
  Battery (1S-2S) ─→ LDO ─→ 3.3V rail (MCU, buffer, pot reference, NTC pullup)
  Battery ─────────────────→ Motor driver Vbat

Sensing:
  Shunt ─→ OPA / PGA ─→ ADC                              (current loop)
                      ↓
                      CMP ─→ TIM1 break input ─→ PWM off (hardware OCP fault)
  Pot ─→ RC filter ─→ ADC                                (position)
  Vbat and motor terminals ─→ divider ─→ ADC             (voltage monitoring)
  NTC ─→ ADC                                             (temperature compensation)

Actuation:
  Control loop ─→ Advanced TIM center-aligned PWM ─→ DRV ─→ Motor

Comms:
  MCU USART ←→ Buffer (5V-tolerant input) ←→ DXL bus (3.3V, half-duplex)

Programming / OTA:
  SWD header (initial flashing via WCH-LinkE)
  DXL "enter bootloader" packet ─→ tinyboot in system flash ─→ reflashes app
```

A proper block diagram will replace this in a later revision. The prod board has no encoder; position comes from the existing servo pot. A future addon flex PCB could add an encoder for higher-resolution feedback, though fitting one into the SG90 or MG90 chassis without major modifications is the tricky part.

### Power

The battery input spans the 1S-to-2S LiPo range, roughly 3.3V to 8.4V across cell counts and state of charge. An LDO drops the input to a 3.3V rail that powers the MCU, the bus buffer, the pot's top reference, and the NTC pullup. The on-die OPAs and comparator are powered through the MCU's own VDD, so they ride on the same 3.3V rail without needing a separate connection. The motor driver takes the battery voltage directly on its Vbat input, so motor PWM amplitude tracks battery voltage and the LDO never sees motor current.

A bulk capacitor on Vbat handles the inductive transients from PWM switching the motor. Local bypass caps sit at each IC's supply pin. There's no separate analog supply rail; the 3.3V rail does both digital and analog duty.

### MCU peripheral assignment

The MCU has to provide several peripherals concurrently, each tied to a specific subsystem:

- An advanced timer with center-aligned PWM mode, for the motor drive output. Center alignment is what makes the PWM-ADC sync work, sampling current at the same point in every PWM cycle.
- A break input on that same advanced timer, wired to the comparator output, so an overcurrent event blanks PWM in hardware without firmware involvement.
- A multi-channel ADC with several inputs: current sense (post-OPA), pot wiper, motor terminal voltage dividers, battery voltage, and NTC.
- Timer-triggered ADC conversion, so each sample fires at the same PWM phase.
- DMA on the ADC, writing each conversion result into a circular buffer in RAM. Firmware reads the buffer, never an individual conversion.
- Half-transfer and transfer-complete interrupts on the DMA, to wake the control loop at a known cadence.
- An on-die programmable opamp / PGA with differential inputs, gaining the shunt voltage into ADC range without external parts.
- An on-die comparator whose output can be routed to the advanced timer's break input, closing the hardware overcurrent path described above.
- USART with single-wire half-duplex mode, so TX and RX share the same physical pin internally and the buffer can flip direction with a single GPIO.

This is a lot to ask of a sub-$0.50 MCU. The CH32V006 brings all of it.

### Control architecture

The end-state controller is a three-layer cascade: position outer, velocity middle, current inner. Each layer runs at its own rate, and each outer layer's output is the next inner layer's setpoint.

Getting there is staged across firmware versions. v1 ships a simple PID on position, just enough to validate that the motor turns and tracks a setpoint over the bus. v2 lands the cascade in working but basic form: a current loop wakes on the PWM-ADC interrupt, a velocity loop runs an order of magnitude slower off the latest position estimate, a position loop runs slower again off the user's commanded position. v3 adds motor modeling and feed-forward compensation, so the controller predicts what the motor needs instead of only reacting to error. Each version is a usable servo on its own; the cascade buys precision and the model buys repeatability.

The execution model underneath all three versions is the same: two-context concurrency, no async runtime, no RTOS. The PWM timer triggers ADC conversion, the DMA writes results into a circular buffer, the half-transfer or transfer-complete interrupt wakes the control loop, the loop computes a new PWM duty and writes it to the timer's compare register. That entire path runs in IRQ context. The main loop, outside IRQ, handles DXL bus packets, calibration routines, bootloader transitions, and bookkeeping with no hard deadline. With 8 KB of SRAM and a single in-order RISC-V core, that two-context split is enough; an async runtime would just spend memory the chip doesn't have.

### Bus topology

The MCU's USART runs in single-wire half-duplex mode: TX and RX share the same physical pin internally. That pin connects to the buffer's I/O.

The buffer is two tristate halves wired anti-parallel inside the same package. One half drives bus-to-MCU when the MCU is receiving; the other half drives MCU-to-bus when the MCU is transmitting. A single GPIO (TX_EN) selects which half is enabled. TX_EN is a line selector, not a transmit enable in the RS-485 sense; switching it doesn't just enable transmit, it also gates the receive path off so the MCU doesn't see its own TX echo through the buffer.

When the MCU isn't transmitting, the bus-side output is tristated, so multiple OSC servos (and other DXL devices) can share the same wire without contention.

The OSC bus runs at 3.3V; there is no 5V rail anywhere on the prod board. The buffer was picked specifically for its 5V-tolerant inputs, so if an off-the-shelf DXL device on the same bus drives 5V, the buffer's input takes it without damage. That is the level-compatibility story for OSC: 3.3V on our side, 5V-tolerant at the boundary, no level shifter and no second rail.

### Timing

The system has two clocks that matter and one seam between them.

The control loop runs at 20 kHz, triggered by the center-aligned PWM. ADC sampling fires at a fixed PWM phase, away from the switching edges that contaminate the shunt voltage with transients. DMA writes the conversion result, the half-transfer or transfer-complete interrupt wakes the control loop, and the loop has one PWM period (50 µs at 20 kHz) to read the buffer, run the math, and write a new compare value before the next sample arrives.

The outer loops decimate from there. Velocity is a candidate for 4 kHz, position for 1 kHz, both as integer divisors of the 20 kHz inner rate so they hit a known PWM cycle with no aliasing. The exact decimation is still undecided; what's locked is that they tick on integer divisors of the inner loop instead of on a free-running timer.

The DXL bus targets 1 Mbps, though that's a design intent rather than a guarantee until firmware v2 measures real-world margin. At 1 Mbps each byte costs 10 µs (8 data bits plus start and stop), so even a multi-byte DXL 2.0 instruction packet runs well under a millisecond on the wire. Response uses the standard Return Delay Time field at its default value, so the firmware waits the configured RDT before transmitting, giving the host a deterministic window to switch its own bus direction.

The seam between the two clocks is the TX_EN flip. The current plan is to drive TX_EN high before kicking off the DMA-fed UART transmission, then latch it back low inside the USART's transmission-complete interrupt. That ordering matters: if TX_EN goes low while the last bit is still being shifted out, the buffer tristates mid-byte and the receiver sees a corrupted stop bit. The transmission-complete flag fires after the last stop bit has fully shifted out of the USART's hardware, which is the only correct moment to release the bus.

UART receive timing is less settled. A working option is DMA into a circular buffer with SysTick or a general-purpose timer providing inter-byte timeout detection, so a stalled packet doesn't sit in the buffer indefinitely. That's a candidate, not a commitment; firmware v2 will pick the exact mechanism after the v1 PID controller is up.

The current plan is for the control-loop IRQ to preempt everything else. A motor running open-loop because a UART byte stretched the IRQ window is a worse failure than a single dropped DXL packet, which the host can retry at protocol level. This isn't fully nailed down yet; the v1 firmware will validate that the priority works in practice. The UART path uses DMA for the same reason; received bytes land in the buffer regardless of when the firmware gets around to looking, so a delayed UART IRQ doesn't lose data.

Flash writes are the third timing-sensitive operation. The CH32V006's flash write stalls the core long enough to drop a control-loop tick and let the motor coast, which is unacceptable while torque is on. The standard DXL convention is the right answer: writes to EEPROM are only accepted when Torque Enable is 0, which is exactly when the motor isn't being actively held.

### Flash partition and OTA

[tinyboot](https://github.com/OpenServoCore/tinyboot) lives in the V006's system flash region (the area normally reserved for the factory ISP bootloader). That leaves the entire user flash for the application, minus one flash page held aside for bootloader metadata. The metadata page records what tinyboot needs to make a boot decision: an active-app marker, a CRC over the app, a version, and similar bookkeeping. Exact contents and partition layout will land when firmware v2 wires tinyboot into the boot path.

The OTA flow is:

1. The host sends a DXL packet asking the app to enter the bootloader.
2. The app sets a flag in the metadata page and resets the MCU.
3. The boot path checks the flag and jumps into tinyboot in system flash.
4. tinyboot receives the new firmware over the same UART the app uses for control, packet by packet.
5. tinyboot writes the firmware into user flash and updates the metadata page with the new version and CRC.
6. tinyboot resets. The boot path sees no enter-bootloader flag and jumps into the user flash app.

## Components

## Annotated reference schematic
