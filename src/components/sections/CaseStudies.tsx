import { useState } from 'react'
import { useRevealOnScroll } from '../../hooks/useIntersectionObserver'
import Shell from '../ui/Shell'
import { caseStudies } from '../../data/caseStudies'

export default function CaseStudies() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()
  const [openId, setOpenId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <section className="case-studies" id="case-studies">
      <div
        ref={ref}
        className={`section-content${isVisible ? ' visible' : ''}`}
      >
        <p className="section-label">Deep Dives</p>
        <h2 className="section-heading">Open the Shells</h2>
        <div className="shells-container">
          {caseStudies.map(cs => (
            <Shell
              key={cs.id}
              caseStudy={cs}
              isOpen={openId === cs.id}
              onToggle={() => handleToggle(cs.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
