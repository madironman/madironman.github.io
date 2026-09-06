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

// Tools written during 5312 pre-tapeout. Client code stays private; these are
// planned clean-room rewrites. Set `github` once each repo exists.
export const tools: Project[] = [
  {
    name: 'Marbel',
    status: 'wip',
    statusLabel: 'rewrite in progress',
    description: 'Reconstructs system state from a raw memory dump of a Cortex-R/M firmware: a Rabin-Karp scan to find live structures, and a bl/blx back-check stack unwinder that works without frame pointers.',
    tech: 'Python · ARM Thumb-2 · ELF/DWARF',
  },
  {
    name: 'Hammer',
    status: 'wip',
    statusLabel: 'rewrite in progress',
    description: 'Dynamic heap flame charts for FreeRTOS. Shows who allocated what, when, and how long it lived, so pool starvation and fragmentation are visible instead of inferred.',
    tech: 'Python · FreeRTOS heap hooks',
  },
  {
    name: 'Spade',
    status: 'wip',
    statusLabel: 'rewrite in progress',
    description: 'Static analyser for struct padding and cache-line straddling. Reads DWARF, reports wasted bytes per struct, and suggests field reorderings.',
    tech: 'Python · pyelftools',
  },
  {
    name: 'Spark',
    status: 'past',
    statusLabel: 'client tool',
    description: 'CH347-based strap-pin automation with high-Z contention avoidance, so a CI job can reflash a board and change its boot mode with nobody in the lab.',
    tech: 'Python · CH347 · GPIO',
  },
  {
    name: 'Vista',
    status: 'past',
    statusLabel: 'client tool',
    description: 'WLAN automation rebuilt as a nightly regression suite across bands, channels and security modes. Sped the Veloce emulator about 400% and compressed a ROM tapeout cycle to one week.',
    tech: 'Python · TCL · Jenkins CI',
  },
  {
    name: 'OpenOCD register bridge',
    status: 'past',
    statusLabel: 'client tool',
    description: 'Extended a register-level verification environment to reach a chip over OpenOCD when it had no JTAG, SDIO, PCIe or USB transport. Adopted by validation teams and reused on FPGA.',
    tech: 'TCL · OpenOCD · ARM ADIv5',
  },
];

export const hardware: Project[] = [
  {
    name: 'Mobile comms over TV White Space',
    status: 'past',
    statusLabel: 'final-year project',
    description: 'Drove transmit and receive directly from Raspberry Pi GPIO pins instead of a dedicated RF transceiver, with Reed-Solomon forward error correction and POCSAG signalling.',
    tech: 'Raspberry Pi · GPIO bit-bang · Reed-Solomon · POCSAG',
  },
  {
    name: 'Raspberry Pi provisioning client',
    status: 'past',
    statusLabel: 'lab build',
    description: 'A drop-in replacement for the ARRIS lab provisioning client machine during a hardware shortage. Cut per-seat cost about 90% and brought up the CMTS behind it.',
    tech: 'Raspberry Pi · DOCSIS · CMTS',
  },
  {
    name: 'Wi-Fi power-save sniffer',
    status: 'wip',
    statusLabel: 'planned',
    description: 'A cheap dev-board tool that watches DTIM, PS-Poll and U-APSD behaviour on a live network and plots when a station actually sleeps versus when it should. Project log to follow.',
    tech: 'ESP32 · 802.11 monitor mode · Python',
  },
];
