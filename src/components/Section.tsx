import type { ReactNode } from 'react'
import { Reveal } from './primitives'

/**
 * Section — consistent vertical rhythm and a single landmark per chapter.
 */
export function Section({
  id,
  children,
  className = '',
  tone = 'default',
  labelledBy,
}: {
  id?: string
  children: ReactNode
  className?: string
  tone?: 'default' | 'raised'
  labelledBy?: string
}) {
  const tones = {
    default: '',
    raised: 'bg-ink/60',
  }

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative scroll-mt-24 py-20 sm:py-28 lg:py-36 ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  )
}

/**
 * ChapterHeading — the recurring section opener: a technical label, a
 * cinematic headline, and an optional supporting line.
 */
export function ChapterHeading({
  eyebrow,
  title,
  subtitle,
  id,
  align = 'left',
  accent = 'signal',
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  id?: string
  align?: 'left' | 'center'
  accent?: 'signal' | 'amber' | 'violet'
}) {
  const accents = {
    signal: 'text-signal',
    amber: 'text-amber',
    violet: 'text-violet',
  }

  return (
    <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <Reveal>
          <p className={`eyebrow mb-5 ${accents[accent]}`}>
            <span
              aria-hidden="true"
              className={`mr-3 inline-block h-px w-8 align-middle ${
                accent === 'amber' ? 'bg-amber/60' : accent === 'violet' ? 'bg-violet/60' : 'bg-signal/60'
              }`}
            />
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <h2
          id={id}
          className="text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-bright sm:text-4xl lg:text-[2.875rem]"
        >
          {title}
        </h2>
      </Reveal>

      {subtitle && (
        <Reveal delay={0.1}>
          <p className={`mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg ${align === 'center' ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </header>
  )
}
