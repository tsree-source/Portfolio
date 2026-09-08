import { currently, future } from '../data/content'
import { ChapterHeading, Section } from './Section'
import { ScenicBackdrop } from './ScenicBackdrop'
import { Reveal } from './primitives'

/**
 * SECTION 11 — Presently.
 * The philosophy made concrete: what the present actually consists of.
 * Structured so it stays easy to edit as the focus changes.
 */
export function Currently() {
  return (
    <Section labelledBy="currently-heading" className="border-t border-white/[0.06]">
      <div className="shell">
        <ChapterHeading id="currently-heading" eyebrow="Today" title="Presently." />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {currently.map((card, index) => (
            <Reveal key={card.label} delay={index * 0.07}>
              <article className="panel h-full px-5 py-6">
                <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-signal">{card.label}</h3>
                <ul className="mt-5 space-y-2.5">
                  {card.items.map((item) => (
                    <li key={item} className="text-[0.9375rem] leading-snug text-bright">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

/**
 * SECTION 12 — The Future.
 * The environment opens back up. Curiosity about harder systems, stated as
 * questions rather than as ambition.
 */
export function FutureSection() {
  return (
    <section
      aria-labelledby="future-heading"
      className="relative overflow-hidden border-t border-white/[0.06] py-28 sm:py-36"
    >
      <ScenicBackdrop phase={0.35} circuit={0.55} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(85% 55% at 50% 100%, rgba(157,128,255,0.16) 0%, rgba(91,147,255,0.08) 42%, rgba(4,6,13,0) 74%)',
        }}
      />

      <div className="shell relative">
        <Reveal>
          <h2
            id="future-heading"
            className="quiet-serif max-w-3xl text-[clamp(2rem,5.5vw,3.5rem)] text-bright"
          >
            {future.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-4 max-w-2xl text-lg text-muted">{future.sub}</p>
        </Reveal>

        <ul className="mt-14 space-y-4">
          {future.questions.map((question, index) => (
            <Reveal as="li" key={question} delay={index * 0.06}>
              <p className="flex items-baseline gap-4 text-[clamp(1rem,2.4vw,1.375rem)] leading-snug tracking-tight text-muted">
                <span aria-hidden="true" className="font-mono text-[0.625rem] text-violet">
                  0{index + 1}
                </span>
                {question}
              </p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.12}>
          <p className="mt-14 text-[clamp(1.25rem,3.2vw,2rem)] font-medium tracking-tight text-bright">
            {future.close}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
