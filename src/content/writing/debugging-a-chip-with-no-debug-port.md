---
title: "What JTAG actually does: ADIv5 from the wire up"
summary: "TAP state machine, the debug port, access ports and MEM-AP: the layers between a debugger's memory read and the pins on the chip."
date: 2026-09-20
tags: [jtag, adiv5, openocd, debug]
draft: true
---

Draft. Outline:

- The TAP state machine and the two shift registers every JTAG device has
- What ARM puts behind it: DPACC and APACC, the debug port
- Access ports, the ROM table, and how a debugger discovers what is on the chip
- MEM-AP: turning a debug transaction into a bus transaction
- Power and reset domains: DBGPWRUPREQ and why the debugger can hang before it starts
- What OpenOCD does with all of this, and how to script it
