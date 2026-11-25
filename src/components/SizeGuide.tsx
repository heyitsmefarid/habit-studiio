import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { SIZE_CHART, type Size } from '../data/products'
import { cx } from '../lib/format'
import { useScrollLock } from '../lib/smooth'

export function SizeGuide({ open, onClose, highlight }: { open: boolean; onClose: () => void; highlight?: Size | null }) {
  useScrollLock(open)
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[75] flex items-end justify-center md:items-center">
          <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sg-title"
            className="relative w-full max-w-2xl bg-paper p-6 md:p-10"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow text-mute">Unifit Scrub Suit</p>
                <h2 id="sg-title" className="display mt-2 text-4xl italic">
                  Size guide
                </h2>
              </div>
              <button onClick={onClose} aria-label="Close size guide" className="-mr-2 p-2" autoFocus>
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <caption className="sr-only">Garment measurements in inches</caption>
                <thead>
                  <tr className="eyebrow border-b border-line text-mute">
                    <th className="py-3 font-normal">Size</th>
                    <th className="py-3 font-normal">Top chest</th>
                    <th className="py-3 font-normal">Top length</th>
                    <th className="py-3 font-normal">Waist (stretch)</th>
                    <th className="py-3 font-normal">Inseam</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {SIZE_CHART.map((r) => (
                    <tr key={r.size} className={cx('border-b border-line', highlight === r.size && 'bg-sand/60')}>
                      <th scope="row" className="py-3 font-sans font-medium">{r.size}</th>
                      <td>{r.chest}″</td>
                      <td>{r.length}″</td>
                      <td>{r.waist}″</td>
                      <td>{r.inseam}″</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-ink-2">
              The Unifit is a relaxed, unisex cut. Between sizes? Size down for a neater fit, or up for more room on long shifts. Measurements are approximate — message us your height and usual size and we’ll help you choose.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
