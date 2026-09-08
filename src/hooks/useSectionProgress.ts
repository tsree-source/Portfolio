import { useEffect, useRef, useState } from 'react'

/**
 * Progress through a pinned section, 0 → 1.
 *
 * 0 is the moment the section's top reaches the top of the viewport; 1 is the
 * moment its bottom does — exactly the window during which a `sticky` child
 * stays pinned, so the value maps directly onto the pinned scene.
 *
 * Measured synchronously from `getBoundingClientRect()` in the scroll handler.
 * An earlier version deferred the read to `requestAnimationFrame`, which is the
 * usual advice, but it makes correctness depend on a frame actually being
 * served: anywhere frames are throttled — a background tab, an inactive
 * embedded view — a queued frame that never runs leaves the sequence frozen on
 * a stale beat, and every later scroll is dropped. Browsers already coalesce
 * scroll events to roughly one per frame, and this handler only reads layout
 * and never writes it, so there is no reflow to batch away.
 *
 * `steps` quantises the value before it reaches React, so scrolling within a
 * single beat causes no re-render at all.
 */
export function useSectionProgress(
  ref: React.RefObject<HTMLElement | null>,
  { steps }: { steps?: number } = {},
): number {
  const [progress, setProgress] = useState(0)
  const last = useRef(-1)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const measure = () => {
      const rect = element.getBoundingClientRect()
      const travel = rect.height - window.innerHeight

      // A section shorter than the viewport has no pinned travel.
      const raw = travel <= 0 ? 0 : -rect.top / travel
      const clamped = Math.min(1, Math.max(0, raw))

      const value = steps ? Math.round(clamped * steps) / steps : clamped
      if (value === last.current) return

      last.current = value
      setProgress(value)
    }

    // Nothing is cached between calls, so a section whose height changes after
    // mount — fonts loading, `svh` resolving, an image settling — can never
    // leave the sequence stuck on a stale measurement.
    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure, { passive: true })

    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [ref, steps])

  return progress
}
