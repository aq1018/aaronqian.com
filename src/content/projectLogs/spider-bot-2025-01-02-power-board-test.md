---
date: 2025-01-02T14:30:00-08:00
title: 'Power board v1 tested'
tags: ['hardware', 'power-systems']
project: 'spider-bot'
---

Built power distribution board:

- 6V input (4x AA for now)
- 12 servo headers
- Bulk capacitors to handle current spikes

Tested with 4 servos moving. Voltage sag: 5.8V → 5.2V under load.

Issue: Brown-out resets when all servos move simultaneously.

Fix: Need bigger caps (1000µF → 2200µF) or external regulator.

LiPo upgrade will help, but power sequencing might be needed.
