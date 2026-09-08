import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useMotionPreference'

/* ---------------------------------------------------------------------------
 * Reveal — the single scroll-entrance used across the site.
 * One motion vocabulary everywhere: a short rise and a fade, once, never
 * repeated on scroll-back. With reduced motion it renders as plain markup.
 * -------------------------------------------------------------------------*/
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'article' | 'header'
}) {
  const reduced = useReducedMotion()
  const MotionTag = m[as]

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/* ---------------------------------------------------------------------------
 * Technical label
 * -------------------------------------------------------------------------*/
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

/* ---------------------------------------------------------------------------
 * Tag — a technology or capability chip.
 * -------------------------------------------------------------------------*/
export function Tag({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'signal' | 'warm' }) {
  const tones = {
    default: 'border-white/10 bg-white/[0.03] text-muted',
    signal: 'border-signal/25 bg-signal/[0.07] text-signal',
    warm: 'border-amber/25 bg-amber/[0.07] text-amber',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function TagRow({ tags, tone }: { tags: string[]; tone?: 'default' | 'signal' | 'warm' }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag tone={tone}>{tag}</Tag>
        </li>
      ))}
    </ul>
  )
}
