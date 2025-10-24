---
date: 2025-01-05T11:20:00-08:00
title: 'CH32 migration started'
tags:
  - hardware
  - cost-reduction
project: 'smart-servo'
---

Switching from STM32F301 to CH32V303 to cut BOM cost.

Pros:

- $0.80 vs $2.40 per unit
- RISC-V core (learning opportunity)
- Same peripherals (ADC, timers, UART)

Cons:

- Toolchain less mature
- Need to port HAL code
- Debugging might be painful

Started porting. ADC and PWM working. Timer interrupts next.
