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

Smart servos today cost $50+. The cheap end of the hobby market is $2-3 SG90 clones that take PWM and nothing else. Those two worlds don't overlap, and as a result, anyone building a hexapod on a hobbyist budget never gets to feel what closed-loop control actually feels like. The point of OSC is to close that gap. Add about $1 of BOM to a stock SG90 clone and you have a smart actuator at $3-4. Cheap enough that "every joint on the robot is smart" stops being a premium decision and starts being a default one.

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
