import { C } from '../system/palette'
import { PinnedScene } from '../system/PinnedScene'
import { Callout, Label, SceneTitle } from '../system/annotations'

/**
 * EXPERIENCE — one interconnect running through the years.
 *
 * Not a stack of dated boxes: a single line the reader advances along, with
 * nodes that come up as the signal reaches them. Education sits on the same
 * line as ordinary nodes rather than in a section of its own, which is the
 * right weight for it — present, inspectable, not dominant.
 *
 * Every date and figure here is taken from the résumés unchanged.
 */
type Node = {
  year: string
  title: string
  role?: string
  period: string
  kind: 'work' | 'study' | 'build'
  points: string[]
  terms?: string[]
}

const NODES: Node[] = [
  {
    year: '2021',
    title: 'Smart Accident Management System',
    role: 'Vehicle telemetry & sensor fusion',
    period: 'Jun 2021 — May 2023',
    kind: 'build',
    points: [
      'Integrated MPU-6050 IMU, GPS, OBD-II and Bluetooth in C/C++ for crash detection and vehicle telemetry.',
      'Emergency triggering validated within ~2 s across 20+ simulated scenarios.',
      'Advanced to TRL 5; Top 30 Pan India in the Government of India 5G Hackathon.',
    ],
    terms: ['C/C++', 'IMU', 'GPS', 'OBD-II', 'Sensor fusion'],
  },
  {
    year: '2023',
    title: 'Johnson Controls',
    role: 'Graduate Design Engineer',
    period: 'Oct 2023 — Jun 2024',
    kind: 'work',
    points: [
      'HW/SW integration and functional validation across 20+ system deployments.',
      'Investigated 200+ engineering records, tracing interface and configuration issues to root cause — 15% less downstream rework.',
      'Automated an 8-field engineering traceability workflow in Python, cutting record lookup time by 25%.',
    ],
    terms: ['HW/SW integration', 'Root-cause analysis', 'Python'],
  },
  {
    year: '2024',
    title: 'University of Illinois Chicago',
    role: 'MS, Electrical and Computer Engineering',
    period: 'Aug 2024 — May 2026',
    kind: 'study',
    points: [
      'Graduate work in digital design, verification and computer architecture.',
      'Bachelor of Engineering, Electronics and Telecommunications — Savitribai Phule Pune University, Jul 2019 — May 2023.',
    ],
    terms: ['Digital design', 'Computer architecture', 'Verification'],
  },
  {
    year: '2025',
    title: 'RTL & FPGA projects',
    role: '5G receiver blocks · memory-mapped DMA',
    period: 'Aug 2025 — Jan 2026',
    kind: 'build',
    points: [
      'Verilog RTL for three fixed-point DSP blocks — LDPC, MMSE equalisation, CORDIC-based QR decomposition — to 250 MHz.',
      '32-bit DMA controller with 8 MMIO registers, transfer FSM and interrupt logic, verified in UVM.',
      '1,000 transactions, 95% functional coverage, 6 protocol and control defects resolved.',
    ],
    terms: ['Verilog', 'SystemVerilog', 'UVM', 'Vivado'],
  },
  {
    year: '2026',
    title: 'InnoIndustry',
    role: 'Volunteer Hardware / Verification Engineer',
    period: 'Aug 2026 — Present',
    kind: 'work',
    points: [
      'Verifying 9 RTL blocks across 2 FPGA projects — Hybrid Beamforming and LDPC.',
      'Self-checking SystemVerilog tests validated against MATLAB golden models.',
      'Debugging RTL/model mismatches through waveform analysis and regression triage.',
    ],
    terms: ['SystemVerilog', 'MATLAB golden models', 'Waveform debug'],
  },
]

export function JourneyTimeline() {
  return (
    <PinnedScene
      id="experience"
      label="Experience and education"
      states={NODES.length}
      vh={420}
      compactVh={320}
      className="border-t border-white/[0.06]"
    >
      {({ state, compact }) => {
        const node = NODES[Math.min(NODES.length - 1, state)]

        return (
          <div className="relative flex h-full flex-col justify-center">
            <div className="shell">
              <SceneTitle eyebrow="Experience" title="One line, five years." id="experience-heading">
                Embedded vehicle systems, into integration and validation, into digital hardware
                and verification.
              </SceneTitle>
            </div>

            {/* The interconnect. */}
            <div className="shell mt-12">
              <SignalLine active={state} compact={compact} />
            </div>

            {/* The node currently reached. */}
            <div className="shell mt-10 grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-14">
              <Callout title={`${node.year} · ${node.title}`} tone="active" visible key={node.year}>
                {node.role && <p className="text-[0.9375rem] text-bright">{node.role}</p>}
                <p className="mt-1">
                  <Label>{node.period}</Label>
                </p>
              </Callout>

              <ul className="space-y-2.5" key={`${node.year}-points`}>
                {node.points.map((point, index) => (
                  <li
                    key={point}
                    className="allow-crossfade flex items-start gap-3 text-[0.875rem] leading-relaxed text-muted transition-opacity duration-700"
                    style={{ transitionDelay: `${index * 90}ms` }}
                  >
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-flow" />
                    {point}
                  </li>
                ))}
                {node.terms && (
                  <li className="pt-2">
                    <Label tone="flow">{node.terms.join(' · ')}</Label>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )
      }}
    </PinnedScene>
  )
}

/** The line itself: travelled, live, and not yet reached. */
function SignalLine({ active, compact }: { active: number; compact: boolean }) {
  const w = 1000
  const h = compact ? 90 : 110
  const y = h / 2
  const step = w / (NODES.length - 1 + 0.6)
  const x = (i: number) => 40 + i * step

  const progressX = x(Math.min(active, NODES.length - 1))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label="Timeline from 2021 to 2026">
      {/* Untravelled line */}
      <line x1={x(0)} y1={y} x2={x(NODES.length - 1)} y2={y} stroke={C.idle} strokeWidth="1.2" />

      {/* Travelled line */}
      <line
        x1={x(0)}
        y1={y}
        x2={progressX}
        y2={y}
        stroke={C.flow}
        strokeWidth="1.8"
        style={{ transition: 'x2 900ms cubic-bezier(0.22,0.61,0.36,1)' }}
      />

      {NODES.map((node, i) => {
        const live = i === active
        const passed = i < active
        const colour = live ? C.active : passed ? C.flow : C.idle
        return (
          <g key={node.year} style={{ transition: 'opacity 600ms ease' }} opacity={live || passed ? 1 : 0.55}>
            {/* Study nodes read as taps off the line rather than inline stages. */}
            {node.kind === 'study' ? (
              <rect x={x(i) - 6} y={y - 6} width="12" height="12" fill="none" stroke={colour} strokeWidth="1.6" style={{ transition: 'stroke 600ms ease' }} />
            ) : (
              <circle cx={x(i)} cy={y} r={live ? 7 : 4.5} fill={live ? colour : C.void} stroke={colour} strokeWidth="1.6" style={{ transition: 'r 500ms ease, fill 500ms ease, stroke 600ms ease' }} />
            )}
            <text x={x(i)} y={y - 22} textAnchor="middle" className="font-mono" fontSize="15" letterSpacing="1.6" fill={colour} style={{ transition: 'fill 600ms ease' }}>
              {node.year}
            </text>
            <text x={x(i)} y={y + 30} textAnchor="middle" className="font-mono" fontSize="8.5" letterSpacing="0.8" fill={C.idle}>
              {node.kind === 'study' ? 'EDUCATION' : node.kind === 'work' ? 'ROLE' : 'BUILD'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
