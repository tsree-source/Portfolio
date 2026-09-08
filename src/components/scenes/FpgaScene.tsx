import { C } from '../system/palette'
import { caseStudies } from '../../data/content'
import { PinnedScene, StateRail } from '../system/PinnedScene'
import { Callout, Figure, Label, SceneTitle } from '../system/annotations'

const STUDY = caseStudies.find((s) => s.id === 'fpga5g')!

/**
 * FPGA 5G RECEIVER — a scroll-linked horizontal narrative.
 *
 * Vertical scroll drives the sample forward through the receiver chain, which
 * is the one place on this site where a horizontal reading is the honest one:
 * a signal really does pass left to right through these blocks. Each block
 * opens as the sample reaches it, then closes behind it.
 *
 * The last two states leave the RTL view and show the same design as placed
 * fabric, which is where the frequency and area numbers come from.
 */
const BLOCKS = [
  {
    key: 'input',
    name: 'INPUT',
    sub: 'received samples',
    detail: 'Fixed-point samples arrive from the front end. Every width from here on is a decision about precision, area and timing at once.',
    terms: ['Fixed-point', 'Streaming'],
  },
  {
    key: 'ldpc',
    name: 'LDPC',
    sub: 'encoder / decoder',
    detail: 'Error-correction coding on the receive path — iterative, and the most control-heavy block of the three.',
    terms: ['Verilog RTL', 'Control FSM', 'Iterative decode'],
  },
  {
    key: 'mmse',
    name: 'MMSE',
    sub: 'equalisation',
    detail: 'Equalisation undoes what the channel did to the signal. Numerically the most sensitive place to lose bits.',
    terms: ['Matrix arithmetic', 'Fixed-point datapath'],
  },
  {
    key: 'cordic',
    name: 'CORDIC / QR',
    sub: 'QR decomposition',
    detail: 'QR decomposition built on CORDIC, so the arithmetic stays in shifts and adds instead of spending multipliers.',
    terms: ['CORDIC', 'Shift-add', 'Pipelined'],
  },
  {
    key: 'output',
    name: 'OUTPUT',
    sub: 'verified behaviour',
    detail: 'Datapath, control and reset verified as three separate behaviour classes, taken to 95% functional coverage.',
    terms: ['SystemVerilog tests', 'Waveform analysis', '95% coverage'],
  },
]

const RAIL = ['Input', 'LDPC', 'MMSE', 'CORDIC', 'Output', 'Synthesis', 'Timing']

export function FpgaScene() {
  return (
    <PinnedScene
      id="chapter-fpga"
      label="FPGA-based 5G receiver RTL"
      states={7}
      vh={520}
      compactVh={380}
      className="border-t border-white/[0.06]"
    >
      {({ state, compact }) => {
        const inFabric = state >= 5
        const blockIndex = Math.min(BLOCKS.length - 1, state)
        const block = BLOCKS[blockIndex]

        return (
          <div className="relative flex h-full flex-col justify-center overflow-hidden">
            <div className="shell">
              <SceneTitle eyebrow={`${STUDY.kind} · ${STUDY.period}`} title={STUDY.name} id="fpga-heading">
                {STUDY.recruiter.problem}
              </SceneTitle>
            </div>

            {/* The chain. Vertical scroll moves it horizontally. */}
            <div className="relative mt-10 h-[16rem] sm:h-[18rem]">
              <ChainTrack state={state} inFabric={inFabric} compact={compact} />
            </div>

            <div className="shell mt-8 grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
              <div className="min-h-[7rem]">
                {!inFabric && (
                  <Callout title={`${block.name} — ${block.sub}`} tone="active" visible>
                    {block.detail}
                    <span className="mt-3 block">
                      <Label tone="flow">{block.terms.join(' · ')}</Label>
                    </span>
                  </Callout>
                )}
                {state === 5 && (
                  <Callout title="From RTL to fabric" tone="flow" visible>
                    The same three blocks, now placed. Synthesis is where the architecture decisions
                    are priced: a shorter critical path and a smaller footprint tend to come from the
                    same restructuring.
                  </Callout>
                )}
                {state === 6 && (
                  <Callout title="Closing timing" tone="active" visible>
                    Critical-path analysis in Vivado, then targeted datapath changes rather than
                    global constraint tuning.
                  </Callout>
                )}
              </div>

              <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
                {STUDY.metrics.slice(0, 3).map((metric) => (
                  <Figure
                    key={metric.label}
                    value={metric.value}
                    label={metric.label}
                    tone="active"
                    visible={state >= 6}
                  />
                ))}
              </div>
            </div>

            {!compact && (
              <div className="shell mt-8">
                <StateRail className="hidden flex-row flex-wrap gap-x-6 [@media(min-height:780px)]:flex" states={RAIL} current={state} />
              </div>
            )}
          </div>
        )
      }}
    </PinnedScene>
  )
}

/* ---------------------------------------------------------------------------
 * The horizontal track
 * -------------------------------------------------------------------------*/
const CARD_W = 300
const GAP = 40

function ChainTrack({ state, inFabric, compact }: { state: number; inFabric: boolean; compact: boolean }) {
  const index = Math.min(BLOCKS.length - 1, state)
  // Keep the live block near the left third of the viewport.
  const offset = -(index * (CARD_W + GAP)) + (compact ? 24 : 120)

  return (
    <div className="absolute inset-0">
      {/* The rail the signal travels on. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px" style={{ background: C.idle, opacity: 0.4 }} />

      <div
        className="absolute top-0 flex h-full items-center"
        style={{
          transform: `translateX(${offset}px)`,
          transition: 'transform 1000ms cubic-bezier(0.22,0.61,0.36,1)',
        }}
      >
        {BLOCKS.map((block, i) => {
          const live = !inFabric && i === index
          const passed = i < index || inFabric
          return (
            <div key={block.key} className="flex items-center" style={{ width: CARD_W + GAP }}>
              <BlockGlyph name={block.name} sub={block.sub} live={live} passed={passed} fabric={inFabric} />
              <div
                aria-hidden="true"
                className="relative h-px flex-1"
                style={{
                  background: passed ? C.flow : C.idle,
                  transition: 'background 700ms ease',
                }}
              >
                {live && (
                  <span
                    className="absolute inset-0 block"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, var(--color-active), transparent)',
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BlockGlyph({
  name,
  sub,
  live,
  passed,
  fabric,
}: {
  name: string
  sub: string
  live: boolean
  passed: boolean
  fabric: boolean
}) {
  const colour = live ? C.active : passed ? C.flow : C.idle

  return (
    <div
      className="relative shrink-0"
      style={{
        width: CARD_W - 60,
        transition: 'transform 900ms cubic-bezier(0.22,0.61,0.36,1)',
        transform: live ? 'scale(1)' : 'scale(0.88)',
      }}
    >
      <svg viewBox="0 0 240 150" className="h-auto w-full">
        <rect
          x="2"
          y="20"
          width="236"
          height="110"
          rx="3"
          fill={live ? 'rgba(232,199,122,0.06)' : 'rgba(255,255,255,0.015)'}
          stroke={colour}
          strokeWidth={live ? 1.8 : 1}
          style={{ transition: 'stroke 700ms ease, fill 700ms ease' }}
        />
        <text x="16" y="46" className="font-mono" fontSize="14" letterSpacing="2.2" fill={colour} style={{ transition: 'fill 700ms ease' }}>
          {name}
        </text>
        <text x="16" y="64" className="font-mono" fontSize="9" fill={C.idle}>
          {sub}
        </text>

        {/* RTL structure, or placed fabric once synthesis has happened. */}
        {fabric ? (
          <g opacity="0.6">
            {Array.from({ length: 3 * 9 }, (_, i) => (
              <rect
                key={i}
                x={16 + (i % 9) * 24}
                y={82 + Math.floor(i / 9) * 15}
                width="18"
                height="10"
                rx="1"
                fill={(i * 5) % 7 > 2 ? colour : 'none'}
                stroke={colour}
                strokeWidth="0.5"
                opacity={(i * 5) % 7 > 2 ? 0.55 : 0.3}
              />
            ))}
          </g>
        ) : (
          <g stroke={colour} strokeWidth="0.8" opacity={live ? 0.75 : 0.35}>
            {Array.from({ length: 4 }, (_, i) => (
              <line key={i} x1="16" y1={84 + i * 11} x2="224" y2={84 + i * 11} />
            ))}
            <line x1="120" y1="80" x2="120" y2="122" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  )
}
