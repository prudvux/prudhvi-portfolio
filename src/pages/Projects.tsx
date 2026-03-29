import CaseStudies from '../components/sections/CaseStudies'
import { useRevealOnScroll } from '../hooks/useIntersectionObserver'
import IslandCard from '../components/ui/IslandCard'
import { projects } from '../data/projects'
import ZoneTransition from '../components/ui/ZoneTransition'

export default function Projects() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <>
      <section className="projects" id="projects" style={{ paddingTop: '10rem' }}>
        <div
          ref={ref}
          className={`section-content${isVisible ? ' visible' : ''}`}
        >
          <p className="section-label">All Work</p>
          <h2 className="section-heading">Projects</h2>
          <div className="islands-grid">
            {projects.map(project => (
              <IslandCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      <ZoneTransition variant="shallow-to-deep" />
      <CaseStudies />
    </>
  )
}
