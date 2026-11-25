import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { cx } from '../lib/format'

const ease = [0.16, 1, 0.3, 1] as const

/** Splits a line into words that rise out of a mask when scrolled into view. */
export function SplitReveal({ text, className, delay = 0, as: Tag = 'span' }: { text: string; className?: string; delay?: number; as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = motion[Tag]
  return (
    <MotionTag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-10% 0px' }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: reduce ? 0 : '105%', opacity: reduce ? 0 : 1 }, show: { y: 0, opacity: 1 } }}
            transition={{ duration: 1, ease, delay: delay + i * 0.045 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

export function FadeIn({ children, className, delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cx(className)}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function Marquee({ children, speed = 40, className }: { children: ReactNode; speed?: number; className?: string }) {
  return (
    <div className={cx('relative flex overflow-hidden', className)}>
      <div className="flex shrink-0 items-center motion-safe:animate-[marquee_var(--d)_linear_infinite]" style={{ ['--d' as string]: `${speed}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
