import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import type { DieRegionId } from '../../data/content'
import { EngineeringDie } from './EngineeringDie'
import { hasWebGL } from '../../lib/webgl'

/** Loaded only when the die is actually going to be rendered in 3D. */
const DieScene = lazy(() => import('./three/DieScene'))

/**
 * DieStage decides how the die is drawn.
 *
 * Three paths, one object:
 *
 *   WebGL      · desktop, motion allowed  → the spatial die
 *   SVG        · phones, and any machine without a usable WebGL context
 *   SVG        · reduced motion, where camera travel is the wrong answer
 *
 * The SVG die is not a degraded placeholder — it is the same floorplan, fully
 * interactive, and it was the shipping version before this. That is why no
 * engineering information depends on WebGL: the fallback carries all of it.
 */
export function DieStage({
  state,
  active,
  onActivate,
  onSelect,
  reduced,
  compact,
  inView,
}: {
  state: number
  active: DieRegionId | null
  onActivate: (id: DieRegionId | null) => void
  onSelect: (id: DieRegionId) => void
  reduced: boolean
  compact: boolean
  inView: boolean
}) {
  // Resolved after mount so the first paint never waits on a WebGL probe.
  const [webgl, setWebgl] = useState<boolean | null>(null)
  useEffect(() => setWebgl(hasWebGL()), [])

  const spatial = webgl === true && !compact && !reduced

  // The SVG die uses its own smaller state vocabulary; map the scene states
  // onto it so both paths tell the same story at the same scroll position.
  const svgZoom = useMemo(() => (active && state >= 3 ? 0.32 : 0), [active, state])

  if (!spatial) {
    return (
      <EngineeringDie
        active={active}
        onActivate={onActivate}
        onSelect={onSelect}
        zoom={svgZoom}
        reduced={reduced}
        className="h-auto w-full"
      />
    )
  }

  return (
    <div className="relative aspect-[16/10] w-full">
      <Suspense fallback={<Initialising />}>
        <DieScene
          state={state}
          active={active}
          onActivate={onActivate}
          onSelect={onSelect}
          reduced={reduced}
          inView={inView}
        />
      </Suspense>
    </div>
  )
}

/**
 * The wait before the scene chunk arrives. It is a status line, not a spinner:
 * this is a hardware portfolio, and "initialising" is what the machine is
 * actually doing.
 */
function Initialising() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-faint">
        <span className="mr-3 inline-block h-px w-8 animate-pulse-soft bg-flow align-middle" />
        Initialising hardware map
      </p>
    </div>
  )
}
