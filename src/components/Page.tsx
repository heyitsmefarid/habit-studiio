import { motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'

const ease = [0.76, 0, 0.24, 1] as const

/** Route wrapper: a bone curtain wipes across between pages. */
export function Page({ children, title, tint }: { children: ReactNode; title: string; tint?: string }) {
  useEffect(() => {
    document.title = title === 'Home' ? 'Habit Studio by Arianne — Unifit Scrub Suits' : `${title} — Habit Studio`
  }, [title])
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[90] pointer-events-none origin-top"
        style={{ background: tint ?? 'var(--color-ink)' }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.55, ease, delay: 0.05 } }}
        exit={{ scaleY: 0 }}
        aria-hidden
      />
      <motion.div
        className="fixed inset-0 z-[90] pointer-events-none origin-bottom"
        style={{ background: tint ?? 'var(--color-ink)' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.45, ease } }}
        aria-hidden
      />
      <motion.main id="main" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }} exit={{ opacity: 1 }}>
        {children}
      </motion.main>
    </>
  )
}
