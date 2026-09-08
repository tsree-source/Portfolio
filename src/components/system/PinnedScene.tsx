import { C } from './palette'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useSectionProgress } from '../../hooks/useSectionProgress'
import { useIsCompact, useReducedMotion } from '../../hooks/useMotionPreference'

export type SceneState = {
  /** Which discrete state the scene is in, 0 … states-1. */
  state: number
  /** Continuous 0 → 1 through the whole pinned run. */
  progress: number
  /** 0 → 1 within the current state. Useful for handing off between states. */
  local: number
  reduced: boolean
  compact: boolean
  /** Whether any part of the scene is on screen. Expensive renderers idle when false. */
  inView: boolean
}

/**
 * PinnedScene — the structural replacement for "heading, paragraph, grid".
 *
 * A chapter is a scene that stays pinned while the reader scrolls through a
 * fixed sequence of states. Scroll position *is* the state, so the sequence is
 * deterministic and reverses cleanly: scrolling back up returns to exactly the
 * state you came from, with no animation queue to unwind.
 *
 * Everything a scene renders should be a function of `state`. That constraint
 * is what keeps the motion explanatory — a thing moves because the system
 * changed state, not because time passed.
 */
export function PinnedScene({
  id,
  label,
  states,
  vh = 300,
  compactVh,
  className = '',
  children,
}: {
  id?: string
  /** Accessible name for the section landmark. */
  label?: string
  /** How many discrete states this scene steps through. */
  states: number
  /** Pinned scroll distance, in vh. */
  vh?: number
  /** Shorter distance on phones; defaults to two-thirds of `vh`. */
  compactVh?: number
  className?: string
  children: (scene: SceneState) => ReactNode
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const compact = useIsCompact()
  const [inView, setInView] = useState(false)

  // A renderer that costs real work should not run while nobody can see it.
  useEffect(() => {
    const element = sectionRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '200px 0px',
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Sampled well above the state count so a boundary is never skipped, and
  // quantised so scrolling inside a state costs no re-render.
  const progress = useSectionProgress(sectionRef, { steps: Math.max(200, states * 24) })

  const scaled = progress * states
  const state = Math.min(states - 1, Math.floor(scaled))
  const local = Math.min(1, Math.max(0, scaled - state))

  const distance = compact ? (compactVh ?? Math.round(vh * 0.66)) : vh

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label={label}
      className={`relative ${className}`}
      style={{ height: `calc(${distance}svh + 100svh)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        {children({ state, progress, local, reduced, compact, inView })}
      </div>
    </section>
  )
}

/**
 * A quiet readout of where you are inside a scene. Doubles as a progress
 * indicator and as a legend for the state machine the scene is running.
 */
export function StateRail({
  states,
  current,
  className = '',
}: {
  states: string[]
  current: number
  className?: string
}) {
  return (
    <ol className={`flex flex-col gap-2 ${className}`} aria-label="Scene progress">
      {states.map((name, index) => {
        const done = index < current
        const now = index === current
        return (
          <li key={name} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-px transition-all duration-500"
              style={{
                width: now ? 22 : done ? 12 : 8,
                background: now ? C.active : done ? C.flow : C.idle,
              }}
            />
            <span
              className="font-mono text-[0.625rem] uppercase tracking-[0.18em] transition-colors duration-500"
              style={{ color: now ? C.active : done ? C.flow : C.idle }}
              aria-current={now ? 'step' : undefined}
            >
              {name}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
