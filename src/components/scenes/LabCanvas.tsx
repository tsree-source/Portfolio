import { C } from '../system/palette'
import { useState } from 'react'
import { labProjects } from '../../data/content'
import { Callout, Label, SceneTitle } from '../system/annotations'
import { Reveal } from '../primitives'

/**
 * THE LAB — a schematic canvas, not a grid of cards.
 *
 * The projects are placed on a workbench and wired to each other by what they
 * actually share: a bus, a boundary, a control loop. Selecting one brings it
 * forward and lets the rest recede, which is progressive disclosure done
 * spatially — the reader never loses sight of where the selected thing sits
 * among the others.
 */
type NodeId = (typeof labProjects)[number]['id']

const NODES: Record<NodeId, { x: number; y: number; w: number; h: number }> = {
  can: { x: 60, y: 128, w: 190, h: 76 },
  bootloader: { x: 352, y: 52, w: 200, h: 76 },
  driver: { x: 646, y: 156, w: 196, h: 76 },
  pmsm: { x: 196, y: 320, w: 190, h: 76 },
  cpu: { x: 566, y: 356, w: 200, h: 76 },
}

/** What actually connects two experiments. */
const LINKS: { from: NodeId; to: NodeId; label: string }[] = [
  { from: 'can', to: 'bootloader', label: 'embedded firmware' },
  { from: 'bootloader', to: 'driver', label: 'HW/SW boundary' },
  { from: 'can', to: 'pmsm', label: 'vehicle & control' },
  { from: 'pmsm', to: 'driver', label: 'validation automation' },
  { from: 'driver', to: 'cpu', label: 'digital systems' },
]

const centre = (id: NodeId) => {
  const n = NODES[id]
  return { x: n.x + n.w / 2, y: n.y + n.h / 2 }
}

export function LabCanvas() {
  const [selected, setSelected] = useState<NodeId | null>(null)
  const project = labProjects.find((p) => p.id === selected) ?? null

  return (
    <section id="chapter-lab" aria-labelledby="lab-heading" className="border-t border-white/[0.06] py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <SceneTitle eyebrow="The lab" title="Things I built to understand hardware more deeply." id="lab-heading">
            Smaller experiments, wired to each other by what they share. Select one to bring it
            forward.
          </SceneTitle>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-12">
          <Reveal>
            <svg
              viewBox="0 0 900 470"
              className="h-auto w-full"
              role="group"
              aria-label="Lab projects and how they relate"
            >
              {/* Workbench grid — quiet, and only where it helps read position. */}
              <g stroke={C.idle} strokeWidth="0.4" opacity="0.18">
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 52} x2="900" y2={i * 52} />
                ))}
                {Array.from({ length: 18 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 52} y1="0" x2={i * 52} y2="470" />
                ))}
              </g>

              {/* Relationship traces */}
              {LINKS.map((link) => {
                const a = centre(link.from)
                const b = centre(link.to)
                const related = selected === link.from || selected === link.to
                const dim = selected !== null && !related
                const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
                return (
                  <g key={`${link.from}-${link.to}`} style={{ transition: 'opacity 600ms ease' }} opacity={dim ? 0.15 : 1}>
                    <path
                      d={`M${a.x} ${a.y} Q ${mid.x} ${mid.y - 34} ${b.x} ${b.y}`}
                      fill="none"
                      stroke={related ? C.active : C.idle}
                      strokeWidth={related ? 1.6 : 1}
                      style={{ transition: 'stroke 600ms ease, stroke-width 600ms ease' }}
                    />
                    <text
                      x={mid.x}
                      y={mid.y - 40}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="8.5"
                      letterSpacing="1"
                      fill={related ? C.active : C.idle}
                      opacity={related ? 1 : 0.55}
                      style={{ transition: 'fill 600ms ease, opacity 600ms ease' }}
                    >
                      {link.label}
                    </text>
                  </g>
                )
              })}

              {/* The experiments */}
              {labProjects.map((p) => {
                const n = NODES[p.id as NodeId]
                const live = selected === p.id
                const dim = selected !== null && !live
                const colour = live ? C.active : C.flow
                const cx = n.x + n.w / 2
                const cy = n.y + n.h / 2

                return (
                  <g
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={live}
                    aria-label={`${p.name} — ${p.period}`}
                    className="cursor-pointer outline-none"
                    onClick={() => setSelected(live ? null : (p.id as NodeId))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setSelected(live ? null : (p.id as NodeId))
                      }
                    }}
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: live ? 'scale(1.06)' : dim ? 'scale(0.96)' : 'scale(1)',
                      opacity: dim ? 0.4 : 1,
                      transition: 'transform 700ms cubic-bezier(0.22,0.61,0.36,1), opacity 600ms ease',
                    }}
                  >
                    <rect
                      x={n.x}
                      y={n.y}
                      width={n.w}
                      height={n.h}
                      rx="3"
                      fill={live ? 'rgba(232,199,122,0.08)' : 'rgba(4,12,12,0.85)'}
                      stroke={colour}
                      strokeWidth={live ? 1.7 : 1}
                      style={{ transition: 'stroke 600ms ease, fill 600ms ease' }}
                    />
                    <text x={n.x + 14} y={n.y + 30} className="font-mono" fontSize="11.5" letterSpacing="1.2" fill={colour}>
                      {p.name.toUpperCase()}
                    </text>
                    <text x={n.x + 14} y={n.y + 50} className="font-mono" fontSize="8.5" fill={C.idle}>
                      {p.period}
                    </text>
                    <g stroke={colour} strokeWidth="0.7" opacity={live ? 0.7 : 0.3}>
                      <line x1={n.x + 14} y1={n.y + 62} x2={n.x + n.w - 14} y2={n.y + 62} />
                    </g>
                  </g>
                )
              })}
            </svg>

            <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-faint">
              Select an experiment · traces show what it shares
            </p>
          </Reveal>

          {/* Progressive disclosure, beside the canvas rather than over it. */}
          <div className="lg:pt-6">
            {project ? (
              <Callout title={project.name} tone="active" visible key={project.id}>
                <p className="text-[0.9375rem] leading-relaxed text-muted">{project.summary}</p>
                <ul className="mt-5 space-y-2">
                  {project.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-faint">
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-flow" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-5">
                  <Label tone="flow">{project.tags.join(' · ')}</Label>
                </p>
              </Callout>
            ) : (
              <Callout title="Five experiments" tone="flow" visible>
                A CAN network built to misbehave on purpose, a bootloader written to survive a
                failed update, a kernel driver proved across its whole lifecycle, a motor drive
                without a position sensor, and a study of what pipeline width actually buys you.
              </Callout>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
