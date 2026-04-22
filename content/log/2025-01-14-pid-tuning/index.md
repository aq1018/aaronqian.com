---
date: 2025-01-14T19:45:00-08:00
title: 'PID tuning breakthrough — cascaded loop working'
project: open-servo-core
aliases:
  - /projects/open-servo-core/logs/2025-01-14-pid-tuning/
tags:
  - firmware
---

Finally got cascaded PID stable:

- Outer loop (position): Kp=2.5, Ki=0.1, Kd=0.8
- Inner loop (velocity): Kp=1.2, Ki=0.05, Kd=0.3

Overshoot down from 15% to 2%. Settling time: 120ms.

Current sensing working. Drawing ~800mA at stall. Need heatsink for FET.

Next: Test bus comms (RS-485) with daisy-chained servos.
