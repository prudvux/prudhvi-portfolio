import { useCallback, useEffect, useRef, useState } from 'react'

type SceneNum = 1 | 2 | 3 | 4 | 5

interface SplashScreenProps {
  onComplete: () => void
}

// ─── Canvas particle for burst/float effects ───────────────────────────────
interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number
  alpha: number
  decay: number
  color: string
  isBurst?: boolean
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const [scene, setScene] = useState<SceneNum>(1)
  const sceneRef    = useRef<SceneNum>(1)
  const [exiting, setExiting] = useState(false)
  const exitingRef  = useRef(false)
  const [cursorRipples, setCursorRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const rippleIdRef = useRef(0)
  const burstTriggeredRef = useRef(false)

  useEffect(() => { sceneRef.current = scene }, [scene])

  // ── Scene timing ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setScene(2), 3000),   // 0–3s   Scene 1: Sunrise calm
      setTimeout(() => setScene(3), 6000),   // 3–6s   Scene 2: Bottle floats in
      setTimeout(() => setScene(4), 9000),   // 6–9s   Scene 3: Message rises
      setTimeout(() => setScene(5), 11000),  // 9–11s  Scene 4: Identity reveals
      setTimeout(() => {                      // 11–13s  Scene 5: Ripple exit
        exitingRef.current = true
        setExiting(true)
        setTimeout(onComplete, 1800)
      }, 11000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  // ── Master canvas loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const startTime = performance.now()

    // Floating ambient particles
    const floatParticles: Particle[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(Math.random() * 0.35 + 0.08),
      r: Math.random() * 2.2 + 0.4,
      alpha: Math.random() * 0.38 + 0.06,
      decay: 0,
      color: Math.random() > 0.5 ? '184,216,208' : '168,204,224',
    }))

    // Bubbles
    const bubbles = Array.from({ length: 32 }, () => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + Math.random() * 500,
      r: Math.random() * 6 + 2,
      speed: Math.random() * 0.7 + 0.2,
      drift: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.28 + 0.07,
    }))

    // Light rays
    const rays = Array.from({ length: 9 }, (_, i) => ({
      xFrac: 0.05 + (i / 9) * 0.9,
      width: Math.random() * 100 + 50,
      baseAlpha: Math.random() * 0.045 + 0.015,
      phase: Math.random() * Math.PI * 2,
      freq: Math.random() * 0.0003 + 0.0001,
      tilt: -0.22 + (i / 9 - 0.5) * 0.5,
    }))

    // Burst particles (scene 4 dissolution)
    const burstParticles: Particle[] = []

    function spawnBurst(cx: number, cy: number) {
      const colors = ['184,216,208', '168,204,224', '248,251,253', '91,143,168', '212,165,154']
      for (let i = 0; i < 80; i++) {
        const angle = (i / 80) * Math.PI * 2 + Math.random() * 0.4
        const speed = Math.random() * 3.5 + 0.6
        burstParticles.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: cy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 1.5,
          r: Math.random() * 3 + 0.8,
          alpha: Math.random() * 0.7 + 0.3,
          decay: Math.random() * 0.012 + 0.006,
          color: colors[Math.floor(Math.random() * colors.length)] ?? '184,216,208',
          isBurst: true,
        })
      }
    }

    let rafId: number

    function draw() {
      const now = performance.now()
      const elapsed = now - startTime
      const w = canvas.width
      const h = canvas.height
      const s = sceneRef.current

      ctx.clearRect(0, 0, w, h)

      // ── 1. Animated ocean waves (all scenes) ──────────────────────────────
      const waveFade = Math.min(1, elapsed / 1200)
      for (let layer = 0; layer < 5; layer++) {
        const t      = elapsed * 0.001
        const speed  = 0.45 + layer * 0.18
        const amp    = 22 - layer * 3
        const yBase  = h * (0.62 + layer * 0.07)
        const alpha  = (0.18 - layer * 0.028) * waveFade

        ctx.beginPath()
        ctx.moveTo(0, h)
        for (let x = 0; x <= w + 4; x += 3) {
          const y = yBase
            + Math.sin(x * 0.005 + t * speed) * amp
            + Math.sin(x * 0.012 + t * speed * 0.65 + layer) * (amp * 0.4)
            + Math.cos(x * 0.002 + t * speed * 0.35) * (amp * 0.25)
          ctx.lineTo(x, y)
        }
        ctx.lineTo(w, h)
        ctx.closePath()

        const wGrad = ctx.createLinearGradient(0, yBase - amp, 0, h)
        if (s === 1) {
          wGrad.addColorStop(0, `rgba(120,185,215,${alpha})`)
          wGrad.addColorStop(1, `rgba(80,140,180,${alpha * 0.4})`)
        } else {
          wGrad.addColorStop(0, `rgba(90,160,200,${alpha * 1.3})`)
          wGrad.addColorStop(1, `rgba(30,80,120,${alpha * 0.5})`)
        }
        ctx.fillStyle = wGrad
        ctx.fill()
      }

      // ── 2. Sunlight shimmer (scene 1 only) ───────────────────────────────
      if (s === 1) {
        const shimmerAlpha = 0.12 * Math.abs(Math.sin(elapsed * 0.0007))
        const shimGrad = ctx.createRadialGradient(w * 0.5, h * 0.15, 0, w * 0.5, h * 0.15, w * 0.55)
        shimGrad.addColorStop(0, `rgba(255,240,200,${shimmerAlpha})`)
        shimGrad.addColorStop(1, 'rgba(255,240,200,0)')
        ctx.fillStyle = shimGrad
        ctx.fillRect(0, 0, w, h)
      }

      // ── 3. Light rays (scene 2+) ──────────────────────────────────────────
      if (s >= 2) {
        const rayFade = Math.min(1, (elapsed - 3000) / 1200)
        rays.forEach(ray => {
          const rx = ray.xFrac * w
          const anim = ray.baseAlpha * (0.55 + 0.45 * Math.sin(elapsed * ray.freq + ray.phase))
          const alpha = anim * rayFade
          const rg = ctx.createLinearGradient(rx, 0, rx, h * 0.85)
          rg.addColorStop(0, `rgba(168,220,255,${alpha})`)
          rg.addColorStop(0.7, `rgba(100,180,220,${alpha * 0.2})`)
          rg.addColorStop(1, 'rgba(100,180,220,0)')
          ctx.save()
          ctx.translate(rx, 0)
          ctx.rotate(ray.tilt)
          ctx.fillStyle = rg
          ctx.fillRect(-ray.width / 2, 0, ray.width, h * 1.5)
          ctx.restore()
        })
      }

      // ── 4. Rising bubbles (scene 2+) ──────────────────────────────────────
      if (s >= 2) {
        const bFade = Math.min(1, (elapsed - 3000) / 1500)
        bubbles.forEach(b => {
          b.y -= b.speed
          b.x += b.drift
          if (b.y < -b.r * 2) { b.y = h + b.r; b.x = Math.random() * w }
          const bg = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x, b.y, b.r)
          const a = b.opacity * bFade
          bg.addColorStop(0, `rgba(255,255,255,${a * 0.9})`)
          bg.addColorStop(0.5, `rgba(168,220,255,${a * 0.2})`)
          bg.addColorStop(1, 'rgba(168,220,255,0)')
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
          ctx.fillStyle = bg
          ctx.fill()
          ctx.strokeStyle = `rgba(200,240,255,${a * 0.28})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        })
      }

      // ── 5. Floating ambient particles (all scenes) ────────────────────────
      floatParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.y < -10) p.y = h + 10
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()
      })

      // ── 6. Burst particles (scene 4) ──────────────────────────────────────
      if (s === 4 || (s >= 4 && burstParticles.length > 0)) {
        if (!burstTriggeredRef.current && s === 4) {
          spawnBurst(w / 2, h / 2)
          burstTriggeredRef.current = true
        }
        for (let i = burstParticles.length - 1; i >= 0; i--) {
          const p = burstParticles[i]!
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.04 // gentle gravity
          p.alpha -= p.decay
          if (p.alpha <= 0) { burstParticles.splice(i, 1); continue }
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${p.color},${p.alpha})`
          ctx.fill()
        }
      }

      // ── 7. Bottle glow halo (scene 2–3) ──────────────────────────────────
      if (s === 2 || s === 3) {
        const gFade = Math.min(1, (elapsed - (s === 3 ? 6000 : 3000)) / 1000)
        const pulse = 0.55 + 0.45 * Math.sin(elapsed * 0.0018)
        const grad = ctx.createRadialGradient(w / 2, h * 0.48, 0, w / 2, h * 0.48, 110)
        grad.addColorStop(0, `rgba(168,220,255,${0.14 * pulse * gFade})`)
        grad.addColorStop(0.5, `rgba(184,216,208,${0.07 * pulse * gFade})`)
        grad.addColorStop(1, 'rgba(168,204,224,0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      rafId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── Cursor ripples (scenes 2, 3) ──────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const s = sceneRef.current
    if (s !== 2 && s !== 3) return
    const id = ++rippleIdRef.current
    setCursorRipples(prev => [...prev.slice(-6), { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setCursorRipples(prev => prev.filter(r => r.id !== id)), 1400)
  }, [])

  // ── Skip / click to enter ─────────────────────────────────────────────────
  const triggerExit = useCallback(() => {
    if (exitingRef.current) return
    exitingRef.current = true
    setScene(5)
    setExiting(true)
    setTimeout(onComplete, 1800)
  }, [onComplete])

  const handleClick = useCallback(() => {
    const s = sceneRef.current
    if (s >= 3) triggerExit()
  }, [triggerExit])

  return (
    <div
      className={`splash${exiting ? ' splash--exit' : ''}`}
      data-scene={scene}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {/* Layered CSS background */}
      <div className="splash-bg" />

      {/* Master canvas */}
      <canvas ref={canvasRef} className="splash-canvas" />

      {/* Cursor ripples */}
      {cursorRipples.map(r => (
        <div key={r.id} className="splash-cursor-ripple" style={{ left: r.x, top: r.y }} />
      ))}

      {/* ── Scene 1: Calm ocean sunrise (no text) ── */}
      <div className="splash-scene splash-s1">
        <div className="splash-horizon" />
        <div className="splash-sun" />
        <div className="splash-sun-ray" />
      </div>

      {/* ── Scene 2: Glass bottle floats in ── */}
      <div className="splash-scene splash-s2">
        <div className="splash-bottle-wrap">
          <svg className="splash-bottle-svg" viewBox="0 0 80 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="bottleGlass" cx="35%" cy="30%" r="65%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
                <stop offset="35%"  stopColor="rgba(168,220,255,0.28)" />
                <stop offset="100%" stopColor="rgba(58,107,130,0.18)" />
              </radialGradient>
              <radialGradient id="bottleGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(184,216,208,0.6)" />
                <stop offset="100%" stopColor="rgba(168,204,224,0)" />
              </radialGradient>
              <linearGradient id="msgPaper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f5f0eb" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#e8e0d5" stopOpacity="0.7" />
              </linearGradient>
              <filter id="glassBlur">
                <feGaussianBlur stdDeviation="0.5" />
              </filter>
            </defs>
            {/* Glow behind bottle */}
            <ellipse cx="40" cy="70" rx="36" ry="44" fill="url(#bottleGlow)" opacity="0.55" />
            {/* Bottle body */}
            <path
              d="M28 42 C18 52 14 65 14 82 C14 105 24 122 40 122 C56 122 66 105 66 82 C66 65 62 52 52 42 Z"
              fill="url(#bottleGlass)"
              stroke="rgba(168,220,255,0.55)"
              strokeWidth="1.2"
            />
            {/* Inner highlight */}
            <path
              d="M26 50 C20 60 18 72 20 85 C21 95 24 108 30 116"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              filter="url(#glassBlur)"
            />
            <path
              d="M22 58 C19 66 18 76 20 88"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Neck */}
            <path
              d="M30 42 L30 26 C30 22 32 20 34 20 L46 20 C48 20 50 22 50 26 L50 42 Z"
              fill="url(#bottleGlass)"
              stroke="rgba(168,220,255,0.5)"
              strokeWidth="1"
            />
            {/* Cork / stopper */}
            <rect x="31" y="12" width="18" height="10" rx="3"
              fill="rgba(240,232,221,0.88)"
              stroke="rgba(184,216,208,0.5)"
              strokeWidth="0.8"
            />
            {/* Cork highlight */}
            <rect x="33" y="14" width="6" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
            {/* Rolled message inside */}
            <rect x="33" y="58" width="14" height="22" rx="2"
              fill="url(#msgPaper)"
              opacity="0.65"
            />
            <line x1="36" y1="64" x2="44" y2="64" stroke="rgba(58,107,130,0.35)" strokeWidth="0.8" />
            <line x1="36" y1="68" x2="44" y2="68" stroke="rgba(58,107,130,0.28)" strokeWidth="0.6" />
            <line x1="36" y1="72" x2="42" y2="72" stroke="rgba(58,107,130,0.2)"  strokeWidth="0.5" />
            {/* Water caustic line */}
            <path
              d="M20 84 C26 80 34 88 40 84 C46 80 54 88 60 84"
              stroke="rgba(168,220,255,0.22)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <p className="splash-bottle-hint">move your cursor &nbsp;·&nbsp; a message awaits</p>
        </div>
      </div>

      {/* ── Scene 3: Message rises from bottle ── */}
      <div className="splash-scene splash-s3">
        <div className="splash-bottle-wrap splash-bottle-open">
          {/* Smaller receding bottle */}
          <svg className="splash-bottle-svg splash-bottle-small" viewBox="0 0 80 130" fill="none">
            <defs>
              <radialGradient id="bg2" cx="35%" cy="30%" r="65%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.35)" />
                <stop offset="100%" stopColor="rgba(58,107,130,0.1)" />
              </radialGradient>
            </defs>
            <path d="M28 42 C18 52 14 65 14 82 C14 105 24 122 40 122 C56 122 66 105 66 82 C66 65 62 52 52 42 Z"
              fill="url(#bg2)" stroke="rgba(168,220,255,0.3)" strokeWidth="1" />
            <path d="M30 42 L30 26 C30 22 32 20 34 20 L46 20 C48 20 50 22 50 26 L50 42 Z"
              fill="url(#bg2)" stroke="rgba(168,220,255,0.25)" strokeWidth="0.8" />
          </svg>
          <div className="splash-message-rise">
            <p className="splash-message-text">Welcome to my ocean</p>
            <div className="splash-message-glow" />
          </div>
        </div>
      </div>

      {/* ── Scene 4: Identity (after particle burst) ── */}
      <div className="splash-scene splash-s4">
        <div className="splash-identity">
          <p className="splash-name">Prudhvi Raj</p>
          <div className="splash-divider" />
          <p className="splash-role-label">UX Designer</p>
          <p className="splash-tagline">Designing calm in complexity</p>
        </div>
      </div>

      {/* ── Scene 5: Exit ripple ── */}
      <div className="splash-exit-ripple" />

      {/* Skip */}
      {!exiting && scene < 5 && (
        <button
          className="splash-skip"
          onClick={e => { e.stopPropagation(); triggerExit() }}
        >
          skip
        </button>
      )}
    </div>
  )
}
