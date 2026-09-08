# Tejaswi Sreerangam — Hardware Engineer

A single-page portfolio built around one idea: *today is a gift, and what we build
with it is the present*. The philosophy sets the atmosphere; the engineering
evidence carries the credibility.

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the production build
```

`dist/` is fully static and uses relative asset paths, so it deploys as-is to
Netlify, Vercel, GitHub Pages, S3, or any static host.

---

## Before you publish — open items

Everything below is tracked in code as `openItems` at the top of
[`src/data/content.ts`](src/data/content.ts). Nothing unverified is rendered.

### 1. Set your profile URLs

`profile.links` in `src/data/content.ts` still holds `'#'` for GitHub and
LinkedIn. **While they are `'#'`, those links are not rendered at all** — a dead
"GitHub" link reads worse than no mention of GitHub. Fill them in and they
appear in the hero and the closing section automatically.

### 2. Résumé conflicts to resolve

The four source résumés disagree in four places. The site takes the conservative
option in each case rather than picking a version silently.

| # | Conflict | Sources | What the site does now |
|---|----------|---------|------------------------|
| 1 | **InnoIndustry job title** | "Volunteer Verification Engineer" (FPGA_RTL, Verification) vs "Volunteer Hardware Engineer" (Validation, Automotive) | Shows the neutral "Volunteer Hardware / Verification Engineer". Replace with the official title. |
| 2 | **Johnson Controls scope** | "20+ system designs" / "20 multi-story deployments" / "20 multi-story floor plans" / "20+ embedded systems" | Shows "20+ system deployments". These are not wording variants — "multi-story floor plans" implies building-scale facility systems, which is a different claim from "embedded systems designs". Pick the accurate one. |
| 3 | **CAN Bus Sensor Node volume** | "30+ CAN transactions" analysed (Validation) vs "1,000 CAN-frame tests" (Automotive) — same project, same Feb–Apr 2025 dates | **No figure is shown.** The test is described qualitatively until the real number is confirmed. |
| 4 | **DMA transactions** | "1,000+" (FPGA_RTL) vs "1,000" (Verification) | Shows "1,000" (the lower, safer figure). |

### 3. Claims requested in the brief but absent from every résumé

These are **not rendered anywhere**. Add them to `content.ts` only with
supporting evidence.

- **KPIT Sparkle 2022 (Top 30)** — appears in no résumé. Only the Government of
  India 5G Hackathon Top-30 Pan India placement is documented.
- **iCreate startup incubation** — appears in no résumé.
- **Sub-200 ms accident detection** — no résumé documents it. Only the ~2 s
  end-to-end emergency trigger across 20+ simulated scenarios is documented, and
  only that is shown. If you later have evidence that local detection was
  <200 ms *and* end-to-end triggering was ~2 s, add them as two clearly separate
  metrics — never merged.
- **ESP32 / MCP2515** — not named in any résumé. The Smart Accident Management
  System is described with the hardware that *is* documented (MPU-6050 IMU, GPS,
  OBD-II, Bluetooth) plus a generic "embedded controller".
- **"Horizon Tech"** — the venture name comes from the design brief, not the
  résumés, which list this as a project (Jun 2021 – May 2023). It is shown as a
  secondary label under the project name.

### 4. Deliberate omissions

- **Portrait** — the About section has a portrait slot (`about.portrait`) that is
  `null`. No photograph was supplied, and a generated one would be worse than
  none, so the section is composed to look complete without it. Set it to an
  image path in `public/` to enable it.
- **Phone number** — present on the résumés, deliberately not published on a
  public page. Add it to the closing section if you want it.

### 5. Résumé downloads

One **Resume** button, two audience-appropriate cuts — never four competing
identities:

| Shown as | File served |
|---|---|
| RTL & Verification | `public/resume/Tejaswi_Sreerangam_RTL_Verification.pdf` (from the Verification résumé) |
| Hardware Validation | `public/resume/Tejaswi_Sreerangam_Hardware_Validation.pdf` (from the Validation résumé) |

The FPGA_RTL and Automotive résumés are not exposed on the site; their content is
folded into the page itself. Replace either PDF in place to update a download.

---

## How the content is organised

**All copy and every factual claim lives in
[`src/data/content.ts`](src/data/content.ts).** Components contain no prose.
Each entry is traceable to a source résumé, and conflicts and placeholders are
flagged inline with `CONFLICT:` / `PLACEHOLDER:` comments. To change what the
site says, edit that one file.

Résumé bullets were rewritten for a portfolio voice; **figures were not** —
every number on the page appears exactly as documented.

## Structure

```
src/
  App.tsx                    section order, motion provider
  data/content.ts            all content + source traceability
  hooks/
    useMotionPreference.ts   reduced-motion and compact-viewport detection
    useActiveSection.ts      nav chapter tracking (single IntersectionObserver)
    useSectionProgress.ts    scroll progress through a pinned section
  components/
    Navigation.tsx           sticky nav, active chapter, résumé menu, mobile sheet
    Prologue.tsx             §1  the present — the pinned opening sequence
    HeroScene.tsx                the environment it transforms through
    scenery.ts                   shared ridge / routing / waveform geometry
    system/
      PinnedScene.tsx            pinned scene + scroll-as-state-machine
      annotations.tsx            the non-card vocabulary
      palette.ts                 colour semantics, as SVG literals
    die/
      EngineeringDie.tsx         the abstract floorplan
      DieSection.tsx             walking the die + capability index
    scenes/
      CurrentWorkScene.tsx       golden model vs RTL, then the 1W2R memory
      DmaScene.tsx               architecture walk → DUT → UVM environment
      FpgaScene.tsx              scroll-linked horizontal receiver chain
      LabCanvas.tsx              schematic canvas of experiments
      JourneyTimeline.tsx        signal-line timeline (education included)
    PastSection.tsx          §2  origin story + system architecture
    TurningPoint.tsx         §3  the conceptual zoom into hardware
    Capabilities.tsx         §4  Design → Verify → Validate
    CurrentWork.tsx          §5  Hybrid Beamforming RTL verification
    SelectedWork.tsx         §6  three case studies
    ProjectCaseStudy.tsx         recruiter view + expandable engineer view
    EngineeringWorkflow.tsx  §7  method
    Lab.tsx                  §8  smaller builds
    ExperienceTimeline.tsx   §9  experience + §10 education
    Currently.tsx            §11 presently + §12 the future
    About.tsx                §13 about
    ClosingSection.tsx       return to the present + contact + footer
    ScenicBackdrop.tsx       the landscape that becomes circuitry
    ArchitectureDiagram.tsx  reusable signal-path diagrams
    WaveformVisual.tsx       digital timing figure
    MetricCard.tsx           measured results, count up once
    Section.tsx              section shell + chapter heading
    primitives.tsx           Reveal, Tag, Eyebrow
```

## Design notes

- **Palette.** Navy/near-black ground throughout. Warm amber, sunrise and gold
  carry the past; electric blue and violet carry the present and the technical
  sections; deep violet opens the future. Defined once as tokens in
  `src/index.css`.
- **Type.** Inter for everything load-bearing, JetBrains Mono for technical
  labels and figures, Instrument Serif only for the philosophical lines — never
  for content a recruiter needs to read quickly.
- **Diagrams** are semantic HTML (ordered lists) rather than pictures, so they
  stack on narrow screens, scale with text size, and read in order to a screen
  reader. Only the waveform and the landscape are SVG.
- **The landscape** is a bottom-anchored band whose height follows its own
  width, so it is never stretched or magnified — a wide screen gets a deep
  range, a phone gets a low horizon and plenty of sky. `phase` drives the
  sunrise, `circuit` drives how far the ridgelines have resolved into PCB
  routing. The same component serves the opening, the turning point and the
  close.

## The opening sequence

One pinned scene, driven entirely by scroll position, with **exactly one thought
on screen at a time**. Fourteen beats: four philosophical lines, a held pause,
the pivot into engineering, seven verbs, and the identity as the conclusion.

The environment is a function of the beat, so the scene is one continuous thing
being transformed rather than a stack of slides:

| Beat | Environment |
|---|---|
| Yesterday is history. | near-black, dark jade, ridges barely visible |
| Tomorrow is a mystery. | shifts to twilight plum |
| Today is a gift. | warm gold rises from the horizon |
| …called the **present**. | jade light emerges; "present" carries a restrained gold glow |
| *(pause)* | the quote is gone; nothing has replaced it yet |
| So what am I doing with mine? | typography turns from serif to sans |
| Learning. | the ridgelines resolve into straight segments |
| Building. | routing draws itself along them |
| Testing. | signals run through the routing |
| Breaking. | an observed waveform stops matching the expected one |
| Debugging. | everything else dims; the failing path is isolated |
| Verifying. | the waveform comes back into alignment |
| Improving. | the whole board lights in jade and gold |
| Tejaswi Sreerangam | the identity, as the conclusion |

Beats are weighted, so the philosophy lingers and the verbs move at a working
pace. The pin lasts **330vh on the desktop and 240vh on phones**.

Three details worth knowing before editing it:

- **The handoff is deliberately asymmetric.** The outgoing line leaves over
  340ms; the incoming one does not begin until 400ms. A symmetric crossfade
  superimposes two sentences on the same spot, which is the stacked look this
  sequence exists to avoid. Verified: never more than one line above 15%
  opacity at any point in a transition.
- **There is no "show everything" fallback.** Phones and reduced-motion users
  get the same sequence, one thought at a time. What changes is the pin length
  and how much movement is used — reduced motion gets opacity-only crossfades
  via the `.allow-crossfade` opt-in, never a stacked list.
- **The navigation is held back.** Links appear at the pivot; the name appears
  only when the identity does, so it is never shown before the sequence
  introduces it. Hidden controls are `inert`, not merely transparent, and the
  skip link is always available.

`useSectionProgress` measures scroll **synchronously** rather than deferring to
`requestAnimationFrame`. The deferred version froze the sequence anywhere frames
are throttled — a background tab, an inactive embedded view — because a queued
frame that never runs drops every later scroll event. The handler only reads
layout and never writes it, and progress is quantised so scrolling within one
beat causes no re-render.

## Chapters as scenes, not sections

Everything after the opening is built on `PinnedScene`: a chapter stays pinned
while the reader scrolls through a fixed sequence of **states**. Scroll position
*is* the state, so sequences are deterministic and reverse cleanly — scrolling
back up returns to exactly the state you came from, with no animation queue to
unwind. Everything a scene renders is a function of `state`, which is what keeps
the motion explanatory: a thing moves because the system changed state, not
because time passed.

| Chapter | States |
|---|---|
| The die | overview → each of six functional regions → the whole die |
| Current work | idle → stimulus → **match** → **mismatch** → memory → ports |
| DMA | architecture walk (CPU → MMIO → FSM → addressing → transfer) → *the design becomes the DUT* → coverage → result |
| FPGA 5G | INPUT → LDPC → MMSE → CORDIC/QR → OUTPUT → synthesis → timing |
| Experience | one interconnect advancing through 2021 → 2026 |

**The die** is the signature object: an original abstract floorplan (invented,
not traced from any real part) whose six blocks are dimensions of the same job.
Hovering or focusing a block illuminates it and its interconnect; scroll walks
the die block by block; clicking follows that region to its chapter. It is
exploration and secondary navigation at once, without ever becoming a row of
buttons.

**The DMA shared-element transition** is the clearest example of spatial
continuity: at the verification state the entire architecture shrinks in place
and the UVM environment assembles around that same object. Nothing is swapped
out, so the reader keeps hold of what is being verified. The measured results —
1,000 transactions, 95% coverage, 6 defects — arrive last, as the outcome of the
process rather than as a badge row.

### Colour semantics

One meaning per colour, everywhere:

| | |
|---|---|
| **Jade** `#45b394` | nominal signal, information flow |
| **Gold** `#e8c77a` | selected, active, correct, "present" |
| **Vermilion** `#e2603f` | failure, mismatch, fault |
| **Ink** `#46566d` | inactive architecture |

A vermilion line in a DMA regression means the same thing as a vermilion
waveform in verification.

They exist twice on purpose — as CSS custom properties for HTML/Tailwind, and as
literals in `components/system/palette.ts` for SVG. A `fill` or `stroke` written
as `var(--color-x)` cannot be transitioned reliably: the browser resolves the
custom property a commit later than it interpolates, so an animated element can
render the previous state's colour. Anything in SVG that transitions uses the
literals. Keep the two in step.

### Non-card composition

The audit that started this redesign counted 8 of 13 sections using the same
`heading → prose → grid of panels` shape, with ~15 bordered containers. That
structure is now down to 6, and the replacement vocabulary lives in
`components/system/annotations.tsx`: labels with leader lines, figures beside
the thing they measure, terms as annotations. A container is used only where the
content genuinely behaves as a discrete object.

## Motion

One vocabulary: a short rise and a fade, once, never repeated on scroll-back.

- `prefers-reduced-motion` is respected in two layers: a global CSS override
  that neutralises every animation and transition, and a JS hook that makes
  components render genuinely static alternatives rather than just skipping a
  transition. The one deliberate exception is `.allow-crossfade`, which keeps a
  320ms opacity-only fade in the opening — cutting instantly between thoughts
  loses the sense of one replacing another and reads as a glitch.
- Below 768px the turning point falls back to a static layout, so phones get no
  second sticky stage. The opening keeps its sequence everywhere.
- Framer Motion is loaded through `LazyMotion` with the `domAnimation` feature
  set and `m` components, keeping the animation runtime out of the critical
  bundle. `strict` mode makes a stray full `motion` import fail loudly.

## Accessibility

Verified on the running site: one `h1`, no heading-level skips across 45
headings, every button and link has an accessible name, no image without `alt`,
no horizontal overflow. Plus a skip link, visible focus rings on everything
focusable, `aria-expanded`/`aria-controls` on every disclosure, `aria-current`
on the active chapter, Escape and click-outside handling on both menus, and
`inert` on off-screen panels so hidden controls cannot be focused.
