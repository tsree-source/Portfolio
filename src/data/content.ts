/**
 * ============================================================================
 * PORTFOLIO CONTENT — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *
 * Every factual claim on this site originates here and is traceable to one of
 * four source résumés:
 *
 *   [FPGA]  TEJASWI_SREERANGAM_FPGA_RTL.pdf
 *   [VLD]   TEJASWI_SREERANGAM_Validation.pdf
 *   [VRF]   TEJASWI_SREERANGAM_Verification.pdf
 *   [AUTO]  Tejaswi_Sreerrangam_AutoMotive_Validation.pdf
 *
 * Rules applied while writing this file:
 *   1. Nothing is stated that is not supported by at least one résumé.
 *   2. Where résumé versions disagree, the conflict is marked `CONFLICT:` and
 *      resolved conservatively (neutral phrasing, or the claim is withheld).
 *   3. Anything requested by the design brief but absent from all four
 *      résumés is marked `PLACEHOLDER:` and is NOT rendered until confirmed.
 *   4. Résumé bullets are rewritten for a portfolio voice; figures are not.
 * ============================================================================
 */

/* ---------------------------------------------------------------------------
 * OPEN ITEMS — resolve these before sending the site to recruiters.
 * Rendered nowhere; kept here so they travel with the code.
 * -------------------------------------------------------------------------*/
export const openItems = [
  'PLACEHOLDER: LinkedIn and GitHub URLs. The résumés hyperlink the words "LinkedIn" and "GitHub" but the extracted text carries no destination. Set profile.links below.',
  'CONFLICT: InnoIndustry role title — "Volunteer Verification Engineer" [FPGA, VRF] vs "Volunteer Hardware Engineer" [VLD, AUTO]. Site currently shows a neutral combined title.',
  'CONFLICT: Johnson Controls scope — "20+ system designs" [FPGA] / "20 multi-story deployments" [VLD] / "20 multi-story floor plans" [VRF] / "20+ embedded systems" [AUTO]. Site uses neutral "20+ system deployments".',
  'CONFLICT: CAN Bus Sensor Node volume — "30+ CAN transactions" analysed [VLD] vs "1,000 CAN-frame tests" [AUTO], same project and same dates. No figure is displayed.',
  'PLACEHOLDER: "KPIT Sparkle 2022 (Top 30)" and "iCreate startup incubation" appear in the design brief but in none of the four résumés. Not displayed.',
  'PLACEHOLDER: sub-200 ms accident-detection metric. Only the ~2 s end-to-end emergency trigger is documented [AUTO]. Not displayed.',
  'PLACEHOLDER: ESP32 / MCP2515 hardware detail for the Smart Accident Management System. Not named in any résumé. Not displayed.',
  'PLACEHOLDER: "Horizon Tech" as the venture name comes from the design brief, not the résumés, which list the work as a project (Jun 2021 – May 2023).',
  'PLACEHOLDER: professional portrait for the About section. Omitted entirely rather than substituted.',
  'NOTE: phone number from the résumés is deliberately not published on a public page. Add to profile.links if wanted.',
]

/* ---------------------------------------------------------------------------
 * IDENTITY
 * -------------------------------------------------------------------------*/
export const profile = {
  name: 'Tejaswi Sreerangam',
  title: 'Hardware Engineer',
  location: 'San Ramon, California',
  email: 'tsreer.5@gmail.com',
  tagline: 'Building, understanding, verifying and improving the systems behind modern hardware.',
  capabilities: ['RTL', 'FPGA', 'Verification', 'Embedded Systems', 'Hardware Validation'],
  links: {
    // PLACEHOLDER: replace with the real profile URLs before publishing.
    github: '#',
    linkedin: '#',
  },
}

/**
 * Profile links that are actually set. A URL left as '#' is treated as unset
 * and simply is not rendered — a portfolio with a dead "GitHub" link reads
 * worse than one that does not mention GitHub at all. Fill in
 * `profile.links` above and the links appear everywhere they belong.
 */
export const socialLinks = (
  [
    { label: 'GitHub', href: profile.links.github },
    { label: 'LinkedIn', href: profile.links.linkedin },
  ] as const
).filter((link) => link.href && link.href !== '#')

/** One résumé identity, two audience-appropriate cuts. Never four. */
export const resumeVariants = [
  {
    label: 'RTL & Verification',
    hint: 'RTL design, FPGA, SystemVerilog/UVM',
    href: './resume/Tejaswi_Sreerangam_RTL_Verification.pdf',
  },
  {
    label: 'Hardware Validation',
    hint: 'HW/SW integration, bring-up, debug',
    href: './resume/Tejaswi_Sreerangam_Hardware_Validation.pdf',
  },
]

/** Chapter ids double as die-region targets, so both routes land in the same place. */
export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'journey', label: 'Journey' },
  { id: 'present', label: 'Present' },
  { id: 'chapter-current', label: 'Work' },
  { id: 'chapter-lab', label: 'Lab' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

/* ---------------------------------------------------------------------------
 * SECTION 1 — THE PRESENT (opening)
 *
 * One pinned scene, one thought at a time. `weight` is how much of the pinned
 * scroll distance each beat occupies: the philosophy lingers, the verbs move at
 * a working pace, and the identity holds at the end.
 *
 * `voice` drives the typographic shift that carries the whole idea:
 *   serif (philosophy) → sans (action) → sans (engineering identity)
 * -------------------------------------------------------------------------*/
export const heroSequence = [
  { key: 'yesterday', kind: 'philosophy', voice: 'serif', weight: 1.15, text: 'Yesterday is history.' },
  { key: 'tomorrow', kind: 'philosophy', voice: 'serif', weight: 1.15, text: 'Tomorrow is a mystery.' },
  { key: 'today', kind: 'philosophy', voice: 'serif', weight: 1.25, text: 'Today is a gift.' },
  {
    key: 'present',
    kind: 'philosophy',
    voice: 'serif',
    weight: 1.35,
    text: 'That is why it is called the present.',
    // The word carrying the whole idea. Rendered with a restrained gold
    // treatment rather than an effect.
    emphasis: 'present',
  },
  // A held breath. The quote is gone; nothing has replaced it yet.
  { key: 'pause', kind: 'pause', voice: 'serif', weight: 0.55 },
  { key: 'pivot', kind: 'pivot', voice: 'sans', weight: 1.15, text: 'So what am I doing with mine?' },
  { key: 'learning', kind: 'verb', voice: 'sans', weight: 0.72, text: 'Learning.' },
  { key: 'building', kind: 'verb', voice: 'sans', weight: 0.72, text: 'Building.' },
  { key: 'testing', kind: 'verb', voice: 'sans', weight: 0.72, text: 'Testing.' },
  { key: 'breaking', kind: 'verb', voice: 'sans', weight: 0.72, text: 'Breaking.' },
  { key: 'debugging', kind: 'verb', voice: 'sans', weight: 0.72, text: 'Debugging.' },
  { key: 'verifying', kind: 'verb', voice: 'sans', weight: 0.72, text: 'Verifying.' },
  { key: 'improving', kind: 'verb', voice: 'sans', weight: 0.85, text: 'Improving.' },
  { key: 'identity', kind: 'identity', voice: 'sans', weight: 2 },
] as const

export type HeroBeat = (typeof heroSequence)[number]

/* ---------------------------------------------------------------------------
 * THE DIE — the functional regions of the engineering work.
 *
 * These are not navigation labels. Each one is a dimension of the same
 * engineer, and each maps to a chapter that shows the evidence for it.
 * Geometry lives in the component; only the words live here.
 * -------------------------------------------------------------------------*/
export const dieRegions = [
  {
    id: 'design',
    name: 'DESIGN',
    sub: 'RTL · FPGA · digital systems',
    question: 'How should this hardware behave?',
    body: 'Turning intended behaviour into synthesisable logic that closes timing.',
    terms: ['Verilog', 'SystemVerilog', 'FSMs', 'Datapaths', 'Fixed-point', 'Vivado', 'Timing analysis'],
    target: 'chapter-fpga',
  },
  {
    id: 'verify',
    name: 'VERIFY',
    sub: 'SystemVerilog · UVM · SVA',
    question: 'How do we prove that it behaves correctly?',
    body: 'Building the environment that decides whether the design is right.',
    terms: ['UVM', 'SVA', 'Scoreboard', 'Reference model', 'Functional coverage', 'Regression'],
    target: 'chapter-dma',
  },
  {
    id: 'validate',
    name: 'VALIDATE',
    sub: 'bring-up · debug · instrumentation',
    question: 'What happens when it meets the real world?',
    body: 'Taking the design onto hardware and finding where reality disagrees.',
    terms: ['JTAG', 'GDB', 'Logic analyzer', 'Fault injection', 'Root-cause analysis', 'Python'],
    target: 'chapter-lab',
  },
  {
    id: 'embedded',
    name: 'EMBEDDED',
    sub: 'vehicle systems · CAN · firmware',
    question: 'Can the system sense the world and act on it?',
    body: 'Where this started: sensors, buses and firmware on a moving vehicle.',
    terms: ['C/C++', 'CAN', 'OBD-II', 'STM32', 'FreeRTOS', 'Sensor fusion'],
    target: 'journey',
  },
  {
    id: 'lab',
    name: 'LAB',
    sub: 'experiments · architecture · controls',
    question: 'What happens if I build it myself?',
    body: 'Smaller builds, each aimed at one question about how a system behaves.',
    terms: ['Bootloader', 'Linux driver', 'PMSM control', 'SimpleScalar'],
    target: 'chapter-lab',
  },
  {
    id: 'current',
    name: 'CURRENT',
    sub: 'hybrid beamforming · InnoIndustry',
    question: 'What am I working on today?',
    body: 'RTL verification across nine blocks of two FPGA signal-processing projects.',
    terms: ['Hybrid Beamforming', 'LDPC', '1W2R memory', 'MATLAB golden model'],
    target: 'chapter-current',
  },
] as const

export type DieRegion = (typeof dieRegions)[number]
export type DieRegionId = DieRegion['id']

/* ---------------------------------------------------------------------------
 * SECTION 2 — THE PAST
 * Source: [AUTO] "Smart Accident Management System | OBD-II Telematics &
 * Sensor Fusion", Jun 2021 – May 2023.
 * -------------------------------------------------------------------------*/
export const past = {
  opener: 'Before I was verifying hardware, I was trying to solve a problem with it.',
  venture: 'Horizon Tech', // PLACEHOLDER: brief-sourced venture name, not in résumés.
  project: 'Smart Accident Management System',
  period: '2021 — 2023',
  body: [
    'The question was simple enough to state and hard to answer: when a vehicle is involved in a crash, how quickly can the vehicle itself tell someone?',
    'Answering it meant working across the whole stack at once — inertial sensing, position, the vehicle’s own diagnostic bus, and the embedded logic that had to decide, in the moment, whether what it was seeing was actually a crash.',
  ],
  // Every item below is named in [AUTO].
  subsystems: [
    { name: 'MPU-6050 IMU', role: 'Accelerometer and gyroscope sensing' },
    { name: 'GPS', role: 'Position and journey telemetry' },
    { name: 'OBD-II', role: 'Vehicle diagnostic data' },
    { name: 'Bluetooth', role: 'Link to the notification path' },
  ],
  stack: ['C/C++', 'Embedded controller', 'Sensor fusion', 'Vehicle telemetry', 'Crash detection'],
  flow: [
    'Vehicle',
    'Sensors',
    'IMU / accelerometer / gyroscope',
    'GPS',
    'OBD-II vehicle data',
    'Embedded processing',
    'Accident / event detection',
    'Telemetry',
    'Emergency response',
  ],
  detection: {
    heading: 'How the decision was made',
    body: 'Crash detection combined lateral-G thresholds with multi-sensor data, so a hard manoeuvre and an actual impact would not look the same to the system.',
  },
  metrics: [
    {
      value: '~2 s',
      label: 'Emergency triggering',
      note: 'Validated across 20+ simulated scenarios',
      // CONFLICT GUARD: the brief asked about a sub-200 ms detection figure.
      // No résumé documents it. Only this end-to-end trigger time is shown.
    },
    { value: '500+', label: 'Telemetry points', note: 'Processed per session' },
    { value: '20+', label: 'Simulated scenarios', note: 'Used to validate triggering' },
  ],
  evolution: {
    heading: '5G-Connected Vehicle Telemetry & Emergency Response',
    body: 'The prototype pointed at a larger question — how event information moves off the vehicle and into connected services fast enough to matter.',
    stages: ['Vehicle', 'Sensing', 'Event detection', 'Connected network', 'Services', 'Emergency awareness'],
  },
  milestones: [
    {
      title: 'Government of India 5G Hackathon',
      detail: 'Top 30 Pan India',
      note: 'National evaluation of the connected-vehicle concept',
    },
    {
      title: 'Prototype progression',
      detail: 'TRL 5',
      note: 'Advanced from concept to validated prototype',
    },
    // PLACEHOLDER: KPIT Sparkle 2022 and iCreate incubation are named in the
    // design brief but appear in none of the four résumés. Add here only with
    // supporting evidence.
  ],
}

/* ---------------------------------------------------------------------------
 * SECTION 3 — THE TURNING POINT (narrative; no new factual claims)
 * -------------------------------------------------------------------------*/
export const turningPoint = {
  ladder: [
    'Vehicle',
    'Electronic system',
    'Controller',
    'PCB',
    'Integrated circuit',
    'Digital logic',
    'Registers',
    'Datapaths',
    'RTL',
    'Signals',
    'Waveforms',
  ],
  heading: 'The questions changed.',
  questions: [
    'Can I build a system that works?',
    'What is actually happening inside the hardware?',
    'How should that hardware behave?',
    'How do we prove that it behaves correctly?',
  ],
}

/* ---------------------------------------------------------------------------
 * SECTION 4 — WHAT I BRING TODAY
 * Skills below are drawn from the skills sections of all four résumés.
 * -------------------------------------------------------------------------*/
export const pillars = [
  {
    id: 'design',
    name: 'Design',
    question: 'How should this hardware behave?',
    blurb: 'Turning intended behaviour into synthesisable logic that meets timing.',
    groups: [
      {
        label: 'RTL',
        items: [
          'Verilog',
          'SystemVerilog',
          'RTL design',
          'FSMs',
          'Datapaths',
          'Combinational / sequential logic',
          'Registers & FIFOs',
          'Memory structures',
          'MMIO',
          'Clock / reset logic',
          'Fixed-point arithmetic',
          'Pipelining',
        ],
      },
      {
        label: 'FPGA & timing',
        items: [
          'FPGA design',
          'Vivado',
          'RTL synthesis',
          'Timing analysis',
          'Critical-path analysis',
          'Resource utilisation',
          'Datapath optimisation',
        ],
      },
    ],
  },
  {
    id: 'verify',
    name: 'Verify',
    question: 'How do we prove it behaves correctly?',
    blurb: 'Building the environment that decides whether the design is right.',
    groups: [
      {
        label: 'Methodology',
        items: [
          'SystemVerilog testbenches',
          'UVM',
          'SVA',
          'Directed testing',
          'Constrained-random testing',
          'Sequences',
          'Drivers',
          'Monitors',
          'Scoreboards',
          'Checkers',
        ],
      },
      {
        label: 'Closure & debug',
        items: [
          'Functional coverage',
          'Coverage closure',
          'Regression testing',
          'Waveform debugging',
          'MATLAB golden-model verification',
          'Reference-model checking',
          'Verilator',
          'GTKWave',
          'XSim',
        ],
      },
    ],
  },
  {
    id: 'validate',
    name: 'Validate',
    question: 'What happens when it meets the real world?',
    blurb: 'Taking the design onto hardware and finding where reality disagrees.',
    groups: [
      {
        label: 'Bring-up & debug',
        items: [
          'HW/SW integration',
          'Functional validation',
          'Board-level validation',
          'Failure reproduction',
          'Fault injection',
          'Root-cause analysis',
          'Register-level debugging',
          'JTAG',
          'GDB',
          'dmesg / log analysis',
        ],
      },
      {
        label: 'Bench & interfaces',
        items: [
          'Logic analyzer',
          'Oscilloscope',
          'Digital multimeter',
          'Bench power supply',
          'CAN protocol decoding',
          'UART',
          'SPI',
          'I2C',
          'CAN',
          'ARM Cortex-M4/M7',
          'FreeRTOS',
        ],
      },
      {
        label: 'Automation',
        items: ['Python', 'C', 'C++', 'Bash', 'Linux', 'MATLAB', 'Git'],
      },
    ],
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 5 — CURRENT WORK
 * Source: InnoIndustry, Aug 2026 – Present [FPGA, VLD, VRF, AUTO].
 * -------------------------------------------------------------------------*/
export const currentWork = {
  eyebrow: 'Current work',
  company: 'InnoIndustry',
  headline: 'Hybrid Beamforming RTL Verification',
  period: 'Aug 2026 — Present',
  summary:
    'I verify RTL for two FPGA signal-processing projects — Hybrid Beamforming and LDPC — across nine blocks, covering datapath, memory, FSM/control, reset and interface behaviour.',
  coverage: [
    { area: 'Datapath', note: 'Fixed-point behaviour against reference' },
    { area: 'Memory', note: 'Write/read path timing and integrity' },
    { area: 'FSM / control', note: 'State progression and legal transitions' },
    { area: 'Reset', note: 'Initialisation and recovery behaviour' },
    { area: 'Interfaces', note: 'Module boundary contracts' },
  ],
  featured: {
    title: '64 × 24-bit complex 1W2R memory',
    points: [
      '1 synchronous write path',
      '2 combinational read paths',
      'Self-checking SystemVerilog tests',
      'Simulation and waveform analysis',
    ],
  },
  methodFlow: {
    left: 'MATLAB golden model',
    right: 'RTL implementation',
    compare: 'Comparator / checker',
    outcomes: ['Match', 'Mismatch'],
    debug: 'Waveform debug & regression triage',
  },
  failureClasses: ['Timing', 'Reset', 'Fixed-point', 'Interface'],
  collaboration:
    'Day to day this means working alongside RTL and algorithm engineers — reproducing failures, closing verification gaps and supporting module-level integration.',
  // Deliberate wording: the résumés describe coverage being driven *toward*
  // 95% on this engagement, not achieved. Do not restate this as a result.
  coverageTarget: 'Driving functional coverage toward 95%',
  metrics: [
    { value: '9', label: 'RTL blocks' },
    { value: '2', label: 'FPGA projects' },
    { value: '2', label: 'MATLAB golden models' },
  ],
}

/* ---------------------------------------------------------------------------
 * SECTION 6 — SELECTED WORK
 * -------------------------------------------------------------------------*/
export type CaseStudy = {
  id: string
  name: string
  kind: string
  period: string
  oneLine: string
  tags: string[]
  keyResult: { value: string; label: string }
  recruiter: { problem: string; contribution: string; result: string }
  detail: {
    architecture: string[]
    implementation: string[]
    verification: string[]
    debug: string[]
    learned: string
  }
  metrics: { value: string; label: string; note?: string; count?: number; suffix?: string }[]
  diagram: 'uvm' | 'datapath' | 'vehicle'
  repo?: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'dma',
    name: 'Memory-Mapped DMA Controller',
    kind: 'RTL design & UVM verification',
    period: 'Sep 2025 — Jan 2026',
    oneLine:
      'A 32-bit DMA controller taken from RTL through a full UVM environment, until the testbench could prove its behaviour rather than suggest it.',
    tags: ['SystemVerilog', 'UVM', 'SVA', 'Functional coverage', 'MMIO', 'FSM'],
    keyResult: { value: '95%', label: 'functional coverage' },
    recruiter: {
      problem:
        'A DMA controller has to move between 1 and 1,024 words without the CPU watching, which means its configuration, transfer and interrupt behaviour all have to be correct at once — and provably so.',
      contribution:
        'I designed the 32-bit RTL — 8 MMIO registers, programmable address generation, a transfer FSM and interrupt logic — then built the UVM environment that verifies it.',
      result:
        'Across 1,000 transactions the environment reached 95% functional coverage and surfaced 6 protocol and control defects, each resolved through regression and waveform debugging.',
    },
    detail: {
      architecture: [
        '32-bit datapath sized for 1–1,024-word transfers.',
        '8 memory-mapped registers exposing configuration, control and status.',
        'Programmable address generation for source and destination.',
        'Transfer FSM sequencing request, burst and completion.',
        'Interrupt logic signalling completion and error conditions back to software.',
      ],
      implementation: [
        'Three functional areas implemented and verified as a set: configuration, data transfer and interrupts.',
        'Register map written so that software-visible behaviour and RTL state stay in step.',
        'Control and datapath kept separable, so a control defect could not hide inside data movement.',
      ],
      verification: [
        'UVM environment with sequences, driver, monitor and scoreboard.',
        'SystemVerilog assertions guarding protocol and control-path legality.',
        'Reference-model checking on every transaction rather than spot checks.',
        'Functional coverage model tracking all 8 registers and the three functional areas.',
        'Regression running the full transaction set after each fix.',
      ],
      debug: [
        '6 protocol and control defects were found and closed.',
        'Each one followed the same route: a scoreboard or assertion failure, reproduced in regression, isolated in waveform, then traced back to the RTL that caused it.',
        'Coverage holes were treated the same way as failures — as unanswered questions about the design.',
      ],
      learned:
        'A testbench is a claim about what correct means. Writing the reference model forced me to state that claim precisely, and most of the defects surfaced at exactly the points where my statement and the RTL disagreed.',
    },
    metrics: [
      { value: '1,000', label: 'Transactions executed', count: 1000 },
      { value: '95%', label: 'Functional coverage', count: 95, suffix: '%' },
      { value: '6', label: 'Defects resolved', count: 6 },
      { value: '8', label: 'MMIO registers', count: 8 },
    ],
    diagram: 'uvm',
  },
  {
    id: 'fpga5g',
    name: 'FPGA-Based 5G Receiver RTL',
    kind: 'Fixed-point RTL design & synthesis',
    period: 'Aug 2025 — Oct 2025',
    oneLine:
      'Three fixed-point DSP blocks from a 5G receiver chain, designed in Verilog and pushed through synthesis until the timing closed.',
    tags: ['Verilog', 'Fixed-point', 'LDPC', 'MMSE', 'CORDIC', 'Vivado'],
    keyResult: { value: '250 MHz', label: 'after optimisation' },
    recruiter: {
      problem:
        'Receiver-side signal processing has to be numerically correct and fast enough to keep up — in fixed point, on an FPGA, where every bit of width costs area.',
      contribution:
        'I designed Verilog RTL for three fixed-point blocks — LDPC encode/decode, MMSE equalisation and CORDIC-based QR decomposition — and verified datapath, control and reset behaviour.',
      result:
        'Vivado synthesis and timing analysis brought the design to 250 MHz, with 20% lower implementation area and 30% lower datapath latency.',
    },
    detail: {
      architecture: [
        'Three DSP blocks spanning the receiver chain: LDPC encoder/decoder, MMSE equalisation, and CORDIC-based QR decomposition.',
        'Fixed-point datapaths throughout, with word widths chosen against area and timing rather than convenience.',
        'Control FSMs separated from arithmetic so that each could be verified on its own terms.',
      ],
      implementation: [
        'CORDIC used for QR decomposition to keep the arithmetic in shifts and adds instead of multipliers.',
        'Datapath restructured during optimisation to shorten the critical path.',
        'Reset behaviour defined explicitly for each block rather than inherited by accident.',
      ],
      verification: [
        'SystemVerilog tests covering three behaviour classes: datapath, control and reset.',
        'Waveform analysis used to confirm fixed-point behaviour matched intent at block boundaries.',
        'Functional coverage taken to 95% on the block set.',
      ],
      debug: [
        'Timing closure drove most of the iteration — critical-path analysis in Vivado, then targeted datapath changes rather than global constraint tuning.',
        'Area reduction and latency reduction were pursued together, since a shorter path and a smaller footprint tend to come from the same restructuring.',
      ],
      learned:
        'Fixed-point design is where architecture and arithmetic stop being separate problems. Deciding where to lose precision is a timing decision, an area decision and a correctness decision at the same time.',
    },
    metrics: [
      { value: '250 MHz', label: 'Synthesised frequency', count: 250, suffix: ' MHz' },
      { value: '20%', label: 'Lower implementation area', count: 20, suffix: '%' },
      { value: '30%', label: 'Lower datapath latency', count: 30, suffix: '%' },
      { value: '3', label: 'DSP blocks designed', count: 3 },
    ],
    diagram: 'datapath',
  },
  {
    id: 'sams',
    name: 'Smart Accident Management System',
    kind: 'Vehicle telemetry & sensor fusion',
    period: 'Jun 2021 — May 2023',
    oneLine:
      'The embedded vehicle system that started all of this — sensing an impact, and getting that fact off the vehicle quickly.',
    tags: ['C/C++', 'MPU-6050 IMU', 'GPS', 'OBD-II', 'Bluetooth', 'Sensor fusion'],
    keyResult: { value: 'TRL 5', label: 'prototype progression' },
    recruiter: {
      problem:
        'A crash is only detectable from the outside if the vehicle can recognise it and report it without a person in the loop.',
      contribution:
        'I integrated four subsystems — MPU-6050 IMU, GPS, OBD-II and Bluetooth — in C/C++ for crash detection and vehicle telemetry.',
      result:
        'Emergency triggering was validated within roughly 2 seconds across 20+ simulated scenarios, processing 500+ telemetry points per session; the prototype advanced to TRL 5 and placed Top 30 Pan India in the Government of India 5G Hackathon.',
    },
    detail: {
      architecture: [
        'Vehicle-side sensing built on inertial data, position and the vehicle’s own diagnostic bus.',
        'Detection logic combining lateral-G thresholds with multi-sensor data to separate hard driving from an actual impact.',
        'Telemetry path carrying event and journey data off the vehicle.',
      ],
      implementation: [
        'Four subsystems integrated in C/C++: MPU-6050 IMU, GPS, OBD-II and Bluetooth.',
        '500+ telemetry points processed per session.',
      ],
      verification: [
        '20+ simulated scenarios exercised the detection path.',
        'Emergency triggering validated at approximately 2 seconds end to end.',
      ],
      debug: [
        'The hard part was not detecting a large acceleration — it was not detecting one when nothing had happened.',
        'Threshold and multi-sensor logic was tuned against the simulated scenario set rather than a single case.',
      ],
      learned:
        'Building this taught me that I cared about the layer underneath. Every question I had about why the system behaved the way it did ended somewhere below my code — in the controller, in the bus, in the hardware.',
    },
    metrics: [
      { value: '~2 s', label: 'Emergency triggering' },
      { value: '20+', label: 'Simulated scenarios', count: 20, suffix: '+' },
      { value: '500+', label: 'Telemetry points / session', count: 500, suffix: '+' },
      { value: 'Top 30', label: 'Pan India — 5G Hackathon' },
    ],
    diagram: 'vehicle',
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 7 — HOW I ENGINEER (method, not new claims)
 * -------------------------------------------------------------------------*/
export const workflow = [
  {
    stage: 'Understand',
    question: 'What should the system do?',
    lines: ['Read requirements.', 'Understand interfaces.', 'Identify expected behaviour.'],
  },
  {
    stage: 'Model',
    question: 'What does correct behaviour look like?',
    lines: ['Architecture.', 'Reference behaviour.', 'Expected outputs.'],
  },
  {
    stage: 'Build',
    question: 'Turn behaviour into implementation.',
    lines: ['RTL.', 'Firmware.', 'Test environment.', 'Automation.'],
  },
  {
    stage: 'Observe',
    question: 'What is the system actually doing?',
    lines: ['Waveforms.', 'Signals.', 'Logs.', 'Measurements.'],
  },
  {
    stage: 'Break',
    question: 'What happens outside the happy path?',
    lines: ['Corner cases.', 'Fault injection.', 'Invalid states.', 'Recovery paths.'],
  },
  {
    stage: 'Debug',
    question: 'Where did expected and observed diverge?',
    lines: ['Reproduce.', 'Trace.', 'Isolate.', 'Find root cause.'],
  },
  {
    stage: 'Verify',
    question: 'Can I prove the behaviour repeatedly?',
    lines: ['Self-checking tests.', 'Assertions.', 'Regression.', 'Coverage.'],
  },
  {
    stage: 'Improve',
    question: 'What does the result teach us about the design?',
    lines: ['Feed the learning back into the implementation.'],
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 8 — THE LAB
 * -------------------------------------------------------------------------*/
export const labProjects = [
  {
    id: 'can',
    name: 'CAN Bus Sensor Node',
    period: 'Feb 2025 — Apr 2025',
    summary:
      'A two-node STM32 CAN network built to watch the protocol misbehave on purpose — arbitration, acknowledgement and bus-off recovery under injected faults.',
    points: [
      '2-node STM32 CAN network across 125 / 250 / 500 kbps',
      'Custom IDs and diagnostic request frames',
      'Arbitration, ACK handling and bus-off recovery validated',
      'Regression at 500 kbps across 3 injected faults',
      'Logic-analyzer protocol decoding of error-counter and recovery behaviour',
      // CONFLICT: [VLD] states "30+ CAN transactions" analysed; [AUTO] states
      // "1,000 CAN-frame tests" — same project, same dates. No count shown
      // until the correct figure is confirmed.
    ],
    tags: ['STM32', 'CAN', 'Fault injection', 'Logic analyzer'],
  },
  {
    id: 'bootloader',
    name: 'Bare-Metal Bootloader',
    period: 'Dec 2025 — Feb 2026',
    summary:
      'A two-stage STM32F4 bootloader, written to survive the cases that actually break field updates: a corrupted image, an interrupted transfer, a rollback.',
    points: [
      '2-stage STM32F4 bootloader with CRC32 validation',
      'Flash partitioning and UART firmware transfer',
      'Python host tooling for the update path',
      '3 low-level failure areas debugged with JTAG/GDB',
      'Firmware recovery validated across 4 scenarios',
      '12+ functional and negative tests across boot, image validation, transfer and recovery',
    ],
    tags: ['STM32F4', 'CRC32', 'UART', 'JTAG/GDB', 'Python'],
  },
  {
    id: 'driver',
    name: 'Embedded Linux Device Driver',
    period: 'Sep 2025 — Nov 2025',
    summary:
      'An I2C kernel driver plus the userspace tooling to prove it behaves across its whole lifecycle, not just on the happy path.',
    points: [
      'I2C Linux kernel driver: probe/remove, sysfs access, interrupt handling',
      'Python userspace validation utility',
      'Repeated lifecycle and access testing',
      '3 failure classes debugged — null checks, cleanup and timing',
      'Error-path testing via dmesg/log analysis',
    ],
    tags: ['Linux kernel', 'I2C', 'sysfs', 'Python'],
  },
  {
    id: 'pmsm',
    name: 'Sensorless PMSM Motor Drive',
    period: 'Dec 2025 — Feb 2026',
    summary:
      'Closed-loop field-oriented control of a 3-phase PMSM without a position sensor — and the protection logic for when it goes wrong.',
    points: [
      'Sensorless FOC with 3 PI loops: d-axis current, q-axis current and speed',
      '6 complementary PWM outputs',
      'ADC/DMA current acquisition',
      '3 protection functions: overcurrent, stall and undervoltage',
      'Python/UART framework logging 5 controller signals across 6 scenarios',
    ],
    tags: ['PMSM', 'FOC', 'PWM', 'ADC/DMA', 'Python'],
  },
  {
    id: 'cpu',
    name: 'CPU Architecture Evaluation',
    period: 'Oct 2024 — Dec 2024',
    summary:
      'A study of what pipeline width actually buys you, run against SPEC CPU2006 workloads in a SimpleScalar/PISA environment.',
    points: [
      'SPEC CPU2006 workloads across 500M instructions',
      '5 pipeline widths (1/2/4/8/16) evaluated',
      '4 processor resources varied: fetch, decode, issue and commit',
      'IPC/CPI and resource-cost trade-offs compared across 5 configurations',
      'Pipeline-scaling trends and performance bottlenecks identified',
    ],
    tags: ['SimpleScalar', 'PISA', 'SPEC CPU2006', 'IPC/CPI'],
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 9 — PROFESSIONAL EXPERIENCE
 * -------------------------------------------------------------------------*/
export const experience = [
  {
    company: 'InnoIndustry',
    // CONFLICT: "Volunteer Verification Engineer" [FPGA, VRF] vs
    // "Volunteer Hardware Engineer" [VLD, AUTO]. Neutral title used until the
    // canonical one is confirmed.
    role: 'Volunteer Hardware / Verification Engineer',
    period: 'Aug 2026 — Present',
    location: 'United States',
    current: true,
    points: [
      'Verify 9 RTL blocks across 2 FPGA/RTL projects — Hybrid Beamforming and LDPC — covering datapath, memory, FSM/control, reset and interfaces.',
      'Develop self-checking SystemVerilog tests and validate RTL behaviour against MATLAB golden models.',
      'Debug RTL/golden-model mismatches through waveform analysis and regression triage, isolating timing, reset, fixed-point and interface issues.',
      'Collaborate with RTL and algorithm engineers to reproduce failures, close verification gaps and support module-level integration.',
    ],
    tags: ['SystemVerilog', 'UVM', 'FPGA', 'MATLAB golden models', 'Waveform debug'],
  },
  {
    company: 'Johnson Controls',
    role: 'Graduate Design Engineer',
    period: 'Oct 2023 — Jun 2024',
    location: 'India',
    current: false,
    points: [
      // CONFLICT: scope described as "20+ system designs" [FPGA] /
      // "20 multi-story deployments" [VLD] / "20 multi-story floor plans" [VRF]
      // / "20+ embedded systems" [AUTO]. Neutral phrasing used below.
      'Performed hardware/software integration and functional validation across 20+ system deployments, checking embedded sensors, controllers and interfaces against system requirements.',
      'Investigated 200+ engineering records with design teams — reproducing failures and tracing interface and configuration issues to root cause — reducing downstream rework by 15%.',
      'Automated an 8-field engineering traceability workflow in Python, reducing technical-record lookup time by 25%.',
    ],
    tags: ['HW/SW integration', 'Functional validation', 'Root-cause analysis', 'Python'],
    metrics: [
      { value: '20+', label: 'System deployments validated' },
      { value: '200+', label: 'Engineering records analysed' },
      { value: '15%', label: 'Less downstream rework' },
      { value: '25%', label: 'Faster record lookup' },
    ],
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 10 — EDUCATION
 * -------------------------------------------------------------------------*/
export const education = [
  {
    school: 'University of Illinois Chicago',
    degree: 'Master of Science, Electrical and Computer Engineering',
    period: 'Aug 2024 — May 2026',
  },
  {
    school: 'Savitribai Phule Pune University',
    degree: 'Bachelor of Engineering, Electronics and Telecommunications',
    period: 'Jul 2019 — May 2023',
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 11 — CURRENTLY (designed to be edited often)
 * -------------------------------------------------------------------------*/
export const currently = [
  {
    label: 'Building',
    items: ['Hybrid Beamforming RTL verification'],
  },
  {
    label: 'Deepening',
    items: ['Digital design', 'SystemVerilog', 'Verification', 'Computer architecture'],
  },
  {
    label: 'Exploring',
    items: ['FPGA systems', 'ASIC / SoC engineering', 'Hardware validation'],
  },
]

/* ---------------------------------------------------------------------------
 * SECTION 12 — THE FUTURE
 * -------------------------------------------------------------------------*/
export const future = {
  heading: 'Tomorrow is still a mystery.',
  sub: 'And that’s what makes engineering interesting.',
  questions: [
    'How should this hardware behave?',
    'How do we make it efficient?',
    'How do we know it behaves correctly?',
    'What happens when it doesn’t?',
    'How can we build it better?',
  ],
  close: 'I want to keep finding out.',
}

/* ---------------------------------------------------------------------------
 * SECTION 13 — ABOUT
 * -------------------------------------------------------------------------*/
export const about = {
  heading: 'The person behind the waveforms.',
  paragraphs: [
    'I’m Tejaswi, a Hardware Engineer interested in understanding systems from both sides: how hardware is built, and how we prove that it works.',
    'My path into hardware started with embedded vehicle systems and sensor integration, then moved deeper into digital logic, RTL, FPGA systems, verification and hardware validation.',
    'What keeps me interested is the same question at every level: what is this system actually doing, and how can I make it work better?',
  ],
  // PLACEHOLDER: portrait intentionally omitted — no professional photograph
  // was supplied, and an AI-generated one would be worse than none.
  portrait: null as string | null,
}

/* ---------------------------------------------------------------------------
 * FINAL — RETURN TO THE PRESENT
 * -------------------------------------------------------------------------*/
export const closing = {
  lines: [
    'Yesterday gave me experience.',
    'Tomorrow gives me direction.',
    'Today gives me the opportunity to build.',
  ],
  resolve: 'That is the present.',
  cta: 'What should we build with it?',
}
