import { useRevealOnScroll } from '../../hooks/useIntersectionObserver'
import IslandCard from '../ui/IslandCard'
import { projects } from '../../data/projects'

export default function Projects() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="projects" id="projects">
      <div
        ref={ref}
        className={`section-content${isVisible ? ' visible' : ''}`}
      >
        <p className="section-label">Selected Work</p>
        <h2 className="section-heading">Islands of Creation</h2>
        <div className="islands-grid">
          {projects.map(project => (
            <IslandCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
