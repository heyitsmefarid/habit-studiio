import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Cross, Monogram, Wordmark } from '../components/Brand'
import { Page } from '../components/Page'
import { FadeIn, SplitReveal } from '../components/Reveal'
import { ShadeImage } from '../components/ShadeImage'
import { STORE } from '../config/store'
import { SHADES } from '../data/products'

export default function Story() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 40])

  return (
    <Page title="Our story">
      <section ref={ref} className="relative overflow-hidden px-5 pb-24 pt-32 md:px-10 md:pb-40 md:pt-44">
        <motion.div style={{ rotate }} className="pointer-events-none absolute -right-24 top-24 text-sand md:right-10" aria-hidden>
          <Monogram className="size-[60vw] md:size-[34vw]" />
        </motion.div>
        <div className="relative mx-auto max-w-[1600px]">
          <p className="eyebrow text-mute">Our story</p>
          <h1 className="display mt-6 text-[17vw] md:text-[11vw]">
            <SplitReveal text="habit," className="italic" />
          </h1>
          <p className="mt-2 font-mono text-sm text-mute">/ˈha-bət/ · noun</p>
          <SplitReveal as="p" text="Something you do so often it becomes part of who you are." className="display mt-8 block max-w-4xl text-4xl leading-[1.08] md:text-6xl" delay={0.2} />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-24 md:grid-cols-12 md:px-10 md:pb-36">
        <motion.div style={{ y }} className="md:col-span-7">
          <ShadeImage photo="brand-cover" alt="Habit Studio by Arianne brand cover with neutral clothing on a rail" tint="#e8dfd2" className="aspect-[16/10]" position="50% 50%" sizes="(min-width: 768px) 58vw, 100vw" />
          <p className="eyebrow mt-3 text-mute">From the Habit Studio page</p>
        </motion.div>
        <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
          <FadeIn>
            <p className="text-lg leading-relaxed">
              <strong className="font-medium">Habit Studio by Arianne</strong> is a curated label for everyday living, based in Quezon City. The idea is simple: the clothes you wear most should be the ones you never have to think twice about.
            </p>
            <p className="mt-5 leading-relaxed text-ink-2">
              For the people who wear a uniform more than anything else in their closet — doctors, nurses, PTs, medtechs, pharmacists, dentists — that means scrubs that fit well, move easily, and come in a color that still feels like them.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow flex items-center gap-2 text-bone/50">
                <Cross className="size-2.5 text-gold" /> {STORE.distributor}
              </p>
              <SplitReveal as="h2" text="Honest basics, made for healthcare." className="display mt-6 block text-5xl italic md:text-7xl" />
            </div>
            <div className="space-y-5 leading-relaxed text-bone/70 md:col-span-5 md:col-start-8 md:pt-16">
              <p>Habit Studio is an official distributor of HTP Basics — HTP Clothing and Basic Scrubs by HTP. We pick the pieces, the shades and the fits, and bring them to you directly from Quezon City.</p>
              <p>Our current focus is the 5-Pocket Unifit Scrub Suit: one honest, well-made uniform in twelve shades, from soft and classy to bold and beautiful.</p>
              <Link to="/shop" className="eyebrow inline-flex items-center gap-2 border-b border-bone/40 pb-1 text-bone hover:border-bone">
                Shop the Unifit <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-6 gap-1 md:grid-cols-12">
            {SHADES.map((s, i) => (
              <motion.div key={s.id} className="aspect-[1/3] origin-bottom" style={{ background: s.hex }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}>
                <span className="sr-only">{s.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="grid gap-px bg-line md:grid-cols-3">
          {[
            ['Thoughtfully made.', 'Every piece is chosen for long shifts and everyday wear — practical first, beautiful always.'],
            ['Effortlessly worn.', 'Pull-on, move-freely uniforms that look put together without trying.'],
            ['Built into your routine.', 'Rotate shades through the week. Getting dressed for duty becomes a small, good habit.'],
          ].map(([h, p], i) => (
            <FadeIn key={h} delay={i * 0.1} className="bg-bone p-8 md:p-12">
              <p className="font-mono text-xs text-mute">0{i + 1}</p>
              <h3 className="display mt-10 text-4xl italic">{h}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-2">{p}</p>
            </FadeIn>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center text-center md:mt-36">
          <Wordmark className="text-5xl md:text-7xl" />
          <p className="mt-10 max-w-md text-ink-2">Ordering for a whole team or batch? Questions about sizing? We’re happy to help.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${STORE.email}`} className="eyebrow flex h-12 items-center bg-ink px-6 text-bone">
              Email us
            </a>
            <a href={STORE.facebook} target="_blank" rel="noreferrer" className="eyebrow flex h-12 items-center border border-ink px-6">
              Message us on Facebook ↗
            </a>
          </div>
          <p className="eyebrow mt-6 text-mute">{STORE.city}</p>
        </div>
      </section>
    </Page>
  )
}
