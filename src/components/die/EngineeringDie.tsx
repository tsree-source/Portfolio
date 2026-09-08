import { C } from '../system/palette'
import { dieRegions, type DieRegionId } from '../../data/content'

/**
 * An original abstract die.
 *
 * The floorplan is invented, not traced from any real part. It borrows the
 * grammar of chip layout — functional blocks on a core, an interconnect spine,
 * a clock tree, memory arrays, an I/O perimeter, laser die markings — because
 * that grammar is what carries the meaning: the whole die is "Hardware
 * Engineer", and the blocks are dimensions of the same work.
 *
 * Everything is driven by `active`: the live region illuminates gold, its
 * interconnect carries a gold signal to the spine, and the rest of the
 * architecture falls back to inactive ink. That is the site's colour rule
 * applied to its own navigation.
 */

/* Core geometry, in the die's own coordinate space. */
export const DIE_VIEWBOX = { w: 1000, h: 680 }

export const BLOCKS: Record<DieRegionId, { x: number; y: number; w: number; h: number }> = {
  design: { x: 118, y: 118, w: 232, h: 158 },
  verify: { x: 386, y: 118, w: 268, h: 158 },
  current: { x: 690, y: 118, w: 192, h: 158 },
  embedded: { x: 118, y: 404, w: 232, h: 158 },
  validate: { x: 386, y: 404, w: 268, h: 158 },
  lab: { x: 690, y: 404, w: 192, h: 158 },
}

/** The interconnect spine every block taps into. */
const SPINE_Y = 340
const SPINE_X0 = 118
const SPINE_X1 = 882

export function EngineeringDie({
  active,
  onActivate,
  onSelect,
  zoom = 0,
  interactive = true,
  reduced = false,
  className = '',
}: {
  active: DieRegionId | null
  onActivate?: (id: DieRegionId | null) => void
  onSelect?: (id: DieRegionId) => void
  /** 0 = whole die, 1 = framed on the active block (semantic zoom). */
  zoom?: number
  interactive?: boolean
  reduced?: boolean
  className?: string
}) {
  // Semantic zoom: frame the active block without unmounting the die, so the
  // reader keeps the mental model of where that block sits.
  let transform = 'translate(0,0) scale(1)'
  if (active && zoom > 0) {
    const b = BLOCKS[active]
    const cx = b.x + b.w / 2
    const cy = b.y + b.h / 2
    const scale = 1 + zoom * 0.85
    const tx = DIE_VIEWBOX.w / 2 - cx * scale
    const ty = DIE_VIEWBOX.h / 2 - cy * scale
    transform = `translate(${tx},${ty}) scale(${scale})`
  }

  const ease = reduced ? '200ms linear' : '900ms cubic-bezier(0.22,0.61,0.36,1)'

  return (
    <svg
      viewBox={`0 0 ${DIE_VIEWBOX.w} ${DIE_VIEWBOX.h}`}
      className={className}
      role={interactive ? 'group' : 'presentation'}
      aria-label={interactive ? 'Functional regions of the engineering work' : undefined}
    >
      <defs>
        <linearGradient id="die-substrate" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#0a1418" />
          <stop offset="100%" stopColor="#050b0e" />
        </linearGradient>
        <radialGradient id="die-glow">
          <stop offset="0%" stopColor={C.active} stopOpacity="0.16" />
          <stop offset="100%" stopColor={C.active} stopOpacity="0" />
        </radialGradient>
        {/* Fine substrate texture, the way a die catches light. */}
        <pattern id="die-grain" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 8 L8 0" stroke="#1a2f36" strokeWidth="0.4" opacity="0.5" />
        </pattern>
      </defs>

      {/* Substrate and I/O perimeter */}
      <rect x="26" y="26" width="948" height="628" rx="22" fill="url(#die-substrate)" stroke="#1d3038" />
      <rect x="26" y="26" width="948" height="628" rx="22" fill="url(#die-grain)" opacity="0.5" />
      <IoPerimeter />

      {/* Core */}
      <rect x="88" y="88" width="824" height="504" rx="8" fill="none" stroke="#16262d" />

      <g style={{ transition: `transform ${ease}` }} transform={transform}>
        <ClockTree />
        <Spine active={active} reduced={reduced} />

        {dieRegions.map((region) => (
          <Block
            key={region.id}
            id={region.id}
            name={region.name}
            sub={region.sub}
            active={active === region.id}
            dimmed={active !== null && active !== region.id}
            interactive={interactive}
            reduced={reduced}
            onActivate={onActivate}
            onSelect={onSelect}
          />
        ))}
      </g>

      {/* Laser die marking, the way a real part is identified. */}
      <text
        x="52"
        y="636"
        className="font-mono"
        fontSize="11"
        letterSpacing="2.4"
        fill={C.idle}
        opacity="0.85"
      >
        TS · HARDWARE ENGINEER · REV 2026
      </text>
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * Die furniture
 * -------------------------------------------------------------------------*/

function IoPerimeter() {
  const pads: { x: number; y: number; w: number; h: number }[] = []
  for (let x = 106; x < 900; x += 34) {
    pads.push({ x, y: 52, w: 18, h: 7 })
    pads.push({ x, y: 621, w: 18, h: 7 })
  }
  for (let y = 116; y < 570; y += 32) {
    pads.push({ x: 52, y, w: 7, h: 18 })
    pads.push({ x: 941, y, w: 7, h: 18 })
  }
  return (
    <g fill="#1f333b">
      {pads.map((p, i) => (
        <rect key={i} {...p} rx="1.5" />
      ))}
    </g>
  )
}

/** A clock-tree-like distribution, present but never loud. */
function ClockTree() {
  return (
    <g stroke={C.idle} strokeWidth="0.8" fill="none" opacity="0.28">
      <path d="M500 96 V340" />
      <path d="M234 200 H766" />
      <path d="M234 200 V150 M234 200 V260" />
      <path d="M766 200 V150 M766 200 V260" />
      <path d="M234 480 H766" />
      <path d="M234 480 V430 M234 480 V540" />
      <path d="M766 480 V430 M766 480 V540" />
      <path d="M500 340 V480" />
    </g>
  )
}

/** The interconnect spine, and each block's tap into it. */
function Spine({ active, reduced }: { active: DieRegionId | null; reduced: boolean }) {
  const lanes = [SPINE_Y - 8, SPINE_Y, SPINE_Y + 8]

  return (
    <g>
      {lanes.map((y, index) => (
        <line
          key={y}
          x1={SPINE_X0}
          y1={y}
          x2={SPINE_X1}
          y2={y}
          stroke={active ? C.flow : C.idle}
          strokeWidth={index === 1 ? 1.4 : 0.9}
          opacity={index === 1 ? 0.9 : 0.45}
          style={{ transition: 'stroke 700ms ease' }}
        />
      ))}

      {/* A signal running the spine, only while a region is live. */}
      {active && !reduced && (
        <line
          x1={SPINE_X0}
          y1={SPINE_Y}
          x2={SPINE_X1}
          y2={SPINE_Y}
          stroke={C.active}
          strokeWidth="2"
          strokeDasharray="70 700"
          className="animate-trace-flow"
        />
      )}

      {/* Vertical taps from each block down/up into the spine. */}
      {dieRegions.map((region) => {
        const b = BLOCKS[region.id]
        const x = b.x + b.w / 2
        const from = b.y < SPINE_Y ? b.y + b.h : b.y
        const live = active === region.id
        return (
          <g key={region.id}>
            <line
              x1={x}
              y1={from}
              x2={x}
              y2={SPINE_Y}
              stroke={live ? C.active : active ? C.idle : C.flow}
              strokeWidth={live ? 2 : 1}
              opacity={live ? 1 : active ? 0.4 : 0.55}
              style={{ transition: 'stroke 700ms ease, opacity 700ms ease, stroke-width 700ms ease' }}
            />
            <circle
              cx={x}
              cy={SPINE_Y}
              r={live ? 4 : 2.5}
              fill={live ? C.active : C.idle}
              style={{ transition: 'fill 700ms ease, r 700ms ease' }}
            />
          </g>
        )
      })}
    </g>
  )
}

/* ---------------------------------------------------------------------------
 * A functional block
 * -------------------------------------------------------------------------*/
function Block({
  id,
  name,
  sub,
  active,
  dimmed,
  interactive,
  reduced,
  onActivate,
  onSelect,
}: {
  id: DieRegionId
  name: string
  sub: string
  active: boolean
  dimmed: boolean
  interactive: boolean
  reduced: boolean
  onActivate?: (id: DieRegionId | null) => void
  onSelect?: (id: DieRegionId) => void
}) {
  const b = BLOCKS[id]
  const stroke = active ? C.active : dimmed ? C.idle : C.flow
  const opacity = active ? 1 : dimmed ? 0.4 : 0.75

  return (
    <g
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${name} — ${sub}` : undefined}
      className={interactive ? 'cursor-pointer outline-none' : undefined}
      onMouseEnter={interactive ? () => onActivate?.(id) : undefined}
      onMouseLeave={interactive ? () => onActivate?.(null) : undefined}
      onFocus={interactive ? () => onActivate?.(id) : undefined}
      onBlur={interactive ? () => onActivate?.(null) : undefined}
      onClick={interactive ? () => onSelect?.(id) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect?.(id)
              }
            }
          : undefined
      }
      style={{ transition: 'opacity 700ms ease' }}
      opacity={opacity}
    >
      {/* Illumination behind the live block. */}
      {active && <rect x={b.x - 26} y={b.y - 26} width={b.w + 52} height={b.h + 52} fill="url(#die-glow)" />}

      <rect
        x={b.x}
        y={b.y}
        width={b.w}
        height={b.h}
        rx="4"
        fill={active ? 'rgba(232,199,122,0.07)' : 'rgba(69,179,148,0.03)'}
        stroke={stroke}
        strokeWidth={active ? 1.6 : 1}
        style={{ transition: 'stroke 700ms ease, fill 700ms ease, stroke-width 700ms ease' }}
      />

      <BlockTexture id={id} active={active} reduced={reduced} />

      <text
        x={b.x + 14}
        y={b.y + 28}
        className="font-mono"
        fontSize="15"
        letterSpacing="2.6"
        fill={active ? C.active : dimmed ? C.idle : C.parchment}
        style={{ transition: 'fill 700ms ease' }}
      >
        {name}
      </text>
      <text
        x={b.x + 14}
        y={b.y + 46}
        className="font-mono"
        fontSize="9.5"
        letterSpacing="0.6"
        fill={C.idle}
      >
        {sub}
      </text>

      {/* Corner registration marks — the block reads as a placed cell. */}
      <g stroke={stroke} strokeWidth="1.2" fill="none" opacity={active ? 1 : 0.5}>
        <path d={`M${b.x} ${b.y + 12} V${b.y} H${b.x + 12}`} />
        <path d={`M${b.x + b.w - 12} ${b.y} H${b.x + b.w} V${b.y + 12}`} />
        <path d={`M${b.x + b.w} ${b.y + b.h - 12} V${b.y + b.h} H${b.x + b.w - 12}`} />
        <path d={`M${b.x + 12} ${b.y + b.h} H${b.x} V${b.y + b.h - 12}`} />
      </g>
    </g>
  )
}

/**
 * Each block carries an internal structure appropriate to what it does:
 * standard-cell rows, a coverage grid, probe pads, bus lanes, a memory array.
 */
function BlockTexture({ id, active, reduced }: { id: DieRegionId; active: boolean; reduced: boolean }) {
  const b = BLOCKS[id]
  const tone = active ? C.active : C.flow
  const faint = active ? 0.5 : 0.26
  const x0 = b.x + 12
  const y0 = b.y + 60
  const w = b.w - 24
  const h = b.h - 74

  if (id === 'design') {
    // Standard-cell rows.
    return (
      <g stroke={tone} strokeWidth="0.8" opacity={faint}>
        {Array.from({ length: 5 }, (_, r) => (
          <line key={r} x1={x0} y1={y0 + r * (h / 5)} x2={x0 + w} y2={y0 + r * (h / 5)} />
        ))}
        {Array.from({ length: 9 }, (_, c) => (
          <line key={c} x1={x0 + c * (w / 9)} y1={y0} x2={x0 + c * (w / 9)} y2={y0 + h} opacity="0.4" />
        ))}
      </g>
    )
  }

  if (id === 'verify') {
    // A coverage grid, filling in as it is exercised.
    const cols = 14
    const rows = 5
    return (
      <g opacity={faint + 0.12}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          const filled = (i * 7) % 20 > 3
          return (
            <rect
              key={i}
              x={x0 + c * (w / cols) + 1}
              y={y0 + r * (h / rows) + 1}
              width={w / cols - 2.5}
              height={h / rows - 2.5}
              fill={filled ? tone : 'none'}
              stroke={tone}
              strokeWidth="0.4"
              opacity={filled ? 0.75 : 0.3}
            />
          )
        })}
      </g>
    )
  }

  if (id === 'current') {
    // A memory array — the 64 × 24-bit block this region is really about.
    const cols = 8
    const rows = 5
    return (
      <g opacity={faint + 0.15}>
        {Array.from({ length: rows * cols }, (_, i) => (
          <rect
            key={i}
            x={x0 + (i % cols) * (w / cols) + 1}
            y={y0 + Math.floor(i / cols) * (h / rows) + 1}
            width={w / cols - 2.5}
            height={h / rows - 2.5}
            fill={tone}
            opacity="0.35"
          />
        ))}
        <line x1={x0} y1={y0 - 6} x2={x0 + w} y2={y0 - 6} stroke={tone} strokeWidth="1" opacity="0.7" />
      </g>
    )
  }

  if (id === 'validate') {
    // Probe pads and a measurement trace.
    return (
      <g opacity={faint + 0.1}>
        {Array.from({ length: 7 }, (_, i) => (
          <circle key={i} cx={x0 + 14 + i * (w / 7)} cy={y0 + 14} r="3.5" fill="none" stroke={tone} />
        ))}
        <path
          d={`M${x0} ${y0 + h - 10} h${w * 0.18} v-22 h${w * 0.14} v22 h${w * 0.2} v-14 h${w * 0.16} v14 h${w * 0.3}`}
          fill="none"
          stroke={tone}
          strokeWidth="1.1"
        />
      </g>
    )
  }

  if (id === 'embedded') {
    // Bus lanes leaving toward the perimeter.
    return (
      <g stroke={tone} strokeWidth="1" opacity={faint} fill="none">
        {Array.from({ length: 4 }, (_, i) => (
          <path
            key={i}
            d={`M${x0} ${y0 + 10 + i * 18} h${w * 0.45} l14 14 h${w * 0.4}`}
            className={active && !reduced ? 'animate-trace-flow' : undefined}
            style={{ animationDelay: `${i * -4}s` }}
          />
        ))}
      </g>
    )
  }

  // lab — scattered experiments on a workbench grid.
  return (
    <g opacity={faint}>
      <g stroke={tone} strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 4 }, (_, r) => (
          <line key={r} x1={x0} y1={y0 + r * (h / 4)} x2={x0 + w} y2={y0 + r * (h / 4)} />
        ))}
      </g>
      {[
        [0.12, 0.2],
        [0.45, 0.55],
        [0.72, 0.28],
        [0.3, 0.78],
        [0.86, 0.7],
      ].map(([fx, fy], i) => (
        <rect key={i} x={x0 + fx * w} y={y0 + fy * h} width="11" height="11" fill={tone} opacity="0.6" />
      ))}
    </g>
  )
}
