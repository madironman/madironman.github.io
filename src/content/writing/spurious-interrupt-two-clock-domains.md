---
title: "The spurious interrupt that lived between two clock domains"
summary: "An MCU kept waking on interrupts nobody raised. The culprit was a two-flop synchroniser deasserting across 96 MHz and 192 MHz, and the fix was a three-line reorder."
date: 2026-09-06
tags: [wlan, soc, debug, clock-domains]
draft: false
---

On a dual-core Wi-Fi SoC I worked on, the MCU sat on one side of an on-die link and the WLAN core sat on the other. They talked through a small block of general-purpose interrupt lines. Each side could raise an interrupt on the other, and each side cleared the interrupt when it had handled it.

Most of the time this worked. Then, at a rate of maybe one in a few thousand, the MCU took an interrupt with nothing pending. The handler ran, read the status register, found zero, and returned. Harmless on its own, except the wake-up cost real power, and on the sleep path a phantom wake could cancel a sleep transition we had just committed to.

## Ruling out software

The first suspect is always software. I checked the obvious things:

- Was the clear-pending write reaching the peripheral before the handler exited? Yes, with a read-back barrier.
- Was another interrupt sharing the line? No, the NVIC mapping was one-to-one.
- Was the WLAN side raising and lowering the line faster than the MCU could see it? Possibly, but the protocol required an acknowledgement before the next raise.

So I instrumented the handler to log the cycle count and the status register on entry, and captured a few hundred phantoms. They all had one thing in common: they arrived within a handful of cycles after a *previous*, genuine interrupt had been cleared.

## The synchroniser

The interrupt line crossed from the WLAN core's 192 MHz domain into the MCU's 96 MHz domain through a standard two-flop synchroniser. That is the textbook way to move a level signal between clocks, and it is fine for the assertion edge.

The problem was the deassertion. The sequence was:

1. WLAN raises the line. Two 96 MHz cycles later the MCU sees it and takes the interrupt.
2. The MCU handler does its work and writes the clear.
3. The clear propagates back to the WLAN side, which drops the line.
4. The dropped line crosses the synchroniser again, taking another two cycles to settle low on the MCU side.

Between steps 2 and 4, the MCU's NVIC was looking at an interrupt input that was still high, because the synchroniser had not yet passed the falling edge through. The handler had already cleared the pending bit. A level-triggered input that is still asserted re-sets the pending bit. When the handler exited, the NVIC saw pending set and took the interrupt again, and by then the line had finally dropped, so the status read came back empty.

It only happened when the handler was fast. A slow handler gave the deassertion time to cross. Adding logging to debug it made the handler slower and the bug rarer, which is why it looked random.

## The fix

The fix was to reorder the exit sequence so the NVIC pending bit is cleared *after* the peripheral level is known to have dropped, not before:

1. Write the clear to the peripheral.
2. Read the peripheral status back until it reads zero. This costs at most a few cycles, since it only has to outlast the synchroniser.
3. Clear the NVIC pending bit.
4. Return.

With that ordering the level-triggered semantics work in our favour. A genuine new interrupt arriving during step 2 keeps the status non-zero, so the loop exits, we clear pending, and the line is still high, so pending re-sets and we handle it. A stale level cannot re-set pending because we do not clear pending until the level is gone.

The change was three lines in the handler epilogue. The phantom wakes went to zero over a weekend soak.

## What I would do differently

I would have looked at the RTL sooner. I spent the first day in software because that is where the fast iteration is, and the cycle-count log was what eventually pointed at the crossing. But the moment "it arrives right after a clear" showed up, the synchroniser should have been the first thing on the whiteboard. Anything level-triggered that crosses a clock domain needs its deassertion latency accounted for, and the place to account for it is the handler exit, not the peripheral.
