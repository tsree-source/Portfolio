import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useMotionPreference'

export type Metric = {
  value: string
  label: string
  note?: string
  /** When present, the figure counts up once as it enters view. */
  count?: number
  suffix?: string
}

/**
 * A single measured result. Figures animate once, on first entry, and never
 * again — a number that keeps re-counting reads as decoration, not data.
 */
export function MetricCard({ metric, tone = 'signal' }: { metric: Metric; tone?: 'signal' | 'amber' | 'violet' }) {
  const display = useCountUp(metric.count, metric.suffix, metric.value)

  const tones = {
    signal: 'text-signal',
    amber: 'text-amber',
    violet: 'text-violet',
  }

  return (
    <div ref={display.ref} className="panel px-5 py-5">
      <p className={`font-mono text-2xl font-medium tracking-tight sm:text-[1.75rem] ${tones[tone]}`}>
        {display.text}
      </p>
      <p className="mt-2 text-sm font-medium text-bright">{metric.label}</p>
      {metric.note && <p className="mt-1 text-[0.8125rem] leading-snug text-faint">{metric.note}</p>}
    </div>
  )
}

/** Compact inline variant used inside dense case-study layouts. */
export function MetricInline({ metric, tone = 'signal' }: { metric: Metric; tone?: 'signal' | 'amber' | 'violet' }) {
  const display = useCountUp(metric.count, metric.suffix, metric.value)
  const tones = {
    signal: 'text-signal',
    amber: 'text-amber',
    violet: 'text-violet',
  }

  return (
    <div ref={display.ref}>
      <p className={`font-mono text-xl font-medium tracking-tight ${tones[tone]}`}>{display.text}</p>
      <p className="mt-1 text-[0.8125rem] leading-snug text-faint">{metric.label}</p>
    </div>
  )
}

/**
 * Counts up to `target` once the element is first seen. Falls back to the
 * final value immediately when animation is unavailable or not wanted.
 */
function useCountUp(target: number | undefined, suffix = '', fallback: string) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [text, setText] = useState(() => (target === undefined || reduced ? fallback : `0${suffix}`))

  useEffect(() => {
    if (target === undefined || reduced) {
      setText(fallback)
      return
    }

    const node = ref.current
    if (!node) return

    let frame = 0
    let started = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return
        started = true
        observer.disconnect()

        const duration = 1100
        const start = performance.now()

        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // Ease-out cubic: fast to settle, no bounce.
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.round(target * eased)
          setText(`${current.toLocaleString('en-US')}${suffix}`)
          if (progress < 1) frame = requestAnimationFrame(step)
        }

        frame = requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target, suffix, fallback, reduced])

  return { ref, text }
}
