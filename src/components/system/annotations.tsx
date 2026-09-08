import type { ReactNode } from 'react'
import { C } from './palette'

/**
 * Annotation primitives — the non-card vocabulary.
 *
 * Most information on a technical drawing is not in a box. It is a label with
 * a leader line, a value beside an axis, a note in the margin. These are the
 * pieces that replace bordered containers everywhere the content is not
 * genuinely a discrete object.
 */

/** A small uppercase technical label. */
export function Label({
  children,
  tone = 'idle',
  className = '',
}: {
  children: ReactNode
  tone?: 'idle' | 'flow' | 'active' | 'fault'
  className?: string
}) {
  return (
    <span
      className={`font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors duration-500 ${className}`}
      style={{ color: C[tone === 'idle' ? 'faint' : tone] }}
    >
      {children}
    </span>
  )
}

/**
 * A note attached to something, with a leader line instead of a border.
 * `side` says which edge the line runs from.
 */
export function Callout({
  title,
  children,
  tone = 'flow',
  side = 'left',
  visible = true,
  className = '',
}: {
  title?: string
  children?: ReactNode
  tone?: 'flow' | 'active' | 'fault' | 'idle'
  side?: 'left' | 'right'
  visible?: boolean
  className?: string
}) {
  const colour = C[tone]

  return (
    <div
      className={`allow-crossfade transition-all duration-700 ${
        side === 'right' ? 'text-right' : ''
      } ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
      }}
    >
      <span
        aria-hidden="true"
        className={`mb-2.5 block h-px transition-all duration-700 ${side === 'right' ? 'ml-auto' : ''}`}
        style={{ width: visible ? 34 : 10, background: colour }}
      />
      {title && (
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]" style={{ color: colour }}>
          {title}
        </p>
      )}
      {children && <div className="mt-2 max-w-xs text-[0.875rem] leading-relaxed text-muted">{children}</div>}
    </div>
  )
}

/**
 * A measured value. Inline, unboxed — a figure on a drawing, not a stat card.
 */
export function Figure({
  value,
  label,
  tone = 'active',
  visible = true,
}: {
  value: string
  label: string
  tone?: 'flow' | 'active' | 'fault'
  visible?: boolean
}) {
  return (
    <div
      className="allow-crossfade transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
    >
      <p className="font-mono text-2xl leading-none tracking-tight" style={{ color: C[tone] }}>
        {value}
      </p>
      <p className="mt-2 text-[0.75rem] leading-snug text-faint">{label}</p>
    </div>
  )
}

/**
 * Chapter title used inside a scene. Sits in the composition rather than
 * centred above it, and never introduces a container.
 */
export function SceneTitle({
  eyebrow,
  title,
  children,
  id,
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  children?: ReactNode
  id?: string
  className?: string
}) {
  return (
    <header className={`max-w-xl ${className}`}>
      {eyebrow && (
        <p className="mb-4 font-mono text-[0.625rem] uppercase tracking-[0.24em] text-flow">{eyebrow}</p>
      )}
      <h2
        id={id}
        className="text-[clamp(1.375rem,2.9vw,2.125rem)] font-semibold leading-[1.14] tracking-[-0.025em] text-bright"
      >
        {title}
      </h2>
      {children && <div className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{children}</div>}
    </header>
  )
}

/** Technology names shown as annotations, not chips in a box. */
export function TermList({
  terms,
  tone = 'idle',
  visible = true,
}: {
  terms: string[]
  tone?: 'idle' | 'flow' | 'active'
  visible?: boolean
}) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {terms.map((term, index) => (
        <li
          key={term}
          className="allow-crossfade font-mono text-[0.6875rem] tracking-wide transition-all duration-500"
          style={{
            color: tone === 'idle' ? C.faint : C[tone],
            opacity: visible ? 1 : 0,
            transitionDelay: visible ? `${index * 45}ms` : '0ms',
          }}
        >
          {term}
        </li>
      ))}
    </ul>
  )
}
