import type { CaseStudy } from '../../types'
import { useCardReveal } from '../../hooks/useIntersectionObserver'

interface ShellProps {
  caseStudy: CaseStudy
  isOpen: boolean
  onToggle: () => void
}

export default function Shell({ caseStudy, isOpen, onToggle }: ShellProps) {
  const { ref, isVisible } = useCardReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={['shell', isOpen ? 'open' : '', isVisible ? 'visible' : ''].filter(Boolean).join(' ')}
    >
      <div className="shell-header" onClick={onToggle}>
        <div className="shell-header-left">
          <span className="shell-number">{caseStudy.number}</span>
          <span className="shell-title">{caseStudy.title}</span>
        </div>
        <div className="shell-toggle">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 1v12M1 7h12" />
          </svg>
        </div>
      </div>
      <div className="shell-content">
        <div className="shell-inner">
          <div className="shell-meta">
            <div className="shell-meta-item">
              <span>Role</span>
              <strong>{caseStudy.meta.role}</strong>
            </div>
            <div className="shell-meta-item">
              <span>Duration</span>
              <strong>{caseStudy.meta.duration}</strong>
            </div>
            <div className="shell-meta-item">
              <span>Impact</span>
              <strong>{caseStudy.meta.impact}</strong>
            </div>
          </div>
          <p className="shell-description">{caseStudy.description}</p>
        </div>
      </div>
    </div>
  )
}
