import { useState } from 'react'
import { dieRegions, pillars, type DieRegionId } from '../../data/content'
import { DieStage } from './DieStage'
import { PinnedScene } from '../system/PinnedScene'
import { Callout, Label, SceneTitle, TermList } from '../system/annotations'
import { Reveal } from '../primitives'

/**
 * The die scene.
 *
 * Scroll walks the die — that is the primary storytelling gesture. Pointer and
 * keyboard override it at any moment, which lets the same object serve as
 * exploration and as secondary navigation without becoming a row of buttons.
 *
 * The state machine is shared by both renderers, so the WebGL die and the SVG
 * fallback tell the same story at the same scroll position:
 *
 *   0  silhouette — the package, barely lit
 *   1  die reveal — the core comes up
 *   2  interconnect illumination — the spine and taps carry signal
 *   3–8  each functional region in turn
 *   9  the whole die again
 */
const FIRST_REGION_STATE = 3
const STATES = FIRST_REGION_STATE + dieRegions.length + 1

export function DieSection() {
  const [hovered, setHovered] = useState<DieRegionId | null>(null)

  const go = (id: DieRegionId) => {
    const region = dieRegions.find((r) => r.id === id)
    if (!region) return
    document.getElementById(region.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PinnedScene
        id="present"
        label="The functional regions of the work"
        states={STATES}
        vh={460}
        compactVh={300}
      >
        {({ state, reduced, compact, inView }) => {
          const walked =
            state >= FIRST_REGION_STATE && state < FIRST_REGION_STATE + dieRegions.length
              ? dieRegions[state - FIRST_REGION_STATE].id
              : null
          // The pointer wins while it is on the die; otherwise scroll decides.
          const active = hovered ?? walked
          const region = dieRegions.find((r) => r.id === active) ?? null

          return (
            <div className="relative flex h-full flex-col justify-center py-14">
              {/* The die is the composition: large, pushed off-axis, allowed to
                  run past the text column rather than sitting in a tidy half. */}
              <div
                className={
                  compact
                    ? 'relative w-full px-4'
                    : 'absolute inset-y-0 right-[-6%] flex w-[70%] items-center'
                }
              >
                <DieStage
                  state={state}
                  active={active}
                  onActivate={setHovered}
                  onSelect={go}
                  reduced={reduced}
                  compact={compact}
                  inView={inView}
                />
              </div>

              <div className="shell relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
                {/* Edge-aligned annotation column — no container. */}
                <div className="order-2 flex flex-col justify-center lg:order-1 lg:h-[30rem]">
                  <div style={{ opacity: state <= 1 ? 1 : 0, transition: 'opacity 600ms ease' }}>
                    <SceneTitle
                      eyebrow="The present"
                      title="One engineer, six functional regions."
                      id="present-heading"
                    >
                      The whole die is the job. The blocks are the dimensions of it — and each one
                      has evidence further down.
                    </SceneTitle>
                  </div>

                  {state === 2 && !region && (
                    <div className="lg:-mt-40">
                      <Callout title="Interconnect" tone="flow" visible>
                        Nothing on a die works alone. The spine is what makes six regions one
                        system — and it is the same idea as the signal path running through the
                        rest of this page.
                      </Callout>
                    </div>
                  )}

                  {region && (
                    <div className="lg:-mt-40">
                      <Callout title={region.name} tone="active" visible>
                        <p className="text-[0.9375rem] leading-relaxed text-bright">{region.question}</p>
                        <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">{region.body}</p>
                        <div className="mt-4">
                          <TermList terms={[...region.terms]} tone="flow" visible />
                        </div>
                        <button
                          type="button"
                          onClick={() => go(region.id)}
                          className="mt-5 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-active transition-opacity hover:opacity-70"
                        >
                          Follow this path
                          <span aria-hidden="true">→</span>
                        </button>
                      </Callout>
                    </div>
                  )}

                  {state === STATES - 1 && !region && (
                    <div className="lg:-mt-40">
                      <Callout title="One system" tone="flow" visible>
                        These are not separate careers. They are the same curiosity at different
                        layers of the same hardware.
                      </Callout>
                    </div>
                  )}
                </div>

                {/* The die occupies this column visually; the cell stays empty
                    so the annotation never collides with it. */}
                <div className="order-1 hidden lg:order-2 lg:block" aria-hidden="true" />
              </div>

              <p className="shell relative z-10 mt-6 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint">
                {compact ? 'Tap a block to follow it' : 'Hover a block · scroll walks the die'}
              </p>
            </div>
          )
        }}
      </PinnedScene>

      {/* The full capability vocabulary, kept scannable and unboxed. */}
      <CapabilityIndex />
    </>
  )
}

/**
 * The complete skill vocabulary as an index rather than a stack of panels:
 * columns, rules, and type. Recruiters scan it; nothing here is a card.
 */
function CapabilityIndex() {
  return (
    <section aria-labelledby="capability-index" className="border-t border-white/[0.06] py-20 sm:py-24">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="capability-index" className="font-mono text-[0.6875rem] uppercase tracking-[0.24em] text-flow">
              Capability index
            </h2>
            <Label>Design → Verify → Validate</Label>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.id} delay={index * 0.05}>
              <div className="border-t border-white/[0.09] pt-5">
                <h3 className="font-mono text-sm uppercase tracking-[0.22em] text-active">{pillar.name}</h3>
                <p className="mt-2 text-[0.875rem] leading-snug text-muted">{pillar.question}</p>

                <div className="mt-5 space-y-4">
                  {pillar.groups.map((group) => (
                    <div key={group.label}>
                      <Label>{group.label}</Label>
                      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-faint">
                        {group.items.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
