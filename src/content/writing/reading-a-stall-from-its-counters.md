---
title: "Reading a stall from its counters"
summary: "A method for diagnosing a producer-consumer stall from a single snapshot of the right counters, and the fix pattern that usually follows: reserve a floor for the side that can't make progress on its own."
date: 2026-07-26
tags: [debug, dma, buffers, method]
draft: false
---

A data path that runs fine for hours and then stops dead, with no crash, no error and no log line, is one of the more common things a firmware engineer gets handed. The link is up, both ends think they are waiting on the other, and traffic is zero. This is a method for reading what happened from the state the system is left in.

## The shape of the problem

Almost every host-to-device data path is a set of pools and rings. There is a pool of packet buffers. The receive side needs empty buffers to land incoming frames into. The transmit side needs buffers to hold outgoing frames until the link takes them. Both sides draw from the same pool, and both give buffers back when they are done.

That shared pool is where stalls come from. If the transmit side is allowed to take every buffer, the receive side has nothing to land frames in, so it cannot make progress. If making progress on receive is what eventually frees the transmit buffers, because the far end is waiting for an acknowledgement that has to arrive through receive, then nothing ever frees, and the system waits on itself.

It is a deadlock, but not the kind a lock-order checker finds. It lives in resource accounting.

## What to snapshot

You do not need a trace. You need one honest snapshot of a few counters, taken while the system is stuck. The set is nearly always the same:

- **Free buffers in the shared pool.** The headline number. If it is zero, the story is already half told.
- **Buffers held by each consumer.** How many are sitting in the transmit queue, how many are posted to the receive DMA engine, how many are in flight on the host side, how many are held by software waiting to be processed.
- **Refill state of the receive engine.** How many descriptors it has to land frames in. If this is zero the receive path is dead regardless of everything else.
- **Backlog on the far side.** Frames the host or peer has queued and cannot deliver.
- **Last activity timestamps** per direction, so you can see which side stopped first.

The held-by counts should add up to the pool size minus the free count. If they do not, you have a leak as well as a stall, and that is a different bug.

## Reading the signature

With the snapshot in hand, the stall usually reads out in one line. A representative signature looks like this, with made-up numbers:

| Counter | Value |
|---|---|
| Pool free | 0 |
| Held by transmit queue | 0 |
| Posted to receive DMA | 0 |
| Held by software, unprocessed receive | 62 |
| Held by host-side receive path | 2 |
| Far-side backlog | 180 |

Read it top to bottom. The pool is empty. Transmit holds nothing, so it is not the hog. The receive DMA has nothing posted, so it cannot land the frames the far side is trying to send, and the far side's backlog confirms it is trying. Nearly the whole pool is sitting in received frames that software has not processed yet. Why has software not processed them? Because processing them means sending a reply, and sending needs a buffer, and there are none.

Every side is waiting on a buffer that only another side can free. That is the loop.

## The fix pattern

The fix is almost never "make the pool bigger". A bigger pool makes the stall rarer and the eventual snapshot larger. The fix is to make sure the side that everyone else depends on can always make progress:

**Reserve a floor.** Set aside a minimum number of buffers that only the receive refill path may take. Transmit and software processing can drain the pool down to the floor and no further. The receive engine can always land a frame, which means the acknowledgement that frees everything else can always arrive.

The same idea has other names in other places. TCP calls it keeping room for ACKs. Memory allocators call it an emergency reserve. Schedulers call it priority inheritance in spirit if not in mechanism. The principle is the same: identify the one consumer whose progress unlocks the others, and guarantee it a resource nobody else can starve.

Two details matter in the implementation. The floor has to be enforced at allocation time, not by hoping a fast path returns buffers quickly. And the number has to be derived from the receive engine's real burst size, not picked as "a few", or the floor will drain in one burst and the stall will come back with a smaller signature.

## Why this generalises

The method is: name every holder of the scarce resource, count them, and find the cycle. It works for packet pools, for DMA descriptors, for semaphore counts, for message-queue slots, and for heap fragmentation, which is the same disease with a variable buffer size. Once you have done it a few times, a stalled system stops being frightening. It is a table with one row you have not filled in yet.
