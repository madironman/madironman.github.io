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
    id: 'infineon',
    tab: 'Infineon',
    title: 'Technical Lead, Windows WLAN Driver',
    client: 'Infineon (Midiana) via embedUR',
    period: 'Jul 2026 – present',
    bullets: [
      'Building the wl utility and DHD applications for the Windows WLAN driver on the Midiana platform.',
      'Evaluating distributed real-time location over Wi-Fi NAN ranging and FTM / RTT: DS-TWR against SS-TWR, leading-edge detection and EKF innovation gating.',
    ],
  },
  {
    id: 'synaptics',
    tab: 'Synaptics',
    title: 'WLAN Firmware & SoC Bring-up',
    client: 'Synaptics via embedUR · Software Engineer → Senior → Technical Lead',
    period: 'Jun 2022 – Jul 2026',
    bullets: [
      'Designed the MCU–WLAN sleep protocol for the 5312 SoC so either core can sleep independently with zero packet loss across full-retention, memory-retention and standby modes. Cortex-R4 and Cortex-M52 firmware over the on-die AXI link.',
      'Filed an invention disclosure on adaptive U-APSD / PM-2 retrieval of AP-buffered packets under high host-wake latency.',
      'Enabled roughly 90% of 5312 development before first silicon by repurposing the on-die Bluetooth Cortex-M4 as the MCU host: wrote the startup assembly, FreeRTOS port and SCI driver from scratch.',
      'Brought up JTAG and OpenOCD on the Veloce emulator, root-causing four RTL defects along the way and proposing a new PMU control register.',
      'Root-caused spurious interrupts across the MCU–WLAN link to a two-flop synchroniser re-cross between the 96 MHz and 192 MHz clock domains.',
      'Cut active power ~70% with DTIM-based power reduction; sped the Veloce emulator ~400% by rebuilding WLAN automation into a nightly regression suite.',
      'Wrote the pre-tapeout debug tooling: Marbel, Hammer, Spade, Crisp and Spark. Mentored two engineers through bring-up.',
    ],
  },
  {
    id: 'hirschmann',
    tab: 'Hirschmann',
    title: 'Embedded Linux & Industrial Switching',
    client: 'Hirschmann (Belden) via embedUR',
    period: 'May 2021 – Jun 2022',
    bullets: [
      'Cut boot time on GRS and MSP switches from 165–172 s to 40–45 s during the VxWorks-to-Linux migration by tracing the delay to a 10-second retry loop and moving module init into dedicated tasks over IPC.',
      'Fixed module-load failures at boot by establishing that the kernel BDE was not modprobed ahead of the user BDE.',
      'Wrote a Linux I2C EEPROM driver reading 27 module parameters through a two-stage CPLD multiplexer for hot-pluggable SFP and PSU support.',
      'Spot award for a new pluggable-module loading algorithm; pat-on-the-back award for the boot-time work.',
    ],
  },
  {
    id: 'commscope',
    tab: 'CommScope',
    title: 'Cable Modem Firmware & Lab Provisioning',
    client: 'CommScope (ARRIS) via embedUR',
    period: 'May 2020 – May 2021',
    bullets: [
      'Debugged DOCSIS signal-strength, DHCP, Green Ethernet and connection defects on SURFboard G34 gateways across the SNMP and dmcli backends. RDKB, Yocto.',
      'Cut client test-machine cost ~90% during a hardware shortage by building a Raspberry Pi replacement for the provisioning client, and brought up the lab provisioning system and CMTS server behind it.',
    ],
  },
];
