import { useScrollTracking } from './hooks/useScrollTracking'
import CursorSystem from './components/cursor/CursorSystem'
import Nav from './components/layout/Nav'
import DepthIndicator from './components/layout/DepthIndicator'
import Footer from './components/layout/Footer'
import BubblesLayer from './components/effects/BubblesLayer'
import Hero from './components/sections/Hero'
import Projects from './components/sections/Projects'
import CaseStudies from './components/sections/CaseStudies'
import About from './components/sections/About'
import Contact from './components/sections/Contact'
import ZoneTransition from './components/ui/ZoneTransition'

export default function App() {
  const { navHidden, activeSection } = useScrollTracking()

  return (
    <>
      <CursorSystem />
      <BubblesLayer />
      <Nav hidden={navHidden} />
      <DepthIndicator activeSection={activeSection} />

      <main>
        <Hero />
        <ZoneTransition variant="shore-to-shallow" />
        <Projects />
        <ZoneTransition variant="shallow-to-deep" />
        <CaseStudies />
        <ZoneTransition variant="deep-to-cove" />
        <About />
        <ZoneTransition variant="cove-to-contact" />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
