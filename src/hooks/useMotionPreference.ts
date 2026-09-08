import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion`. Components use this to render a genuinely
 * static alternative rather than to merely shorten a transition.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * True below the given breakpoint. Used to drop parallax and the sticky
 * scroll-stage on small screens, where both are more cost than value.
 */
export function useIsCompact(maxWidth = 768): boolean {
  const [compact, setCompact] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(`(max-width: ${maxWidth - 1}px)`).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${maxWidth - 1}px)`)
    const onChange = () => setCompact(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [maxWidth])

  return compact
}

/** Convenience: any condition under which rich motion should be suppressed. */
export function useSimplifiedMotion(): boolean {
  const reduced = useReducedMotion()
  const compact = useIsCompact()
  return reduced || compact
}
