---
title: "What happens between reset and main() on a Cortex-M"
summary: "The vector table, the two words the core reads first, and the startup code that has to run before C is allowed to exist."
date: 2026-08-23
tags: [cortex-m, boot, linker, bare-metal]
draft: false
---

Most firmware engineers first meet startup code as a file the vendor gave them and told them not to touch. It is worth touching. Everything in it exists for a reason, and when a board refuses to boot, this is where you will end up.

## The two words the hardware reads

On reset, a Cortex-M core does exactly two things before it executes any instruction. It reads the 32-bit word at the start of the vector table and loads it into the stack pointer. Then it reads the next word, clears its bottom bit, and jumps there. That second word is the reset handler.

That is the whole hardware contract. The vector table lives at a fixed address, usually the start of flash, and can be moved later by writing the vector table offset register. Entry zero is the initial stack pointer, entry one is reset, and the rest are exception and interrupt handlers in a fixed order: NMI, HardFault, the fault handlers, SVCall, PendSV, SysTick, then the chip's own interrupts.

Two consequences follow. The stack is valid from the very first instruction, which is why the reset handler can be written in C on a Cortex-M when it cannot on many other cores. And if the first word in your image is wrong, the core boots with a garbage stack pointer and faults on the first push, which looks like a chip that does nothing at all.

## What the reset handler has to do

The reset handler's job is to make the C runtime's assumptions true. C assumes initialised globals hold their initial values and uninitialised globals are zero. Neither is true at reset, because RAM is random and the initial values are sitting in flash.

So the reset handler, in order:

1. **Copies `.data` from flash to RAM.** The linker script places `.data` at its run address in RAM but its load address in flash, and exports symbols for both plus the size. The startup code walks them with a word copy loop.
2. **Zeroes `.bss`.** Another pair of linker symbols, another loop.
3. **Runs system initialisation.** Clock tree, flash wait states, FPU enable if there is one, vector table relocation if the image runs from somewhere other than the default. On CMSIS-style ports this is `SystemInit`.
4. **Runs the C++ and library constructors** if the toolchain has any. On GCC this is `__libc_init_array`, which walks an array of function pointers the linker collected.
5. **Calls `main`.** If `main` returns, most startup files fall into an infinite loop, because there is nowhere to return to.

Everything before step 1 has to be written without touching any global variable, since none of them are valid yet. Everything before step 3 has to work on the reset-default clock, which is usually a slow internal oscillator.

## Where the linker script comes in

The linker script is the other half of startup. It defines the memory regions, assigns sections to them, and emits the symbols the reset handler uses. A minimal one says: flash starts here and is this big, RAM starts here and is this big, put the vector table first in flash, then `.text`, then `.rodata`, then the load image of `.data`. Put `.data` and `.bss` in RAM, and put the stack at the top.

If the `.data` load address and run address are ever confused, the copy loop copies garbage over itself and globals come up wrong. If the stack symbol is wrong, the first word of the vector table is wrong. If a section gets placed outside its region, the link fails, which is the good outcome.

## Things that actually go wrong

- **The image is linked at the wrong address.** The vector table is correct but sitting somewhere the core does not look. Symptom: nothing happens. Check the first two words of the binary against the map file.
- **`.bss` is not zeroed.** A global that "should be zero" is not, and the bug only shows on cold boot, since a warm reset leaves RAM as it was. Symptom: works after a reflash, fails after a power cycle.
- **The `.data` copy runs before the RAM clock is enabled.** On some chips RAM banks are gated at reset. The copy loop writes into nothing and reads back nothing.
- **A fault handler is missing from the table.** The linker fills the slot with zero or with a weak default. Faulting into address zero re-enters the vector table as code, which is a spectacular way to die.
- **The FPU is used before it is enabled.** The compiler emits VFP instructions for a `float` in `SystemInit`, the coprocessor is disabled, and the core takes a UsageFault before the debugger can even attach.

## Why it is worth knowing

Once you have written one of these from scratch, a startup file stops being magic and becomes about forty lines you could reproduce on a whiteboard. That is the level of familiarity you want with anything that runs before your debugger can see it.
