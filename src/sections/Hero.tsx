import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShadeImage } from '../components/ShadeImage'
import { PRICE, SHADES } from '../data/products'
import { cx, mix, pad, peso } from '../lib/format'

const MODELED = SHADES.filter((s) => !s.crop)
const ease = [0.16, 1, 0.3, 1] as const
const INTERVAL = 4200

export function Hero() {
  const [i, setI] = useState(2)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const touched = useRef(false)
  const shade = MODELED[i]

  useEffect(() => {
    if (paused || reduce) return
    const t = setTimeout(() => setI((n) => (n + 1) % MODELED.length), INTERVAL)
    return () => clearTimeout(t)
  }, [i, paused, reduce])

  const pick = (n: number) => {
    touched.current = true
    setI(n)
  }

  return (
    <motion.section
      aria-label="The Unifit collection"
      className="relative min-h-[100svh] overflow-hidden pt-16 md:pt-20"
      animate={{ backgroundColor: mix(shade.hex, '#f1ece3', 0.88) }}
      transition={{ duration: 1.2, ease }}
    >
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-[1600px] grid-cols-1 gap-8 px-5 pb-8 md:gap-10 md:px-10 md:pb-10 lg:grid-cols-12">
        {/* copy */}
        <div className="relative z-10 flex min-w-0 flex-col justify-between pt-6 md:pt-10 lg:col-span-5">
          <div>
            <motion.p className="eyebrow flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <span className="inline-block h-px w-8 bg-ink" />
              N°01 — The Unifit Collection
            </motion.p>
            <h1 className="display mt-6 text-[15vw] md:mt-8 md:text-[10vw] lg:text-[clamp(3.4rem,5.6vw,6.8rem)]">
              {['Color,', 'built into', 'your routine.'].map((line, n) => (
                <span key={n} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={cx('block whitespace-nowrap', n === 0 && 'italic', n === 2 && 'md:pl-[0.5em]')}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.3, ease, delay: 0.25 + n * 0.09 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1, ease }}>
              The 5-Pocket Unifit Scrub Suit by HTP Basics, in twelve shades — for the doctors, nurses, PTs, medtechs, pharmacists and dentists who wear it every day.
            </motion.p>
          </div>

          {/* active shade readout */}
          <div className="mt-10 hidden md:block">
            <div className="flex items-end justify-between gap-6 border-t border-ink/20 pt-5">
              <div className="min-h-[7.5rem] min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div key={shade.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.6, ease }}>
                    <p className="eyebrow text-ink-2">
                      Shade {pad(i + 1)} / {pad(MODELED.length)} · {shade.plain}
                    </p>
                    <p className="display mt-2 text-6xl italic">{shade.name}</p>
                    <p className="mt-2 text-sm text-ink-2">{shade.vibe}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <Link
                to={`/product/unifit-${shade.id}`}
                className="group relative flex h-14 shrink-0 items-center gap-4 overflow-hidden bg-ink pl-5 pr-6 text-bone"
              >
                <motion.span className="size-3 rounded-full" animate={{ backgroundColor: shade.hex }} />
                <span className="eyebrow">Shop {shade.name}</span>
                <span className="font-mono text-xs opacity-60">{peso(PRICE)}</span>
                <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.4} />
              </Link>
            </div>
          </div>
        </div>

        {/* desktop: shade accordion */}
        <div
          className="relative hidden h-[min(64svh,720px)] gap-1.5 self-end md:flex lg:col-span-7 lg:h-[min(82svh,860px)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="group"
          aria-label="Choose a shade"
        >
          {MODELED.map((s, n) => {
            const active = n === i
            return (
              <motion.button
                key={s.id}
                
                aria-pressed={active}
                aria-label={`${s.name} — ${s.plain}`}
                onMouseEnter={() => pick(n)}
                onFocus={() => pick(n)}
                onClick={() => pick(n)}
                className="relative h-full min-w-0 overflow-hidden text-left outline-offset-2"
                style={{ backgroundColor: s.hex }}
                animate={{ flexGrow: active ? 7 : 1 }}
                initial={{ flexGrow: 1, clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                viewport={{ once: true }}
                transition={{ flexGrow: { duration: 1, ease }, clipPath: { duration: 1.2, ease, delay: 0.35 + n * 0.06 } }}
              >
                <motion.div className="absolute inset-0" animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.8 }}>
                  <ShadeImage photo={s.photo} tint={s.hex} alt={`Model wearing the ${s.name} Unifit Scrub Suit`} className="absolute inset-0" position="50% 35%" priority={n === 2} sizes="50vw" />
                </motion.div>
                <span
                  className={cx(
                    'eyebrow absolute bottom-5 left-1/2 origin-left -rotate-90 whitespace-nowrap transition-opacity duration-500 [writing-mode:horizontal-tb]',
                    active ? 'opacity-0' : 'opacity-90',
                    s.on === 'light' ? 'text-bone' : 'text-ink',
                  )}
                  style={{ translate: '0.4rem 0' }}
                >
                  {pad(n + 1)} {s.name}
                </span>
                {active && !paused && !reduce && (
                  <motion.span
                    key={`p-${i}`}
                    className="absolute bottom-0 left-0 h-[3px] bg-bone/90 mix-blend-difference"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* mobile: cross-fading card + swatches */}
        <div className="md:hidden">
          <Link to={`/product/unifit-${shade.id}`} className="relative block aspect-[4/5] overflow-hidden" style={{ background: shade.hex }}>
            <AnimatePresence initial={false}>
              <motion.div key={shade.id} className="absolute inset-0" initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease }}>
                <ShadeImage photo={shade.photo} tint={shade.hex} alt={`Model wearing the ${shade.name} Unifit Scrub Suit`} className="absolute inset-0" position="50% 30%" priority />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/50 to-transparent p-4 text-bone">
              <div>
                <p className="eyebrow opacity-80">{shade.plain}</p>
                <p className="display text-5xl italic">{shade.name}</p>
              </div>
              <span className="eyebrow border-b border-bone pb-0.5">Shop · {peso(PRICE)}</span>
            </div>
          </Link>
          <div className="mt-4 flex justify-between" role="group" aria-label="Choose a shade">
            {MODELED.map((s, n) => (
              <button key={s.id} aria-pressed={n === i} aria-label={s.name} onClick={() => pick(n)} className="grid size-10 place-items-center">
                <span className={cx('size-7 rounded-full transition-transform duration-500', n === i && 'scale-[1.25] ring-1 ring-ink ring-offset-2 ring-offset-bone')} style={{ background: s.hex }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
