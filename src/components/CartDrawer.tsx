import { AnimatePresence, motion } from 'motion/react'
import { Minus, Plus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FREE_SHIPPING_MIN_QTY } from '../config/store'
import { SHADES } from '../data/products'
import { peso } from '../lib/format'
import { useScrollLock } from '../lib/smooth'
import { totals, useCart } from '../store/cart'
import { ShadeImage } from './ShadeImage'

const ease = [0.76, 0, 0.24, 1] as const

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove } = useCart()
  const { items, qty, subtotal, freeShip } = totals(lines)
  const navigate = useNavigate()
  const closeRef = useRef<HTMLButtonElement>(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const left = Math.max(0, FREE_SHIPPING_MIN_QTY - qty)

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-paper"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-baseline gap-3">
                <h2 className="display text-3xl italic">Your bag</h2>
                <span className="eyebrow text-mute">{qty} {qty === 1 ? 'set' : 'sets'}</span>
              </div>
              <button ref={closeRef} onClick={() => setOpen(false)} className="-mr-2 p-2" aria-label="Close bag">
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>

            {FREE_SHIPPING_MIN_QTY > 0 && qty > 0 && (
              <div className="border-b border-line px-6 py-4">
                <p className="text-sm">{freeShip ? 'Free shipping unlocked. Salamat!' : `Add ${left} more ${left === 1 ? 'set' : 'sets'} for free shipping.`}</p>
                <div className="mt-3 flex h-1 gap-1" aria-hidden>
                  {Array.from({ length: FREE_SHIPPING_MIN_QTY }).map((_, i) => (
                    <motion.span key={i} className="flex-1 origin-left bg-ink" initial={false} animate={{ scaleX: i < qty ? 1 : 0, opacity: 1 }} style={{ background: i < qty ? items[i % items.length]?.product.shade.hex : undefined }} transition={{ duration: 0.6, ease }} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 px-10 text-center">
                  <div className="flex -space-x-3">
                    {SHADES.slice(0, 6).map((s) => (
                      <span key={s.id} className="size-10 rounded-full ring-2 ring-paper" style={{ background: s.hex }} />
                    ))}
                  </div>
                  <p className="display text-3xl italic">Nothing here yet.</p>
                  <p className="max-w-xs text-sm text-ink-2">Twelve shades are waiting. Find the one that matches your shift.</p>
                  <Link to="/shop" onClick={() => setOpen(false)} className="eyebrow border-b border-ink pb-1">
                    Browse the collection
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li key={it.slug + it.size} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="flex gap-4 px-6 py-5">
                        <Link to={`/product/${it.slug}`} onClick={() => setOpen(false)} className="shrink-0">
                          <ShadeImage photo={it.product.shade.photo} crop={it.product.shade.crop} tint={it.product.shade.hex} alt={`${it.product.shade.name} scrub suit`} className="h-28 w-[88px]" sizes="100px" />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="display text-2xl">{it.product.shade.name}</p>
                              <p className="eyebrow mt-1 text-mute">
                                {it.product.name} · {it.size}
                              </p>
                            </div>
                            <p className="font-mono text-sm">{peso(it.total)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center border border-line">
                              <button className="grid size-8 place-items-center" onClick={() => setQty(it.slug, it.size, it.qty - 1)} aria-label={`One less ${it.product.shade.name}`}>
                                <Minus className="size-3" />
                              </button>
                              <span className="w-7 text-center font-mono text-sm" aria-live="polite">
                                {it.qty}
                              </span>
                              <button className="grid size-8 place-items-center" onClick={() => setQty(it.slug, it.size, it.qty + 1)} aria-label={`One more ${it.product.shade.name}`}>
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <button onClick={() => remove(it.slug, it.size)} className="eyebrow text-mute link-underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-line px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow">Subtotal</span>
                  <span className="display text-3xl">{peso(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-mute">Shipping calculated at checkout. Pay by GCash or Cash on Delivery.</p>
                <button
                  onClick={() => {
                    setOpen(false)
                    navigate('/checkout')
                  }}
                  className="group relative mt-5 flex h-14 w-full items-center justify-between overflow-hidden bg-ink px-6 text-bone"
                >
                  <span className="eyebrow relative z-10">Checkout</span>
                  <span className="relative z-10 font-mono text-sm">{peso(subtotal)} →</span>
                  <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
