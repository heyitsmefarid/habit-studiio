import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { ArrowRight, ArrowUpRight, Shuffle } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cross } from '../components/Brand'
import { FadeIn, Marquee, SplitReveal } from '../components/Reveal'
import { ShadeImage } from '../components/ShadeImage'
import { STORE } from '../config/store'
import { MOODS, PRICE, PRODUCT_DETAILS, SHADES, type Mood } from '../data/products'
import { cx, pad, peso } from '../lib/format'
import { lightness } from '../lib/search'
import { useCart } from '../store/cart'

const ease = [0.16, 1, 0.3, 1] as const
const shade = (id: string) => SHADES.find((s) => s.id === id)!

/* ───────────────── Professions ticker ───────────────── */
export function Professions() {
  return (
    <section aria-label="Made for every healthcare professional" className="border-y border-line bg-paper py-6 md:py-8">
      <Marquee speed={45}>
        {PRODUCT_DETAILS.professions.map((p, i) => (
          <span key={p} className="flex items-center">
            <span className={cx('display px-6 text-4xl md:px-10 md:text-6xl', i % 2 ? 'italic' : '')}>{p}</span>
            <Cross className="size-3 text-gold" />
          </span>
        ))}
      </Marquee>
    </section>
  )
}

/* ───────────────── Manifesto ───────────────── */
const MANIFESTO =
  'A curated label for everyday living. Uniforms you reach for without thinking, in colors that still feel like you at hour twelve.'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.45'] })
  const words = MANIFESTO.split(' ')
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-44">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="eyebrow md:col-span-3">
          <span className="text-mute">N°02 —</span> The habit
        </p>
        <div ref={ref} className="md:col-span-9">
          <p className="display text-[9vw] leading-[1.02] md:text-[4.6vw]" aria-label={MANIFESTO}>
            <span aria-hidden>
              {words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {w}
                </Word>
              ))}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-20 grid gap-px bg-line md:mt-32 md:grid-cols-3">
        {[
          { t: '06:00', h: 'Thoughtfully made.', p: 'Curated from Basic Scrubs by HTP. Five pockets, a clean V-neck, nothing you don’t need.' },
          { t: '14:00', h: 'Effortlessly worn.', p: 'A relaxed Unifit cut with an elastic waist and jogger leg — easy to move in from endorsement to handover.' },
          { t: '22:00', h: 'Built into your routine.', p: 'Twelve shades to rotate through the week, so getting dressed for duty is the easiest decision you make.' },
        ].map((c, i) => (
          <FadeIn key={c.t} delay={i * 0.1} className="bg-bone p-6 pb-10 md:p-10 md:pb-14">
            <p className="font-mono text-xs text-mute">{c.t}</p>
            <h3 className="display mt-10 text-4xl italic md:mt-16">{c.h}</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-2">{c.p}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

/* ───────────────── Anatomy ───────────────── */
const SPECS = [
  { n: '01', h: 'Clean V-neck', p: 'A simple V that frames the face and layers easily under a white coat.', pin: { x: 49, y: 22 } },
  { n: '02', h: 'Five pockets', p: 'Spread across the top and pants for pens, penlight, ID and phone.', pin: null },
  { n: '03', h: 'Elastic waist', p: 'Pull-on and stay-put. No drawstrings to retie mid-shift.', pin: { x: 49, y: 41 } },
  { n: '04', h: 'Jogger leg', p: 'Relaxed through the thigh, tapered to the ankle — neat with any shoe.', pin: { x: 46, y: 84 } },
  { n: '05', h: 'Unifit cut', p: 'One relaxed, unisex pattern built to fit every kind of body.', pin: null },
]

export function Anatomy() {
  const [active, setActive] = useState(0)
  const harbor = shade('harbor')
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-5">
          <p className="eyebrow text-bone/50">N°03 — Anatomy of the Unifit</p>
          <SplitReveal as="h2" text="Every detail earns its place." className="display mt-6 block text-6xl italic md:text-7xl" />
          <ol className="mt-12 divide-y divide-bone/10 border-y border-bone/10">
            {SPECS.map((s, i) => (
              <li key={s.n}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-start gap-6 py-5 text-left"
                  aria-expanded={active === i}
                >
                  <span className={cx('font-mono text-xs transition-colors', active === i ? 'text-gold' : 'text-bone/40')}>{s.n}</span>
                  <span className="flex-1">
                    <span className={cx('display block text-3xl transition-[font-style]', active === i && 'italic')}>{s.h}</span>
                    <motion.span className="block overflow-hidden text-sm text-bone/60" initial={false} animate={{ height: active === i ? 'auto' : 0, opacity: active === i ? 1 : 0 }} transition={{ duration: 0.5, ease }}>
                      <span className="block pt-2">{s.p}</span>
                    </motion.span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative md:col-span-6 md:col-start-7">
          <div className="relative aspect-square">
            <ShadeImage photo={harbor.photo} tint={harbor.hex} alt="The Unifit Scrub Suit in Harbor, front view" className="absolute inset-0" position="50% 50%" sizes="(min-width: 768px) 50vw, 100vw" />
            {SPECS.map((s, i) =>
              s.pin ? (
                <motion.span
                  key={s.n}
                  aria-hidden
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${s.pin.x}%`, top: `${s.pin.y}%` }}
                  animate={{ scale: active === i ? 1 : 0.7, opacity: active === i ? 1 : 0.55 }}
                >
                  <span className="relative grid size-7 place-items-center rounded-full bg-bone font-mono text-[10px] text-ink">
                    {s.n}
                    {active === i && <span className="absolute inset-0 animate-ping rounded-full bg-bone/60" />}
                  </span>
                </motion.span>
              ) : null,
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="eyebrow text-bone/50">Shown in Harbor · Steel Blue</p>
            <Link to="/product/unifit-harbor" className="eyebrow link-underline">
              View product →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── Shade finder ───────────────── */
const SHIFTS = [
  { id: 'day', label: 'Day shift', note: 'Sunlit wards, early rounds' },
  { id: 'rotating', label: 'Rotating', note: 'A little of everything' },
  { id: 'night', label: 'Night shift', note: 'Quiet halls, long hours' },
] as const

export function ShadeFinder() {
  const [mood, setMood] = useState<Mood | null>(null)
  const [shift, setShift] = useState<(typeof SHIFTS)[number]['id'] | null>(null)
  const [nudge, setNudge] = useState(0)
  const add = useCart((s) => s.add)

  const result = useMemo(() => {
    if (!mood || !shift) return null
    const pool = SHADES.filter((s) => s.mood === mood).sort((a, b) => lightness(b.hex) - lightness(a.hex))
    const base = shift === 'day' ? 0 : shift === 'rotating' ? 1 : pool.length - 1
    return pool[(base + nudge) % pool.length]
  }, [mood, shift, nudge])

  return (
    <section id="shade-finder" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36" aria-labelledby="finder-title">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow text-mute">N°04 — Shade finder</p>
          <SplitReveal as="h2" text="Which shade matches your personality?" className="display mt-6 block text-[12vw] md:text-7xl" />
          <span id="finder-title" className="sr-only">
            Shade finder
          </span>

          <fieldset className="mt-12">
            <legend className="eyebrow mb-4">1 · Your energy on duty</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(MOODS) as Mood[]).map((m) => (
                <label key={m} className={cx('cursor-pointer border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1', mood === m ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink')}>
                  <input type="radio" name="mood" value={m} className="sr-only" checked={mood === m} onChange={() => { setMood(m); setNudge(0) }} />
                  <span className="display block text-2xl italic">{MOODS[m].title}</span>
                  <span className={cx('mt-3 flex gap-1')} aria-hidden>
                    {SHADES.filter((s) => s.mood === m).map((s) => (
                      <span key={s.id} className="h-2 flex-1" style={{ background: s.hex }} />
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="eyebrow mb-4">2 · Your usual shift</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {SHIFTS.map((s) => (
                <label key={s.id} className={cx('cursor-pointer border p-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1', shift === s.id ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink')}>
                  <input type="radio" name="shift" value={s.id} className="sr-only" checked={shift === s.id} onChange={() => { setShift(s.id); setNudge(0) }} />
                  <span className="block font-medium">{s.label}</span>
                  <span className={cx('mt-1 block text-xs', shift === s.id ? 'text-bone/60' : 'text-mute')}>{s.note}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="md:col-span-5 md:col-start-8" aria-live="polite">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand">
            <AnimatePresence mode="popLayout">
              {result ? (
                <motion.div key={result.id} className="absolute inset-0" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} exit={{ opacity: 0 }} transition={{ duration: 1, ease }}>
                  <ShadeImage photo={result.photo} crop={result.crop} tint={result.hex} alt={`${result.name} Unifit Scrub Suit`} className="absolute inset-0" />
                  <div className={cx('absolute inset-x-0 bottom-0 p-6', result.on === 'light' || result.crop ? 'bg-gradient-to-t from-ink/70 to-transparent text-bone' : 'bg-gradient-to-t from-ink/60 to-transparent text-bone')}>
                    <p className="eyebrow opacity-80">Your shade is</p>
                    <p className="display text-7xl italic">{result.name}</p>
                    <p className="mt-1 text-sm opacity-90">{result.vibe}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" className="absolute inset-0 grid grid-cols-4" exit={{ opacity: 0 }}>
                  {SHADES.map((s, i) => (
                    <motion.span key={s.id} style={{ background: s.hex }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} />
                  ))}
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="display bg-bone px-5 py-3 text-2xl italic">Answer two questions →</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-3">
              <button onClick={() => add(`unifit-${result.id}`, 'M')} className="eyebrow flex h-12 flex-1 items-center justify-center gap-3 bg-ink px-5 text-bone">
                <span className="size-2.5 rounded-full" style={{ background: result.hex }} /> Add {result.name} · M — {peso(PRICE)}
              </button>
              <Link to={`/product/unifit-${result.id}`} className="eyebrow flex h-12 items-center border border-ink px-5">
                Choose size
              </Link>
              <button onClick={() => setNudge((n) => n + 1)} className="eyebrow flex h-12 items-center gap-2 px-3 text-ink-2" aria-label="Show another shade in this mood">
                <Shuffle className="size-4" strokeWidth={1.4} /> Another
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── Mood collections ───────────────── */
export function Collections() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-36">
      <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-10">
        <div>
          <p className="eyebrow text-mute">N°05 — Collections</p>
          <SplitReveal as="h2" text="From soft and classy to bold and beautiful." className="display mt-5 block max-w-3xl text-5xl md:text-7xl" />
        </div>
        <Link to="/shop" className="eyebrow flex items-center gap-2 border-b border-ink pb-1">
          All 12 shades <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
        {(Object.keys(MOODS) as Mood[]).map((m, idx) => {
          const list = SHADES.filter((s) => s.mood === m)
          const hero = list.find((s) => !s.crop) ?? list[0]
          return (
            <FadeIn key={m} delay={idx * 0.1}>
              <Link to={`/shop?mood=${m}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-0 flex">
                    {list.map((s) => (
                      <span key={s.id} className="flex-1 transition-[flex-grow] duration-1000 ease-[var(--ease-out-expo)] group-hover:flex-grow-0" style={{ background: s.hex }} />
                    ))}
                  </div>
                  <div className="absolute inset-0 [clip-path:inset(0_0_100%_0)] transition-[clip-path] duration-1000 ease-[var(--ease-out-expo)] group-hover:[clip-path:inset(0_0_0%_0)] group-focus-visible:[clip-path:inset(0_0_0%_0)]">
                    <ShadeImage photo={hero.photo} crop={hero.crop} tint={hero.hex} alt="" className="absolute inset-0" sizes="33vw" />
                  </div>
                  <span className="display absolute left-5 top-4 text-7xl text-bone drop-shadow-[0_1px_12px_rgba(0,0,0,0.25)]">{MOODS[m].index}</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display text-4xl italic">{MOODS[m].title}</h3>
                    <p className="mt-2 text-sm text-ink-2">{MOODS[m].line}</p>
                    <p className="eyebrow mt-3 text-mute">{list.map((s) => s.name).join(' · ')}</p>
                  </div>
                  <ArrowUpRight className="mt-2 size-5 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.3} />
                </div>
              </Link>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}

/* ───────────────── Lookbook teaser ───────────────── */
export function LookbookTeaser() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['18%', '-18%'])
  const y3 = useTransform(scrollYProgress, [0, 1], ['2%', '-24%'])
  const frames = [
    { s: shade('merlot'), t: '05:40', c: 'Before the alarm', y: y1, cls: 'md:col-span-4 md:mt-24' },
    { s: shade('papaya'), t: '12:30', c: 'Lunch, finally', y: y2, cls: 'md:col-span-4 md:col-start-6' },
    { s: shade('dusk'), t: '19:00', c: 'Handover, unhurried', y: y3, cls: 'md:col-span-3 md:col-start-10 md:mt-40' },
  ]
  return (
    <section ref={ref} className="overflow-hidden bg-sand/60 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-mute">N°06 — Lookbook</p>
            <SplitReveal as="h2" text="A day in the Unifit." className="display mt-5 block text-6xl italic md:text-8xl" />
          </div>
          <Link to="/lookbook" className="group eyebrow flex h-12 items-center gap-3 bg-ink px-6 text-bone">
            View the lookbook <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-12">
          {frames.map((f) => (
            <motion.figure key={f.t} style={{ y: f.y }} className={f.cls}>
              <ShadeImage photo={f.s.photo} tint={f.s.hex} alt={`${f.s.name} Unifit Scrub Suit — ${f.c}`} className="aspect-[4/5]" sizes="33vw" />
              <figcaption className="mt-3 flex items-baseline justify-between">
                <span className="font-mono text-xs">{f.t}</span>
                <span className="display text-xl italic">{f.c}</span>
                <span className="eyebrow text-mute">{f.s.name}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────── Distributor / flat-lay band ───────────────── */
export function FlatlayBand() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.04, 1])
  return (
    <section ref={ref} className="relative h-[90svh] min-h-[560px] overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <ShadeImage photo="unifit-collection-flatlay" alt="The Unifit Scrub Suit collection laid out in twelve shades" tint="#d9d2c6" className="absolute inset-0" position="50% 50%" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-10 text-bone md:px-10 md:pb-16">
        <p className="eyebrow flex items-center gap-2 text-bone/80">
          <Cross className="size-2.5 text-gold" /> {STORE.distributor} · {STORE.city}
        </p>
        <h2 className="display mt-4 text-[14vw] leading-[0.88] md:text-[9vw]">
          Twelve shades.
          <br />
          <span className="italic">One uniform.</span>
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link to="/shop" className="eyebrow flex h-12 items-center gap-3 bg-bone px-6 text-ink">
            Shop the collection <ArrowRight className="size-4" />
          </Link>
          <span className="font-mono text-sm text-bone/80">{peso(PRICE)} per set</span>
          <span className="flex gap-1" aria-hidden>
            {SHADES.map((s, i) => (
              <span key={s.id} title={s.name} className="size-3 rounded-full ring-1 ring-bone/30" style={{ background: s.hex }}>
                <span className="sr-only">{pad(i + 1)}</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}
