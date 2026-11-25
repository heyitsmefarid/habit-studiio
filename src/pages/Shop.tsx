import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { LayoutGrid, Palette, Search, X } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Page } from '../components/Page'
import { ProductCard } from '../components/ProductCard'
import { LINES, MOODS, PRODUCTS, SHADES, TEE_COLORS, type Line, type Mood } from '../data/products'
import { FREE_SHIPPING_MIN_QTY } from '../config/store'
import { cx, pad } from '../lib/format'
import { FAMILIES, lightness, searchProducts, type Family } from '../lib/search'

const SORTS = {
  featured: 'Featured',
  light: 'Light to dark',
  dark: 'Dark to light',
  az: 'Name A–Z',
} as const
type Sort = keyof typeof SORTS

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const mood = (params.get('mood') as Mood | null) ?? null
  const lineParam = params.get('line')
  const line: Line | null = lineParam === 'tee' || lineParam === 'unifit' ? lineParam : null
  const family = (params.get('family') as Family | null) ?? null
  const q = params.get('q') ?? ''
  const sort = ((params.get('sort') as Sort) || 'featured') as Sort
  const view = params.get('view') === 'swatch' ? 'swatch' : 'grid'

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const list = useMemo(() => {
    let l = q ? searchProducts(q) : PRODUCTS
    if (line) l = l.filter((p) => p.line === line)
    if (mood) l = l.filter((p) => p.shade.mood === mood)
    if (family) l = l.filter((p) => (FAMILIES[family].ids as readonly string[]).includes(p.shade.id))
    if (sort === 'light') l = [...l].sort((a, b) => lightness(b.shade.hex) - lightness(a.shade.hex))
    if (sort === 'dark') l = [...l].sort((a, b) => lightness(a.shade.hex) - lightness(b.shade.hex))
    if (sort === 'az') l = [...l].sort((a, b) => a.shade.name.localeCompare(b.shade.name))
    return l
  }, [q, line, mood, family, sort])

  const active = [line && LINES[line].title, mood && MOODS[mood].title, family && FAMILIES[family].label, q && `“${q}”`].filter(Boolean) as string[]
  const heading = mood ? MOODS[mood].title : line ? LINES[line].title : 'Everything'
  const featured = !q && !mood && !family && !line && sort === 'featured'
  const setLine = (l: Line | null) => {
    const next = new URLSearchParams(params)
    next.delete('mood')
    if (l) next.set('line', l)
    else next.delete('line')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <Page title={mood ? MOODS[mood].title : line ? LINES[line].title : 'Shop'}>
      <section className="mx-auto max-w-[1600px] px-5 pt-28 md:px-10 md:pt-40">
        <p className="eyebrow text-mute">{line ? LINES[line].eyebrow : 'Unifit Scrub Suits · Basic Tees · HTP Basics'}</p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <AnimatePresence mode="wait">
            <motion.h1 key={heading} className="display text-[15vw] md:text-[9vw]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <span className={cx(mood && 'italic')}>{heading}</span>
              <sup className="ml-2 align-top font-mono text-base tracking-normal text-mute md:text-xl">({pad(list.length)})</sup>
            </motion.h1>
          </AnimatePresence>
          <p className="max-w-sm pb-3 text-sm leading-relaxed text-ink-2">
            {mood ? MOODS[mood].line : line ? LINES[line].intro : 'Scrub suits in twelve shades for every kind of healthcare bestie, and everyday basic tees for your days off.'}
          </p>
        </div>
      </section>

      {/* filter bar */}
      <div className="sticky top-[var(--header-h)] z-30 mt-10 border-y border-line bg-bone/90 backdrop-blur-md transition-[top] duration-500 ease-[var(--ease-out-expo)]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-3 md:px-10 lg:flex-row lg:items-center lg:gap-6">
          <div className="no-scrollbar -mx-5 flex min-w-0 gap-1.5 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:mx-0 lg:flex-1 lg:px-0" role="group" aria-label="Filter by collection">
            <Chip on={!mood && !line} onClick={() => setLine(null)}>All</Chip>
            {(Object.keys(LINES) as Line[]).map((l) => (
              <Chip key={l} on={line === l} onClick={() => setLine(line === l ? null : l)}>
                {LINES[l].short}
              </Chip>
            ))}
            <span className="mx-1 w-px shrink-0 bg-line" aria-hidden />
            {(Object.keys(MOODS) as Mood[]).map((m) => (
              <Chip key={m} on={mood === m} onClick={() => set('mood', mood === m ? null : m)}>
                {MOODS[m].title}
              </Chip>
            ))}
            <span className="mx-1 w-px shrink-0 bg-line" aria-hidden />
            {(Object.keys(FAMILIES) as Family[]).map((f) => (
              <Chip key={f} on={family === f} onClick={() => set('family', family === f ? null : f)}>
                <span className="flex -space-x-1" aria-hidden>
                  {FAMILIES[f].ids.slice(0, 3).map((id) => (
                    <span key={id} className="size-2.5 rounded-full ring-1 ring-bone" style={{ background: [...SHADES, ...TEE_COLORS].find((s) => s.id === id)!.hex }} />
                  ))}
                </span>
                {FAMILIES[f].label}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-3 lg:shrink-0">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 border-b border-line focus-within:border-ink lg:w-48 lg:flex-none xl:w-56">
              <Search className="size-4 shrink-0 text-mute" strokeWidth={1.4} />
              <span className="sr-only">Search shades</span>
              <input value={q} onChange={(e) => set('q', e.target.value || null)} placeholder="Search" className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-mute" type="search" />
            </label>
            <label className="relative">
              <span className="sr-only">Sort</span>
              <select value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? null : e.target.value)} className="eyebrow h-9 appearance-none bg-transparent pr-5 outline-none">
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[10px]">▾</span>
            </label>
            <div className="flex border border-line" role="group" aria-label="View">
              <button onClick={() => set('view', null)} aria-pressed={view === 'grid'} aria-label="Photo grid" className={cx('grid size-9 place-items-center', view === 'grid' && 'bg-ink text-bone')}>
                <LayoutGrid className="size-4" strokeWidth={1.4} />
              </button>
              <button onClick={() => set('view', 'swatch')} aria-pressed={view === 'swatch'} aria-label="Swatch book" className={cx('grid size-9 place-items-center', view === 'swatch' && 'bg-ink text-bone')}>
                <Palette className="size-4" strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-5 pb-28 pt-8 md:px-10 md:pb-40" aria-live="polite">
        {active.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="eyebrow text-mute">{list.length} results for</span>
            {active.map((a) => (
              <span key={a} className="eyebrow bg-sand px-2.5 py-1">
                {a}
              </span>
            ))}
            <button onClick={() => setParams({}, { replace: true })} className="eyebrow ml-2 flex items-center gap-1 link-underline">
              <X className="size-3" /> Clear all
            </button>
          </div>
        )}

        {list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="display text-5xl italic">No shades match that.</p>
            <p className="mt-3 text-ink-2">Try another color, or clear the filters.</p>
            <button onClick={() => setParams({}, { replace: true })} className="eyebrow mt-8 border-b border-ink pb-1">
              Show everything
            </button>
          </div>
        ) : view === 'grid' ? (
          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => {
                  const wide = featured && i === 4
                  return (
                    <Fragment key={p.slug}>
                      {featured && i === 7 && <Interstitial />}
                      {featured && i > 0 && p.line !== list[i - 1].line && <LineBreak line={p.line} />}
                      <motion.div layout exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className={cx(wide && 'sm:col-span-2')}>
                        <ProductCard product={p} index={i} wide={wide} />
                      </motion.div>
                    </Fragment>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {list.map((p, i) => (
              <motion.div key={p.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.6 }}>
                <Link to={`/product/${p.slug}`} className="group block bg-paper p-2 pb-4 shadow-[0_1px_0_var(--color-line)] transition-transform duration-500 hover:-translate-y-1.5">
                  <span className="relative block aspect-[3/4] overflow-hidden" style={{ background: p.shade.hex }}>
                    <span className={cx('display absolute bottom-3 left-3 text-5xl italic transition-transform duration-700 group-hover:-translate-y-1', p.shade.on === 'light' ? 'text-bone' : 'text-ink')}>{p.line === 'tee' ? 'T' : pad(SHADES.indexOf(p.shade) + 1)}</span>
                  </span>
                  <span className="mt-3 block px-1">
                    <span className="display block text-2xl">{p.shade.name}</span>
                    <span className="eyebrow mt-1 flex justify-between gap-2 text-mute">
                      <span className="truncate">{p.line === 'tee' ? p.name : p.shade.plain}</span>
                      <span>{p.shade.hex.toUpperCase()}</span>
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Page>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={cx('eyebrow flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 transition-colors', on ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink')}>
      {children}
    </button>
  )
}

/** Full-width divider where the grid moves from scrub suits to tees. */
function LineBreak({ line }: { line: Line }) {
  return (
    <motion.div layout className="col-span-full flex flex-wrap items-end justify-between gap-4 border-t border-line pt-10">
      <div>
        <p className="eyebrow text-mute">{LINES[line].eyebrow}</p>
        <h2 className="display mt-3 text-5xl italic md:text-6xl">{LINES[line].title}</h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-ink-2">{LINES[line].intro}</p>
    </motion.div>
  )
}

function Interstitial() {
  return (
    <motion.aside layout className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-ink p-7 text-bone" aria-label="From the studio">
      <p className="eyebrow text-bone/50">From the studio</p>
      <p className="display text-[2.6rem] italic leading-[1.02]">“A little color for every kind of healthcare bestie.”</p>
      <div>
        <div className="flex h-2">
          {SHADES.map((s) => (
            <span key={s.id} className="flex-1" style={{ background: s.hex }} />
          ))}
        </div>
        <p className="eyebrow mt-4 text-bone/50">{FREE_SHIPPING_MIN_QTY > 0 ? `Free shipping on ${FREE_SHIPPING_MIN_QTY} items or more` : 'GCash or Cash on Delivery'}</p>
      </div>
    </motion.aside>
  )
}
