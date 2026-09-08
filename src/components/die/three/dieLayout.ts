import type { DieRegionId } from '../../../data/content'

/**
 * The die floorplan in 3D.
 *
 * Deliberately the same arrangement as the SVG die, so the WebGL and fallback
 * versions describe one object rather than two different pictures: three
 * regions across the top of the core, three across the bottom, an interconnect
 * spine between them, and an I/O perimeter around the edge.
 *
 * Units are arbitrary but chosen so the whole package is roughly 11 × 7.6,
 * which frames well in a 32° lens without perspective distortion.
 */
export const PACKAGE = { w: 11, d: 7.6, h: 0.44 }
export const CORE = { w: 9.6, d: 6.4, h: 0.14 }

/** Top of the die surface — everything on the floorplan sits on this plane. */
export const SURFACE_Y = PACKAGE.h / 2 + CORE.h

export type RegionBox = {
  x: number
  z: number
  w: number
  d: number
  /** How far this region stands proud of the die surface. */
  h: number
}

export const REGIONS: Record<DieRegionId, RegionBox> = {
  design: { x: -2.92, z: -1.62, w: 2.5, d: 1.74, h: 0.2 },
  verify: { x: -0.06, z: -1.62, w: 2.86, d: 1.74, h: 0.24 },
  current: { x: 2.94, z: -1.62, w: 2.02, d: 1.74, h: 0.22 },
  embedded: { x: -2.92, z: 1.62, w: 2.5, d: 1.74, h: 0.2 },
  validate: { x: -0.06, z: 1.62, w: 2.86, d: 1.74, h: 0.22 },
  lab: { x: 2.94, z: 1.62, w: 2.02, d: 1.74, h: 0.18 },
}

/** The interconnect spine, and each region's tap into it. */
export const SPINE = { z: 0, x0: -4.2, x1: 4.2, lanes: [-0.09, 0, 0.09] }

export function tapPath(id: DieRegionId): { x: number; z0: number; z1: number } {
  const r = REGIONS[id]
  const edge = r.z < 0 ? r.z + r.d / 2 : r.z - r.d / 2
  return { x: r.x, z0: edge, z1: SPINE.z }
}

/**
 * Camera framing per scroll state. `overview` is the elevated oblique angle the
 * die is read from; a region view moves in and tilts down without ever
 * orbiting, so the reader's mental model of the floorplan survives the move.
 */
export const OVERVIEW = {
  position: [5.4, 7.4, 9.2] as const,
  target: [0, 0, 0] as const,
}

export const SILHOUETTE = {
  position: [3.2, 3.1, 12.4] as const,
  target: [0, 0, 0] as const,
}

/**
 * Semantic zoom, deliberately gentle.
 *
 * The camera leans toward the live region rather than diving at it: the region
 * becomes dominant while the rest of the floorplan stays readable, so the
 * reader never loses track of where on the die they are. A hard zoom looked
 * impressive for one frame and then left you nowhere.
 */
export function regionView(id: DieRegionId) {
  const r = REGIONS[id]
  const k = 0.34

  return {
    position: [
      OVERVIEW.position[0] * (1 - k * 0.45) + r.x * k * 0.7,
      OVERVIEW.position[1] * (1 - k * 0.3),
      OVERVIEW.position[2] * (1 - k * 0.32) + r.z * k * 0.7,
    ] as [number, number, number],
    target: [r.x * 0.7, SURFACE_Y, r.z * 0.7] as [number, number, number],
  }
}
