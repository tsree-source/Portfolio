import { about, education, profile } from '../data/content'
import { ChapterHeading, Section } from './Section'
import { Reveal } from './primitives'

/**
 * SECTION 13 — About.
 * First person, short, and free of the usual adjectives. The portrait slot is
 * intentionally empty: no professional photograph was supplied, and a
 * generated one would be worse than none.
 */
export function About() {
  return (
    <Section id="about" labelledBy="about-heading" tone="raised" className="border-t border-white/[0.06]">
      <div className="shell">
        <ChapterHeading id="about-heading" eyebrow="About" title={about.heading} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
          <div className="max-w-2xl space-y-5">
            {about.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph} delay={index * 0.06}>
                <p className="text-base leading-relaxed text-muted sm:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="space-y-8">
            {about.portrait && (
              <Reveal>
                <img
                  src={about.portrait}
                  alt={`${profile.name}, Hardware Engineer`}
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-xs rounded-lg border border-white/10 object-cover"
                />
              </Reveal>
            )}

            <Reveal delay={0.08}>
              <dl className="space-y-5 border-l border-white/[0.09] pl-6">
                <div>
                  <dt className="eyebrow mb-1.5">Based in</dt>
                  <dd className="text-[0.9375rem] text-bright">{profile.location}</dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1.5">Studied</dt>
                  <dd className="text-[0.9375rem] leading-snug text-bright">
                    {education.map((entry) => (
                      <span key={entry.school} className="block">
                        {entry.school.replace('University of Illinois Chicago', 'UIC')}
                        <span className="text-faint"> · {entry.period.split(' — ')[1]}</span>
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1.5">Works across</dt>
                  <dd className="text-[0.9375rem] leading-snug text-bright">
                    {profile.capabilities.join(' · ')}
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
