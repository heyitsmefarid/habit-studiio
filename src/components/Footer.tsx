import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { STORE } from '../config/store'
import { SHADES } from '../data/products'
import { Cross } from './Brand'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-bone">
      <div className="flex h-1.5">
        {SHADES.map((s) => (
          <span key={s.id} className="flex-1" style={{ background: s.hex }} />
        ))}
      </div>
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-10 pt-16 md:grid-cols-12 md:px-10 md:pt-24">
        <div className="md:col-span-5">
          <p className="display text-4xl italic leading-[1.05] md:text-5xl">Built into your routine.</p>
          <p className="mt-5 max-w-sm text-sm text-bone/60">{STORE.intro}</p>
          <a href={`mailto:${STORE.email}`} className="mt-8 inline-flex items-center gap-2 border-b border-bone/40 pb-1 text-sm hover:border-bone">
            {STORE.email} <ArrowUpRight className="size-4" strokeWidth={1.4} />
          </a>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="eyebrow mb-4 text-bone/40">Shop</p>
            <ul className="space-y-2 text-sm">
              <li><Link className="link-underline" to="/shop">All shades</Link></li>
              <li><Link className="link-underline" to="/shop?mood=soft">Soft &amp; Classy</Link></li>
              <li><Link className="link-underline" to="/shop?mood=bold">Bold &amp; Beautiful</Link></li>
              <li><Link className="link-underline" to="/shop?mood=deep">Deep &amp; Grounded</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-bone/40">Studio</p>
            <ul className="space-y-2 text-sm">
              <li><Link className="link-underline" to="/lookbook">Lookbook</Link></li>
              <li><Link className="link-underline" to="/story">Our story</Link></li>
              <li><Link className="link-underline" to="/checkout">Checkout</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-bone/40">Find us</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="link-underline" href={STORE.facebook} target="_blank" rel="noreferrer">
                  Facebook ↗
                </a>
              </li>
              <li className="text-bone/60">{STORE.city}</li>
              <li className="text-bone/60">{STORE.distributor}</li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <p className="display select-none text-center text-[23vw] leading-[0.8] tracking-[0.06em] text-bone/[0.07] md:text-[21vw]" aria-hidden>
          HABIT
        </p>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 border-t border-bone/10 px-5 py-6 md:px-10">
        <span className="eyebrow text-bone/40">© {new Date().getFullYear()} Habit Studio by Arianne</span>
        <span className="eyebrow flex items-center gap-2 text-bone/40">
          <Cross className="size-2.5" /> GCash &amp; Cash on Delivery accepted
        </span>
      </div>
    </footer>
  )
}
