// Scope rule for this file: describe the kind of work and the skills used.
// No customer part numbers, platform code names, defect specifics, roadmap
// items or internal metrics. Those belong to the customers under NDA.

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
      'Leading host-side WLAN driver tooling and utilities for a Windows platform.',
      'Details are under customer NDA. Ask me about the general shape of the work.',
    ],
  },
  {
    id: 'wlan-soc',
    tab: 'WLAN SoC',
    title: 'WLAN Firmware & SoC Bring-up',
    client: 'embedUR Systems · Wi-Fi silicon customer · Engineer → Senior → Technical Lead',
    period: 'Jun 2022 – Jul 2026',
    bullets: [
      'Designed low-power sleep protocols between an application MCU and a WLAN core on a dual-core Wi-Fi SoC, covering retention and standby modes with no packet loss. Cortex-R and Cortex-M firmware over an on-die AXI link.',
      'Filed an invention disclosure in the area of 802.11 power save.',
      'Ran pre-silicon bring-up on a hardware emulator: brought up JTAG and OpenOCD access, drove the platform from reset to first ping, and found and characterised RTL defects along the way.',
      'Wrote a bare-metal startup, FreeRTOS port and inter-core transport driver from scratch so most firmware development could proceed before first silicon.',
      'Root-caused defects that lived between firmware and hardware: clock-domain crossings, DMA engine edge cases, interrupt-controller behaviour, memory-pool starvation on host transports.',
      'Built the debug and automation tooling the bring-up ran on: memory-dump analysis, heap profiling, static struct analysis, remote board control and a nightly regression suite that multiplied emulator throughput.',
      'Mentored two engineers through their first bring-up and low-level debug work.',
    ],
  },
  {
    id: 'linux',
    tab: 'Embedded Linux',
    title: 'Embedded Linux & Industrial Switching',
    client: 'embedUR Systems · industrial networking customer',
    period: 'May 2021 – Jun 2022',
    bullets: [
      'Cut switch boot time by roughly four times during a VxWorks-to-Linux migration by tracing a retry loop in hardware discovery and restructuring module initialisation into parallel tasks over IPC.',
      'Fixed kernel-module load ordering at boot and wrote a Linux I2C EEPROM driver for hot-pluggable module support through a CPLD multiplexer.',
      'Customer awards for the boot-time work and for a new pluggable-module loading algorithm.',
    ],
  },
  {
    id: 'docsis',
    tab: 'Cable modem',
    title: 'Cable Modem Firmware & Lab Provisioning',
    client: 'embedUR Systems · broadband equipment customer',
    period: 'May 2020 – May 2021',
    bullets: [
      'Debugged DOCSIS signal, DHCP, Green Ethernet and connectivity defects on residential gateways across SNMP and CLI backends. RDK-B, Yocto.',
      'Replaced an expensive provisioning-client machine with a Raspberry Pi during a hardware shortage and brought up the lab provisioning system and CMTS behind it.',
    ],
  },
];
