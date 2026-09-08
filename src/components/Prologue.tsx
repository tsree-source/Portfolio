import { useEffect, useMemo, useRef, useState } from 'react'
import { heroSequence, profile, socialLinks } from '../data/content'
import { HeroScene, type HeroStage } from './HeroScene'
import { useIsCompact, useReducedMotion } from '../hooks/useMotionPreference'
import { useSectionProgress } from '../hooks/useSectionProgress'

/* ---------------------------------------------------------------------------
 * SECTION 1 — The Present.
 *
 * A single pinned scene that the visitor drives with the scroll wheel. Exactly
 * one thought holds the viewport at any moment; the environment transforms
 * underneath it from night, through dawn, into a working board.
 *
 * The same sequence runs on every device and for every motion preference. What
 * changes is how much scroll it takes and how much movement is used to get
 * between beats — never how many thoughts are on screen at once.
 * -------------------------------------------------------------------------*/

/** Cumulative scroll thresholds, so beats can be given different durations. */
const TOTAL_WEIGHT = heroSequence.reduce((sum, beat) => sum + beat.weight, 0)

const THRESHOLDS = heroSequence.map((_, index) => {
  const before = heroSequence.slice(0, index).reduce((sum, beat) => sum + beat.weight, 0)
  return before / TOTAL_WEIGHT
})

/** How the environment stands during each beat. */
const STAGES: Record<string, HeroStage> = {
  yesterday: { mood: 'night', light: 0.04, geometry: 0, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  tomorrow: { mood: 'twilight', light: 0.12, geometry: 0, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  today: { mood: 'dawn', light: 0.78, geometry: 0, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  present: { mood: 'jade', light: 0.92, geometry: 0.12, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  pause: { mood: 'jade', light: 0.8, geometry: 0.18, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  pivot: { mood: 'jade', light: 0.66, geometry: 0.3, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  learning: { mood: 'jade', light: 0.58, geometry: 1, traces: 0, signals: false, fault: 'none', illuminate: 0 },
  building: { mood: 'jade', light: 0.5, geometry: 1, traces: 1, signals: false, fault: 'none', illuminate: 0 },
  testing: { mood: 'jade', light: 0.46, geometry: 1, traces: 1, signals: true, fault: 'none', illuminate: 0 },
  breaking: { mood: 'jade', light: 0.42, geometry: 1, traces: 1, signals: true, fault: 'active', illuminate: 0 },
  debugging: { mood: 'jade', light: 0.38, geometry: 1, traces: 1, signals: true, fault: 'isolated', illuminate: 0 },
  verifying: { mood: 'jade', light: 0.46, geometry: 1, traces: 1, signals: true, fault: 'fixed', illuminate: 0 },
  improving: { mood: 'jade', light: 0.6, geometry: 1, traces: 1, signals: true, fault: 'fixed', illuminate: 1 },
  identity: { mood: 'jade', light: 0.7, geometry: 1, traces: 1, signals: true, fault: 'none', illuminate: 1 },
}

/** Index of the beat where the writing turns from reflection to engineering. */
const PIVOT_INDEX = heroSequence.findIndex((beat) => beat.kind === 'pivot')

export type HeroChrome = {
  /** Navigation links and the résumé button may appear. */
  chrome: boolean
  /** The name may appear in the navigation — not before the identity beat. */
  name: boolean
}

export function Prologue({ onChromeChange }: { onChromeChange?: (chrome: HeroChrome) => void }) {
  const reduced = useReducedMotion()
  const compact = useIsCompact()
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)

  // Sampled finely enough that a beat boundary is never missed, and quantised
  // so that scrolling inside a beat costs nothing.
  const progress = useSectionProgress(sectionRef, { steps: 400 })

  // The active beat is the last threshold the scroll position has passed.
  const beat = useMemo(() => {
    let index = 0
    for (let i = 0; i < THRESHOLDS.length; i += 1) {
      if (progress >= THRESHOLDS[i]) index = i
    }
    return index
  }, [progress])

  // The first line arrives on its own, once, after the scene has settled.
  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), reduced ? 120 : 620)
    return () => window.clearTimeout(timer)
  }, [reduced])

  // The interface arrives in two steps: navigation once the sequence turns to
  // engineering, and the name only as the sequence concludes.
  const isFinal = beat === heroSequence.length - 1
  const showChrome = beat >= PIVOT_INDEX
  useEffect(() => {
    onChromeChange?.({ chrome: showChrome, name: isFinal })
  }, [showChrome, isFinal, onChromeChange])

  const stage = STAGES[heroSequence[beat].key]

  // Pinned distance: within the 250–350vh the brief asks for on the desktop,
  // shorter on phones so the opening never becomes a scrolling chore.
  const pinnedVh = compact ? 240 : 330

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative"
      style={{ height: `calc(${pinnedVh}svh + 100svh)` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <HeroScene stage={stage} reduced={reduced} compact={compact} />

        {/* A soft scrim under the words. Once the board lights up, fine jade
            routing runs straight through the text column; this keeps the
            typography legible without putting a visible panel behind it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(100deg, rgba(3,6,8,0.78) 0%, rgba(3,6,8,0.62) 34%, rgba(3,6,8,0.22) 62%, rgba(3,6,8,0) 82%)',
          }}
        />

        <div className="shell relative flex h-full items-center">
          <div className="relative w-full">
            {heroSequence.map((item, index) => (
              <BeatLayer
                key={item.key}
                active={entered && beat === index}
                reduced={reduced}
                interactive={item.kind === 'identity'}
              >
                {item.kind === 'philosophy' && (
                  <PhilosophyLine text={item.text} emphasis={'emphasis' in item ? item.emphasis : undefined} warm={index >= 2} />
                )}
                {item.kind === 'pivot' && <PivotLine text={item.text} />}
                {item.kind === 'verb' && <VerbLine text={item.text} />}
                {item.kind === 'identity' && <Identity />}
              </BeatLayer>
            ))}
          </div>
        </div>

        <SequenceRail beat={beat} total={heroSequence.length} />
        <ScrollAffordance visible={!isFinal && entered} first={beat === 0} />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------------------
 * A beat. Only one is visible at a time; the rest are fully transparent and
 * inert, so nothing behind the current thought can be seen, focused or read
 * out of order.
 * -------------------------------------------------------------------------*/
function BeatLayer({
  children,
  active,
  reduced,
  interactive,
}: {
  children: React.ReactNode
  active: boolean
  reduced: boolean
  interactive: boolean
}) {
  return (
    <div
      className="allow-crossfade absolute inset-x-0 top-1/2"
      // Inert whenever hidden: an invisible beat must not be tabbable, and only
      // the identity beat contains controls.
      inert={!active ? true : undefined}
      style={{
        opacity: active ? 1 : 0,
        transform: reduced
          ? 'translateY(-50%)'
          : `translateY(calc(-50% + ${active ? '0px' : '18px'})) scale(${active ? 1 : 0.985})`,
        filter: reduced ? undefined : active ? 'blur(0px)' : 'blur(7px)',
        // The handoff is deliberately asymmetric: the outgoing thought leaves
        // quickly and completely, and the incoming one only begins once the
        // frame is clear. A symmetric crossfade superimposes two sentences on
        // the same spot, which is exactly the stacked look this sequence is
        // meant to avoid.
        transition: reduced
          ? `opacity 320ms linear ${active ? '340ms' : '0ms'}`
          : active
            ? 'opacity 820ms cubic-bezier(0.22,0.61,0.36,1) 400ms, transform 1000ms cubic-bezier(0.22,0.61,0.36,1) 400ms, filter 820ms cubic-bezier(0.22,0.61,0.36,1) 400ms'
            : 'opacity 340ms cubic-bezier(0.4,0,1,1), transform 600ms cubic-bezier(0.4,0,1,1), filter 340ms cubic-bezier(0.4,0,1,1)',
        pointerEvents: active && interactive ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Voices
 * -------------------------------------------------------------------------*/

/** Serif. Reflection. */
function PhilosophyLine({ text, emphasis, warm }: { text: string; emphasis?: string; warm: boolean }) {
  const parts = useMemo(() => {
    if (!emphasis) return null
    const index = text.toLowerCase().indexOf(emphasis.toLowerCase())
    if (index === -1) return null
    return {
      before: text.slice(0, index),
      word: text.slice(index, index + emphasis.length),
      after: text.slice(index + emphasis.length),
    }
  }, [text, emphasis])

  return (
    <p
      className={`quiet-serif max-w-[16ch] text-[clamp(2.5rem,8.5vw,5.5rem)] leading-[1.05] transition-colors duration-1000 sm:max-w-[20ch] ${
        warm ? 'text-parchment' : 'text-muted'
      }`}
    >
      {parts ? (
        <>
          {parts.before}
          <span
            className="text-gold"
            style={{ textShadow: '0 0 28px rgba(228,198,132,0.35), 0 0 60px rgba(240,160,60,0.18)' }}
          >
            {parts.word}
          </span>
          {parts.after}
        </>
      ) : (
        text
      )}
    </p>
  )
}

/** Sans. The turn from reflection to work. */
function PivotLine({ text }: { text: string }) {
  return (
    <p className="max-w-[18ch] text-[clamp(1.75rem,5.5vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.025em] text-bright">
      {text}
    </p>
  )
}

/** Sans. One action, holding the frame. */
function VerbLine({ text }: { text: string }) {
  return (
    <p className="text-[clamp(2.75rem,10vw,6rem)] font-semibold leading-none tracking-[-0.04em] text-bright">
      {text}
    </p>
  )
}

/* ---------------------------------------------------------------------------
 * The conclusion of the sequence.
 * -------------------------------------------------------------------------*/
function Identity() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow mb-5 text-jade">Present</p>
      <h1 className="text-[clamp(2.25rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-bright">
        {profile.name}
      </h1>
      <p className="mt-3 text-[clamp(1.125rem,2.6vw,1.75rem)] font-medium tracking-tight text-amber">
        {profile.title}
      </p>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{profile.tagline}</p>

      <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        {profile.capabilities.map((capability, index) => (
          <li key={capability} className="flex items-center gap-3 font-mono text-[0.75rem] tracking-wide text-faint">
            {capability}
            {index < profile.capabilities.length - 1 && (
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
            )}
          </li>
        ))}
      </ul>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <a
          href="#work"
          className="inline-flex items-center gap-2 rounded-md bg-jade px-5 py-3 text-sm font-medium text-void transition-colors duration-300 hover:bg-[#5ac7a8]"
        >
          Explore my work
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href="#journey"
          className="inline-flex items-center rounded-md border border-white/15 px-5 py-3 text-sm text-muted transition-colors duration-300 hover:border-white/30 hover:text-bright"
        >
          Start from the beginning
        </a>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-6 font-mono text-[0.75rem] text-faint">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-muted"
          >
            {link.label}
          </a>
        ))}
        <a href={`mailto:${profile.email}`} className="transition-colors hover:text-muted">
          {profile.email}
        </a>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * A quiet progress rail, so the sequence reads as finite rather than endless.
 * -------------------------------------------------------------------------*/
function SequenceRail({ beat, total }: { beat: number; total: number }) {
  return (
    <div aria-hidden="true" className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-1.5 md:flex">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className="block h-px transition-all duration-700"
          style={{
            width: index === beat ? 20 : 10,
            background: index === beat ? 'var(--color-jade)' : 'rgb(148 168 205 / 0.2)',
          }}
        />
      ))}
    </div>
  )
}

/**
 * The scroll cue, and the recruiter's way out of the sequence. Both stay
 * unobtrusive; neither competes with the thought on screen.
 */
function ScrollAffordance({ visible, first }: { visible: boolean; first: boolean }) {
  return (
    <div
      className="allow-crossfade absolute inset-x-0 bottom-7 flex flex-col items-center gap-3 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
    >
      <span
        aria-hidden="true"
        className="font-mono text-[0.625rem] tracking-[0.28em] text-faint transition-opacity duration-700"
        style={{ opacity: first ? 1 : 0 }}
      >
        SCROLL
      </span>
      <a
        href="#work"
        className="font-mono text-[0.625rem] tracking-[0.2em] text-faint/70 transition-colors hover:text-muted"
      >
        SKIP TO THE WORK
      </a>
    </div>
  )
}
