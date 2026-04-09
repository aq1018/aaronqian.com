---
date: "2026-03-07T17:32:38.071Z"
title: "CH32V006 Based Dev Board For OpenServoCore"
draft: true
tags:
  - hardware
---

As I mentioned in earlier logs, I am migrating OpenServoCore from an
STM32F301-based architecture to a cheaper CH32V006-based one. The first step was
to create a development board that I could use for firmware development. After a
few weeks of work in KiCad, along with several rounds of PCB review from the
Reddit community, I finally have a design that is ready to share here.

Just in case you landed here with no prior context, this board is intended to
serve as the firmware development platform for the OpenServoCore, A project to
turn low-cost servos like the MG90S into smart actuators with cascade control
and a DYNAMIXEL-style communications over single wire UART (DXL TTL).

**Update 04/08/2026**

There was some issues with this board, specifically, The VCC/VDD was swapped,
ans some silk screen labels were wrong. I have updated them here, and now the
images are correct.

## Rendering

Here is a quick peak of the board.

{{<model src="servo-dev-board-ch32v006.glb" alt="3D model of CH32V006 based OpenServoCore dev board" aspect="4/3" tilt="-50">}}

## Features

Comparing to the STM32 based dev board, which only has current sensing, this
design expanded upon the old board's capabilities so we can implement more
sophisticated control scheme in the future.

### Current Sensing

Pins: `ISNS+`, `ISNS-`

The STM32 based board used current mirroring from the DRV8231ADSG motor driver.
In order to reduce BOM cost, I have decided to use the low cost DRV8837 instead.
The current sensor is built around a low side shunt resistor and a pair of
kelvin traces that leads to CH32V006's internal op-amps with programmable gain.
This increases the footprint a bit, but reduces the cost per board for a bout $1
each.

### Voltage Sensing

Pins: `VSNA`, `VSNB`

Previous STM32 board didn't have voltage sensing, which limits the visibility of
the motor in system control. This board now adds voltage sensors on both motor
terminals via a voltage divider. Now it's possible to sense Back EMF and opens
the possibility to more accurate control loops. This can also be used to
approximate system voltage.

### Temperature Sensing

Pin: `VNTC`

STM32F301 has an internal temperature sensor which CH32V006 lacked. I used this
as the base temperature for the motor winding temperature estimation. So the new
board has to have some way to sense ambient temperature to match. This is done
via a 10kΩ NTC, very low cost.

### Position Sensing

Pin: `VPOS`

This works mostly the same as previous STM32 based board. I added an 4.7kΩ/0.1µF
RC filter to smooth out the jittering as a safety measure. Probably not needed,
but it's just extra insurance.

### Motor Encoder Expansions

Pins: `ENCA`, `ENCB`

There are two more ADC channel left on the MCU, and for future expansion, the
most likely use would be an optical quadrature encoder similar to Adam's
ServoProject. So I made a connector with `ENCA`, `ENCB`, `3V3`, `GND` for future
expansions.

### Single Wire UART (Dynamixel TTL style)

Pins: `TX`, `RX`, `TX_EN`

The STM32 dev board only had regular UART connectors. This board integrates
Single Wire UART intended to directly integrate with existing Dynamixel TTL
style connectors. This is achieved by using a `74LVC2G241` dual tristate buffer
used in
[Dynamixel Reference Design](https://emanual.robotis.com/docs/en/dxl/x/xm430-w210/#ttl-communication)
