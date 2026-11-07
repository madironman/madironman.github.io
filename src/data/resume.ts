// Every line on the site comes from the signed-off resume, rephrased for the
// web at most. Do not add claims, numbers, technologies or results that the
// resume does not state, and keep its scoping words ("Main contributor",
// "Contributed", "Design signed off ...") intact.
//
// Bullets use **lead phrase** markup; the page renders it as <strong>.

export interface CaseStudy {
  id: string;
  title: string;
  problem: string;
  approach: string;
  result: string;
  note?: string;
}

export interface Group {
  label: string;
  items: string[];
}

export interface Engagement {
  id: string;
  client: string;
  scope: string;
  dates: string;
  intro?: string;
  cases: CaseStudy[];
  more: Group[];
  note?: string;
}

export const summary = {
  lede:
    '6+ years in embedded systems, most of them on 802.11 WLAN silicon: low-power SoC architecture, pre-silicon bring-up, host–firmware transports over PCIe, SDIO and on-die AXI, and now a Windows Wi-Fi 6/6E driver.',
  approach: '',
};

export const employer = {
  name: 'embedUR Systems',
  place: 'Chennai, India',
  dates: 'May 2020 – Present',
  titles: [
    { title: 'Technical Lead', years: '2025–present' },
    { title: 'Senior Software Engineer', years: '2022–2025' },
    { title: 'Software Engineer', years: '2020–2022' },
    { title: 'Intern', years: '2020' },
  ],
};

export const engagements: Engagement[] = [
  {
    id: 'infineon',
    client: 'Infineon',
    scope: 'Windows Wi-Fi driver',
    dates: 'Jul 2026 – Present',
    intro:
      '**Main contributor** to a Windows 11 WiFiCx driver for a Wi-Fi 6/6E PCIe chipset on ARM64, ported from the Linux brcmfmac driver, and to its wl.exe / dhd.exe diagnostics tools.',
    cases: [
      {
        id: 'infineon-handshake',
        title: 'WPA2 handshake failure on ARM64',
        problem: 'A WPA2 4-way-handshake failure.',
        approach: 'Traced it to stale ARM64 cache lines on zero-copy TX buffers, and cleaned the cache before DMA.',
        result: 'Handshake fixed, which let zero-copy TX be switched back on.',
      },
      {
        id: 'infineon-recovery',
        title: 'Resets, surprise removal and firmware halts',
        problem: 'The driver had to survive resets, surprise removal and firmware halts on two board designs.',
        approach: 'Added recovery paths: a probe-time reset and an FLR fallback.',
        result: 'The driver restarts automatically, with a coredump, after a firmware halt.',
      },
    ],
    more: [
      {
        label: 'Also on this engagement',
        items: [
          '**Implemented Windows PCIe power management:** firmware D3 handshake, hot resume without a firmware reload (cold-resume fallback), S0 idle, Modern Standby, and wake-on-WLAN with ARP/NS/GTK-rekey offload.',
        ],
      },
    ],
  },
  {
    id: 'synaptics',
    client: 'Synaptics',
    scope: 'WLAN firmware and SoC bring-up',
    dates: 'Jun 2022 – Jul 2026',
    cases: [
      {
        id: 'synaptics-sleep',
        title: 'Sleep architecture for a combined MCU + Wi-Fi SoC',
        problem: 'Either core of a combined MCU + Wi-Fi SoC should be able to sleep without dropping traffic.',
        approach:
          'Designed the sleep architecture: a four-state machine (MCU × WLAN, each awake/asleep) in which WLAN firmware moves from host buffers to local TCM buffers while the MCU sleeps, so either core sleeps without dropping traffic.',
        result: 'Design signed off; implementation under way when the engagement closed.',
      },
      {
        id: 'synaptics-presilicon',
        title: 'Development before first silicon',
        problem: 'The SoC’s host driver and transport had to be developed before first silicon.',
        approach:
          'Conceived and designed a stand-in MCU platform on an existing combo chip, and wrote its interrupt and DMA code. The chip’s Bluetooth Cortex-M4 booted a FreeRTOS host image through a UART-patch and JTAG load chain and ran the transport against the WLAN Cortex-R4, with cross-core doorbells built from timer and chip-level interrupt registers.',
        result: '~90% of the host-driver and transport development happened before first silicon.',
      },
      {
        id: 'synaptics-emulator',
        title: 'Test turnaround on the Veloce emulator',
        problem: 'WLAN test turnaround on the Veloce emulator took 8 h, and the emulator was used only for bring-up.',
        approach: 'Built the full test-automation framework, and ran the emulation hosts headless over SSH.',
        result:
          'Turnaround cut from 8 h to ~30 min, and emulator utilisation pushed toward ~90% with nightly regressions and pre-merge checks. The team then released ROM for a tapeout in one week instead of the usual one to three months.',
      },
    ],
    more: [
      {
        label: 'Bring-up and debug',
        items: [
          '**Brought up JTAG/OpenOCD debug on the Veloce emulator,** root-causing three RTL and place-and-route faults in the debug path and redesigning JTAG fetch for emulation speed, and added an OpenOCD backend so the verification teams’ TCL scripts ran unmodified.',
          '**Drove emulator bring-up of a new SoC from reset to ping,** and shortened its MCU boot by removing a duplicate data-section copy, BSS clear and initialisation that ran in both the startup assembly and crt0.',
          '**Designed the MCU–WLAN interrupt architecture** of the on-die transport (PCIe msgbuf rings re-hosted on AXI): a FreeRTOS-safe NVIC driver on CMSIS and an instrumented test driver measuring latency, misses and spurious hits, which caught a clock-domain-crossing race on deassertion, fixed by deferring clear-pending.',
          '**Resolved a day-0 field escalation** by programming internal interrupt generators and an on-chip JTAG master to reach otherwise inaccessible debug registers.',
        ],
      },
      {
        label: 'Data path and security',
        items: [
          '**Ended zero-throughput stalls under sustained bidirectional SDIO traffic** by diagnosing an RX pool-starvation loop from the pool counters and reserving a floor of packet pools for RX DMA refill.',
          '**Hardened WPA2 without breaking mixed legacy networks** by blocking pairwise TKIP while keeping group TKIP, enforced across the supplicant, host driver and firmware MAC key-install path.',
        ],
      },
      {
        label: 'Silicon workarounds',
        items: [
          '**Kept the M2M DMA engine usable despite a silicon FSM defect,** profiling it against memcpy to steer the hardware team to the root cause, and devised the runtime workaround that routes only the affected transfers through memcpy.',
          '**Unblocked the SoC’s deep-sleep mode despite a silicon RC-oscillator enable-latch defect,** bringing the MCU’s RC clock up via the WLAN core’s internal JTAG master, then via an LDO overvolt applied only around sleep, and made the MCU an always-on wake source.',
          '**Restored core discovery on the new SoC** by handling, in the EROM parser, a silicon bug that left the MCU core out of the chip’s enumeration ROM.',
        ],
      },
      {
        label: 'Low power',
        items: [
          '**Implemented dynamic RAM-bank turn-off** for a chip-level sleep-current reduction on an SDIO WLAN chipset, confining packet pools to the last bank and gating it only when every pool was idle; the new memory layout also shrank the firmware image considerably. Ported it to three earlier chipsets, and designed follow-ons that also gate free memory during active operation.',
        ],
      },
      {
        label: 'Debug tooling',
        items: [
          '**Wrote bring-up debug tooling:** a crash-triage engine that rebuilds system state from raw RAM dumps, a heap profiler, a struct-layout analyser, and a strap-pin kit that made remote CI reflash possible.',
          '**Audited release binaries with a self-built disassembly scan** for illegal undefined-instruction patterns, surfacing 200+ latent crash points.',
        ],
      },
      {
        label: 'Mentoring',
        items: ['**Mentored two engineers,** an intern and a new power-save engineer, through low-level debug and the new SoC’s power-save design; both went on to earn customer appreciation for their work.'],
      },
    ],
  },
  {
    id: 'hirschmann',
    client: 'Hirschmann (Belden)',
    scope: 'Embedded Linux, industrial Ethernet switches',
    dates: 'May 2021 – Jun 2022',
    cases: [
      {
        id: 'hirschmann-boot',
        title: 'Boot-time regression in a VxWorks-to-Linux port',
        problem: 'After a VxWorks-to-Linux port, Linux took 165–172 s to boot on two industrial-switch platforms.',
        approach: 'Traced a 10 s per-slot retry loop in the hardware scan, and moved module initialisation into two tasks.',
        result: 'Linux boot cut to 40–45 s.',
      },
      {
        id: 'hirschmann-sfp',
        title: 'Hot-pluggable SFP modules',
        problem: 'On three switch platforms, hot-pluggable SFP modules returned no module data and passed no SFP-to-SFP traffic.',
        approach: 'Added the missing device-tree entries, and resolved I2C address collisions with a dummy-register scheme.',
        result: 'Module data and SFP-to-SFP traffic restored on all three platforms.',
      },
    ],
    more: [],
  },
  {
    id: 'commscope',
    client: 'CommScope (ARRIS)',
    scope: 'Cable-modem firmware and lab provisioning',
    dates: 'May 2020 – May 2021',
    cases: [
      {
        id: 'commscope-lab',
        title: 'Lab test clients through a hardware shortage',
        problem: 'Test-client laptops were expensive and scarce during a hardware shortage, and testers had to find a free one by asking in a Teams channel.',
        approach:
          'Replaced the laptops with Raspberry Pi clients and automated their allocation, so test scripts claimed any free Pi for iperf runs. Also one of five engineers who brought up the lab’s CMTS server.',
        result: 'Client test-machine cost cut ~90%.',
      },
    ],
    more: [
      {
        label: 'Also on this engagement',
        items: [
          '**Debugged DOCSIS signal-strength, DHCP, Green Ethernet and public Wi-Fi hotspot (GRE tunnel) connection defects** on SURFboard cable gateways across the SNMP and dmcli back ends.',
        ],
      },
    ],
  },
];

export const skills: { label: string; text: string }[] = [
  {
    label: 'Wireless',
    text: 'IEEE 802.11, power save (DTIM, PS-Poll, U-APSD, TWT), wake-on-WLAN and offloads',
  },
  {
    label: 'Firmware & OS',
    text: 'RTOS (FreeRTOS, ThreadX), CMSIS, bare-metal bring-up, Windows kernel-mode drivers (KMDF, WiFiCx, NetAdapterCx), embedded Linux (device tree, I2C)',
  },
  {
    label: 'SoC & interfaces',
    text: 'ARM Cortex-R4/M4/M52, AXI/AHB/APB, PCIe (D3, ASPM L1 substates, FLR), SDIO, DMA, UART, GPIO, PMU and power domains',
  },
  {
    label: 'Debug & validation',
    text: 'JTAG/ARM ADIv5, OpenOCD, GDB, WinDbg (KDNET), Driver Verifier, Lauterbach TRACE32, Veloce emulation, FPGA, RTL and waveform analysis',
  },
  {
    label: 'Languages & tools',
    text: 'C (primary); Python, TCL and C# for tooling; ARM assembly; Git, Jenkins CI, MSBuild/WDK',
  },
];

export const disclosure =
  'Co-inventor on a filed invention disclosure in 802.11 power save: station-side, controlled retrieval of AP-buffered packets (hybrid U-APSD / PM-2 with adaptive control) for hosts with long wake latency.';

export const publication = {
  text: 'A TV-white-space surveillance link transmitting off a Raspberry Pi GPIO pin and receiving on an RTL-SDR; published by Springer (ICIDCA, 2021). From the thesis internship at Ericsson Research India (Dec 2019 – Mar 2020).',
};

export const awards: string[] = [];

export const education = {
  degree: 'B.E. Electrical & Electronics Engineering',
  school: 'SRM Easwari Engineering College (Anna University), Chennai',
  dates: '2016 – 2020',
  points: [
    'Department topper, 2016–2020 batch.',
    'Thesis internship, Ericsson Research India (Dec 2019 – Mar 2020): a TV-white-space surveillance link transmitting off a Raspberry Pi GPIO pin and receiving on an RTL-SDR; published by Springer (ICIDCA, 2021).',
  ],
};
