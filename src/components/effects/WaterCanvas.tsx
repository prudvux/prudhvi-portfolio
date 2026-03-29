import { useEffect, useRef } from 'react'

export default function WaterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0
    let rafId: number

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { width: w, height: h } = canvas

      for (let layer = 0; layer < 3; layer++) {
        const alpha = 0.06 - layer * 0.015
        const speed = 0.0008 + layer * 0.0003
        const amplitude = 15 + layer * 8
        const yOffset = h * 0.2 + layer * (h * 0.25)

        ctx.beginPath()
        ctx.moveTo(0, h)

        for (let x = 0; x <= w; x += 3) {
          const y =
            yOffset +
            Math.sin(x * 0.003 + time * speed * 1000 + layer) * amplitude +
            Math.sin(x * 0.007 + time * speed * 700) * (amplitude * 0.5) +
            Math.cos(x * 0.001 + time * speed * 500) * (amplitude * 0.3)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(w, h)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, h)
        gradient.addColorStop(0, `rgba(168, 204, 224, ${alpha})`)
        gradient.addColorStop(1, `rgba(91, 143, 168, ${alpha * 0.5})`)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      time++
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas id="waterCanvas" ref={canvasRef} />
}
