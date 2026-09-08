/**
 * Shared silhouettes for the landscape.
 *
 * All paths are authored in a 1440 × 600 space and drawn as a bottom-anchored
 * band, so the horizon sits at the same place regardless of viewport shape.
 *
 * The natural and geometric ridges describe the *same* skyline: the geometric
 * set hits the same peaks with straight segments, so crossfading between them
 * reads as the landscape resolving into engineering drawing rather than as one
 * picture being swapped for another.
 */

/* --- Natural silhouettes ------------------------------------------------- */

export const RIDGE_FAR =
  'M0 402 Q 92 306 182 358 Q 254 398 322 302 Q 402 192 472 302 Q 542 400 620 352 Q 702 300 782 236 Q 860 300 932 322 Q 1012 344 1092 292 Q 1172 242 1252 322 Q 1332 398 1440 342'

export const RIDGE_MID =
  'M0 470 Q 100 432 202 462 Q 302 492 382 430 Q 472 360 562 430 Q 642 490 732 452 Q 822 414 902 458 Q 992 506 1082 456 Q 1172 406 1262 452 Q 1352 498 1440 460'

export const RIDGE_NEAR =
  'M0 528 Q 122 508 242 532 Q 362 554 482 524 Q 602 494 722 526 Q 842 558 962 528 Q 1082 498 1202 526 Q 1322 554 1440 530'

/* --- The same skyline, drawn as straight segments ------------------------ */

export const RIDGE_FAR_GEOMETRIC =
  'M0 402 L182 358 L322 302 L472 302 L620 352 L782 236 L932 322 L1092 292 L1252 322 L1440 342'

export const RIDGE_MID_GEOMETRIC =
  'M0 470 L202 462 L382 430 L562 430 L732 452 L902 458 L1082 456 L1262 452 L1440 460'

export const RIDGE_NEAR_GEOMETRIC =
  'M0 528 L242 532 L482 524 L722 526 L962 528 L1202 526 L1440 530'

/* --- Board routing ------------------------------------------------------- */

export const TRACES = [
  'M0 372 H196 L232 336 H468 L504 372 H742 L778 340 H1012 L1048 376 H1268 L1304 348 H1440',
  'M0 440 H148 L184 404 H392 L428 440 H660 L696 408 H944 L980 444 H1206 L1242 416 H1440',
  'M0 502 H280 L316 470 H540 L576 502 H812 L848 472 H1090 L1126 504 H1350 L1386 482 H1440',
]

export const VIAS: [number, number][] = [
  [232, 336],
  [504, 372],
  [778, 340],
  [1048, 376],
  [184, 404],
  [428, 440],
  [696, 408],
  [980, 444],
  [316, 470],
  [576, 502],
  [848, 472],
  [1126, 504],
]

/* --- Timing figure used for the break / debug / verify beats -------------- */

/** Renders a bit pattern as a square wave with vertical edges. */
function square(bits: number[], x0: number, step: number, high: number, low: number): string {
  const y = (bit: number) => (bit ? high : low)
  let path = `M ${x0} ${y(bits[0])}`

  bits.forEach((bit, index) => {
    const x = x0 + index * step
    if (index > 0 && bit !== bits[index - 1]) path += ` L ${x} ${y(bit)}`
    path += ` L ${x + step} ${y(bit)}`
  })

  return path
}

const WAVE_X = 872
const WAVE_STEP = 58
const WAVE_HIGH = 214
const WAVE_LOW = 276

/** What the design is supposed to do. */
export const WAVE_EXPECTED = square([0, 1, 1, 0, 1, 0, 0, 1], WAVE_X, WAVE_STEP, WAVE_HIGH, WAVE_LOW)

/** What it actually did — a bit that arrives late and one that never rises. */
export const WAVE_OBSERVED = square([0, 0, 1, 0, 0, 0, 0, 1], WAVE_X, WAVE_STEP, WAVE_HIGH, WAVE_LOW)

export const WAVE_REGION = {
  x: WAVE_X - 16,
  y: WAVE_HIGH - 30,
  width: WAVE_STEP * 8 + 32,
  height: WAVE_LOW - WAVE_HIGH + 60,
}
