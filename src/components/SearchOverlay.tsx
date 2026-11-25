import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOODS } from '../data/products'
import { peso } from '../lib/format'
import { searchProducts } from '../lib/search'
import { useScrollLock } from '../lib/smooth'

const SUGGEST = ['pink', 'night shift', 'blue', 'soft', 'nurses', 'black', 'bold']

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = useMemo(() => (q.trim() ? searchProducts(q) : []), [q])
  useScrollLock(open)

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => input.current?.focus(), 50)
    }
  }, [open])
  useEffect(() => setActive(0), [q])

  const go = (slug: string) => {
    onClose()
    navigate(`/product/${slug}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[80] flex flex-col bg-bone/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((a) => Math.min(results.length - 1, a + 1))
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((a) => Math.max(0, a - 1))
            }
            if (e.key === 'Enter' && results[active]) go(results[active].slug)
          }}
        >
          <div className="mx-auto w-full max-w-5xl px-5 pt-6 md:px-10 md:pt-12">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-mute">Search the collection</span>
              <button onClick={onClose} className="-mr-2 p-2" aria-label="Close search">
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <label className="mt-6 flex items-center gap-4 border-b border-ink pb-4">
              <Search className="size-6 shrink-0" strokeWidth={1.2} />
              <span className="sr-only">Search by shade, color, mood or profession</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try “pink” or “night shift”"
                className="display w-full bg-transparent text-4xl italic outline-none placeholder:text-mute/60 md:text-6xl"
                role="combobox"
                aria-expanded={results.length > 0}
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${results[active].slug}` : undefined}
              />
            </label>
            {!q && (
              <div className="mt-6 flex flex-wrap gap-2">
                {SUGGEST.map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="eyebrow rounded-full border border-line px-4 py-2 transition-colors hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mx-auto mt-6 w-full max-w-5xl flex-1 overflow-y-auto px-5 pb-10 md:px-10" data-lenis-prevent>
            {q && (
              <p className="eyebrow mb-4 text-mute" aria-live="polite">
                {results.length} {results.length === 1 ? 'shade' : 'shades'} found
              </p>
            )}
            <ul id="search-results" role="listbox" className="divide-y divide-line">
              {results.map((p, i) => (
                <motion.li key={p.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <button
                    id={`sr-${p.slug}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(p.slug)}
                    className="group flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span className="size-12 shrink-0 rounded-full transition-transform duration-500 group-aria-selected:scale-110" style={{ background: p.shade.hex }} />
                    <span className="flex-1">
                      <span className="display block text-3xl">{p.shade.name}</span>
                      <span className="eyebrow text-mute">
                        {p.shade.plain} · {MOODS[p.shade.mood].title}
                      </span>
                    </span>
                    <span className="hidden font-mono text-sm md:block">{peso(p.price)}</span>
                    <ArrowUpRight className="size-5 opacity-0 transition-opacity group-aria-selected:opacity-100" strokeWidth={1.4} />
                  </button>
                </motion.li>
              ))}
            </ul>
            {q && results.length === 0 && <p className="display mt-10 text-3xl italic text-ink-2">No shade by that name — yet. Try a color like “blue” or “maroon”.</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
