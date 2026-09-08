import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useMotionPreference'

export type FlowNode = {
  label: string
  note?: string
  /** Marks the node the section is really about. */
  emphasis?: boolean
}

type Accent = 'signal' | 'amber' | 'violet'

const ACCENTS: Record<Accent, { text: string; border: string; dot: string; line: string }> = {
  signal: { text: 'text-signal', border: 'border-signal/30', dot: 'bg-signal', line: 'bg-signal/40' },
  amber: { text: 'text-amber', border: 'border-amber/30', dot: 'bg-amber', line: 'bg-amber/40' },
  violet: { text: 'text-violet', border: 'border-violet/30', dot: 'bg-violet', line: 'bg-violet/40' },
}

/**
 * ArchitectureDiagram — a signal path through a system, drawn as semantic
 * markup rather than a picture of one.
 *
 * Built from an ordered list so it degrades correctly: it stacks vertically on
 * narrow screens, reads in order to a screen reader, and scales with text
 * size. A single travelling dot per connector suggests flow without turning
 * the diagram into an animation.
 */
export function ArchitectureDiagram({
  nodes,
  orientation = 'vertical',
  accent = 'signal',
  title,
  className = '',
}: {
  nodes: FlowNode[]
  orientation?: 'vertical' | 'horizontal'
  accent?: Accent
  title?: string
  className?: string
}) {
  const reduced = useReducedMotion()
  const { ref, seen } = useSeen()
  const tone = ACCENTS[accent]
  const animate = seen && !reduced

  if (orientation === 'horizontal') {
    return (
      <figure ref={ref} className={`m-0 ${className}`}>
        {title && <figcaption className="eyebrow mb-5">{title}</figcaption>}
        {/* Horizontal on wide screens, vertical stack below it. */}
        <ol className="flex flex-col gap-0 md:flex-row md:items-stretch">
          {nodes.map((node, index) => (
            <li key={node.label} className="flex flex-1 flex-col md:flex-row md:items-center">
              <NodeBox node={node} tone={tone} index={index} />
              {index < nodes.length - 1 && (
                <Connector orientation="horizontal" tone={tone} animate={animate} delay={index * 0.35} />
              )}
            </li>
          ))}
        </ol>
      </figure>
    )
  }

  return (
    <figure ref={ref} className={`m-0 ${className}`}>
      {title && <figcaption className="eyebrow mb-5">{title}</figcaption>}
      <ol className="flex flex-col">
        {nodes.map((node, index) => (
          <li key={node.label} className="flex flex-col">
            <NodeBox node={node} tone={tone} index={index} />
            {index < nodes.length - 1 && (
              <Connector orientation="vertical" tone={tone} animate={animate} delay={index * 0.3} />
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}

function NodeBox({
  node,
  tone,
  index,
}: {
  node: FlowNode
  tone: (typeof ACCENTS)[Accent]
  index: number
}) {
  return (
    <div
      className={`flex-1 rounded-lg border px-4 py-3 transition-colors duration-500 ${
        node.emphasis ? `${tone.border} bg-white/[0.04]` : 'border-white/[0.08] bg-white/[0.015]'
      }`}
    >
      <div className="flex items-baseline gap-3">
        <span aria-hidden="true" className="font-mono text-[0.625rem] text-faint">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`text-sm font-medium tracking-tight ${node.emphasis ? tone.text : 'text-bright'}`}
        >
          {node.label}
        </span>
      </div>
      {node.note && <p className="mt-1 pl-8 text-[0.8125rem] leading-snug text-faint">{node.note}</p>}
    </div>
  )
}

function Connector({
  orientation,
  tone,
  animate,
  delay,
}: {
  orientation: 'vertical' | 'horizontal'
  tone: (typeof ACCENTS)[Accent]
  animate: boolean
  delay: number
}) {
  if (orientation === 'horizontal') {
    return (
      <div aria-hidden="true" className="flex items-center justify-center py-2 md:w-8 md:py-0">
        {/* Vertical run on stacked layout, horizontal run once side by side. */}
        <div className="relative h-6 w-px overflow-hidden bg-white/10 md:h-px md:w-full">
          {animate && (
            <span
              className={`absolute inset-0 animate-signal-down md:animate-signal-right ${tone.line}`}
              style={{ animationDelay: `${delay}s` }}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div aria-hidden="true" className="flex justify-start pl-8">
      <div className="relative h-5 w-px overflow-hidden bg-white/10">
        {animate && (
          <span
            className={`absolute inset-0 animate-signal-down ${tone.line}`}
            style={{ animationDelay: `${delay}s` }}
          />
        )}
      </div>
    </div>
  )
}

/** Fires once, when the element first enters view. */
export function useSeen<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, seen }
}
