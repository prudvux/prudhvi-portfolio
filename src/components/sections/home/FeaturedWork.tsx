import { useRevealOnScroll } from '../../../hooks/useIntersectionObserver'
import IslandCard from '../../ui/IslandCard'
import { projects } from '../../../data/projects'

export default function FeaturedWork() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="projects featured-work" id="featured-work">
      <div
        ref={ref}
        className={`section-content${isVisible ? ' visible' : ''}`}
      >
        <p className="section-label">Selected Work</p>
        <h2 className="section-heading">Featured Work</h2>
        <p className="section-intro">
          A curated set of projects where design meets impact —<br />
          from research to real-world execution.
        </p>
        <div className="islands-grid">
          {projects.map(project => (
            <IslandCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
