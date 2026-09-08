import { C } from '../system/palette'
import { caseStudies } from '../../data/content'
import { PinnedScene, StateRail } from '../system/PinnedScene'
import { Callout, Figure, Label, SceneTitle } from '../system/annotations'

const STUDY = caseStudies.find((s) => s.id === 'dma')!

/**
 * DMA — enter the hardware, then watch the testbench assemble around it.
 *
 * States 0–4 walk the datapath, with a detail view that zooms on whatever the
 * chain is currently pointing at. At state 5 the entire architecture becomes
 * the DUT: it shrinks in place, and the verification environment builds around
 * that same object. Nothing is swapped out, so the reader keeps hold of what
 * is being verified.
 *
 * The measured results arrive last, as the outcome of that process.
 */
const STAGES = [
  { key: 'cpu', name: 'CPU / control', detail: 'Software configures a transfer and then stops watching it.' },
  { key: 'mmio', name: 'MMIO register bank', detail: 'Eight memory-mapped registers carry configuration, control and status.' },
  { key: 'fsm', name: 'Transfer FSM', detail: 'The control path sequences request, burst and completion.' },
  { key: 'addr', name: 'Address generation', detail: 'Programmable source and destination addressing, 1–1,024 words.' },
  { key: 'data', name: 'Data transfer', detail: 'A 32-bit datapath moves the words without the CPU in the loop.' },
  { key: 'irq', name: 'Interrupt', detail: 'Completion and error conditions are signalled back to software.' },
]

const RAIL = ['Architecture', 'Registers', 'Control', 'Addressing', 'Transfer', 'Verify', 'Cover', 'Result']

export function DmaScene() {
  return (
    <PinnedScene
      id="chapter-dma"
      label="Memory-mapped DMA controller — RTL and UVM verification"
      states={8}
      vh={520}
      compactVh={380}
      className="border-t border-white/[0.06]"
    >
      {({ state, compact }) => {
        const inVerification = state >= 5
        const walkIndex = Math.min(STAGES.length - 1, state)

        return (
          <div className="relative flex h-full flex-col justify-center">
            <div className="shell grid gap-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-12">
              <div className="flex flex-col justify-center">
                <SceneTitle eyebrow={`${STUDY.kind} · ${STUDY.period}`} title={STUDY.name} id="dma-heading">
                  {STUDY.recruiter.problem}
                </SceneTitle>

                <div className="mt-6 min-h-[6rem]">
                  {!inVerification && (
                    <Callout title={STAGES[walkIndex].name} tone="active" visible>
                      {STAGES[walkIndex].detail}
                    </Callout>
                  )}
                  {state === 5 && (
                    <Callout title="The design becomes the DUT" tone="flow" visible>
                      The same controller, now the thing under test. A UVM environment assembles
                      around it: sequences drive stimulus, a monitor observes, and a scoreboard
                      checks every transaction against a reference model.
                    </Callout>
                  )}
                  {state === 6 && (
                    <Callout title="Assertions and coverage" tone="flow" visible>
                      Assertions guard protocol and control-path legality while the run is going.
                      The coverage model tracks all eight registers and the three functional areas,
                      so a hole in the model is a question about the design.
                    </Callout>
                  )}
                  {state === 7 && (
                    <Callout title="What came out of it" tone="active" visible>
                      {STUDY.detail.learned}
                    </Callout>
                  )}
                </div>

                {!compact && <StateRail className="mt-6 hidden [@media(min-height:780px)]:flex" states={RAIL} current={state} />}
              </div>

              <div className="flex items-center">
                <DmaDiagram state={state} />
              </div>
            </div>

            {/* Results, arriving as the conclusion of the process. */}
            <div className="shell mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {STUDY.metrics.slice(0, 3).map((metric, index) => (
                <Figure
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                  tone={index === 2 ? 'fault' : 'active'}
                  visible={state >= 7}
                />
              ))}
              <div style={{ opacity: state >= 7 ? 1 : 0, transition: 'opacity 700ms ease' }}>
                <Label tone="idle">Resolved through regression and waveform debugging</Label>
              </div>
            </div>
          </div>
        )
      }}
    </PinnedScene>
  )
}

/* ---------------------------------------------------------------------------
 * One diagram, two phases: the architecture, then that architecture as a DUT.
 * -------------------------------------------------------------------------*/
function DmaDiagram({ state }: { state: number }) {
  const inVerification = state >= 5
  const walk = Math.min(STAGES.length - 1, state)

  // The shared element: the whole design shrinks into the middle of the bench.
  const dutTransform = inVerification
    ? 'translate(196, 150) scale(0.44)'
    : 'translate(0, 0) scale(1)'

  return (
    <svg viewBox="0 0 680 470" className="h-auto w-full" style={{ maxHeight: '52svh' }} role="img" aria-label="DMA controller architecture and its verification environment">
      {/* ---- The verification environment, built around the DUT ---- */}
      <g opacity={inVerification ? 1 : 0} style={{ transition: 'opacity 900ms ease' }}>
        <BenchBlock x={20} y={40} w={150} h={44} label="SEQUENCE" delay={0} show={inVerification} />
        <BenchBlock x={20} y={104} w={150} h={44} label="DRIVER" delay={120} show={inVerification} />
        <BenchBlock x={510} y={40} w={150} h={44} label="MONITOR" delay={240} show={inVerification} />
        <BenchBlock x={510} y={104} w={150} h={44} label="SCOREBOARD" delay={360} show={inVerification} />
        <BenchBlock x={510} y={168} w={150} h={44} label="REFERENCE MODEL" delay={480} show={inVerification} tone={C.idle} />
        <BenchBlock
          x={265}
          y={392}
          w={150}
          h={40}
          label="COVERAGE · SVA"
          delay={0}
          show={state >= 6}
          tone={C.active}
        />

        {/* Wiring in and out of the DUT. */}
        <g stroke={C.flow} strokeWidth="1.1" fill="none" opacity="0.8">
          <path d="M95 84 V104" />
          <path d="M170 126 H250" />
          <path d="M430 126 H510" />
          <path d="M585 84 V104" />
          <path d="M585 148 V168" />
        </g>
        {inVerification && (
          <path
            d="M170 126 H250"
            stroke={C.active}
            strokeWidth="2"
            fill="none"
            strokeDasharray="18 120"
            className="animate-trace-flow"
          />
        )}
        <path
          d="M340 300 V392"
          stroke={C.active}
          strokeWidth="1"
          fill="none"
          opacity={state >= 6 ? 0.7 : 0}
          style={{ transition: 'opacity 700ms ease' }}
        />
      </g>

      {/* ---- The design itself ---- */}
      <g transform={dutTransform} style={{ transition: 'transform 1100ms cubic-bezier(0.22,0.61,0.36,1)' }}>
        <rect
          x="10"
          y="20"
          width="660"
          height="330"
          rx="6"
          fill="rgba(255,255,255,0.015)"
          stroke={inVerification ? C.active : C.idle}
          strokeWidth={inVerification ? 2.4 : 1}
          style={{ transition: 'stroke 900ms ease' }}
        />
        <text
          x="26"
          y="44"
          className="font-mono"
          fontSize="11"
          letterSpacing="2"
          fill={inVerification ? C.active : C.idle}
          style={{ transition: 'fill 900ms ease' }}
        >
          {inVerification ? 'DUT — DMA CONTROLLER' : '32-BIT DMA CONTROLLER'}
        </text>

        {/* The walk: six stages, the live one illuminated. */}
        {STAGES.map((stage, index) => {
          const live = !inVerification && index === walk
          const passed = !inVerification && index < walk
          const colour = live
            ? C.active
            : passed
              ? C.flow
              : C.idle
          const col = index % 3
          const row = Math.floor(index / 3)
          const x = 40 + col * 208
          const y = 70 + row * 132

          return (
            <g key={stage.key} style={{ transition: 'opacity 600ms ease' }}>
              <rect
                x={x}
                y={y}
                width="180"
                height="96"
                rx="3"
                fill={live ? 'rgba(232,199,122,0.07)' : 'rgba(255,255,255,0.015)'}
                stroke={colour}
                strokeWidth={live ? 1.8 : 1}
                style={{ transition: 'stroke 600ms ease, fill 600ms ease, stroke-width 600ms ease' }}
              />
              <text x={x + 12} y={y + 24} className="font-mono" fontSize="10" letterSpacing="1.3" fill={colour} style={{ transition: 'fill 600ms ease' }}>
                {stage.name.toUpperCase()}
              </text>
              <StageTexture stageKey={stage.key} x={x + 12} y={y + 36} live={live} colour={colour} />
            </g>
          )
        })}

        {/* Datapath through the design. */}
        <g stroke={C.idle} strokeWidth="1" fill="none" opacity="0.6">
          <path d="M220 118 H248" />
          <path d="M428 118 H456" />
          <path d="M130 166 V202" />
          <path d="M338 166 V202" />
          <path d="M546 166 V202" />
        </g>
      </g>
    </svg>
  )
}

/** Each architecture stage carries the structure it actually has. */
function StageTexture({
  stageKey,
  x,
  y,
  live,
  colour,
}: {
  stageKey: string
  x: number
  y: number
  live: boolean
  colour: string
}) {
  const opacity = live ? 0.9 : 0.35

  if (stageKey === 'mmio') {
    // Eight registers.
    return (
      <g opacity={opacity} style={{ transition: 'opacity 600ms ease' }}>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            <rect x={x + (i % 4) * 40} y={y + Math.floor(i / 4) * 22} width="34" height="16" rx="1.5" fill="none" stroke={colour} strokeWidth="0.8" />
            <text x={x + (i % 4) * 40 + 4} y={y + Math.floor(i / 4) * 22 + 12} className="font-mono" fontSize="7" fill={colour}>
              R{i}
            </text>
          </g>
        ))}
      </g>
    )
  }

  if (stageKey === 'fsm') {
    // State transitions.
    return (
      <g opacity={opacity} style={{ transition: 'opacity 600ms ease' }}>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={x + 16 + i * 46} cy={y + 20} r="10" fill="none" stroke={colour} strokeWidth="1" />
        ))}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${x + 27 + i * 46} ${y + 20} H${x + 45 + i * 46}`} stroke={colour} strokeWidth="1" markerEnd="" />
        ))}
        <path d={`M${x + 154} ${y + 20} q14 -22 -138 -14`} fill="none" stroke={colour} strokeWidth="0.8" opacity="0.6" strokeDasharray="3 3" />
      </g>
    )
  }

  if (stageKey === 'data') {
    // A 32-bit bus.
    return (
      <g opacity={opacity} style={{ transition: 'opacity 600ms ease' }}>
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={x} y1={y + 6 + i * 7} x2={x + 156} y2={y + 6 + i * 7} stroke={colour} strokeWidth="0.9" />
        ))}
        <text x={x} y={y + 56} className="font-mono" fontSize="7.5" fill={colour}>
          32-BIT · 1–1,024 WORDS
        </text>
      </g>
    )
  }

  if (stageKey === 'irq') {
    return (
      <g opacity={opacity} style={{ transition: 'opacity 600ms ease' }}>
        <path d={`M${x} ${y + 30} h40 v-22 h12 v22 h100`} fill="none" stroke={colour} strokeWidth="1.2" />
        <text x={x} y={y + 52} className="font-mono" fontSize="7.5" fill={colour}>
          DONE · ERROR
        </text>
      </g>
    )
  }

  if (stageKey === 'addr') {
    return (
      <g opacity={opacity} style={{ transition: 'opacity 600ms ease' }}>
        {['SRC', 'DST'].map((t, i) => (
          <g key={t}>
            <text x={x} y={y + 12 + i * 20} className="font-mono" fontSize="8" fill={colour}>
              {t}
            </text>
            <rect x={x + 30} y={y + 2 + i * 20} width="120" height="12" rx="1" fill="none" stroke={colour} strokeWidth="0.7" />
          </g>
        ))}
      </g>
    )
  }

  // cpu
  return (
    <g opacity={opacity} style={{ transition: 'opacity 600ms ease' }}>
      <rect x={x} y={y} width="60" height="34" rx="2" fill="none" stroke={colour} strokeWidth="0.8" />
      <path d={`M${x + 64} ${y + 17} H${x + 156}`} stroke={colour} strokeWidth="1" />
      <text x={x} y={y + 52} className="font-mono" fontSize="7.5" fill={colour}>
        CONFIGURE · START
      </text>
    </g>
  )
}

function BenchBlock({
  x,
  y,
  w,
  h,
  label,
  delay,
  show,
  tone = C.flow,
}: {
  x: number
  y: number
  w: number
  h: number
  label: string
  delay: number
  show: boolean
  tone?: string
}) {
  return (
    <g
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 700ms ease ${delay}ms, transform 700ms cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`,
      }}
    >
      <rect x={x} y={y} width={w} height={h} rx="3" fill="rgba(255,255,255,0.02)" stroke={tone} strokeWidth="1.1" />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" className="font-mono" fontSize="9.5" letterSpacing="1.4" fill={tone}>
        {label}
      </text>
    </g>
  )
}
