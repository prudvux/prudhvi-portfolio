import { useEffect, useRef } from 'react'

const TRAIL_LENGTH = 12
const INTERACTIVE = 'a, button, .shell-header, .skill-pebble'

export default function CursorSystem() {
  const dropletRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const trailHostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.innerWidth <= 768) return

    const droplet = dropletRef.current!
    const glow = glowRef.current!
    const trailHost = trailHostRef.current!

    let mouseX = 0, mouseY = 0
    let dropX = 0, dropY = 0
    let glowX = 0, glowY = 0
    let isHovering = false
    const trailHistory: Array<{ x: number; y: number }> = []

    // Build trail particle pool
    const particles: HTMLDivElement[] = []
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const p = document.createElement('div')
      p.className = 'cursor-trail-particle'
      const size = Math.max(2, 7 - i * 0.5)
      p.style.width = `${size}px`
      p.style.height = `${size}px`
      const alpha = (1 - i / TRAIL_LENGTH) * 0.45
      p.style.background = `radial-gradient(circle, rgba(168,204,224,${alpha}) 0%, rgba(184,216,208,${alpha * 0.4}) 50%, transparent 75%)`
      trailHost.appendChild(p)
      particles.push(p)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      trailHistory.unshift({ x: mouseX, y: mouseY })
      if (trailHistory.length > TRAIL_LENGTH + 5) trailHistory.pop()
    }

    // Event delegation for hover state
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        isHovering = true
        droplet.classList.add('hovering')
        glow.classList.add('hovering')
      }
    }

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        const related = e.relatedTarget as Element | null
        if (!related?.closest(INTERACTIVE)) {
          isHovering = false
          droplet.classList.remove('hovering')
          glow.classList.remove('hovering')
        }
      }
    }

    const onClick = (e: MouseEvent) => {
      const flash = document.createElement('div')
      flash.className = 'ripple-flash'
      flash.style.left = `${e.clientX}px`
      flash.style.top = `${e.clientY}px`
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 900)

      for (let i = 1; i <= 3; i++) {
        const ring = document.createElement('div')
        ring.className = `ripple-ring ring-${i}`
        ring.style.left = `${e.clientX}px`
        ring.style.top = `${e.clientY}px`
        document.body.appendChild(ring)
        setTimeout(() => ring.remove(), 2200)
      }

      droplet.style.filter = 'drop-shadow(0 4px 16px rgba(168,204,224,0.6))'
      setTimeout(() => {
        droplet.style.filter = isHovering
          ? 'drop-shadow(0 4px 12px rgba(58,107,130,0.45))'
          : 'drop-shadow(0 2px 6px rgba(58,107,130,0.3))'
      }, 300)
    }

    let rafId: number
    function animate() {
      dropX += (mouseX - dropX) * 0.18
      dropY += (mouseY - dropY) * 0.18
      droplet.style.left = `${dropX}px`
      droplet.style.top = `${dropY}px`

      glowX += (mouseX - glowX) * 0.08
      glowY += (mouseY - glowY) * 0.08
      glow.style.left = `${glowX}px`
      glow.style.top = `${glowY}px`

      const vx = mouseX - dropX
      const vy = mouseY - dropY
      const angle = Math.atan2(vx, -vy) * 0.3
      const scale = isHovering ? ' scale(1.4)' : ''
      droplet.style.transform = `translate(-50%, -50%) rotate(${angle}rad)${scale}`

      for (let i = 0; i < particles.length; i++) {
        const idx = Math.min(i * 2 + 3, trailHistory.length - 1)
        const pos = trailHistory[idx]
        if (pos) {
          particles[i]!.style.left = `${pos.x}px`
          particles[i]!.style.top = `${pos.y}px`
        }
      }

      rafId = requestAnimationFrame(animate)
    }
    animate()

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('click', onClick)
      particles.forEach(p => p.remove())
    }
  }, [])

  return (
    <>
      <div className="cursor-glow" ref={glowRef} />
      <div className="cursor-droplet" ref={dropletRef}>
        <svg viewBox="0 0 22 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="dropGrad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="40%" stopColor="rgba(168,204,224,0.5)" />
              <stop offset="100%" stopColor="rgba(58,107,130,0.35)" />
            </radialGradient>
          </defs>
          <path
            d="M11 0 C11 0 0 14 0 20 C0 25.5 4.9 30 11 30 C17.1 30 22 25.5 22 20 C22 14 11 0 11 0Z"
            fill="url(#dropGrad)"
            stroke="rgba(168,204,224,0.6)"
            strokeWidth="0.8"
          />
          <ellipse cx="8" cy="17" rx="3.5" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(-15, 8, 17)" />
          <ellipse cx="7" cy="14" rx="1.5" ry="2" fill="rgba(255,255,255,0.4)" transform="rotate(-20, 7, 14)" />
        </svg>
      </div>
      {/* Trail particle host — particles appended dynamically via useEffect */}
      <div
        ref={trailHostRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
      />
    </>
  )
}
