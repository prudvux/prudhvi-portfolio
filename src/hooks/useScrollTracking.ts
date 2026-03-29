import { useState, useEffect, useRef } from 'react'

const TOTAL_SECTIONS = 5

export function useScrollTracking() {
  const [navHidden, setNavHidden] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const lastScrollRef = useRef(0)
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Nav hide/show on scroll direction
      if (scrollY > windowHeight * 0.8) {
        if (scrollY > lastScrollRef.current) {
          setNavHidden(true)
        } else {
          setNavHidden(false)
          clearTimeout(navTimeoutRef.current)
          navTimeoutRef.current = setTimeout(() => {
            if (window.scrollY > windowHeight * 0.8) setNavHidden(true)
          }, 3000)
        }
      } else {
        setNavHidden(false)
      }
      lastScrollRef.current = scrollY

      // Active depth dot
      const progress = scrollY / (docHeight - windowHeight)
      const active = Math.min(Math.floor(progress * TOTAL_SECTIONS), TOTAL_SECTIONS - 1)
      setActiveSection(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(navTimeoutRef.current)
    }
  }, [])

  return { navHidden, activeSection }
}
