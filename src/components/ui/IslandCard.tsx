import type { Project } from '../../types'
import { useCardReveal } from '../../hooks/useIntersectionObserver'

interface IslandCardProps {
  project: Project
}

export default function IslandCard({ project }: IslandCardProps) {
  const { ref, isVisible } = useCardReveal<HTMLDivElement>(project.delay)

  return (
    <div
      ref={ref}
      className={`island-card${isVisible ? ' visible' : ''}`}
    >
      <div className="card-image-area">
        <span className="card-icon">{project.emoji}</span>
      </div>
      <span className="card-tag">{project.tag}</span>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-desc">{project.description}</p>
      <a href="#" className="card-link">
        Explore island{' '}
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </a>
    </div>
  )
}
