import { useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Node {
  id: number
  label: string
  x: number; y: number
  vx: number; vy: number
  // target position for convergence
  tx: number; ty: number
  // float origin (idle drift center)
  ox: number; oy: number
  // float phase offset
  phase: number
  phaseY: number
  r: number
  color: string
  glowColor: string
  hovered: boolean
  // 0 = floating, 1 = converged
  convergeT: number
}

const NODES_DEF = [
  { label: 'Design',      color: '168,204,224', glow: '168,204,224' },
  { label: 'Engineering', color: '184,216,208', glow: '184,216,208' },
  { label: 'Product',     color: '168,204,224', glow: '212,165,154' },
  { label: 'Research',    color: '184,216,208', glow: '184,216,208' },
  { label: 'AI',          color: '212,165,154', glow: '212,165,154' },
]

// Phase thresholds in ms
const PHASE1_END   = 2000
const PHASE2_END   = 5000
const PHASE3_END   = 8000

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function NodeCanvas() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouseRef   = useRef({ x: -999, y: -999 })
  const nodesRef   = useRef<Node[]>([])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initNodes()
    }

    function initNodes() {
      const w = canvas.width
      const h = canvas.height

      // Final wave-path positions — a gentle S-curve across center
      const waveTargets = NODES_DEF.map((_, i) => {
        const t  = i / (NODES_DEF.length - 1)
        const tx = w * 0.15 + t * w * 0.7
        const ty = h * 0.5 + Math.sin(t * Math.PI) * h * 0.15
        return { tx, ty }
      })

      nodesRef.current = NODES_DEF.map((def, i) => {
        const ox = w * 0.1 + Math.random() * w * 0.8
        const oy = h * 0.15 + Math.random() * h * 0.7
        return {
          id:         i,
          label:      def.label,
          x:          ox,
          y:          oy,
          vx:         (Math.random() - 0.5) * 0.4,
          vy:         (Math.random() - 0.5) * 0.4,
          tx:         waveTargets[i]!.tx,
          ty:         waveTargets[i]!.ty,
          ox, oy,
          phase:      Math.random() * Math.PI * 2,
          phaseY:     Math.random() * Math.PI * 2,
          r:          28 + Math.random() * 10,
          color:      def.color,
          glowColor:  def.glow,
          hovered:    false,
          convergeT:  0,
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)

    const startTime = performance.now()
    let rafId: number

    // ── Hit test ──────────────────────────────────────────────────────────────
    function hitTest(n: Node, mx: number, my: number) {
      const dx = n.x - mx
      const dy = n.y - my
      return Math.sqrt(dx * dx + dy * dy) < n.r + 18
    }

    // ── Draw one node ──────────────────────────────────────────────────────────
    function drawNode(n: Node, phase: number, alpha: number) {
      const blurRadius = n.hovered ? 0 : lerp(8, 0, Math.min(1, (phase - PHASE1_END) / (PHASE2_END - PHASE1_END)))

      ctx.save()

      // Glow
      const glowSize  = n.hovered ? n.r * 2.5 : n.r * 1.8
      const glowAlpha = (n.hovered ? 0.35 : 0.18) * alpha
      const gGrad     = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowSize)
      gGrad.addColorStop(0,   `rgba(${n.glowColor},${glowAlpha})`)
      gGrad.addColorStop(0.5, `rgba(${n.glowColor},${glowAlpha * 0.3})`)
      gGrad.addColorStop(1,   `rgba(${n.glowColor},0)`)
      ctx.fillStyle = gGrad
      ctx.beginPath()
      ctx.arc(n.x, n.y, glowSize, 0, Math.PI * 2)
      ctx.fill()

      // Blur filter for phase 1
      if (blurRadius > 0.5) ctx.filter = `blur(${blurRadius}px)`

      // Node circle
      const nodeGrad = ctx.createRadialGradient(
        n.x - n.r * 0.28, n.y - n.r * 0.28, 0,
        n.x, n.y, n.r
      )
      const baseAlpha = n.hovered ? 0.9 : 0.55
      nodeGrad.addColorStop(0,   `rgba(255,255,255,${baseAlpha * alpha})`)
      nodeGrad.addColorStop(0.4, `rgba(${n.color},${(baseAlpha * 0.65) * alpha})`)
      nodeGrad.addColorStop(1,   `rgba(${n.color},${(baseAlpha * 0.3) * alpha})`)

      ctx.beginPath()
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
      ctx.fillStyle = nodeGrad
      ctx.fill()

      // Border
      ctx.strokeStyle = `rgba(${n.color},${(n.hovered ? 0.8 : 0.35) * alpha})`
      ctx.lineWidth   = n.hovered ? 1.5 : 0.8
      ctx.stroke()

      ctx.filter = 'none'
      ctx.restore()

      // Label — show on hover always, fade in during phase 2+
      const labelAlpha = n.hovered
        ? 1
        : Math.max(0, (phase - PHASE2_END) / (PHASE3_END - PHASE2_END)) * 0.65

      if (labelAlpha > 0.02) {
        ctx.save()
        ctx.globalAlpha = labelAlpha * alpha
        ctx.font        = `${n.hovered ? 600 : 400} ${n.hovered ? '13px' : '11px'} 'Questrial', sans-serif`
        ctx.fillStyle   = n.hovered ? `rgba(30,58,74,0.95)` : `rgba(30,58,74,0.7)`
        ctx.textAlign   = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.label, n.x, n.y)
        ctx.restore()
      }
    }

    // ── Draw connection line ───────────────────────────────────────────────────
    function drawLine(a: Node, b: Node, alpha: number) {
      const dx   = b.x - a.x
      const dy   = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 420) return

      const strength  = Math.max(0, 1 - dist / 420)
      const lineAlpha = strength * alpha * 0.6

      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
      grad.addColorStop(0,   `rgba(${a.color},${lineAlpha})`)
      grad.addColorStop(0.5, `rgba(168,204,224,${lineAlpha * 0.7})`)
      grad.addColorStop(1,   `rgba(${b.color},${lineAlpha})`)

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.strokeStyle = grad
      ctx.lineWidth   = strength * (a.hovered || b.hovered ? 1.8 : 1)
      ctx.stroke()
    }

    // ── Draw final wave path ───────────────────────────────────────────────────
    function drawWavePath(nodes: Node[], alpha: number) {
      if (nodes.length < 2) return
      ctx.beginPath()
      ctx.moveTo(nodes[0]!.x, nodes[0]!.y)
      for (let i = 1; i < nodes.length; i++) {
        const prev = nodes[i - 1]!
        const curr = nodes[i]!
        const mx   = (prev.x + curr.x) / 2
        const my   = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my)
      }
      const last = nodes[nodes.length - 1]!
      ctx.lineTo(last.x, last.y)

      const grad = ctx.createLinearGradient(nodes[0]!.x, 0, last.x, 0)
      grad.addColorStop(0,   `rgba(168,204,224,${alpha * 0.55})`)
      grad.addColorStop(0.4, `rgba(184,216,208,${alpha * 0.45})`)
      grad.addColorStop(0.7, `rgba(168,204,224,${alpha * 0.5})`)
      grad.addColorStop(1,   `rgba(212,165,154,${alpha * 0.4})`)

      ctx.strokeStyle = grad
      ctx.lineWidth   = 1.5
      ctx.stroke()
    }

    // ── Main loop ─────────────────────────────────────────────────────────────
    function draw() {
      const now     = performance.now()
      const elapsed = now - startTime
      const w       = canvas.width
      const h       = canvas.height
      const t       = elapsed / 1000
      const mx      = mouseRef.current.x
      const my      = mouseRef.current.y
      const nodes   = nodesRef.current

      ctx.clearRect(0, 0, w, h)

      // ── Update node positions ──────────────────────────────────────────────

      // Convergence progress (0→1 during phase 2→3)
      const convergeRaw = Math.max(0, Math.min(1,
        (elapsed - PHASE2_END) / (PHASE3_END - PHASE2_END)
      ))
      const converge = easeInOut(convergeRaw)

      // Line alpha: fade in during phase 2
      const lineAlpha = Math.max(0, Math.min(1,
        (elapsed - PHASE1_END) / (PHASE2_END - PHASE1_END)
      ))

      // Wave path alpha: fade in during phase 3
      const waveAlpha = Math.max(0, Math.min(1,
        (elapsed - (PHASE2_END + (PHASE3_END - PHASE2_END) * 0.5)) /
        ((PHASE3_END - PHASE2_END) * 0.5)
      ))

      nodes.forEach(n => {
        // Idle float (sinusoidal drift)
        const floatX = n.ox + Math.sin(t * 0.38 + n.phase)  * 30
        const floatY = n.oy + Math.cos(t * 0.28 + n.phaseY) * 22

        // Mouse repulsion (gentle)
        const dx = n.x - mx
        const dy = n.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        let pushX = 0, pushY = 0
        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180 * 18
          pushX = (dx / dist) * force
          pushY = (dy / dist) * force
        }

        // Target: lerp between float+push and converge target
        const targetX = lerp(floatX + pushX, n.tx, converge)
        const targetY = lerp(floatY + pushY, n.ty, converge)

        n.x += (targetX - n.x) * 0.06
        n.y += (targetY - n.y) * 0.06

        // Update hover
        n.hovered = hitTest(n, mx, my)
      })

      // ── Draw connections ───────────────────────────────────────────────────
      if (lineAlpha > 0.01) {
        ctx.save()
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            drawLine(nodes[i]!, nodes[j]!, lineAlpha)
          }
        }
        ctx.restore()
      }

      // ── Draw wave path (phase 3) ───────────────────────────────────────────
      if (waveAlpha > 0.01) {
        ctx.save()
        ctx.globalAlpha = waveAlpha
        const sorted = [...nodes].sort((a, b) => a.x - b.x)
        drawWavePath(sorted, waveAlpha)
        ctx.restore()
      }

      // ── Draw nodes ────────────────────────────────────────────────────────
      nodes.forEach(n => drawNode(n, elapsed, 1))

      rafId = requestAnimationFrame(draw)
    }

    draw()

    // ── Mouse events ──────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
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
