import { useRevealOnScroll, useCardReveal } from '../../../hooks/useIntersectionObserver'
import { whatIDo } from '../../../data/experience'

interface SkillCardProps {
  index: number
  skill: string
}

function SkillCard({ index, skill }: SkillCardProps) {
  const { ref, isVisible } = useCardReveal<HTMLDivElement>(index * 100)
  return (
    <div ref={ref} className={`skill-card${isVisible ? ' visible' : ''}`}>
      <span className="skill-number">0{index + 1}</span>
      <p className="skill-name">{skill}</p>
    </div>
  )
}

export default function WhatIDo() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="what-i-do" id="what-i-do">
      <div
        ref={ref}
        className={`section-content${isVisible ? ' visible' : ''}`}
      >
        <p className="section-label">Capabilities</p>
        <h2 className="section-heading">Designing clarity<br />in complex systems</h2>
        <div className="skills-grid">
          {whatIDo.map((skill, i) => (
            <SkillCard key={skill} index={i} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  )
}
