import { useMemo } from 'react'
import {
  RIDGE_FAR,
  RIDGE_FAR_GEOMETRIC,
  RIDGE_MID,
  RIDGE_MID_GEOMETRIC,
  RIDGE_NEAR,
  RIDGE_NEAR_GEOMETRIC,
  TRACES,
  VIAS,
  WAVE_EXPECTED,
  WAVE_OBSERVED,
  WAVE_REGION,
} from './scenery'

/**
 * The environment for the opening sequence.
 *
 * Every visual state is a function of `stage`, so the scene is one continuous
 * thing being transformed rather than a set of slides. Nothing here animates on
 * a timer: the beat changes, the properties change, and CSS transitions carry
 * the scene from one state to the next.
 *
 * The transformation follows the words:
 *   learning   → the ridgelines resolve into straight segments
 *   building   → routing draws itself along them
 *   testing    → signals run through the routing
 *   breaking   → one signal stops matching what was expected
 *   debugging  → everything else dims; the failing path is isolated
 *   verifying  → the observed waveform comes back into alignment
 *   improving  → the whole board lights in jade and gold
 */
export type HeroStage = {
  mood: 'night' | 'twilight' | 'dawn' | 'jade'
  /** Warm light rising from the horizon, 0 → 1. */
  light: number
  /** Natural ridgelines → straight segments, 0 → 1. */
  geometry: number
  /** How much of the routing has been drawn, 0 → 1. */
  traces: number
  /** Signals running along the routing. */
  signals: boolean
  fault: 'none' | 'active' | 'isolated' | 'fixed'
  /** Final illumination, 0 → 1. */
  illuminate: number
}

const MOODS: Record<HeroStage['mood'], string> = {
  night:
    'radial-gradient(125% 82% at 50% 104%, rgba(12,44,38,0.55) 0%, rgba(6,18,16,0.2) 42%, rgba(3,6,8,0) 68%), linear-gradient(180deg, #030608 0%, #050f0d 100%)',
  twilight:
    'radial-gradient(118% 78% at 50% 104%, rgba(92,48,102,0.5) 0%, rgba(38,20,52,0.22) 44%, rgba(8,6,14,0) 70%), linear-gradient(180deg, #070610 0%, #160d20 100%)',
  dawn: 'radial-gradient(112% 74% at 50% 104%, rgba(240,160,60,0.46) 0%, rgba(150,58,72,0.2) 38%, rgba(12,8,16,0) 68%), linear-gradient(180deg, #0a0810 0%, #1b1017 100%)',
  jade: 'radial-gradient(112% 74% at 50% 104%, rgba(69,179,148,0.34) 0%, rgba(240,160,60,0.18) 36%, rgba(4,12,12,0) 70%), linear-gradient(180deg, #04080b 0%, #061510 100%)',
}

const MOOD_KEYS = Object.keys(MOODS) as HeroStage['mood'][]

export function HeroScene({
  stage,
  reduced,
  compact,
}: {
  stage: HeroStage
  reduced: boolean
  compact: boolean
}) {
  const { mood, light, geometry, traces, signals, fault, illuminate } = stage

  const faulted = fault === 'active' || fault === 'isolated'
  const isolated = fault === 'isolated'
  const fixed = fault === 'fixed'
  const waveVisible = fault !== 'none'

  // Everything below transitions on opacity or a stroke offset only.
  const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'
  const slow = reduced ? '320ms' : '1500ms'
  const medium = reduced ? '320ms' : '1100ms'

  return (
    <div className="allow-crossfade pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Mood — four full-bleed washes crossfading between night, twilight,
          dawn and the jade light that follows it. */}
      {MOOD_KEYS.map((key) => (
        <div
          key={key}
          className="absolute inset-0"
          style={{
            background: MOODS[key],
            opacity: mood === key ? 1 : 0,
            transition: `opacity ${slow} ${ease}`,
          }}
        />
      ))}

      {/* Warm light rising from the horizon. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          opacity: light,
          background:
            'radial-gradient(70% 100% at 50% 100%, rgba(255,199,120,0.34) 0%, rgba(240,160,60,0.16) 32%, rgba(240,160,60,0) 68%)',
          transition: `opacity ${slow} ${ease}`,
        }}
      />

      {/* Landscape and board share one coordinate space, anchored to the
          bottom, with height following width so the horizon never distorts. */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full"
        style={{ aspectRatio: '1440 / 600' }}
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax meet"
        role="presentation"
      >
        <defs>
          <linearGradient id="hero-ridge-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b2c35" />
            <stop offset="100%" stopColor="#081210" />
          </linearGradient>
          <linearGradient id="hero-ridge-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101d24" />
            <stop offset="100%" stopColor="#050d0c" />
          </linearGradient>
          <linearGradient id="hero-ridge-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060c0e" />
            <stop offset="100%" stopColor="#030608" />
          </linearGradient>
        </defs>

        {/* Solid masses — always present, they are the ground of the scene. */}
        <g style={{ opacity: 1 - illuminate * 0.25, transition: `opacity ${slow} ${ease}` }}>
          <path d={`${RIDGE_FAR} V600 H0 Z`} fill="url(#hero-ridge-far)" />
          <path d={`${RIDGE_MID} V600 H0 Z`} fill="url(#hero-ridge-mid)" />
          <path d={`${RIDGE_NEAR} V600 H0 Z`} fill="url(#hero-ridge-near)" />
        </g>

        {/* Natural contour light. */}
        <g
          fill="none"
          strokeWidth="1"
          style={{ opacity: (0.14 + light * 0.3) * (1 - geometry), transition: `opacity ${slow} ${ease}` }}
        >
          <path d={RIDGE_FAR} stroke="#e4c684" />
          <path d={RIDGE_MID} stroke="#f0a03c" opacity="0.65" />
          <path d={RIDGE_NEAR} stroke="#e4c684" opacity="0.4" />
        </g>

        {/* The same skyline, resolved into straight segments. */}
        <g
          data-role="geometry"
          fill="none"
          strokeWidth="1"
          strokeLinejoin="round"
          style={{ opacity: geometry * 0.75, transition: `opacity ${slow} ${ease}` }}
        >
          <path d={RIDGE_FAR_GEOMETRIC} stroke="#45b394" />
          <path d={RIDGE_MID_GEOMETRIC} stroke="#45b394" opacity="0.7" />
          <path d={RIDGE_NEAR_GEOMETRIC} stroke="#e4c684" opacity="0.45" />
          {/* Vertices, where the curve became a decision. */}
          {[
            [182, 358],
            [322, 302],
            [472, 302],
            [782, 236],
            [1092, 292],
            [1252, 322],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#45b394" stroke="none" />
          ))}
        </g>

        {/* Routing. Normalised path length lets a single number draw it in. */}
        <g
          data-role="traces"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: isolated ? 0.18 : traces,
            transition: `opacity ${medium} ${ease}`,
          }}
        >
          {TRACES.map((trace, index) => (
            <path
              key={index}
              d={trace}
              pathLength={1}
              stroke={illuminate > 0 ? '#45b394' : '#5b93ff'}
              strokeWidth="1.1"
              strokeDasharray="1"
              strokeDashoffset={1 - traces}
              style={{
                transition: `stroke-dashoffset ${reduced ? '320ms' : '1700ms'} ${ease}, stroke ${slow} ${ease}`,
                transitionDelay: reduced ? '0ms' : `${index * 180}ms`,
              }}
            />
          ))}
        </g>

        {/* Signals travelling through the routing. */}
        {signals && !reduced && (
          <g data-role="signals" fill="none" strokeLinecap="round" style={{ opacity: isolated ? 0.12 : 1 }}>
            {TRACES.map((trace, index) => (
              <path
                key={index}
                d={trace}
                stroke={fixed || illuminate > 0 ? '#7fe3c4' : '#8fb6ff'}
                strokeWidth="1.6"
                className="animate-trace-flow"
                style={{ animationDelay: `${index * -6}s` }}
              />
            ))}
          </g>
        )}

        {/* Vias. */}
        <g
          style={{
            opacity: isolated ? 0.12 : traces * 0.85,
            transition: `opacity ${medium} ${ease}`,
          }}
        >
          {VIAS.map(([x, y], index) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r={illuminate > 0 ? 3 : 2.4}
              fill={illuminate > 0 ? '#e4c684' : '#9d80ff'}
              className={illuminate > 0 && !reduced ? 'animate-pulse-soft' : undefined}
              style={{ animationDelay: `${index * 0.35}s`, transition: `fill ${slow} ${ease}, r ${slow} ${ease}` }}
            />
          ))}
        </g>

        {/* The timing figure: expected against observed. */}
        <g data-role="wave" style={{ opacity: waveVisible ? 1 : 0, transition: `opacity ${medium} ${ease}` }}>
          {/* Isolation frame. */}
          <rect
            x={WAVE_REGION.x}
            y={WAVE_REGION.y}
            width={WAVE_REGION.width}
            height={WAVE_REGION.height}
            rx="8"
            fill="rgba(226,112,95,0.05)"
            stroke="#e2705f"
            strokeWidth="1"
            strokeDasharray="4 4"
            style={{ opacity: isolated ? 0.9 : 0, transition: `opacity ${medium} ${ease}` }}
          />

          {/* What was expected — always dim, always there. */}
          <path d={WAVE_EXPECTED} fill="none" stroke="#e4c684" strokeWidth="1.3" strokeDasharray="5 5" opacity="0.5" />

          {/* What actually happened. */}
          <path
            d={WAVE_OBSERVED}
            fill="none"
            stroke="#e2705f"
            strokeWidth="1.8"
            style={{ opacity: faulted ? 1 : 0, transition: `opacity ${medium} ${ease}` }}
          />

          {/* Back in alignment. */}
          <path
            d={WAVE_EXPECTED}
            fill="none"
            stroke="#45b394"
            strokeWidth="1.8"
            style={{ opacity: fixed || illuminate > 0 ? 1 : 0, transition: `opacity ${medium} ${ease}` }}
          />

          {/* Where the two disagree. */}
          <circle
            cx={WAVE_REGION.x + 90}
            cy={245}
            r="5"
            fill="none"
            stroke="#e2705f"
            strokeWidth="1.4"
            style={{ opacity: faulted ? 1 : 0, transition: `opacity ${medium} ${ease}` }}
          />
        </g>

        {/* Final illumination — the board as one working structure. */}
        <g
          fill="none"
          style={{ opacity: illuminate * 0.5, transition: `opacity ${slow} ${ease}` }}
          stroke="#e4c684"
          strokeWidth="1"
        >
          <rect x="360" y="392" width="720" height="128" rx="10" opacity="0.35" />
          <path d="M360 456 H240" opacity="0.3" />
          <path d="M1080 456 H1200" opacity="0.3" />
        </g>
      </svg>

      {/* Mist, drifting between the ridges. */}
      {!reduced && !compact && <Mist light={light} />}

      {/* Very few particles, and only once there is light to catch. */}
      {!reduced && !compact && <Motes light={light} />}

      {/* Vignette, to hold attention in the middle of the frame. */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120% 85% at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  )
}

function Mist({ light }: { light: number }) {
  return (
    <div
      className="absolute inset-x-0 bottom-[14%] h-[30%]"
      style={{ opacity: 0.25 + light * 0.35, transition: 'opacity 1500ms ease-out' }}
    >
      {[0, 1, 2].map((band) => (
        <span
          key={band}
          className="animate-drift absolute inset-x-0 block"
          style={{
            top: `${band * 34}%`,
            height: `${18 + band * 6}%`,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(220,235,230,0.05) 30%, rgba(240,200,140,0.06) 55%, rgba(255,255,255,0) 100%)',
            filter: 'blur(14px)',
            animationDuration: `${16 + band * 5}s`,
            animationDelay: `${band * -6}s`,
          }}
        />
      ))}
    </div>
  )
}

function Motes({ light }: { light: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        left: `${(index * 41 + 7) % 100}%`,
        top: `${38 + ((index * 27) % 46)}%`,
        delay: `${(index % 6) * 1.6}s`,
        duration: `${11 + (index % 4) * 2.2}s`,
        size: index % 3 === 0 ? 2 : 1.5,
      })),
    [],
  )

  return (
    <div className="absolute inset-0" style={{ opacity: light * 0.6, transition: 'opacity 1500ms ease-out' }}>
      {motes.map((mote, index) => (
        <span
          key={index}
          className="animate-drift absolute rounded-full bg-gold/60"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}
    </div>
  )
}
