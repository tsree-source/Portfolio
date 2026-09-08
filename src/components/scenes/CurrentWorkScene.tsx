import { C } from '../system/palette'
import { useState } from 'react'
import { currentWork } from '../../data/content'
import { PinnedScene, StateRail } from '../system/PinnedScene'
import { Callout, Figure, SceneTitle, TermList } from '../system/annotations'

/**
 * CURRENT WORK — the checking loop as a running system.
 *
 * The claim this section has to earn is that verification is a discipline, not
 * a bullet point. So the scene runs the loop: a stimulus enters two
 * independent implementations, their outputs meet at a comparator, and the
 * comparator's verdict drives the colour of everything downstream.
 *
 * States
 *   0  two implementations, idle
 *   1  stimulus enters both
 *   2  outputs reach the comparator — match, gold
 *   3  a later vector mismatches — vermilion, waveform inspection
 *   4  semantic zoom into the 64 × 24-bit 1W2R memory
 *   5  the ports, individually inspectable
 */
const STATES = ['Idle', 'Stimulus', 'Match', 'Mismatch', 'Memory', 'Ports']

export function CurrentWorkScene() {
  return (
    <PinnedScene
      id="chapter-current"
      label="Current work — hybrid beamforming RTL verification"
      states={6}
      vh={420}
      compactVh={320}
      className="border-t border-white/[0.06]"
    >
      {({ state, compact }) => (
        <div className="relative flex h-full flex-col justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 50% at 70% 10%, rgba(69,179,148,0.08) 0%, rgba(4,12,12,0) 70%)',
            }}
          />

          <div className="shell relative grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-14">
            {/* Left: the story, changing with the state. */}
            <div className="flex flex-col justify-center">
              <SceneTitle
                eyebrow={`${currentWork.company} · ${currentWork.period}`}
                title={currentWork.headline}
                id="current-heading"
              >
                {currentWork.summary}
              </SceneTitle>

              <div className="mt-6 min-h-[7rem]">
                {state <= 1 && (
                  <Callout title="Two sources of truth" tone="flow" visible>
                    A MATLAB golden model says what the block should compute. The RTL says what
                    the hardware will actually do. Verification is the argument between them.
                  </Callout>
                )}
                {state === 2 && (
                  <Callout title="Match" tone="active" visible>
                    Every transaction is checked against the reference, not sampled. Agreement is
                    the uninteresting case — it is the one that has to hold a thousand times.
                  </Callout>
                )}
                {state === 3 && (
                  <Callout title="Mismatch" tone="fault" visible>
                    A disagreement is the useful case. It is reproduced, isolated in waveform, and
                    traced back to whichever side was wrong — timing, reset, fixed-point or interface.
                  </Callout>
                )}
                {state >= 4 && (
                  <Callout title={currentWork.featured.title} tone="active" visible>
                    One synchronous write path and two combinational read paths, checked in
                    simulation and in waveform.
                    <span className="mt-3 block">
                      <TermList terms={['1W', '2R', '24-bit complex', '64 words']} tone="flow" visible />
                    </span>
                  </Callout>
                )}
              </div>

              {!compact && <StateRail className="mt-6 hidden [@media(min-height:780px)]:flex" states={STATES} current={state} />}
            </div>

            {/* Right: the system itself. */}
            <div className="flex items-center">
              {state < 4 ? <ComparisonLoop state={state} /> : <MemoryBlock exposePorts={state >= 5} />}
            </div>
          </div>

          {/* Scope figures arrive as context, not as a badge row. */}
          <div className="shell relative mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {currentWork.metrics.map((metric, index) => (
              <Figure
                key={metric.label}
                value={metric.value}
                label={metric.label}
                tone="flow"
                visible={state >= 1 + index * 0}
              />
            ))}
            <Figure value="95%" label={currentWork.coverageTarget} tone="active" visible={state >= 2} />
          </div>
        </div>
      )}
    </PinnedScene>
  )
}

/* ---------------------------------------------------------------------------
 * The comparison: stimulus → two paths → comparator → verdict
 * -------------------------------------------------------------------------*/
function ComparisonLoop({ state }: { state: number }) {
  const flowing = state >= 1
  const verdict = state === 2 ? 'match' : state >= 3 ? 'mismatch' : null

  const referenceColour = verdict === 'match' ? C.active : C.flow
  const rtlColour =
    verdict === 'mismatch' ? C.fault : verdict === 'match' ? C.active : C.flow

  return (
    <svg viewBox="0 0 620 400" className="h-auto w-full" style={{ maxHeight: '52svh' }} role="img" aria-label="Golden model compared against RTL">
      <defs>
        <marker id="cw-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 z" fill={C.idle} />
        </marker>
      </defs>

      {/* Stimulus */}
      <g opacity={flowing ? 1 : 0.35} style={{ transition: 'opacity 700ms ease' }}>
        <text x="8" y="196" className="font-mono" fontSize="10" letterSpacing="1.6" fill={C.idle}>
          STIMULUS
        </text>
        <line x1="8" y1="206" x2="120" y2="206" stroke={C.flow} strokeWidth="1.2" markerEnd="url(#cw-arrow)" />
        {flowing && (
          <line
            x1="8"
            y1="206"
            x2="120"
            y2="206"
            stroke={C.active}
            strokeWidth="2"
            strokeDasharray="24 200"
            className="animate-trace-flow"
          />
        )}
      </g>

      {/* Fork into two implementations */}
      <path d="M120 206 L150 206 L150 96 L188 96" fill="none" stroke={referenceColour} strokeWidth="1.2" style={{ transition: 'stroke 700ms ease' }} />
      <path d="M120 206 L150 206 L150 312 L188 312" fill="none" stroke={rtlColour} strokeWidth="1.2" style={{ transition: 'stroke 700ms ease' }} />

      <Implementation
        x={188}
        y={54}
        label="MATLAB GOLDEN MODEL"
        sub="expected behaviour"
        colour={referenceColour}
        active={flowing}
      />
      <Implementation
        x={188}
        y={270}
        label="RTL IMPLEMENTATION"
        sub="actual behaviour"
        colour={rtlColour}
        active={flowing}
      />

      {/* Join into the comparator */}
      <path d="M396 96 L440 96 L440 190" fill="none" stroke={referenceColour} strokeWidth="1.2" style={{ transition: 'stroke 700ms ease' }} />
      <path d="M396 312 L440 312 L440 222" fill="none" stroke={rtlColour} strokeWidth="1.2" style={{ transition: 'stroke 700ms ease' }} />

      {/* Comparator */}
      <g>
        <rect
          x="404"
          y="186"
          width="72"
          height="40"
          rx="3"
          fill="rgba(255,255,255,0.02)"
          stroke={verdict === 'mismatch' ? C.fault : verdict ? C.active : C.idle}
          strokeWidth="1.2"
          style={{ transition: 'stroke 700ms ease' }}
        />
        <text x="440" y="210" textAnchor="middle" className="font-mono" fontSize="9.5" letterSpacing="1.2" fill={C.muted}>
          COMPARE
        </text>
      </g>

      {/* Verdict */}
      <line
        x1="476"
        y1="206"
        x2="530"
        y2="206"
        stroke={verdict === 'mismatch' ? C.fault : verdict ? C.active : C.idle}
        strokeWidth="1.4"
        style={{ transition: 'stroke 700ms ease' }}
      />
      <text
        x="538"
        y="203"
        className="font-mono"
        fontSize="12"
        letterSpacing="1.8"
        fill={verdict === 'mismatch' ? C.fault : verdict ? C.active : C.idle}
        style={{ transition: 'fill 700ms ease' }}
      >
        {verdict === 'mismatch' ? 'MISMATCH' : verdict === 'match' ? 'MATCH' : '—'}
      </text>

      {/* Waveform inspection appears only when there is something to inspect. */}
      <g opacity={verdict === 'mismatch' ? 1 : 0} style={{ transition: 'opacity 700ms ease' }}>
        <text x="188" y="376" className="font-mono" fontSize="9" letterSpacing="1.4" fill={C.idle}>
          WAVEFORM INSPECTION
        </text>
        <path d="M188 356 h30 v-20 h34 v20 h30 v-20 h34 v20 h44" fill="none" stroke={C.active} strokeWidth="1.2" opacity="0.55" strokeDasharray="4 4" />
        <path d="M188 356 h30 v-20 h34 v20 h64 v-20 h34 v20 h14" fill="none" stroke={C.fault} strokeWidth="1.4" />
        <circle cx="316" cy="346" r="7" fill="none" stroke={C.fault} strokeWidth="1.2" />
      </g>
    </svg>
  )
}

function Implementation({
  x,
  y,
  label,
  sub,
  colour,
  active,
}: {
  x: number
  y: number
  label: string
  sub: string
  colour: string
  active: boolean
}) {
  return (
    <g style={{ transition: 'opacity 700ms ease' }} opacity={active ? 1 : 0.5}>
      <rect x={x} y={y} width="208" height="84" rx="3" fill="rgba(255,255,255,0.02)" stroke={colour} strokeWidth="1.2" style={{ transition: 'stroke 700ms ease' }} />
      <text x={x + 14} y={y + 30} className="font-mono" fontSize="10.5" letterSpacing="1.4" fill={colour} style={{ transition: 'fill 700ms ease' }}>
        {label}
      </text>
      <text x={x + 14} y={y + 48} className="font-mono" fontSize="9" fill={C.idle}>
        {sub}
      </text>
      {/* Internal structure, so the box reads as a block and not a label. */}
      <g stroke={colour} strokeWidth="0.6" opacity="0.35">
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={x + 14} y1={y + 60 + i * 5} x2={x + 194} y2={y + 60 + i * 5} />
        ))}
      </g>
    </g>
  )
}

/* ---------------------------------------------------------------------------
 * The memory, and its three ports
 * -------------------------------------------------------------------------*/
function MemoryBlock({ exposePorts }: { exposePorts: boolean }) {
  const [port, setPort] = useState<'w' | 'a' | 'b' | null>(null)

  const ports = [
    { id: 'w' as const, y: 88, label: 'WRITE', sub: '1 synchronous write path', tone: C.active },
    { id: 'a' as const, y: 188, label: 'READ A', sub: 'combinational read path', tone: C.flow },
    { id: 'b' as const, y: 268, label: 'READ B', sub: 'combinational read path', tone: C.flow },
  ]

  return (
    <div className="w-full">
      <svg viewBox="0 0 620 360" className="h-auto w-full" style={{ maxHeight: '52svh' }} role="img" aria-label="64 by 24-bit complex 1W2R memory">
        {/* The array */}
        <rect x="248" y="60" width="240" height="248" rx="3" fill="rgba(69,179,148,0.03)" stroke={C.flow} strokeWidth="1.2" />
        <g fill={C.flow} opacity="0.3">
          {Array.from({ length: 8 * 12 }, (_, i) => (
            <rect key={i} x={258 + (i % 8) * 28} y={72 + Math.floor(i / 8) * 20} width="20" height="13" />
          ))}
        </g>
        <text x="368" y="330" textAnchor="middle" className="font-mono" fontSize="10" letterSpacing="1.6" fill={C.muted}>
          64 × 24-BIT COMPLEX
        </text>

        {/* Ports */}
        {ports.map((p) => {
          const live = port === p.id
          const dim = port !== null && !live
          return (
            <g
              key={p.id}
              role="button"
              tabIndex={exposePorts ? 0 : -1}
              aria-label={`${p.label} — ${p.sub}`}
              className={exposePorts ? 'cursor-pointer outline-none' : undefined}
              onMouseEnter={() => exposePorts && setPort(p.id)}
              onMouseLeave={() => exposePorts && setPort(null)}
              onFocus={() => exposePorts && setPort(p.id)}
              onBlur={() => exposePorts && setPort(null)}
              opacity={exposePorts ? (dim ? 0.35 : 1) : 0.4}
              style={{ transition: 'opacity 600ms ease' }}
            >
              <line
                x1="60"
                y1={p.y}
                x2="248"
                y2={p.y}
                stroke={live ? C.active : p.tone}
                strokeWidth={live ? 2.2 : 1.2}
                style={{ transition: 'stroke 500ms ease, stroke-width 500ms ease' }}
              />
              {live && (
                <line
                  x1="60"
                  y1={p.y}
                  x2="248"
                  y2={p.y}
                  stroke={C.active}
                  strokeWidth="2.4"
                  strokeDasharray="26 200"
                  className="animate-trace-flow"
                />
              )}
              <circle cx="60" cy={p.y} r={live ? 5 : 3.5} fill={live ? C.active : p.tone} style={{ transition: 'r 400ms ease, fill 400ms ease' }} />
              <text x="8" y={p.y - 12} className="font-mono" fontSize="10" letterSpacing="1.6" fill={live ? C.active : C.muted}>
                {p.label}
              </text>
              <text x="8" y={p.y + 22} className="font-mono" fontSize="8.5" fill={C.idle}>
                {p.sub}
              </text>
            </g>
          )
        })}
      </svg>

      <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint">
        {exposePorts ? 'Hover or tap a port to trace it' : ''}
      </p>
    </div>
  )
}
