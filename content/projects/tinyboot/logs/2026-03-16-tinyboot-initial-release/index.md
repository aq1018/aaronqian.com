---
date: "2026-04-04T02:03:42.434Z"
title: "tinyboot Initial Release"
tags:
  - firmware
---

While I was waiting for the CH32V006 dev board to arrive, I ended up going on a
side quest: making firmware updates less painful for future OpenServoCore-based
servos. Once a servo is built into a system, it is not really practical to pull
it back out, open the case, desolder the board, and hook up a debugger just to
flash new firmware. Updating over the existing one-wire UART bus is a must-have
feature if I wanted to keep both you and me sane. And that is how
[tinyboot](https://github.com/OpenServoCore/tinyboot) was born.

## Demo

This is a demo of tinyboot running on `CH32V003`. Here, `tinyboot` refers to the
command-line interface (`tinyboot-cli`) used to interact with the bootloader.

![tinyboot demo](demo.gif)

## What is `tinyboot`

`tinyboot` is a small but capable bootloader for resource-constrained MCUs. It
is written in Rust and currently targets the CH32 family. It should be fairly
easy to expand to other microcontroller families in the future, but there are no
immediate plans to do that right now.

At the moment, it works on `CH32V003`, mostly because I happened to have a few
lying around. Support for other CH32 families is coming soon, since I have
already picked up a few additional boards to cover different chip variants.

One little-known detail about the CH32 family is that these chips include a
system flash region containing the WCH factory bootloader. That bootloader is
meant to be used with `wchisp` / `WCHISPTool` to upload firmware over UART or
USB. However, the factory bootloader is not open source, and it is not flexible
enough for what I need. In particular, it does not let me customize the UART/USB
pin layout or support DXL TTL-style single-wire UART with a `TX_EN` pin.

So `tinyboot` is designed primarily as a replacement for the factory bootloader,
living directly in the system flash region. That said, flashing it into the user
flash region is also supported if you prefer to keep things arranged that way.

## Feature Highlights

I wanted something more robust than the factory-provided bootloader so I could
minimize the chance of bricking a servo and needing physical access to the board
again. Most of the features were designed with that goal in mind, while still
keeping resource usage to a minimum.

### Trial Boot

The bootloader keeps track of whether the currently flashed application has
successfully booted. With help from a small application-side library, the
firmware can report back once startup is complete.

After a fresh firmware update, if the application fails to confirm boot after a
power reset, the bootloader decrements a trial boot counter. Once that counter
is exhausted, it refuses to jump to the application and stays in bootloader mode
instead, allowing a new firmware image to be flashed. This gives the bootloader
a way to recover from bad updates without needing a debugger.

### Configurable and Modular Transport

The bootloader is modular and intended to be extended. Right now it supports
UART transport, including both standard UART and DXL TTL / RS485-style UART with
a `TX_EN` pin. There are no current plans for USB support, but it could be added
later by implementing the `Transport` trait.

### Tiny Footprint

Right now `tinyboot` fits in 1920 bytes of system flash on the `CH32V003`.
Getting it this small required a lot of compromises, so this is not exactly a
showcase of idiomatic safe Rust. It is a little unhinged, but it works.

### Library Over Binary

This is not a single binary crate. Instead, `tinyboot` is structured as a set of
library crates that can be used to build your own bootloader binary. That makes
it much easier to adapt the bootloader to different pin layouts and transport
configurations just by changing a few settings.

## Next Steps

This is still a young project, and right now it only supports `CH32V003`. The
next step is expanding support to other CH32 parts. I plan to maintain this long
term, since reliable in-system firmware updates will be a core part of the
OpenServoCore project.
