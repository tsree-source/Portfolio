import { past } from '../data/content'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { MetricCard } from './MetricCard'
import { ChapterHeading, Section } from './Section'
import { Reveal, TagRow } from './primitives'

/**
 * SECTION 2 — The Past.
 * The origin story, not a second copy of the résumé: what the problem was,
 * what was built, and how far it travelled.
 */
export function PastSection() {
  return (
    <Section id="journey" labelledBy="journey-heading" className="border-t border-white/[0.06]">
      {/* Warm ground — this chapter belongs to the sunrise end of the palette. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 12% 0%, rgba(240,160,60,0.09) 0%, rgba(124,44,64,0.05) 38%, rgba(4,6,13,0) 70%)',
        }}
      />

      <div className="shell relative">
        <Reveal>
          <p className="quiet-serif max-w-3xl text-[clamp(1.5rem,3.6vw,2.5rem)] text-gold">{past.opener}</p>
        </Reveal>

        <div className="my-14 hairline" />

        <ChapterHeading
          id="journey-heading"
          eyebrow="The past · 2021 — 2023"
          accent="amber"
          title={
            <>
              {past.project}
              <span className="mt-3 block text-lg font-normal tracking-normal text-faint sm:text-xl">
                {past.venture}
              </span>
            </>
          }
        />

        <div className="mt-8 max-w-3xl space-y-5">
          {past.body.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.05 * index}>
              <p className="text-base leading-relaxed text-muted sm:text-lg">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8">
            <TagRow tags={past.stack} tone="warm" />
          </div>
        </Reveal>

        {/* Subsystems + system architecture */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <h3 className="eyebrow mb-6">Four subsystems, one decision</h3>
            </Reveal>
            <ul className="space-y-3">
              {past.subsystems.map((subsystem, index) => (
                <Reveal as="li" key={subsystem.name} delay={index * 0.06}>
                  <div className="panel flex items-baseline justify-between gap-4 px-4 py-3.5">
                    <span className="font-mono text-sm text-bright">{subsystem.name}</span>
                    <span className="text-right text-[0.8125rem] leading-snug text-faint">{subsystem.role}</span>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <div className="panel mt-8 border-amber/20 px-5 py-5">
                <h4 className="text-sm font-semibold text-amber">{past.detection.heading}</h4>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{past.detection.body}</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <ArchitectureDiagram
              title="Signal path — vehicle to emergency response"
              accent="amber"
              nodes={past.flow.map((label, index) => ({
                label,
                emphasis: index === 6,
              }))}
            />
          </Reveal>
        </div>

        {/* Measured results */}
        <div className="mt-20">
          <Reveal>
            <h3 className="eyebrow mb-6">What was measured</h3>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {past.metrics.map((metric, index) => (
              <Reveal key={metric.label} delay={index * 0.07}>
                <MetricCard metric={metric} tone="amber" />
              </Reveal>
            ))}
          </div>
        </div>

        {/* Where the project went next */}
        <div className="mt-24">
          <Reveal>
            <h3 className="text-2xl font-semibold tracking-tight text-bright sm:text-3xl">
              {past.evolution.heading}
            </h3>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{past.evolution.body}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10">
              <ArchitectureDiagram
                orientation="horizontal"
                accent="amber"
                nodes={past.evolution.stages.map((label) => ({ label }))}
              />
            </div>
          </Reveal>
        </div>

        {/* Recognition, told as distance travelled rather than as badges */}
        <div className="mt-24">
          <Reveal>
            <h3 className="eyebrow mb-8">How far it travelled</h3>
          </Reveal>

          <ol className="relative space-y-8 border-l border-white/[0.08] pl-8">
            {past.milestones.map((milestone, index) => (
              <Reveal as="li" key={milestone.title} delay={index * 0.08}>
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full border border-amber/50 bg-void"
                />
                <p className="font-mono text-sm text-amber">{milestone.detail}</p>
                <p className="mt-1.5 text-lg font-medium tracking-tight text-bright">{milestone.title}</p>
                <p className="mt-1 text-[0.875rem] leading-snug text-faint">{milestone.note}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
