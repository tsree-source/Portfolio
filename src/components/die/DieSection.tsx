import { useState } from 'react'
import { dieRegions, pillars, type DieRegionId } from '../../data/content'
import { EngineeringDie } from './EngineeringDie'
import { PinnedScene } from '../system/PinnedScene'
import { Callout, Label, SceneTitle, TermList } from '../system/annotations'
import { Reveal } from '../primitives'

/**
 * The die scene.
 *
 * Scroll walks the die region by region — the primary storytelling gesture.
 * Pointer and keyboard can override that at any time, which makes the same
 * object serve as exploration and as secondary navigation without ever
 * becoming a row of buttons.
 *
 * States: 0 overview · 1–6 each functional region · 7 the whole die again.
 */
export function DieSection() {
  const [hovered, setHovered] = useState<DieRegionId | null>(null)

  const go = (id: DieRegionId) => {
    const region = dieRegions.find((r) => r.id === id)
    if (!region) return
    document.getElementById(region.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PinnedScene id="present" label="The functional regions of the work" states={8} vh={360} compactVh={280}>
        {({ state, reduced, compact }) => {
          // Scroll selects; the pointer wins while it is on the die.
          const scrolled = state >= 1 && state <= 6 ? dieRegions[state - 1].id : null
          const active = hovered ?? scrolled
          const region = dieRegions.find((r) => r.id === active) ?? null
          const zoom = compact ? 0 : active && state >= 1 && state <= 6 ? 0.32 : 0

          return (
            <div className="relative flex h-full flex-col justify-center py-16">
              {/* The die is the composition: large, pushed off-axis, allowed to
                  run past the text column rather than sitting in a tidy half. */}
              <div
                className={
                  compact
                    ? 'relative w-full px-4'
                    : 'pointer-events-auto absolute inset-y-0 right-[-8%] flex w-[74%] items-center'
                }
              >
                <EngineeringDie
                  active={active}
                  onActivate={setHovered}
                  onSelect={go}
                  zoom={zoom}
                  reduced={reduced}
                  className="h-auto w-full"
                />
              </div>

              <div className="shell relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,22rem)_1fr]">
                {/* Edge-aligned annotation column — no container. */}
                <div className="order-2 flex flex-col justify-center lg:order-1 lg:h-[30rem]">
                  <div style={{ opacity: state === 0 ? 1 : 0, transition: 'opacity 600ms ease' }}>
                    <SceneTitle
                      eyebrow="The present"
                      title="One engineer, six functional regions."
                      id="present-heading"
                    >
                      The whole die is the job. The blocks are the dimensions of it — and each one
                      has evidence further down.
                    </SceneTitle>
                  </div>

                  {region && (
                    <div className="-mt-[1px]" style={{ marginTop: state === 0 ? '-14rem' : 0 }}>
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

                  {state === 7 && !region && (
                    <Callout title="One system" tone="flow" visible>
                      These are not separate careers. They are the same curiosity at different
                      layers of the same hardware.
                    </Callout>
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
