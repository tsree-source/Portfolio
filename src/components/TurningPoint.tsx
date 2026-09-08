import { useRef } from 'react'
import { m } from 'framer-motion'
import { turningPoint } from '../data/content'
import { ScenicBackdrop } from './ScenicBackdrop'
import { useSimplifiedMotion } from '../hooks/useMotionPreference'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { Reveal } from './primitives'

const LADDER = turningPoint.ladder
const QUESTIONS = turningPoint.questions

/**
 * SECTION 3 — The Turning Point.
 *
 * The conceptual zoom from a working vehicle system down to waveforms, and the
 * change in the questions being asked. This is the hinge of the narrative: the
 * landscape finishes resolving into circuitry here, and the section ends on the
 * marker the rest of the site is written from.
 */
export function TurningPoint() {
  const simplified = useSimplifiedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useSectionProgress(sectionRef, { steps: 120 })

  if (simplified) return <StaticTurningPoint />

  // First 55% descends the ladder; the remainder asks the questions.
  const descent = Math.min(1, progress / 0.55)
  const depth = Math.min(LADDER.length - 1, Math.floor(descent * LADDER.length))
  const questionPhase = Math.max(0, (progress - 0.55) / 0.45)
  const questionsShown = Math.min(QUESTIONS.length, Math.floor(questionPhase * (QUESTIONS.length + 1)))

  return (
    <section
      ref={sectionRef}
      aria-labelledby="turning-heading"
      className="relative border-t border-white/[0.06]"
      style={{ height: '300svh' }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <ScenicBackdrop phase={1 - descent * 0.6} circuit={descent} />

        <div className="shell relative flex h-full items-center">
          <div className="grid w-full gap-12 lg:grid-cols-2 lg:gap-20">
            {/* The zoom */}
            <div>
              <h2 id="turning-heading" className="eyebrow mb-8 text-signal">
                Going one layer down
              </h2>
              <ol className="space-y-1.5">
                {LADDER.map((item, index) => {
                  const state = index === depth ? 'current' : index < depth ? 'passed' : 'ahead'
                  return (
                    <li key={item} className="flex items-center gap-4">
                      <span
                        aria-hidden="true"
                        className={`h-px transition-all duration-700 ${
                          state === 'current' ? 'w-10 bg-signal' : state === 'passed' ? 'w-5 bg-white/20' : 'w-3 bg-white/10'
                        }`}
                      />
                      <span
                        className={`text-[clamp(0.95rem,1.6vw,1.25rem)] tracking-tight transition-all duration-700 ${
                          state === 'current'
                            ? 'font-medium text-bright'
                            : state === 'passed'
                              ? 'text-faint'
                              : 'text-white/15'
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* The questions */}
            <div className="relative flex flex-col justify-center">
              <m.p
                initial={false}
                animate={{ opacity: questionsShown > 0 ? 1 : 0 }}
                transition={{ duration: 0.6 }}
                className="eyebrow mb-7 text-violet"
              >
                {turningPoint.heading}
              </m.p>

              <ul className="space-y-5">
                {QUESTIONS.map((question, index) => {
                  const shown = index < questionsShown
                  const isLatest = index === questionsShown - 1
                  return (
                    <m.li
                      key={question}
                      initial={false}
                      animate={{
                        opacity: shown ? (isLatest ? 1 : 0.4) : 0,
                        x: shown ? 0 : 12,
                      }}
                      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                      className={`text-[clamp(1.125rem,2.4vw,1.75rem)] leading-snug tracking-tight ${
                        isLatest ? 'text-bright' : 'text-muted'
                      }`}
                    >
                      {question}
                    </m.li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* The marker the rest of the site is written from. */}
        <m.div
          initial={false}
          animate={{ opacity: progress > 0.93 ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
        >
          <p className="font-mono text-[clamp(1.5rem,6vw,3rem)] tracking-[0.4em] text-signal/80">PRESENT</p>
        </m.div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * Static alternative — same content, no scroll choreography.
 * -------------------------------------------------------------------------*/
function StaticTurningPoint() {
  return (
    <section aria-labelledby="turning-heading" className="relative overflow-hidden border-t border-white/[0.06] py-24">
      <ScenicBackdrop phase={0.5} circuit={0.9} />

      <div className="shell relative">
        <Reveal>
          <h2 id="turning-heading" className="eyebrow mb-8 text-signal">
            Going one layer down
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {LADDER.map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                <span className={`text-base tracking-tight ${index === LADDER.length - 1 ? 'text-bright' : 'text-muted'}`}>
                  {item}
                </span>
                {index < LADDER.length - 1 && (
                  <span aria-hidden="true" className="text-faint">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="my-12 hairline" />

        <Reveal>
          <p className="eyebrow mb-6 text-violet">{turningPoint.heading}</p>
        </Reveal>
        <ul className="space-y-4">
          {QUESTIONS.map((question, index) => (
            <Reveal as="li" key={question} delay={index * 0.07}>
              <p
                className={`text-xl leading-snug tracking-tight ${
                  index === QUESTIONS.length - 1 ? 'text-bright' : 'text-muted'
                }`}
              >
                {question}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.15}>
          <p className="mt-14 font-mono text-3xl tracking-[0.35em] text-signal/80">PRESENT</p>
        </Reveal>
      </div>
    </section>
  )
}
