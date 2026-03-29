import { useEffect, useRef } from 'react'

interface Node {
  id: number
  label: string
  x: number
  y: number
  vx: number
  vy: number
  // base radius + pulse
  baseR: number
  r: number
  pulsePhase: number
  pulseSpeed: number
  pulseAmp: number
  // color cycling
  colorPhase: number
  colorSpeed: number
  hovered: boolean
}

const NODES_DEF = [
  'Design',
  'Engineering',
  'Product',
  'Research',
  'AI',
]

// Colors visible on the light white→mist→sky-blue hero gradient
const COLOR_PALETTE = [
  { fill: '58,107,130',   glow: '58,107,130'   },  // --ocean
  { fill: '91,143,168',   glow: '91,143,168'   },  // --deep-blue
  { fill: '30,58,74',     glow: '58,107,130'   },  // --abyss
  { fill: '58,107,130',   glow: '184,216,208'  },  // ocean w/ seafoam glow
  { fill: '91,143,168',   glow: '168,204,224'  },  // deep-blue w/ sky glow
]

// Exclusion ellipse — keeps nodes away from the hero text
const EXCL_RX_FRAC = 0.30
const EXCL_RY_FRAC = 0.26

export default function NodeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -999, y: -999 })
  const nodesRef  = useRef<Node[]>([])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initNodes()
    }

    function randomPerimeterPos(w: number, h: number, cx: number, cy: number, exRx: number, exRy: number) {
      // Keep trying random positions until one lands outside exclusion zone
      let x = 0, y = 0
      for (let attempt = 0; attempt < 40; attempt++) {
        x = 60 + Math.random() * (w - 120)
        y = 60 + Math.random() * (h - 120)
        const dx = (x - cx) / exRx
        const dy = (y - cy) / exRy
        if (dx * dx + dy * dy > 1.1) break
      }
      return { x, y }
    }

    function initNodes() {
      const w   = canvas.width
      const h   = canvas.height
      const cx  = w / 2
      const cy  = h / 2
      const exRx = w * EXCL_RX_FRAC + 60
      const exRy = h * EXCL_RY_FRAC + 50

      nodesRef.current = NODES_DEF.map((label, i) => {
        const pos = randomPerimeterPos(w, h, cx, cy, exRx, exRy)
        const baseR = 22 + Math.random() * 16
        return {
          id:          i,
          label,
          x:           pos.x,
          y:           pos.y,
          vx:          (Math.random() - 0.5) * 0.7,
          vy:          (Math.random() - 0.5) * 0.7,
          baseR,
          r:           baseR,
          pulsePhase:  Math.random() * Math.PI * 2,
          pulseSpeed:  0.4 + Math.random() * 0.6,
          pulseAmp:    8 + Math.random() * 10,
          colorPhase:  Math.random() * Math.PI * 2,
          colorSpeed:  0.15 + Math.random() * 0.2,
          hovered:     false,
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)

    let rafId: number
    const startTime = performance.now()

    function hitTest(n: Node, mx: number, my: number) {
      const dx = n.x - mx
      const dy = n.y - my
      return Math.sqrt(dx * dx + dy * dy) < n.r + 16
    }

    function getColor(n: Node, t: number) {
      // Blend between two adjacent palette entries
      const total  = COLOR_PALETTE.length
      const cycle  = (n.colorPhase + t * n.colorSpeed) % (Math.PI * 2)
      const raw    = (cycle / (Math.PI * 2)) * total
      const idxA   = Math.floor(raw) % total
      const idxB   = (idxA + 1) % total
      const blend  = raw - Math.floor(raw)

      const a = COLOR_PALETTE[idxA]!
      const b = COLOR_PALETTE[idxB]!

      // Parse and interpolate RGB
      const [ar, ag, ab2] = a.fill.split(',').map(Number) as [number, number, number]
      const [br, bg, bb]  = b.fill.split(',').map(Number) as [number, number, number]
      const r = Math.round(ar + (br - ar) * blend)
      const g = Math.round(ag + (bg - ag) * blend)
      const bl = Math.round(ab2 + (bb - ab2) * blend)

      const [gr, gg, gb] = a.glow.split(',').map(Number) as [number, number, number]
      const [gr2, gg2, gb2] = b.glow.split(',').map(Number) as [number, number, number]
      const glr = Math.round(gr + (gr2 - gr) * blend)
      const glg = Math.round(gg + (gg2 - gg) * blend)
      const glb = Math.round(gb + (gb2 - gb) * blend)

      return { fill: `${r},${g},${bl}`, glow: `${glr},${glg},${glb}` }
    }

    function drawNode(n: Node, color: { fill: string; glow: string }) {
      ctx.save()

      // Outer glow
      const glowR = n.hovered ? n.r * 2.8 : n.r * 2.2
      const glowA = n.hovered ? 0.32 : 0.18
      const gGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
      gGrad.addColorStop(0,   `rgba(${color.glow},${glowA})`)
      gGrad.addColorStop(0.5, `rgba(${color.glow},${glowA * 0.3})`)
      gGrad.addColorStop(1,   `rgba(${color.glow},0)`)
      ctx.fillStyle = gGrad
      ctx.beginPath()
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
      ctx.fill()

      // Node body — glass-like with radial gradient
      const nodeGrad = ctx.createRadialGradient(
        n.x - n.r * 0.3, n.y - n.r * 0.3, 0,
        n.x, n.y, n.r
      )
      const ba = n.hovered ? 0.85 : 0.62
      nodeGrad.addColorStop(0,   `rgba(255,255,255,${ba * 0.9})`)
      nodeGrad.addColorStop(0.35, `rgba(${color.fill},${ba * 0.7})`)
      nodeGrad.addColorStop(1,   `rgba(${color.fill},${ba * 0.4})`)
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = nodeGrad
      ctx.fill()

      // Border ring
      ctx.strokeStyle = `rgba(${color.fill},${n.hovered ? 0.8 : 0.45})`
      ctx.lineWidth   = n.hovered ? 1.8 : 1
      ctx.stroke()

      ctx.restore()

      // Label
      ctx.save()
      ctx.globalAlpha  = n.hovered ? 1 : 0.8
      ctx.font         = `${n.hovered ? 600 : 400} ${n.hovered ? '13px' : '11px'} 'Questrial', sans-serif`
      ctx.fillStyle    = n.hovered ? 'rgba(30,58,74,1)' : 'rgba(30,58,74,0.85)'
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(n.label, n.x, n.y)
      ctx.restore()
    }

    function draw() {
      const now = performance.now()
      const t   = (now - startTime) / 1000
      const w   = canvas.width
      const h   = canvas.height
      const cx  = w / 2
      const cy  = h / 2
      const mx  = mouseRef.current.x
      const my  = mouseRef.current.y

      const exRx = w * EXCL_RX_FRAC + 60
      const exRy = h * EXCL_RY_FRAC + 50
      const pad  = 55

      ctx.clearRect(0, 0, w, h)

      nodesRef.current.forEach(n => {

        // ── Pulse size ──────────────────────────────────────────────────────
        n.r = n.baseR + Math.sin(t * n.pulseSpeed + n.pulsePhase) * n.pulseAmp

        // ── Random walk — add small Brownian nudge each frame ───────────────
        n.vx += (Math.random() - 0.5) * 0.12
        n.vy += (Math.random() - 0.5) * 0.12

        // Speed cap
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        const maxSpeed = 0.9
        if (speed > maxSpeed) {
          n.vx = (n.vx / speed) * maxSpeed
          n.vy = (n.vy / speed) * maxSpeed
        }

        let nx = n.x + n.vx
        let ny = n.y + n.vy

        // ── Exclusion zone — push node out if inside ellipse ────────────────
        const dex = (nx - cx) / exRx
        const dey = (ny - cy) / exRy
        const ellipseDist = Math.sqrt(dex * dex + dey * dey)

        if (ellipseDist < 1.0) {
          const angle  = Math.atan2((ny - cy) / exRy, (nx - cx) / exRx)
          const overlap = 1.0 - ellipseDist
          const force  = overlap * 3.5
          n.vx += Math.cos(angle) * force
          n.vy += Math.sin(angle) * force * (exRx / exRy)
          // Immediately nudge position to boundary
          nx = cx + Math.cos(angle) * exRx * 1.02
          ny = cy + Math.sin(angle) * exRy * 1.02
        }

        // ── Canvas boundary bounce ──────────────────────────────────────────
        if (nx < pad)     { nx = pad;     n.vx = Math.abs(n.vx) * 0.6 }
        if (nx > w - pad) { nx = w - pad; n.vx = -Math.abs(n.vx) * 0.6 }
        if (ny < pad)     { ny = pad;     n.vy = Math.abs(n.vy) * 0.6 }
        if (ny > h - pad) { ny = h - pad; n.vy = -Math.abs(n.vy) * 0.6 }

        // ── Mouse repulsion ─────────────────────────────────────────────────
        const mdx   = nx - mx
        const mdy   = ny - my
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 150 && mdist > 0) {
          const force = (150 - mdist) / 150 * 2.5
          n.vx += (mdx / mdist) * force
          n.vy += (mdy / mdist) * force
        }

        // Velocity damping so nodes don't accelerate forever
        n.vx *= 0.97
        n.vy *= 0.97

        n.x = nx
        n.y = ny
        n.hovered = hitTest(n, mx, my)
      })

      // Draw nodes — no lines
      nodesRef.current.forEach(n => {
        const color = getColor(n, t)
        drawNode(n, color)
      })

      rafId = requestAnimationFrame(draw)
    }

    draw()

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouseRef.current = { x: -999, y: -999 } }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="node-canvas" />
}
