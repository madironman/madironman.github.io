// Scope rule for this file: describe the kind of work and the skills used.
// No customer part numbers, platform code names, defect specifics, roadmap
// items or internal metrics. Those belong to the customers under NDA.
// Bullets use **lead phrase** markup; the page renders it as <strong>.

export interface Job {
  id: string;
  tab: string;
  title: string;
  client: string;
  period: string;
  bullets: string[];
}

export const jobs: Job[] = [
  {
    id: 'now',
    tab: 'Current',
    title: 'Technical Lead, WLAN host software',
    client: 'embedUR Systems · semiconductor customer',
    period: 'Jul 2026 – present',
    bullets: [
      '**Driver-side tooling.** Building the applications and control utility for a Windows WLAN driver.',
      '**Technical lead.** Design reviews, debug escalations and mentoring for the engagement.',
    ],
  },
  {
    id: 'wlan-soc',
    tab: 'WLAN SoC',
    title: 'WLAN Firmware & SoC Bring-up',
    client: 'embedUR Systems · Wi-Fi silicon customer · Engineer → Senior → Technical Lead',
    period: 'Jun 2022 – Jul 2026',
    bullets: [
      '**Low-power architecture.** Designed the sleep protocol between an application MCU and a WLAN core on a dual-core Wi-Fi SoC, covering retention and standby modes with no packet loss. Cortex-R and Cortex-M firmware over an on-die AXI link.',
      '**Invention disclosure.** Named inventor on a filed disclosure in 802.11 power save.',
      '**Pre-silicon bring-up.** Brought up JTAG and OpenOCD on a hardware emulator, drove the platform from reset to first ping, and characterised RTL issues on the way.',
      '**Before first silicon.** Wrote a bare-metal startup, FreeRTOS port and inter-core transport driver from scratch so most firmware development could proceed months early.',
      '**Power.** Cut active power by about 70% with a DTIM-based power-save scheme; shipped validation releases for three chipsets on time for a customer demo.',
      '**Root cause.** Defects that lived between firmware and hardware: clock-domain crossings, DMA edge cases, interrupt-controller behaviour, memory-pool starvation on host transports.',
      '**Tooling.** Memory-dump analysis, heap profiling, static struct analysis, remote board control, and a nightly regression suite that multiplied emulator throughput about four times.',
      '**Mentoring.** Two engineers through their first bring-up; both earned customer recognition.',
    ],
  },
  {
    id: 'linux',
    tab: 'Embedded Linux',
    title: 'Embedded Linux & Industrial Switching',
    client: 'embedUR Systems · industrial networking customer',
    period: 'May 2021 – Jun 2022',
    bullets: [
      '**Boot time.** Cut switch boot time by roughly four times during a VxWorks-to-Linux migration by tracing a retry loop in hardware discovery and parallelising module initialisation over IPC.',
      '**Kernel and drivers.** Fixed module load ordering at boot and wrote a Linux I2C EEPROM driver for hot-pluggable modules through a CPLD multiplexer.',
      '**Recognised.** Customer awards for the boot-time work and for a new pluggable-module loading algorithm.',
    ],
  },
  {
    id: 'docsis',
    tab: 'Cable modem',
    title: 'Cable Modem Firmware & Lab Provisioning',
    client: 'embedUR Systems · broadband equipment customer',
    period: 'May 2020 – May 2021',
    bullets: [
      '**DOCSIS debugging.** Signal, DHCP, Green Ethernet and connectivity defects on residential gateways across SNMP and CLI backends. RDK-B, Yocto.',
      '**Lab infrastructure.** Replaced an expensive provisioning-client machine with a Raspberry Pi during a hardware shortage and brought up the provisioning system and CMTS behind it.',
    ],
  },
];

export const stats = [
  { value: '6+', label: 'years on 802.11 silicon' },
  { value: '~70%', label: 'active power cut' },
  { value: '4×', label: 'emulator throughput' },
  { value: '1', label: 'invention disclosure', highlight: true },
];

export const recognition = [
  'Customer award · emulator automation',
  'Spot award · pluggable-module algorithm',
  'Pat-on-the-back · switch boot time',
  '5 / 5 "significantly exceeded" · three years running',
  'Gold medalist · B.E. EEE, Anna University',
  'Named inventor · 802.11 power save',
];

export const principles = [
  { title: 'Read the waveform before blaming the code.', body: 'Half my best bugs were in the RTL. The other half were in my assumptions about it.' },
  { title: 'Every bug earns a tool.', body: 'If I had to find it by hand once, the next person should not have to.' },
  { title: 'Numbers, or it did not happen.', body: 'A power figure without a measurement setup is a rumour.' },
  { title: 'Bring-up is a team sport.', body: 'I mentor the way I was mentored: by handing over the debugger.' },
];

export const askMe = [
  'clock-domain crossings',
  'why your sleep current is 3 mA too high',
  'a Fourier series in fifty lines of JavaScript',
  'which suit had the best HUD (Mark VII, obviously)',
];
