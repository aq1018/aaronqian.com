---
date: 2025-01-05T11:20:00-08:00
title: "CH32 migration started"
description: Moving OpenServoCore from STM32F301 to CH32V303 to cut per-unit cost from $2.40 to $0.80, at the price of porting the HAL.
project: open-servo-core
aliases:
  - /projects/open-servo-core/logs/2025-01-05-ch32-migration/
tags:
  - ch32
---

Switching from STM32F301 to CH32V303 to cut BOM cost.

<!--more-->

Pros:

- $0.80 vs $2.40 per unit
- RISC-V core (learning opportunity)
- Same peripherals (ADC, timers, UART)

Cons:

- Toolchain less mature
- Need to port HAL code
- Debugging might be painful

Started porting. ADC and PWM working. Timer interrupts next.
