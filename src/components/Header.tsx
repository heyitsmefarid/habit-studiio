import { AnimatePresence, motion } from 'motion/react'
import { Search, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../store/cart'
import { cx } from '../lib/format'
import { useScrollLock } from '../lib/smooth'
import { Wordmark } from './Brand'
import { SHADES } from '../data/products'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/shop?mood=soft', label: 'Collections' },
  { to: '/shop?line=tee', label: 'Tees' },
  { to: '/lookbook', label: 'Lookbook' },
  { to: '/story', label: 'Story' },
]

export function Header({ onSearch }: { onSearch: () => void }) {
  const qty = useCart((s) => s.lines.reduce((a, l) => a + l.qty, 0))
  const setOpen = useCart((s) => s.setOpen)
  const { pathname, search } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  useScrollLock(menu)

  useEffect(() => {
    // Hide on scroll down, show on scroll up. Only flip on a clear move in one
    // direction: Lenis eases out in 1–2px steps, which used to flip the header
    // back into view at the end of every downward scroll.
    let anchor = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (y < 400) {
        setHidden(false)
        anchor = y
        return
      }
      const d = y - anchor
      if (d > 12) setHidden(true)
      else if (d < -12) setHidden(false)
      if (Math.abs(d) > 12) anchor = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenu(false), [pathname, search])

  // Close the mobile menu with Escape, and if the window grows past the mobile breakpoint.
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    const mq = window.matchMedia('(min-width: 1024px)')
    const onMq = () => mq.matches && setMenu(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onMq)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [menu])

  // Expose header visibility so sticky bars (shop filters, buy box) can sit right under it.
  const offscreen = hidden && !menu
  useEffect(() => {
    document.documentElement.toggleAttribute('data-header-hidden', offscreen)
  }, [offscreen])

  const query = new URLSearchParams(search)
  const mood = query.get('mood')
  const line = query.get('line')
  const isActive = (label: string) => {
    if (label === 'Shop') return pathname === '/shop' && !mood && !line
    if (label === 'Collections') return pathname === '/shop' && !!mood
    if (label === 'Tees') return (pathname === '/shop' && line === 'tee' && !mood) || pathname.startsWith('/product/tee-')
    return pathname.startsWith(NAV.find((n) => n.label === label)!.to)
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone">
        Skip to content
      </a>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-out-expo)]',
          offscreen ? '-translate-y-full' : 'translate-y-0',
          scrolled ? 'bg-bone/85 backdrop-blur-md border-b border-line' : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-5 md:h-20 md:px-10">
          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-7">
            {NAV.map((n) => {
              const on = isActive(n.label)
              return (
                <Link key={n.label} to={n.to} aria-current={on ? 'page' : undefined} className={cx('eyebrow link-underline whitespace-nowrap pb-0.5', on && 'bg-[length:100%_1px]')}>
                  {n.label}
                </Link>
              )
            })}
          </nav>
          <button className="eyebrow -ml-2 h-10 justify-self-start px-2 lg:hidden" onClick={() => setMenu(true)} aria-expanded={menu} aria-controls="mobile-menu">
            Menu
          </button>

          <Link to="/" aria-label="Habit Studio — home" className="text-[19px] md:text-[22px]">
            <Wordmark compact />
          </Link>

          <div className="-mr-2 flex items-center justify-end gap-1 md:gap-3">
            <button onClick={onSearch} className="group flex h-10 items-center gap-2 px-2" aria-label="Search shades (press /)">
              <Search className="size-[18px]" strokeWidth={1.4} />
              <span className="eyebrow hidden lg:inline">Search</span>
              <kbd className="eyebrow hidden rounded border border-line px-1.5 py-0.5 text-[10px] lg:inline">/</kbd>
            </button>
            <button onClick={() => setOpen(true)} className="relative flex h-10 items-center gap-2 px-2" aria-label={`Open bag, ${qty} item${qty === 1 ? '' : 's'}`}>
              <ShoppingBag className="size-[18px]" strokeWidth={1.4} />
              <span className="eyebrow hidden lg:inline">Bag</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={qty}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="grid min-w-5 place-items-center rounded-full bg-ink px-1.5 font-mono text-[10px] leading-5 text-bone"
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-bone lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex h-16 items-center justify-between px-5 md:h-20 md:px-10">
              <span className="eyebrow opacity-60">Menu</span>
              <button onClick={() => setMenu(false)} aria-label="Close menu" className="-mr-2 p-2" autoFocus>
                <X className="size-5" strokeWidth={1.4} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 overflow-y-auto px-5 md:px-10">
              {[{ to: '/', label: 'Home' }, ...NAV, { to: '/checkout', label: 'Checkout' }].map((n, i) => (
                <motion.div key={n.label} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
                  <Link to={n.to} onClick={() => setMenu(false)} className="display block text-[min(13vw,5.5rem)] italic">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex h-3">
              {SHADES.map((s) => (
                <span key={s.id} className="flex-1" style={{ background: s.hex }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
