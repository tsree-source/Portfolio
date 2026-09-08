import { useEffect, useRef, useState } from 'react'
import { navItems, profile, resumeVariants } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const NAV_IDS = navItems.map((item) => item.id)

/**
 * The navigation is held back while the opening sequence runs: links appear
 * once the sequence turns to engineering, and the name only once the identity
 * has been introduced on its own terms. Everything stays keyboard-reachable
 * through the skip link, and hidden controls are made inert rather than merely
 * transparent.
 */
export function Navigation({ showChrome = true, showName = true }: { showChrome?: boolean; showName?: boolean }) {
  const active = useActiveSection(NAV_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile sheet while it is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <>
      <a href="#main" className="sr-only-focusable">
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && showChrome
            ? 'border-b border-white/[0.07] bg-void/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-4">
          <a
            href="#home"
            inert={!showName ? true : undefined}
            className="group flex shrink-0 items-baseline gap-2.5 whitespace-nowrap text-sm font-semibold tracking-tight text-bright transition-opacity duration-1000"
            style={{ opacity: showName ? 1 : 0 }}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber transition-colors duration-500 group-hover:bg-signal"
            />
            {profile.name}
            <span className="hidden font-mono text-[0.6875rem] font-normal tracking-[0.14em] text-faint xl:inline">
              HARDWARE ENGINEER
            </span>
          </a>

          {/* Desktop navigation */}
          <ul
            inert={!showChrome ? true : undefined}
            className="hidden items-center gap-1 transition-opacity duration-1000 lg:flex"
            style={{ opacity: showChrome ? 1 : 0 }}
          >
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-md px-3 py-2 text-[0.8125rem] transition-colors duration-300 ${
                      isActive ? 'text-bright' : 'text-faint hover:text-muted'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-px h-px origin-left bg-signal transition-transform duration-500 ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div
            inert={!showChrome ? true : undefined}
            className="flex items-center gap-2 transition-opacity duration-1000"
            style={{ opacity: showChrome ? 1 : 0 }}
          >
            <ResumeMenu />
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-muted transition-colors hover:text-bright lg:hidden"
            >
              <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
                {mobileOpen ? (
                  <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M2 5h12" strokeLinecap="round" />
                    <path d="M2 11h12" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet — deliberately plain: a list of chapters, nothing else. */}
      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-void/97 pt-16 backdrop-blur-xl lg:hidden">
          <nav aria-label="Sections" className="shell py-8">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.id} className="border-b border-white/[0.06]">
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`flex items-center justify-between py-4 text-lg ${
                      active === item.id ? 'text-signal' : 'text-muted'
                    }`}
                  >
                    {item.label}
                    <span aria-hidden="true" className="font-mono text-xs text-faint">
                      {String(navItems.indexOf(item) + 1).padStart(2, '0')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-block font-mono text-sm text-faint"
              onClick={() => setMobileOpen(false)}
            >
              {profile.email}
            </a>
          </nav>
        </div>
      )}
    </>
  )
}

/**
 * One Resume button. It opens two audience-appropriate cuts of a single
 * résumé — never four competing identities.
 */
function ResumeMenu() {
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onClick = (event: MouseEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 rounded-md border border-amber/35 bg-amber/[0.08] px-3.5 py-2 text-[0.8125rem] font-medium text-amber transition-colors duration-300 hover:border-amber/60 hover:bg-amber/[0.14]"
      >
        Resume
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 4l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] w-60 overflow-hidden rounded-lg border border-white/10 bg-ink-3 shadow-2xl shadow-black/50">
          <p className="eyebrow border-b border-white/[0.07] px-4 py-3">Same engineer, two cuts</p>
          <ul>
            {resumeVariants.map((variant) => (
              <li key={variant.label}>
                <a
                  href={variant.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="block text-sm text-bright">{variant.label}</span>
                  <span className="mt-0.5 block text-xs text-faint">{variant.hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
