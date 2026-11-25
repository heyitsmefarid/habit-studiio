import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const Ctx = createContext<Lenis | null>(null)
export const useLenis = () => useContext(Ctx)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const ref = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 1, anchors: true })
    ref.current = l
    setLenis(l)
    l.on('scroll', ScrollTrigger.update)
    const tick = (t: number) => l.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
    }
  }, [])

  return <Ctx.Provider value={lenis}>{children}</Ctx.Provider>
}

/** Scroll to top on route change (after the exit transition). */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()
  useEffect(() => {
    const t = setTimeout(() => {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
      ScrollTrigger.refresh()
    }, 10)
    return () => clearTimeout(t)
  }, [pathname, lenis])
  return null
}

/** Pause smooth scrolling while a drawer/overlay is open. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()
  useEffect(() => {
    if (!locked) return
    lenis?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = prev
    }
  }, [locked, lenis])
}
