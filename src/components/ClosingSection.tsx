import { closing, profile, resumeVariants, socialLinks } from '../data/content'
import { ScenicBackdrop } from './ScenicBackdrop'
import { Reveal } from './primitives'

/**
 * FINAL — Return to the present.
 * The opening landscape comes back, mirrored, with the engineering story now
 * behind it. Kept extremely clean: three lines, one question, four ways to
 * make contact.
 */
export function ClosingSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-white/[0.06] py-28 sm:py-36"
    >
      <ScenicBackdrop phase={1} circuit={0.25} mirrored />

      <div className="shell relative">
        <ul className="space-y-2">
          {closing.lines.map((line, index) => (
            <Reveal as="li" key={line} delay={index * 0.1}>
              <p className="quiet-serif text-[clamp(1.5rem,4.5vw,2.75rem)] text-muted">{line}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.3}>
          <p className="mt-8 quiet-serif text-[clamp(1.75rem,5vw,3.25rem)] text-gold">{closing.resolve}</p>
        </Reveal>

        <div className="my-14 hairline" />

        <Reveal delay={0.1}>
          <h2
            id="contact-heading"
            className="text-[clamp(1.75rem,5vw,3rem)] font-semibold leading-tight tracking-[-0.025em] text-bright"
          >
            {closing.cta}
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-md bg-amber px-5 py-3 text-sm font-medium text-void transition-colors duration-300 hover:bg-[#ffb85c]"
            >
              {profile.email}
            </a>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-white/15 px-5 py-3 text-sm text-muted transition-colors duration-300 hover:border-white/30 hover:text-bright"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10">
            <p className="eyebrow mb-3">Resume</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {resumeVariants.map((variant) => (
                <li key={variant.label}>
                  <a
                    href={variant.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.8125rem] text-signal transition-colors hover:text-bright"
                  >
                    {variant.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="shell flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[0.75rem] text-faint">
          {profile.name}
          <span aria-hidden="true" className="mx-2">
            ·
          </span>
          {profile.title}
        </p>
        <p className="font-mono text-[0.75rem] text-faint">
          Today is a gift. What we build with it is the present.
        </p>
      </div>
    </footer>
  )
}
