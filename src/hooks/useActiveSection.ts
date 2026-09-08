import { useEffect, useState } from 'react'

/**
 * Reports which section currently occupies the middle of the viewport, so the
 * navigation can track the chapter the reader is actually in.
 *
 * Uses a single IntersectionObserver with a band around the viewport centre —
 * no scroll listeners, no layout reads during scroll.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Track ratios so the most-visible section wins when two overlap the band.
    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let best = ''
        let bestRatio = 0
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        if (best) setActive(best)
      },
      {
        // A band across the middle of the viewport.
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
