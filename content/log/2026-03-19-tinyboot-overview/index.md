---
date: "2026-03-19T00:00:00.000Z"
title: "tinyboot — Project Overview"
description: Rust based embedded bootloader for resource constrained MCUs such as CH32
project: tinyboot
aliases:
  - /projects/tinyboot/
tags:
  - tinyboot
  - announcement
---

A Rust bootloader that squeezes into the CH32V003's 1920-byte system flash, with CRC16 validation and trial boot, and still leaves the entire 16KB user flash free for your application.

tinyboot is the bootloader half of [OpenServoCore](https://github.com/OpenServoCore), my effort to turn cheap MG90S-class servos into networked smart actuators. Servos need field updates over the same TTL bus they take commands on, and they have very little flash to spare. So tinyboot has to be tiny, robust enough to never brick the part, and portable across the CH32 family.

This post is the project overview: what tinyboot is, the feature set, the chips it targets (V003 working today, V103 in progress, the rest of the V0/V2/V3/X line planned), and the transports it speaks (UART and RS485 working, USB planned). If "Rust in 1920 bytes" sounds like a typo, that's fair, it surprised me too.

<!--more-->

GitHub: [OpenServoCore/tinyboot](https://github.com/OpenServoCore/tinyboot)

## Overview

Rust bootloader for resource-constrained micro-controllers. Fits in the CH32V003's 1920-byte system flash with full trial boot, CRC16 app validation, OB-based metadata, and version reporting — leaving the entire 16KB user flash for the application.

## Key Features

- **Tiny** - footprint designed to fit in system flash
- **Robust** - CRC16 and trail boot to prevent bricking
- **Configurable** - Configurable transports, hardware pins
- **Extendable** - Designed to be easily extended to other chips / chip families

## Supported Chips

- `CH32V003` - Working
- `CH32V103` - In Development
- `CH32V002/V004/V005/V006/V007` - Planned
- `CH32X035` - Planned
- `CH32V203` - Planned
- `CH32V307` - Planned

## Supported Transports

- `UART` - Working
- `RS485` (UART with `TX_EN` pin) - Working
- `USB` - Planned
