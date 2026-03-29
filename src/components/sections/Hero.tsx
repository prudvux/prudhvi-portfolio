import { useEffect, useRef } from 'react'
import WaterCanvas from '../effects/WaterCanvas'

export default function Hero() {
  const particlesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = particlesRef.current!
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div')
      p.className = 'particle'
      const size = Math.random() * 6 + 3
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      p.style.left = `${Math.random() * 100}%`
      p.style.animationDuration = `${Math.random() * 15 + 10}s`
      p.style.animationDelay = `${Math.random() * 10}s`
      container.appendChild(p)
      particles.push(p)
    }

    return () => particles.forEach(p => p.remove())
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="light-rays" />
        <div className="fog fog-1" />
        <div className="fog fog-2" />
        <div className="particles-container" ref={particlesRef} />
        <WaterCanvas />
      </div>

      <div className="hero-text">
        <p className="hero-greeting">UX Designer &amp; Storyteller</p>
        <h1 className="hero-title">
          Welcome to<br />my <em>ocean</em>
        </h1>
        <p className="hero-subtitle">
          Where design flows like water —<br />intuitive, effortless, alive
        </p>
      </div>

      <div className="scroll-hint">
        <span>Dive in</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
