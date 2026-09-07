export type Status = 'shipped' | 'wip' | 'past';

export interface Project {
  name: string;
  status: Status;
  statusLabel: string;
  description: string;
  tech: string;
  github?: string;
  link?: string;
}

// Tooling built for customers under NDA. The code belongs to them; these
// cards describe the class of problem each tool solved, nothing more.
export const tooling: Project[] = [
  {
    name: 'Memory-dump analyser',
    status: 'past',
    statusLabel: 'internal tool',
    description: 'Rebuilds system state from a raw RAM dump of a Cortex-R/M firmware: locates live structures by signature scanning and recovers call stacks without frame pointers by validating branch-and-link return addresses.',
    tech: 'Python · ARM Thumb-2 · ELF/DWARF',
  },
  {
    name: 'Heap profiler',
    status: 'past',
    statusLabel: 'internal tool',
    description: 'Dynamic heap flame charts for an RTOS firmware. Shows who allocated what, when, and how long it lived, so pool starvation and fragmentation are visible instead of inferred.',
    tech: 'Python · RTOS heap hooks',
  },
  {
    name: 'Struct layout analyser',
    status: 'past',
    statusLabel: 'internal tool',
    description: 'Static analysis of struct padding and cache-line straddling from DWARF. Reports wasted bytes per struct and suggests field reorderings.',
    tech: 'Python · DWARF',
  },
  {
    name: 'Remote board control',
    status: 'past',
    statusLabel: 'internal tool',
    description: 'USB-bridge automation of boot-mode strap pins with bus-contention avoidance, so a CI job can reflash a board and change its boot mode with nobody in the lab.',
    tech: 'Python · USB-to-GPIO bridge',
  },
  {
    name: 'Emulator regression suite',
    status: 'past',
    statusLabel: 'internal tool',
    description: 'WLAN automation rebuilt as a nightly regression across bands, channels and security modes, with the scheduling changes that multiplied emulator utilisation.',
    tech: 'Python · TCL · Jenkins CI',
  },
  {
    name: 'Debug-port register bridge',
    status: 'past',
    statusLabel: 'internal tool',
    description: 'Extended a register-level verification environment to reach a chip over OpenOCD when it had no other usable transport. Later reused on FPGA.',
    tech: 'TCL · OpenOCD · ARM ADIv5',
  },
];

// Personal work. Everything here is either pre-employment or generic study
// material with no connection to customer products.
export const projects: Project[] = [
  {
    name: 'TV white space for mobile communication',
    status: 'past',
    statusLabel: 'Ericsson Research India internship · Dec 2019 – Mar 2020',
    description: 'Final-year thesis: television white space for mobile communication in rural and hilly terrain. Drove transmit and receive directly from Raspberry Pi GPIO pins instead of dedicated RF transceiver chips.',
    tech: 'Raspberry Pi · GPIO bit-bang · TV white space',
  },
  {
    name: 'Fourier lab',
    status: 'shipped',
    statusLabel: 'live · interactive',
    description: 'Draw any closed shape and watch it decomposed into a Fourier series, then redrawn by a chain of rotating circles. Adjustable term count, phase and amplitude readout, five presets. No libraries.',
    tech: 'TypeScript · Canvas · DFT',
    link: '/fourier',
  },
  {
    name: 'Firmware interview notes',
    status: 'wip',
    statusLabel: 'in progress',
    description: 'Working notes from a structured pass over embedded and firmware fundamentals: C, bits, ARM architecture, buses, linkers, RTOS, networking. The pieces that turn into real insight end up in Writing.',
    tech: 'Markdown · C',
  },
];
