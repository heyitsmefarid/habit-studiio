import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { SHADES } from '../data/products'
import { Monogram } from './Brand'

const KEY = 'habit-intro-seen'

/** First-visit intro: monogram, shade stripes, then a curtain lift. Once per session. */
export function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem(KEY) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      return false
    }
  })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!show) return
    let raf = 0
    const start = performance.now()
    const dur = 1700
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(step)
      else
        setTimeout(() => {
          setShow(false)
          try {
            sessionStorage.setItem(KEY, '1')
          } catch {}
        }, 350)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col bg-ink text-bone"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              <Monogram className="size-24" />
            </motion.div>
            <motion.p className="eyebrow text-bone/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Prepping your shift
            </motion.p>
          </div>
          <div className="flex items-end justify-between px-6 pb-6 md:px-10">
            <span className="eyebrow text-bone/50">Habit Studio — Quezon City</span>
            <span className="display text-7xl tabular-nums md:text-9xl">{String(n).padStart(3, '0')}</span>
          </div>
          <div className="flex h-2">
            {SHADES.map((s, i) => (
              <motion.span key={s.id} className="flex-1 origin-bottom" style={{ background: s.hex }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2 + i * 0.07, duration: 0.6 }} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
