---
date: 2025-01-14T19:45:00-08:00
title: "PID tuning breakthrough — cascaded loop working"
description: Cascaded position+velocity PID finally stable. Overshoot from 15% to 2%, settling time 120 ms. Next up — RS-485 daisy-chain.
project: open-servo-core
aliases:
  - /projects/open-servo-core/logs/2025-01-14-pid-tuning/
tags:
  - firmware
---

Finally got cascaded PID stable. Overshoot down from 15% to 2%, settling time 120ms.

<!--more-->

Gains:

- Outer loop (position): Kp=2.5, Ki=0.1, Kd=0.8
- Inner loop (velocity): Kp=1.2, Ki=0.05, Kd=0.3

Current sensing working. Drawing ~800mA at stall. Need heatsink for FET.

Next: Test bus comms (RS-485) with daisy-chained servos.
