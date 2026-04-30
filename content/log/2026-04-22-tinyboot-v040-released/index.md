---
date: "2026-04-22T00:00:00.000Z"
title: "tinyboot v0.4.0 Released — The API is Stable"
description: tinyboot v0.4.0 marks API stability — protocol design, crate structure, and CH32V103 support are settled enough to commit to.
project: tinyboot
tags:
  - tinyboot
  - announcement
---

You may have noticed v0.3.0 came and went without an announcement. That was deliberate. Crates were merging, APIs were shifting, the wire protocol was being reworked, and I didn't want to ship a writeup that'd be stale in two weeks. v0.4.0 is the release where the dust finally settles.

If you're new here, [tinyboot](https://github.com/OpenServoCore/tinyboot) is a minimal Rust bootloader for resource-constrained MCUs. It fits in 1920 bytes of system flash and gives you CRC-validated firmware updates over UART, with trial boot and automatic fallback to service mode. I'm building it as part of [OpenServoCore](/projects/open-servo-core/) so you can OTA-update servo firmware over the same single-wire DXL TTL bus, without tearing the robot apart.

What's in v0.4.0: full CH32V00x family support (V002 through V007, including the V006 that the OSC dev board runs on), TX_EN now fits in system flash on every supported variant, the three `tinyboot-ch32-*` crates collapsed into one, 24-bit protocol addresses with per-command flag bits, two nasty half-duplex bugs squashed during dev-board validation, and a docs rewrite aimed at users instead of maintainers. Plus a quiet announcement: with the API stable, active feature work pauses while my attention shifts to the OSC firmware rewrite.

<!--more-->

## Links

- Repository: [OpenServoCore/tinyboot](https://github.com/OpenServoCore/tinyboot)
- Handbook: [openservocore.github.io/tinyboot](https://openservocore.github.io/tinyboot)
- Changelog: [CHANGELOG.md](https://github.com/OpenServoCore/tinyboot/blob/main/CHANGELOG.md)

## What is tinyboot

tinyboot is a minimal bootloader for resource constrained MCUs. It is written in Rust, and it fits in 1920 bytes of system flash, leaving all user flash free for your application, except a small page (64 bytes on V003) of user flash to store boot metadata. It gives you CRC-validated firmware updates over UART with trial boot and automatic fallback to bootloader service mode when trials run out. The kind of safe OTA update story you'd expect from a much larger bootloader, squeezed into the constraints of a $0.22 MCU.

It's currently focused on the CH32 family, but the core is chip-agnostic and designed to be portable. If you're interested in bringing tinyboot to another chip family, see the porting section of the [handbook](https://openservocore.github.io/tinyboot/porting.html).

I'm building it as part of [OpenServoCore](/projects/open-servo-core/), an open-source smart servo platform. tinyboot handles the OTA updates via the existing single wire UART (Dynamixel TTL), so you don't have to tear your robot apart and open up each servo, unsolder the board just to flash a new firmware.

### Platform Support

| Family   | Status            |
| -------- | ----------------- |
| CH32V003 | Supported         |
| CH32V00x | **New in v0.4.0** |
| CH32V103 | Supported         |
| CH32X03x | Planned           |

## V00x Support

The biggest addition in v0.4.0 is full support for the CH32V00x family: V002, V004, V005, V006, and V007. This is the release that matters most for OpenServoCore, because the OSC dev board runs on the CH32V006. Hardware validation for this release was done on the actual dev board.

Getting here wasn't entirely smooth. I ran into a hardware issue where the RX line wouldn't work without driving the inverse TX_EN line, which took a scope session to figure out. But that's a story for another post. I'm just glad I was able to finally get RX to work and complete the hardware test.

## Everything Fits

TX_EN support used to overflow system flash on some chip variants. That's not acceptable. TX_EN isn't optional for OpenServoCore. It's required for half-duplex RS-485 / DXL TTL communication.

As of v0.4.0, all chip variants compile with TX_EN enabled and fit in system flash. The V103 was the outlier. It has a split flash layout, and I moved the UART transport into the second region to make it fit. That trick deserves its own post. Down the road, that second region also has enough room for a USB transport, so flashing via USB on V103 is a real possibility.

## Crate Restructure

The previous three separate crates (`tinyboot-ch32-boot`, `-app`, `-hal`) are now merged into a single `tinyboot-ch32` crate with `boot`, `app`, and `hal` modules. There's also a new `tinyboot-ch32-rt`, a minimal runtime because `qingke-rt` is too large for system flash.

This wasn't a planned refactor. It was the natural result of continuous iteration during tinyboot's early development. I'd rather get the architecture right early by sacrificing API stability than lock in the wrong abstractions.

`tinyboot-ch32` is currently git-only and not published to crates.io. It depends on a git version of `ch32-metapac` that includes flash fixes for the V00x family that haven't been released yet.

## Protocol and API Changes

The wire protocol now uses 24-bit addresses instead of 32-bit, freeing the fourth byte for per-command flags. 24 bits is still 16MB of addressable space, more than enough for these MCUs. The standalone `Flush` command is gone; it's now a flag on the final `Write`. Cleaner on the wire, simpler in the dispatcher, improves the developer experience, and best of all no size increase due to zero-cost abstractions via Rust's union types.

On the API side: `BootMode` became `RunMode` to separate the concept of boot flash region selection vs bootloader run mode (handoff or service). `BootClient` was also removed after the crates merge. Boolean parameters in the public API became semantic enums (`Duplex::Half` instead of `half_duplex: true`). Last but not least, flash lock/unlock is now scoped per operation instead of manual.

## Bug Fixes

Two nasty half-duplex communication bugs, both found during hardware validation on the dev board:

The dispatcher wasn't flushing the transport after sending a response. On a full-duplex UART you'd never notice, but on RS-485 / DXL TTL half-duplex the data just sits in the buffer and never goes out on the wire.

The ring buffer wasn't resetting its head/tail pointers after flushing buffered writes to flash. The buffer was logically empty but the pointers were advanced, so subsequent writes would eventually wrap incorrectly. I didn't notice this before because I didn't do back-to-back `flash` commands with the `tinyboot` CLI.

## Docs Overhaul

Documentation has been completely rewritten for users instead of maintainers, and a user handbook has been created. When the architecture is changing every release, writing user-facing docs is a losing game. Now that things have stabilized, it actually makes sense.

## What "Stable" Means

To be clear, tinyboot is not production-grade. But as of v0.4.0, it's stable in the ways that matter:

- **Architecture stable**: no more big crate restructures.
- **Protocol stable**: no more wire format changes.
- **Features stable**: all core features compile and fit on all supported chips.
- **Behavior stable**: no obvious bugs.

This means I'm shifting focus. tinyboot satisfies all of OpenServoCore's needs, and my attention is moving to rewriting the OSC firmware. I'll still maintain tinyboot, and issues and PRs are welcome, but active feature development is pausing for now.

## What's Next

- USB transport for V103 (the second flash region has room).
- CH32X03x support eventually.
- But the immediate priority is OpenServoCore firmware.
