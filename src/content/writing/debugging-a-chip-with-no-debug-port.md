---
title: "Debugging a chip with no debug port"
summary: "Bringing up JTAG and OpenOCD on a Veloce emulator before silicon existed, and the four RTL defects that fell out of it."
date: 2026-09-20
tags: [bring-up, jtag, openocd, emulation]
draft: true
---

Draft. Outline:

- Why emulation bring-up needs a debugger at all
- The TCK skew from place-and-route
- DBGPWRUPREQ not powering the PMU
- The debug module held in reset
- Fetch speed bound to TCK
- The PMU control register we added
