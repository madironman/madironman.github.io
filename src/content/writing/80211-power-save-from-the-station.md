---
title: "802.11 power save, from the station's side"
summary: "Beacons, TIM and DTIM, PS-Poll and U-APSD: how a Wi-Fi station decides when it is safe to sleep, and where the power actually goes when it gets that wrong."
date: 2026-08-09
tags: [wlan, "802.11", power, wireless]
draft: false
---

Wi-Fi power save is one of those areas where the standard is public, the mechanism is simple, and the details are what separate a device that lasts a day from one that lasts a week. This is the station's view of it. Nothing here is beyond the published 802.11 specification.

## The problem

A Wi-Fi radio that is listening draws tens of milliamps. One that is asleep draws tens of microamps. A battery-powered station wants to be asleep almost all the time, but the access point can only deliver a frame when the station is awake. So the two sides need an agreement about *when* the station will listen, and a way for the AP to say "I have something for you" without the station listening constantly.

## Beacons and the TIM

The access point transmits a beacon at a fixed interval, commonly around 100 milliseconds. Inside every beacon is a traffic indication map, the TIM. It is a bitmap with one bit per associated station. If a station's bit is set, the AP has buffered unicast frames waiting for it.

A station in power save tells the AP it is going to sleep by setting the power management bit in a frame header. From then on the AP buffers anything addressed to that station instead of transmitting it. The station wakes up at beacon time, receives the beacon, checks its bit in the TIM, and goes back to sleep if the bit is clear. That is the whole of legacy power save: wake for a beacon, look at one bit, sleep again.

The station does not have to wake for every beacon. It negotiates a listen interval at association, in units of beacons, and the AP agrees to buffer for at least that long. A longer listen interval means more sleep and more latency for anything arriving from the network.

## DTIM and multicast

Multicast and broadcast frames cannot be buffered per station, since every station has to hear them. So the AP delivers them right after a special beacon, the delivery TIM or DTIM, which occurs every N beacons. N is the DTIM period, and the AP advertises it.

A station that cares about multicast, which in practice means anything that needs ARP and mDNS to work, has to wake for every DTIM beacon regardless of its listen interval. For a lot of consumer devices the DTIM period is the single biggest lever on standby current. A DTIM of one means waking ten times a second. A DTIM of three cuts that to three times a second, at the cost of multicast latency.

## Getting the buffered frames

When the station sees its TIM bit set it has two ways to retrieve traffic.

**PS-Poll** is the legacy method. The station sends a PS-Poll control frame, the AP responds with one buffered frame, and the "more data" bit in that frame's header tells the station whether to poll again. One frame per poll is slow and chatty, but it is universally supported.

**Staying awake** is the other. The station clears its power management bit, the AP delivers everything, and the station sets the bit again. Simpler, and faster when there is a burst.

## U-APSD

Unscheduled automatic power save delivery, part of the WMM extensions, was designed for voice. The station sends a *trigger* frame, which is just an uplink data frame on one of the enabled access categories. The AP responds with a burst of buffered frames up to a negotiated service period length, and marks the last one with an end-of-service-period bit. The station sleeps the moment it sees that bit.

The elegance is that a voice call already sends uplink packets at a regular cadence, so the triggers cost nothing extra, and the downlink is delivered in a tight burst right after each one. No beacon wake is needed for the traffic at all. The station still wakes for DTIM beacons.

## Where the power actually goes

When people measure a station and find it drawing more than expected, the cause is almost always one of these:

- **Beacon receive time.** The radio has to be on early enough to catch the beacon, and beacon timing drifts. A station that opens its receive window wide to be safe spends most of its energy waiting for beacons that arrive late.
- **DTIM period.** Set by the AP, not the station. A station cannot sleep through DTIM without losing multicast.
- **The tail after traffic.** Most stations stay awake for a while after the last frame in case more is coming. Too short and every packet pays a wake-up; too long and the radio idles.
- **Noisy multicast.** A network full of chatty mDNS and SSDP means every DTIM wake is followed by real receive time for frames the station will discard.
- **Retries.** A frame that fails and retries keeps the radio on for every attempt. Poor link quality quietly multiplies active time.

## The mental model

Everything in 802.11 power save reduces to one question the station keeps asking: is it safe to turn the radio off right now, and when do I have to turn it back on? Beacons and DTIM answer the second half with a schedule. TIM bits, PS-Poll and U-APSD answer the first half by making the AP hold traffic until asked. The device that lasts a week is the one whose firmware asks that question honestly and does not hedge by staying awake "just in case".
