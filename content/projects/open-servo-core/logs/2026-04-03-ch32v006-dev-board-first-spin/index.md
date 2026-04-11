---
date: "2026-04-04T01:38:14.199Z"
title: "CH32V006 Dev Board First Spin - Lessons From a Faulty Revision"
tags:
  - hardware
---

As hinted at the end of my previous log, I sent the design of the CH32V006
OpenServoCore dev board to [PCBWay](https://www.pcbway.com/) for fabrication,
since they were kind enough to sponsor the PCB and assembly for the
OpenServoCore project, and a few days ago, I received a notification that the
boards had been delivered.

## Unboxing (Eventually)

That should've been the easy part. Instead, my first debugging task turned out
not to be the board, but the shipping address. The tracking page said the
package had arrived at my front door, but there was nothing there. After
checking around the house and running around in circles in a panicked daze, I
went back to the order details and realized I had entered the wrong house
number. Embarrassing mistake #1. The package had been delivered to my neighbor
instead. Luckily my lovely neighbor kept it safe for me.

After thanking my neighbor and skipping home like a five year old, I immediately
opened the package. Seeing the red boards in front of me had made my day.

Here is how the first revision turned out:

![Front Side View](front.webp "Front side view")
![Back Side View](back.webp "Back side view")

At this point, I thought the hard part was over. I got my boards safely in my
palm, I just needed to plug it in and start writing firmware. Well, what a
remarkably naive assumption.

## Powering On

When I plugged in the USB-C cable to the board, the first thing I noticed is
that the 3.3V rail LED didn't light up. This is an immediate bad sign — it means
something past the LDO is not working right. I pulled out my multimeter and
measured the voltage on the rail: 0.84V. Board defect? Design error? Bad parts?
My mind raced through different possibilities. The components on the board felt
cold, and I didn't smell any magic smoke. That's a good indication that nothing
is shorted. But to be safe, I unplugged the power and started probing with my
multimeter. Nothing obvious.

Out of ideas, I decided to test the other boards to see if it was a
manufacturing defect. The results came up exactly the same: 3.3V LED not
lighting up. So it wasn't a board defect. It's either the LDO or my design.

To eliminate the possibility of a faulty LDO, I hooked up the `GND` and `+3V3`
rails with an external 3.3V power source. Still 0.84V. The conclusion was clear:
PCBWay did a good job, but my design had failed.

## Debugging

After narrowing it down to a design issue, I hunted through the KiCad PCB design
file looking for misplaced vias, traces, or design violations. Nothing. I stared
at the schematics again. Still nothing suspicious.

Out of options, I started randomly poking around different test points. At some
point, I decided to hook the external 3.3V supply to what was labeled as the
`+3V3` test point hook.

Pop. Magic smoke.

My heart sank. But then — the green LED lit up. I stared at it for a moment,
confused. I measured the `+3V3` rail: 3.3V. What?

Something had clearly burned open, but I couldn't even tell where the pop came
from. Then I looked at the PCB design more carefully and had my second moment of
shame: the top row of test point hooks are all labeled wrong. Embarrassing
mistake #2. I must have been shifting the nets during layout and forgot to
update the silkscreen labels. That "3V3" test point was actually the `EN` pin
between the MCU and the DRV. By feeding 3.3V directly into it, I had fried
either the DRV or the MCU, and whatever burned open had stopped dragging the
3.3V rail down to 0.84V.

To figure out which one was the culprit, I grabbed a fresh board and started
desoldering components one at a time. First the DRV, with a hot air reflow tool
— plugged it in, still the same. Then the MCU — and the 3.3V LED lit up.

I stared at the MCU schematic for a good 10 minutes, and then it hit me.
Embarrassing mistake #3, and the rookiest one of all: I had swapped VDD and VCC.

## The Board Surgery

With the root cause identified, the fix was conceptually simple: lift the
VCC/VDD leads of the MCU and wire them correctly. Whether it would actually work
was another question. I had no idea if the MCU was still alive after being fed
reverse voltage. But there was no other choice — I had 5 boards and all of them
had the same design error. The only encouraging sign was that nothing had
released magic smoke during normal power-on, which meant the MCU might have
survived.

### Attempt #1

I lifted the VCC/VDD leads on the already desoldered MCU, and reflowed the chip
back onto the board. But during soldering of the tiny magnet wires, I yanked the
VCC lead a bit too hard and it snapped clean off. Out of morbid curiosity, I
decided to power on the board anyway, just to see what would happen.

To my surprise, the debugger recognized the MCU. I wrote a quick blinker app and
flashed it — no issues. The `STAT` LED was permanently on and all GPIO pins read
3.3V due to the disconnected VCC, so it wasn't a functional board, but the MCU
was alive. That was huge.

### Attempt #2

Encouraged, I moved on to board #3. This time, instead of desoldering the entire
MCU, I tried a more targeted approach: cut the trace from the decoupling
capacitor to the VCC lead, then cut and lift the VDD pin from the ground plane.
I went in with the knife, but cut the VDD lead a bit too aggressively — the
whole lead fell off. Another board down. I had to stop, put everything away, and
walk away for the night. Two failed attempts in a row was enough for one day.

### Attempt #3

The next day, with steadier nerves, I came back and reviewed the PCB layout more
carefully. This time I planned every cut before touching the board. The
approach: cut both the decoupling capacitor trace and the ground plane
connection, verify isolation with continuity measurements, and then bridge the
corrected connections with thin magnet wire.

The cutting and scraping went fine. The hard part was soldering the magnet wire.
The leads on the QFP package are tiny, and the wire kept slipping off. I bridged
adjacent leads multiple times and had to wick them clean. The wire wouldn't stay
in place while I tried to tack it down. I found myself holding my breath,
magnifying glasses on, taking deep breaths between each attempt. After about an
hour of shaky hands and generous amounts of flux, I finally got the wires to
behave by pressing them against the body of the MCU. This let me hold the wire
steady while aligning it with the leads precisely. I measured continuity one
more time — good.

## It Works

I plugged in the board, flashed the blinker app, and the `STAT` LED started
blinking. I let out a breath I didn't know I was holding. Then I brought up UART
— that worked too.

![Plugged in and working post PCB surgery](in-use.webp "Plugged in and working post PCB surgery")

With a sigh of relief, I had salvaged the board, with one extra board left for
backup.

It's also worth noting just how resilient the CH32V006 turned out to be. This
chip took reverse voltage on its power pins across multiple power-on cycles and
still came back to life. For a $0.22 MCU, that's pretty impressive. I would not
have expected it to survive, let alone run firmware afterwards.

I also wanted to shout out to PCBWay for sponsoring this spin. I did not see any
issues with manufacturing and the boards are of high quality. If I want to
nitpick, the test point hooks are not aligned perfectly, but it's kind of
expected due to how big the TP footprints are and the reflow process probably
caused those hooks to float a bit. This is purely cosmetic however, and I
probably should've used a smaller footprint anyway.

## What's Next

I pushed out fixes to the design on GitHub and updated my previous post with the
corrected schematics. My next step is to fully verify the board — testing the
DRV, UART buffer, ADCs, and the various sensors. Now that I know which pin is
real power and which one is real ground, hopefully Rev. B will be a smoother
sail.

Three embarrassing mistakes, two failed surgeries, and one working board. I'll
take it.
