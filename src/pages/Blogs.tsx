import { useRevealOnScroll } from '../hooks/useIntersectionObserver'

export default function Blogs() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <section
      className="contact"
      style={{
        background: 'linear-gradient(180deg, var(--white) 0%, var(--mist) 100%)',
        paddingTop: '12rem',
      }}
    >
      <div
        ref={ref}
        className={`section-content contact-content${isVisible ? ' visible' : ''}`}
      >
        <div className="bottle-icon">
          <svg viewBox="0 0 60 60" fill="none" stroke="var(--ocean)" strokeWidth="1.2">
            <path d="M20 10 h20 v8 l8 12 v20 c0 5-4 8-8 8 H20 c-4 0-8-3-8-8 V30 l8-12 V10z" />
            <path d="M22 8 h16 v2 H22z" fill="var(--seafoam)" stroke="none" opacity="0.4" />
            <path d="M16 36 c6-2 12 2 18-2 s10 0 10-2" opacity="0.3" />
            <line x1="30" y1="18" x2="30" y2="30" strokeDasharray="2 3" opacity="0.4" />
          </svg>
        </div>
        <h2>Thoughts &amp;<br />Writings</h2>
        <p className="subtitle">Stories from the deep — coming soon</p>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: 'var(--deep-blue)',
            opacity: 0.5,
            marginTop: '1rem',
          }}
        >
          Articles on UX, AI, and the craft of design are on their way.
        </p>
      </div>
    </section>
  )
}
