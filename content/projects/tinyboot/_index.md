---
title: tinyboot
description:
  Rust based embedded bootloader for resource constrained MCUs such as CH32
status: in-development
links:
  github: https://github.com/OpenServoCore/tinyboot
aside: Fits in the CH32V003's 1920-byte system flash!
order: 2
---

## Overview

Rust bootloader for resource-constrained micro-controllers. Fits in the
CH32V003's 1920-byte system flash with full trial boot, CRC16 app validation,
OB-based metadata, and version reporting — leaving the entire 16KB user flash
for the application.

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
