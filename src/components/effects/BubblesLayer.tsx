import { useEffect, useRef } from 'react'

export default function BubblesLayer() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = layerRef.current!

    function createBubble() {
      const b = document.createElement('div')
      const isTiny = Math.random() > 0.4
      b.className = isTiny ? 'bubble tiny' : 'bubble'
      const size = isTiny ? Math.random() * 5 + 2 : Math.random() * 14 + 6
      b.style.width = `${size}px`
      b.style.height = `${size}px`
      b.style.left = `${Math.random() * 100}%`
      b.style.bottom = '-20px'
      b.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}px`)
      b.style.setProperty('--drift-end', `${(Math.random() - 0.5) * 60}px`)
      const duration = isTiny ? Math.random() * 8 + 5 : Math.random() * 14 + 8
      b.style.animationDuration = `${duration}s`
      layer.appendChild(b)
      setTimeout(() => b.remove(), duration * 1000)
    }

    // Initial staggered batch
    for (let i = 0; i < 25; i++) {
      setTimeout(createBubble, Math.random() * 4000)
    }

    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < count; i++) {
        setTimeout(createBubble, Math.random() * 800)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return <div className="bubbles-layer" ref={layerRef} />
}
