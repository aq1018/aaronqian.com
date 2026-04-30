---
date: "2026-03-25T00:00:00.000Z"
title: "Version 0.2.1 Released"
description: tinyboot 0.2.1 fixes user-flash boot issues — broken interrupt vector tables, peripheral cleanup, and version reads.
project: tinyboot
aliases:
  - /projects/tinyboot/logs/2026-03-25-version-21-released/
tags:
  - tinyboot
  - announcement
---

Turns out shipping a bootloader and actually booting real firmware through it are two different things. The user-flash path was quietly broken, and the week after the initial release was mostly spent hunting down the bugs that only show up once an application is sitting behind the bootloader.

If you're new here, [tinyboot](https://github.com/aq1018/tinyboot) is my minimal serial bootloader for the CH32V003 and friends, squeezed into 1920 bytes of system flash. The 0.2.0 release got the protocol and the system-flash variant solid. 0.2.1 is the follow-up that makes the user-flash variant actually usable.

The headline fixes: a hardcoded `mtvec` in `qingke-rt` that pointed the interrupt vector table at the wrong place, APB2 peripherals leaking state from the bootloader into the app, a broken `app_version` read, an alignment UB in the boot metadata path, and a `defmt` panic on reset-into-bootloader. Plus another ~180 bytes shaved off the system-flash build, because every byte matters when you have 1920 of them.

<!--more-->

## User-Flash Fixes

### Broken Interrupt Vector Table

This was the main issue. `qingke-rt` hardcodes `mtvec` to `0x0`, which is correct when your application starts at the beginning of flash. But in the user-flash layout, the app is loaded behind the bootloader at a non-zero address, so the interrupt vector table points to the wrong place and everything falls apart. I added a `fix_mtvec!` macro on the application side to patch this up at startup.

### Peripheral Cleanup

The bootloader was not properly resetting APB2 peripherals before jumping to the application. If the bootloader had initialized UART or GPIO, those peripherals would still be in a configured state when the app started, which could cause conflicts. Now everything gets cleaned up before the jump.

### App Version Display

The app version was not being read correctly in the user-flash case, which also broke the app boot path. Fixed the `app_version` read along with the rest of the user-flash flow.

## Other Fixes

### Memory Alignment UB

The boot metadata reads had an alignment issue. I was reading raw bytes and reinterpreting them directly, which is undefined behavior when the source buffer is not properly aligned. The fix was to read into a `u32` buffer first and cast back to a `u8` array.

### Defmt Panics

When the application triggered a reset back into bootloader mode, `defmt` would panic during startup. This turned out to be a conflict in the startup assembly. I ended up splitting the bootloader runtime into a minimal and a full startup path to avoid the issue.

## Optimizations

I managed to shave off another ~180 bytes from the system-flash bootloader through a mix of aggressive inlining, merging the CRC and payload handling, batching RCC enable calls, and writing custom `read_exact`/`write_all` implementations. Every byte matters when you have 1920 bytes to work with.

## Other Improvements

All CH32V003 chip variants are now included in CI, and `tinyboot-cli` picked up `env_logger` support. Set `RUST_LOG=debug` for protocol-level diagnostics.
