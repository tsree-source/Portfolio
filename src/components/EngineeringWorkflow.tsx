import { workflow } from '../data/content'
import { ChapterHeading, Section } from './Section'
import { Reveal } from './primitives'

/**
 * SECTION 7 — How I engineer.
 *
 * The loop that connects RTL verification and physical hardware validation
 * into one method. Rendered as an ordered list on a single spine so it reads
 * as a process rather than a set of unrelated cards.
 */
export function EngineeringWorkflow() {
  return (
    <Section labelledBy="workflow-heading" tone="raised" className="border-t border-white/[0.06]">
      <div className="shell">
        <ChapterHeading
          id="workflow-heading"
          eyebrow="Method"
          accent="violet"
          title="How I approach hardware problems."
          subtitle="The same loop applies whether the thing under test is an RTL block or a board on the bench."
        />

        <ol className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {workflow.map((step, index) => (
            <Reveal as="li" key={step.stage} delay={(index % 2) * 0.06}>
              <div className="group relative border-l border-white/[0.09] pl-6 transition-colors duration-500 hover:border-violet/40">
                <span
                  aria-hidden="true"
                  className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-white/25 transition-colors duration-500 group-hover:bg-violet"
                />
                <div className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-mono text-[0.625rem] text-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-bright">{step.stage}</h3>
                </div>

                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{step.question}</p>

                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {step.lines.map((line) => (
                    <li key={line} className="text-[0.8125rem] text-faint">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
