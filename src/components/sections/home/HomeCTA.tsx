import { Link } from 'react-router-dom'
import { useRevealOnScroll } from '../../../hooks/useIntersectionObserver'

export default function HomeCTA() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section className="home-cta" id="home-cta">
      <div
        ref={ref}
        className={`section-content home-cta-content${isVisible ? ' visible' : ''}`}
      >
        <div className="bottle-icon">
          <svg viewBox="0 0 60 60" fill="none" stroke="var(--ocean)" strokeWidth="1.2">
            <path d="M24 8 h12 v6 c6 2 10 8 10 18 v12 c0 4-4 8-8 8 H22 c-4 0-8-4-8-8 V32 c0-10 4-16 10-18 V8z" />
            <path d="M26 6 h8 v2 h-8z" fill="var(--seafoam)" stroke="none" opacity="0.5" />
            <path d="M18 38 c4-3 8 0 12-3 s8 0 12-3" opacity="0.4" />
            <path d="M18 42 c4-3 8 0 12-3 s8 0 12-3" opacity="0.25" />
            <rect x="25" y="22" width="10" height="8" rx="1" fill="var(--sand)" stroke="none" opacity="0.4" />
          </svg>
        </div>
        <h2>Let&apos;s build something<br />meaningful together</h2>
        <Link to="/contact" className="home-cta-btn">
          Contact Me
        </Link>
      </div>
    </section>
  )
}
