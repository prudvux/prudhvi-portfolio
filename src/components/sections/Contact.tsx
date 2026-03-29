import { useState } from 'react'
import { useRevealOnScroll } from '../../hooks/useIntersectionObserver'

export default function Contact() {
  const { ref, isVisible } = useRevealOnScroll<HTMLDivElement>()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="contact" id="contact">
      <div
        ref={ref}
        className={`section-content contact-content${isVisible ? ' visible' : ''}`}
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

        <h2>
          Send a message<br />in a bottle
        </h2>
        <p className="subtitle">It will find its way to me</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" id="name" placeholder=" " autoComplete="off" />
            <label htmlFor="name">Your name</label>
          </div>
          <div className="form-group">
            <input type="email" id="email" placeholder=" " autoComplete="off" />
            <label htmlFor="email">Your email</label>
          </div>
          <div className="form-group">
            <textarea id="message" rows={3} placeholder=" " />
            <label htmlFor="message">Your message</label>
          </div>
          <button type="submit" className="send-bottle">
            <span>{submitted ? 'Message cast ✨' : 'Cast into the sea'}</span>
          </button>
        </form>
      </div>
    </section>
  )
}
