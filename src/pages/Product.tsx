import { AnimatePresence, motion } from 'motion/react'
import { Check, Minus, Plus, Ruler } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Page } from '../components/Page'
import { ProductCard } from '../components/ProductCard'
import { ShadeImage } from '../components/ShadeImage'
import { SizeGuide } from '../components/SizeGuide'
import { COD, FREE_SHIPPING_MIN_QTY, SHIPPING, STORE } from '../config/store'
import { FIT_LABEL, LINES, MOODS, PRODUCT_DETAILS, TEE_DETAILS, colorLabel, getProduct, otherFit, siblings, sizeGuideFor, type PhotoName, type Size } from '../data/products'
import { cx, mix, pad, peso } from '../lib/format'
import { useCart } from '../store/cart'
import NotFound from './NotFound'

const ease = [0.16, 1, 0.3, 1] as const

export default function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  if (!product) return <NotFound />
  return <ProductView key={slug} slug={slug} />
}

function ProductView({ slug }: { slug: string }) {
  const product = getProduct(slug)!
  const { shade } = product
  const navigate = useNavigate()
  const add = useCart((s) => s.add)
  const [size, setSize] = useState<Size | null>(null)
  const [qty, setQty] = useState(1)
  const [guide, setGuide] = useState(false)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)
  const [openTab, setOpenTab] = useState<string | null>('details')
  const sizeRef = useRef<HTMLFieldSetElement>(null)
  const tee = product.line === 'tee'
  const range = siblings(product)
  const idx = range.indexOf(product)
  const modeled = !shade.crop
  const tint = mix(shade.hex, '#f1ece3', 0.9)
  const details = tee ? TEE_DETAILS : PRODUCT_DETAILS
  const guideData = sizeGuideFor(product)
  const counterpart = otherFit(product)

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 2200)
    return () => clearTimeout(t)
  }, [added])

  const onAdd = () => {
    if (!size) {
      setError(true)
      sizeRef.current?.querySelector('input')?.focus()
      return
    }
    add(product.slug, size, qty)
    setAdded(true)
  }

  type Shot = { key: string; photo: PhotoName; crop?: { x: number; y: number; zoom: number }; alt: string; label: string; position?: string }
  const gallery: Shot[] = tee
    ? [
        { key: 'main', photo: shade.photo, alt: `Model wearing the ${product.name} in ${shade.name}`, label: `${FIT_LABEL[product.fit!]}’s fit`, position: '50% 20%' },
        ...(counterpart ? [{ key: 'other', photo: counterpart.shade.photo, alt: `Model wearing the ${counterpart.name} in ${shade.name}`, label: `${FIT_LABEL[counterpart.fit!]}’s fit`, position: '50% 20%' }] : []),
        { key: 'guide', photo: guideData.photo!, alt: `${guideData.title} size guide from HTP Basics`, label: 'Size guide', position: '50% 50%' },
      ]
    : [
        { key: 'main', photo: shade.photo, crop: shade.crop, alt: modeled ? `Model wearing the ${shade.name} Unifit Scrub Suit` : `${shade.name} Unifit Scrub top, folded`, label: modeled ? 'On model' : 'Flat-lay', position: '50% 28%' },
        ...(shade.flatlay ? [{ key: 'detail', photo: shade.detailPhoto ?? ('unifit-collection-flatlay' as const), crop: { ...shade.flatlay, zoom: modeled ? shade.flatlay.zoom : 4.2 }, alt: `Close-up of the ${shade.name} fabric and V-neck`, label: 'Close-up' }] : []),
        { key: 'collection', photo: 'unifit-collection-flatlay', alt: 'The full Unifit collection in twelve shades', label: 'The collection' },
      ]

  const related = (tee ? range : range.filter((p) => p.shade.mood === shade.mood)).filter((p) => p.slug !== slug).slice(0, 3)
  const prev = range[(idx - 1 + range.length) % range.length]
  const next = range[(idx + 1) % range.length]
  const crumb = tee ? { to: '/shop?line=tee', label: LINES.tee.title } : { to: `/shop?mood=${shade.mood}`, label: MOODS[shade.mood].title }

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      body: (
        <>
          <p>{details.summary}</p>
          <dl className="mt-4 divide-y divide-line border-y border-line">
            {details.features.map((f) => (
              <div key={f.k} className="flex justify-between gap-6 py-2.5">
                <dt className="eyebrow text-mute">{f.k}</dt>
                <dd className="text-right">{f.v}</dd>
              </div>
            ))}
          </dl>
        </>
      ),
    },
    {
      id: 'fit',
      label: 'Size & fit',
      body: (
        <p>
          {tee
            ? `Regular fit with slight stretch, in HTP Basics sizes XS, SM, ML, XL, 2XL and 3XL. The ${product.fit === 'women' ? 'women’s tee is cut slimmer and shorter' : 'men’s tee is cut longer and wider'} — check the measurements before you order.`
            : 'Relaxed, unisex Unifit cut in sizes XS to 2XL. Between sizes, go down for a neater look or up for extra room.'}{' '}
          <button className="underline underline-offset-4" onClick={() => setGuide(true)}>
            See the size guide
          </button>
          .
        </p>
      ),
    },
    { id: 'care', label: 'Care', body: <ul className="list-inside list-disc space-y-1">{details.care.map((c) => <li key={c}>{c}</li>)}</ul> },
    {
      id: 'delivery',
      label: 'Delivery & payment',
      body: (
        <ul className="space-y-2">
          <li>Ships from {STORE.city}. Metro Manila from {peso(SHIPPING['Metro Manila'])}, provincial from {peso(SHIPPING['North & South Luzon'])}.</li>
          {FREE_SHIPPING_MIN_QTY > 0 && <li>Free shipping on {FREE_SHIPPING_MIN_QTY} items or more.</li>}
          <li>Pay with GCash — send to our number and enter your reference number at checkout.</li>
          {COD.enabled && <li>Cash on Delivery available. {COD.note}</li>}
        </ul>
      ),
    },
  ]

  return (
    <Page title={`${shade.name} ${product.name}`} tint={shade.hex}>
      <motion.div animate={{ backgroundColor: tint }} transition={{ duration: 0.8 }}>
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 pb-24 pt-20 md:grid-cols-12 md:gap-12 md:px-10 md:pt-28">
          {/* gallery */}
          <div className="min-w-0 md:col-span-7">
            <nav aria-label="Breadcrumb" className="eyebrow mb-5 flex flex-wrap gap-x-2 gap-y-1 text-mute">
              <Link to="/shop" className="link-underline">Shop</Link>
              <span>/</span>
              <Link to={crumb.to} className="link-underline">{crumb.label}</Link>
              <span>/</span>
              <span className="text-ink" aria-current="page">{shade.name}</span>
            </nav>
            <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0">
              {gallery.map((g, i) => (
                <motion.figure
                  key={g.key}
                  className={cx('relative w-[86vw] shrink-0 snap-center md:w-auto', tee ? (g.key === 'guide' ? 'aspect-[4/5] md:aspect-square' : 'aspect-[4/5]') : i === 0 ? 'md:col-span-2 aspect-[4/5] md:aspect-[5/4]' : 'aspect-[4/5]')}
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 1.2, ease, delay: 0.2 + i * 0.1 }}
                >
                  <ShadeImage photo={g.photo} crop={g.crop} tint={shade.hex} alt={g.alt} className="absolute inset-0" position={g.position ?? '50% 50%'} priority={i === 0} sizes={i === 0 ? '(min-width: 768px) 58vw, 90vw' : '(min-width: 768px) 29vw, 90vw'} />
                  <figcaption className="eyebrow absolute bottom-3 left-3 bg-paper/90 px-2 py-1 text-[10px]">{g.label}</figcaption>
                </motion.figure>
              ))}
            </div>
          </div>

          {/* buy box */}
          <div className="min-w-0 md:col-span-5">
            <div className="md:sticky md:top-[calc(var(--header-h)+2rem)] md:transition-[top] md:duration-500">
              <p className="eyebrow text-mute">
                {tee ? `Color ${pad(idx + 1)} of ${pad(range.length)} · ${LINES.tee.title}` : `Shade ${pad(idx + 1)} of ${range.length} · ${MOODS[shade.mood].title}`}
              </p>
              <h1 className="display mt-4 text-[18vw] italic md:text-[7.5vw] lg:text-[6.5rem]">
                {/* letters animate one by one, but each word stays on one line */}
                {shade.name.split(' ').map((word, w, words) => {
                  const offset = words.slice(0, w).join(' ').length + (w ? 1 : 0)
                  return (
                    <span key={w} className="inline-block whitespace-nowrap">
                      {word.split('').map((ch, i) => (
                        <motion.span key={i} className="inline-block" initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease, delay: 0.15 + (offset + i) * 0.035 }}>
                          {ch}
                        </motion.span>
                      ))}
                      {w < words.length - 1 && ' '}
                    </span>
                  )
                })}
              </h1>
              <div className="mt-3 flex items-baseline justify-between gap-4 border-b border-line pb-5">
                <p className="text-ink-2">
                  {product.name}
                  {shade.plain !== shade.name && (
                    <>
                      {' '}· <span className="text-ink">{shade.plain}</span>
                    </>
                  )}
                </p>
                <p className="display text-4xl">{peso(product.price)}</p>
              </div>
              <p className="display mt-5 text-2xl italic text-ink-2">“{shade.vibe}”</p>

              {/* fit switcher (tees) */}
              {tee && counterpart && (
                <div className="mt-8">
                  <p className="eyebrow mb-3">Fit</p>
                  <div className="grid grid-cols-2 gap-1.5" role="list">
                    {(product.fit === 'women' ? [product, counterpart] : [counterpart, product]).map((p) => (
                        <Link
                          key={p.slug}
                          to={`/product/${p.slug}`}
                          role="listitem"
                          aria-current={p.slug === slug ? 'true' : undefined}
                          className={cx('flex h-12 items-center justify-between border px-4 transition-colors', p.slug === slug ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink')}
                        >
                          <span className="eyebrow">{FIT_LABEL[p.fit!]}</span>
                          <span className="font-mono text-sm">{peso(p.price)}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

              {/* shade switcher */}
              <div className="mt-8">
                <p className="eyebrow mb-3 flex justify-between">
                  <span>{tee ? 'Color' : 'Shade'}</span>
                  <span className="text-mute">{shade.name}</span>
                </p>
                <div className="flex flex-wrap gap-2" role="list">
                  {range.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/product/${p.slug}`}
                      role="listitem"
                      aria-label={colorLabel(p)}
                      aria-current={p.slug === slug ? 'true' : undefined}
                      title={p.shade.name}
                      className={cx('size-8 rounded-full transition-transform duration-300 hover:scale-110', p.slug === slug && 'ring-1 ring-ink ring-offset-[3px] ring-offset-bone')}
                      style={{ background: p.shade.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* size */}
              <fieldset ref={sizeRef} className="mt-8" aria-describedby={error ? 'size-error' : undefined}>
                <legend className="eyebrow mb-3 flex w-full justify-between">
                  <span>Size</span>
                  <button type="button" onClick={() => setGuide(true)} className="flex items-center gap-1.5 text-mute link-underline">
                    <Ruler className="size-3.5" strokeWidth={1.4} /> Size guide
                  </button>
                </legend>
                <div className="grid grid-cols-6 gap-1.5">
                  {product.sizes.map((s) => (
                    <label key={s} className={cx('relative grid h-12 cursor-pointer place-items-center border font-mono text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2', size === s ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink', error && !size && 'border-[#a4302a]/60')}>
                      <input type="radio" name="size" value={s} className="sr-only" checked={size === s} onChange={() => { setSize(s); setError(false) }} />
                      {s}
                    </label>
                  ))}
                </div>
                <AnimatePresence>
                  {error && !size && (
                    <motion.p id="size-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm text-[#a4302a]">
                      Please choose a size first.
                    </motion.p>
                  )}
                </AnimatePresence>
              </fieldset>

              {/* qty + add */}
              <div className="mt-6 flex gap-2">
                <div className="flex h-14 items-center border border-line">
                  <button className="grid h-full w-11 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono" aria-live="polite" aria-label={`Quantity ${qty}`}>
                    {qty}
                  </span>
                  <button className="grid h-full w-11 place-items-center" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Increase quantity">
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <button onClick={onAdd} className="group relative flex h-14 flex-1 items-center justify-center overflow-hidden bg-ink text-bone">
                  <span className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" style={{ background: shade.hex }} aria-hidden />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added ? 'added' : 'add'}
                      className={cx('eyebrow relative flex items-center gap-2 transition-colors duration-500', shade.on === 'dark' && 'group-hover:text-ink')}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {added ? (
                        <>
                          <Check className="size-4" /> Added to bag
                        </>
                      ) : (
                        <>Add to bag — {peso(product.price * qty)}</>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <button
                onClick={() => {
                  if (!size) return onAdd()
                  add(product.slug, size, qty)
                  useCart.getState().setOpen(false)
                  navigate('/checkout')
                }}
                className="eyebrow mt-2 h-12 w-full border border-ink transition-colors hover:bg-ink hover:text-bone"
              >
                Buy now
              </button>
              <p className="mt-4 text-xs text-mute">GCash or Cash on Delivery · Ships from Quezon City{FREE_SHIPPING_MIN_QTY > 0 ? ` · Free shipping on ${FREE_SHIPPING_MIN_QTY}+ items` : ''}</p>

              {/* accordion */}
              <div className="mt-10 border-t border-line">
                {tabs.map((t) => (
                  <div key={t.id} className="border-b border-line">
                    <button className="flex w-full items-center justify-between py-4" onClick={() => setOpenTab(openTab === t.id ? null : t.id)} aria-expanded={openTab === t.id} aria-controls={`tab-${t.id}`}>
                      <span className="eyebrow">{t.label}</span>
                      <motion.span animate={{ rotate: openTab === t.id ? 45 : 0 }} className="text-lg leading-none" aria-hidden>
                        +
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openTab === t.id && (
                        <motion.div id={`tab-${t.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease }} className="overflow-hidden">
                          <div className="pb-5 text-sm leading-relaxed text-ink-2">{t.body}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {!tee && (
                <div className="mt-8">
                  <p className="eyebrow mb-3 text-mute">Made for</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRODUCT_DETAILS.professions.map((p) => (
                      <span key={p} className="rounded-full border border-line px-3 py-1 text-xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* related */}
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="display text-5xl italic md:text-6xl">{tee ? `More ${FIT_LABEL[product.fit!].toLowerCase()}’s colors` : `Also in ${MOODS[shade.mood].title}`}</h2>
          <Link to={crumb.to} className="eyebrow hidden border-b border-ink pb-1 md:block">
            See all
          </Link>
        </div>
        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* prev / next shade */}
      <nav aria-label="More shades" className="grid grid-cols-2">
        {[
          { p: prev, dir: tee ? 'Previous color' : 'Previous shade' },
          { p: next, dir: tee ? 'Next color' : 'Next shade' },
        ].map(({ p, dir }, i) => (
          <Link key={dir} to={`/product/${p.slug}`} className={cx('group relative flex h-48 flex-col justify-end overflow-hidden p-5 md:h-72 md:p-10', i === 1 && 'items-end text-right')} style={{ background: p.shade.hex }}>
            <span className={cx('eyebrow', p.shade.on === 'light' ? 'text-bone/70' : 'text-ink/60')}>{dir}</span>
            <span className={cx('display text-5xl italic transition-transform duration-700 ease-[var(--ease-out-expo)] md:text-8xl', i === 0 ? 'group-hover:translate-x-3' : 'group-hover:-translate-x-3', p.shade.on === 'light' ? 'text-bone' : 'text-ink')}>{p.shade.name}</span>
          </Link>
        ))}
      </nav>

      <SizeGuide open={guide} onClose={() => setGuide(false)} highlight={size} guide={guideData} />
    </Page>
  )
}
