import { useRevealOnScroll, useCardReveal } from '../../../hooks/useIntersectionObserver'
import { experiences } from '../../../data/experience'
import type { Experience } from '../../../types'

interface ExperienceItemProps {
  experience: Experience
  delay: number
}

function ExperienceItem({ experience, delay }: ExperienceItemProps) {
  const { ref, isVisible } = useCardReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} className={`experience-item${isVisible ? ' visible' : ''}`}>
      <p className="experience-role">{experience.role}</p>
      <p className="experience-company">{experience.company}</p>
    </div>
  )
}

export default function ExperienceSnapshot() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="experience-snapshot" id="experience">
      <div
        ref={ref}
        className={`section-content${isVisible ? ' visible' : ''}`}
      >
        <p className="section-label">Experience</p>
        <h2 className="section-heading">
          3+ years across product,<br />engineering, and UX
        </h2>
        <div className="experience-grid">
          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.id} experience={exp} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  )
}
