---
title: "Phantom interrupts at a clock-domain crossing"
summary: "Why a level-triggered interrupt that crosses between two clock domains can fire twice, and the handler ordering that makes it stop."
date: 2026-09-06
tags: [interrupts, clock-domains, cortex-m, debug]
draft: false
---

This is a pattern, not a war story. I have met it more than once and I expect to meet it again, so here is the mechanism written down properly.

## The setup

Two blocks on a chip run in different clock domains. Call them the fast side and the slow side. The fast side owns a peripheral that can raise an interrupt line towards the slow side, where a Cortex-M core services it through the NVIC. The slow side acknowledges by writing a clear bit back into the peripheral, which drops the line.

Because the line crosses clock domains, it goes through a two-flop synchroniser. That is the textbook way to move a level signal between clocks and it is correct. It also costs two slow-side clock cycles of latency in *each direction*: two cycles for the rise to be seen, and two more for the fall to be seen after the peripheral drops it.

## The symptom

Every so often the core takes the interrupt, enters the handler, reads the peripheral's status register, finds nothing pending, and returns. Nothing breaks, but the wake-up was real: it cost power, and if the system was on its way into a low-power state, the phantom can cancel the transition it had just committed to.

The rate is low and looks random. It gets rarer when you add logging to the handler, which is the first hint.

## What is actually happening

Walk the sequence in slow-side cycles:

1. The peripheral asserts the line. Two cycles later the NVIC sees it high, sets the pending bit, and the core enters the handler.
2. The handler does its work and writes the clear bit to the peripheral.
3. The peripheral drops the line on the fast side.
4. The falling edge crosses the synchroniser. For two more slow-side cycles the NVIC still sees the line *high*.

Now look at what the handler does at its end. A typical epilogue clears the NVIC pending bit and returns. If it does that during step 4, the input is still asserted, and a level-sensitive input that is still asserted re-sets the pending bit as soon as it is cleared. The core returns from the handler, the NVIC sees pending set, and takes the interrupt again. By the time the second handler reads status, the fall has crossed and the register reads zero.

A fast handler finishes inside the two-cycle window and hits the phantom. A slow one, or one with logging in it, finishes after the window and never does. That is why the bug hides when you look at it.

## The fix

Make the handler wait for the level to drop before it clears pending. Concretely:

1. Write the clear bit to the peripheral.
2. Read the peripheral's status back until it reads zero. This only has to outlast the synchroniser, so it is a handful of cycles, not a real spin.
3. Clear the NVIC pending bit.
4. Return.

With this ordering the level-triggered semantics work for you instead of against you. If a genuine new interrupt arrives during step 2, status stays non-zero, the loop ends, you clear pending, and the still-high line re-sets pending so the new event is serviced. A stale level cannot re-set pending because you never clear pending while the level is still there.

It is usually a three-line change in the epilogue.

## How to recognise it next time

- The phantom arrives within a few cycles of a *previous* genuine interrupt. Log a cycle counter on handler entry and the pattern jumps out.
- The rate drops when the handler gets slower.
- The interrupt source is in a different clock domain from the core.

If all three are true, stop looking in the software and go read the synchroniser. Anything level-triggered that crosses a clock domain needs its deassertion latency accounted for, and the place to account for it is the handler exit, not the peripheral.
