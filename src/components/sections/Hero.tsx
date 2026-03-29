import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import WaterCanvas from '../effects/WaterCanvas'
import NodeCanvas from '../effects/NodeCanvas'

export default function Hero() {
  const particlesRef  = useRef<HTMLDivElement>(null)
  const headlineRef   = useRef<HTMLHeadingElement>(null)
  const [headlineRipples, setHeadlineRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const rippleIdRef   = useRef(0)

  // Floating particles
  useEffect(() => {
    const container = particlesRef.current!
    const particles: HTMLDivElement[] = []
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 6 + 3
      p.style.width  = `${size}px`
      p.style.height = `${size}px`
      p.style.left   = `${Math.random() * 100}%`
      p.style.animationDuration = `${Math.random() * 15 + 10}s`
      p.style.animationDelay    = `${Math.random() * 10}s`
      container.appendChild(p)
      particles.push(p)
    }
    return () => particles.forEach(p => p.remove())
  }, [])

  // Headline distortion ripple on hover
  const handleHeadlineMove = useCallback((e: React.MouseEvent<HTMLHeadingElement>) => {
    const id = ++rippleIdRef.current
    const rect = headlineRef.current!.getBoundingClientRect()
    setHeadlineRipples(prev => [
      ...prev.slice(-4),
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    setTimeout(() => setHeadlineRipples(prev => prev.filter(r => r.id !== id)), 900)
  }, [])

  return (
    <section className="hero hero--nodes" id="hero">
      {/* Atmospheric background */}
      <div className="hero-bg">
        <div className="light-rays" />
        <div className="fog fog-1" />
        <div className="fog fog-2" />
        <div className="particles-container" ref={particlesRef} />
        <WaterCanvas />
      </div>

      {/* Node canvas — full section overlay */}
      <div className="node-canvas-wrap">
        <NodeCanvas />
      </div>

      {/* Text content */}
      <div className="hero-text">
        <p className="hero-greeting">UX Designer &amp; Systems Thinker</p>

        {/* Headline with hover ripple */}
        <div className="hero-headline-wrap">
          <h1
            ref={headlineRef}
            className="hero-title hero-title--nodes"
            onMouseMove={handleHeadlineMove}
          >
            I design systems people<br />don&apos;t have to think about
          </h1>
          {headlineRipples.map(r => (
            <div
              key={r.id}
              className="headline-ripple"
              style={{ left: r.x, top: r.y }}
            />
          ))}
        </div>

        <p className="hero-subtitle">
          Turning complexity into clarity through research, strategy, and execution —<br />
          across products, teams, and AI systems.
        </p>

        <div className="hero-ctas">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta hero-cta--primary"
          >
            View Resume
          </a>
          <Link to="/projects" className="hero-cta hero-cta--secondary">
            Explore Projects
          </Link>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Dive in</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
