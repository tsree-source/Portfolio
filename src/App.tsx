import { useCallback, useState } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { Navigation } from './components/Navigation'
import { Prologue, type HeroChrome } from './components/Prologue'
import { PastSection } from './components/PastSection'
import { TurningPoint } from './components/TurningPoint'
import { DieSection } from './components/die/DieSection'
import { CurrentWorkScene } from './components/scenes/CurrentWorkScene'
import { DmaScene } from './components/scenes/DmaScene'
import { FpgaScene } from './components/scenes/FpgaScene'
import { EngineeringWorkflow } from './components/EngineeringWorkflow'
import { LabCanvas } from './components/scenes/LabCanvas'
import { JourneyTimeline } from './components/scenes/JourneyTimeline'
import { Currently, FutureSection } from './components/Currently'
import { About } from './components/About'
import { ClosingSection, Footer } from './components/ClosingSection'

/**
 * The page is a route through one engineering system rather than a stack of
 * sections.
 *
 *   the present            → the opening sequence
 *   the past               → where the curiosity started
 *   the turn               → down through the layers into hardware
 *   the die                → the whole job, and its functional regions
 *   current work           → the checking loop, running
 *   verify → design        → DMA, then the 5G receiver chain
 *   method · lab           → how the work is done, and what it was tried on
 *   experience             → one line through five years
 *   today · tomorrow · who → and back to the present
 *
 * Motion is loaded through LazyMotion with the `domAnimation` feature set and
 * `m` components, keeping the animation runtime out of the critical bundle;
 * `strict` makes a stray full `motion` import fail loudly.
 */
export default function App() {
  const [heroChrome, setHeroChrome] = useState<HeroChrome>({ chrome: false, name: false })

  // Stable identity, so the effect inside Prologue does not re-fire each render.
  const handleChromeChange = useCallback((next: HeroChrome) => {
    setHeroChrome((current) =>
      current.chrome === next.chrome && current.name === next.name ? current : next,
    )
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <Navigation showChrome={heroChrome.chrome} showName={heroChrome.name} />

      <main id="main">
        <Prologue onChromeChange={handleChromeChange} />
        <PastSection />
        <TurningPoint />
        <DieSection />
        <CurrentWorkScene />
        <DmaScene />
        <FpgaScene />
        <EngineeringWorkflow />
        <LabCanvas />
        <JourneyTimeline />
        <Currently />
        <FutureSection />
        <About />
        <ClosingSection />
      </main>

      <Footer />
    </LazyMotion>
  )
}
