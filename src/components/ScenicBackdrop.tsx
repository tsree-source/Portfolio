import { useMemo } from 'react'
import { useReducedMotion } from '../hooks/useMotionPreference'

/**
 * ScenicBackdrop
 *
 * The site's one piece of atmosphere: layered ridgelines under a slow sunrise,
 * which resolve into PCB routing as the narrative moves from landscape into
 * hardware.
 *
 * `phase` (0 → 1) drives the sunrise; `circuit` (0 → 1) drives how far the
 * natural line work has become circuitry. Both are declarative, so the same
 * component serves the opening, the turning point and the closing section.
 *
 * The ridge SVG uses `slice` rather than stretching: mountains keep their
 * proportions on every viewport, and the sun is a separate layer so it stays
 * circular regardless of container shape.
 */
export function ScenicBackdrop({
  phase,
  circuit = 0,
  className = '',
  mirrored = false,
}: {
  phase: number
  circuit?: number
  className?: string
  mirrored?: boolean
}) {
  const reduced = useReducedMotion()
  const p = clamp(phase)
  const c = clamp(circuit)

  const skyWarmth = 0.05 + p * 0.42

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Sky wash — cool navy warming towards amber as the sun climbs. */}
      <div
        className="absolute inset-0 transition-[background] duration-[1400ms] ease-out"
        style={{
          background: `radial-gradient(115% 70% at 50% 96%, rgba(240,160,60,${skyWarmth * 0.5}) 0%, rgba(124,44,64,${
            skyWarmth * 0.3
          }) 30%, rgba(8,12,23,0) 64%)`,
        }}
      />

      {/* Signal wash — the cool side, growing with the circuitry. */}
      <div
        className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
        style={{
          opacity: c,
          background:
            'radial-gradient(95% 58% at 50% 92%, rgba(91,147,255,0.16) 0%, rgba(157,128,255,0.09) 42%, rgba(4,6,13,0) 74%)',
        }}
      />

      {/* Sun — kept inside a wrapper that shares the ridge band's geometry, so
          it rises along the horizon instead of floating in the middle of the
          text on tall screens. Its own layer, so it is always a circle. */}
      <div className="absolute inset-x-0 bottom-0" style={{ aspectRatio: '1440 / 600' }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-[1600ms] ease-out"
          style={{
            // 13% ≈ tucked behind the near ridge, 45% ≈ clear of the peaks.
            bottom: `${13 + p * 32}%`,
            opacity: (0.25 + p * 0.75) * (1 - c * 0.5),
          }}
        >
          <div className="relative aspect-square w-[4vw] max-w-[76px] min-w-[26px]">
            <div
              className="absolute left-1/2 top-1/2 aspect-square w-[620%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(240,160,60,0.30) 0%, rgba(255,138,74,0.11) 42%, rgba(255,138,74,0) 70%)',
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #ffd9a0 0%, #f0a03c 55%, #ff8a4a 100%)',
                boxShadow: '0 0 48px rgba(240,160,60,0.4)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Ridgelines and routing.
          A bottom-anchored band whose height follows its own width, so the
          landscape is never stretched and never cropped: wide viewports get a
          deep range, tall narrow ones get a low horizon with plenty of sky.
          Stretching it over the full container magnified a single peak until
          it filled a phone screen. */}
      <svg
        className={`absolute inset-x-0 bottom-0 w-full ${mirrored ? 'scale-x-[-1]' : ''}`}
        style={{ aspectRatio: '1440 / 600' }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax meet"
        role="presentation"
      >
        <defs>
          <linearGradient id="ridge-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22304d" />
            <stop offset="100%" stopColor="#0e1526" />
          </linearGradient>
          <linearGradient id="ridge-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#141d31" />
            <stop offset="100%" stopColor="#090e1a" />
          </linearGradient>
          <linearGradient id="ridge-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#080c17" />
            <stop offset="100%" stopColor="#04060d" />
          </linearGradient>
        </defs>

        {/* Mist bands sitting between the ridges. */}
        <g style={{ opacity: (0.12 + p * 0.3) * (1 - c * 0.6), transition: 'opacity 1400ms ease-out' }}>
          <rect x="0" y="396" width="1440" height="22" fill="#f0a03c" opacity="0.13" />
          <rect x="0" y="452" width="1440" height="16" fill="#e4c684" opacity="0.10" />
          <rect x="0" y="502" width="1440" height="11" fill="#ff8a4a" opacity="0.07" />
        </g>

        {/* Ridges, far to near. Curved silhouettes rather than sawtooth. */}
        <g style={{ opacity: 1 - c * 0.5, transition: 'opacity 1600ms ease-out' }}>
          <path d={`${RIDGE_FAR} V600 H0 Z`} fill="url(#ridge-far)" />
          <path d={`${RIDGE_MID} V600 H0 Z`} fill="url(#ridge-mid)" />
          <path d={`${RIDGE_NEAR} V600 H0 Z`} fill="url(#ridge-near)" />
        </g>

        {/* Contour light on the ridge edges — the natural line work. */}
        <g
          fill="none"
          strokeWidth="1"
          style={{ opacity: (0.12 + p * 0.26) * (1 - c), transition: 'opacity 1600ms ease-out' }}
        >
          <path d={RIDGE_FAR} stroke="#e4c684" />
          <path d={RIDGE_MID} stroke="#f0a03c" opacity="0.7" />
        </g>

        {/* Routing — 45° bends, the way a board is actually laid out.
            Each trace is a quiet solid run with a brighter pulse travelling
            along it, rather than a dashed line. */}
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: c, transition: 'opacity 1600ms ease-out' }}
        >
          {TRACES.map((trace, index) => (
            <g key={index}>
              <path d={trace} stroke="#5b93ff" strokeWidth="1" opacity="0.28" />
              {!reduced && (
                <path
                  d={trace}
                  stroke="#7aa8ff"
                  strokeWidth="1.4"
                  opacity="0.75"
                  className="animate-trace-flow"
                  style={{ animationDelay: `${index * -7}s` }}
                />
              )}
            </g>
          ))}
        </g>

        {/* Vias on the routing. */}
        <g fill="#9d80ff" style={{ opacity: c * 0.7, transition: 'opacity 1600ms ease-out' }}>
          {VIAS.map(([x, y], index) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="2.5"
              className={reduced ? undefined : 'animate-pulse-soft'}
              style={{ animationDelay: `${index * 0.5}s` }}
            />
          ))}
        </g>
      </svg>

      {!reduced && <Particles phase={p} />}

      {/* Grain, so the large gradients do not band. Kept light — enough to
          break up the sky, not enough to grey out the warm light. */}
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Silhouettes
 * -------------------------------------------------------------------------*/

const RIDGE_FAR =
  'M0 402 Q 92 306 182 358 Q 254 398 322 302 Q 402 192 472 302 Q 542 400 620 352 Q 702 300 782 236 Q 860 300 932 322 Q 1012 344 1092 292 Q 1172 242 1252 322 Q 1332 398 1440 342'

const RIDGE_MID =
  'M0 470 Q 100 432 202 462 Q 302 492 382 430 Q 472 360 562 430 Q 642 490 732 452 Q 822 414 902 458 Q 992 506 1082 456 Q 1172 406 1262 452 Q 1352 498 1440 460'

const RIDGE_NEAR =
  'M0 528 Q 122 508 242 532 Q 362 554 482 524 Q 602 494 722 526 Q 842 558 962 528 Q 1082 498 1202 526 Q 1322 554 1440 530'

const TRACES = [
  'M0 372 H196 L232 336 H468 L504 372 H742 L778 340 H1012 L1048 376 H1268 L1304 348 H1440',
  'M0 440 H148 L184 404 H392 L428 440 H660 L696 408 H944 L980 444 H1206 L1242 416 H1440',
  'M0 502 H280 L316 470 H540 L576 502 H812 L848 472 H1090 L1126 504 H1350 L1386 482 H1440',
]

const VIAS: [number, number][] = [
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

function Particles({ phase }: { phase: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        left: `${(index * 37 + 9) % 100}%`,
        top: `${32 + ((index * 23) % 52)}%`,
        delay: `${(index % 8) * 1.2}s`,
        duration: `${9 + (index % 5) * 1.7}s`,
        size: index % 3 === 0 ? 2 : 1.5,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: 0.2 + phase * 0.45 }}>
      {particles.map((particle, index) => (
        <span
          key={index}
          className="animate-drift absolute rounded-full bg-gold/70"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  )
}

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}
