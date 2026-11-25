import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { SplitReveal } from '../components/Reveal'
import { ShadeImage } from '../components/ShadeImage'
import { SHADES } from '../data/products'
import { cx } from '../lib/format'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const s = (id: string) => SHADES.find((x) => x.id === id)!

const DAY = [
  { t: '05:40', title: 'Before the alarm', note: 'Laid out the night before. One less decision.', shade: s('midnight') },
  { t: '06:30', title: 'Commute', note: 'Jeep, MRT, a lot of walking. The elastic waist doesn’t mind.', shade: s('harbor') },
  { t: '07:00', title: 'Endorsement', note: 'Pens in the chest pocket, penlight within reach.', shade: s('saffron') },
  { t: '10:15', title: 'Rounds', note: 'Relaxed through the thigh, tapered at the ankle.', shade: s('fern') },
  { t: '12:30', title: 'Lunch, finally', note: 'Bright enough to be spotted across the cafeteria.', shade: s('papaya') },
  { t: '15:00', title: 'Clinic hours', note: 'Soft color for patients who need a little calm.', shade: s('dusk') },
  { t: '18:45', title: 'Handover', note: 'Still neat after eleven hours.', shade: s('guava') },
  { t: '22:00', title: 'Night shift', note: 'Deep tones for the quiet hours.', shade: s('merlot') },
]

export default function Lookbook() {
  const wrap = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!
        const distance = () => el.scrollWidth - window.innerWidth
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        // parallax inside each frame + progress clock
        gsap.utils.toArray<HTMLElement>('[data-frame-img]').forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
        })
        gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: wrap.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
      })
      return () => mm.revert()
    },
    { scope: wrap },
  )

  return (
    <Page title="Lookbook">
      <section className="mx-auto max-w-[1600px] px-5 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
        <p className="eyebrow text-mute">Lookbook · Vol. 01</p>
        <SplitReveal as="h1" text="A day in the Unifit." className="display mt-5 block text-[16vw] italic md:text-[10vw]" />
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <p className="max-w-md text-ink-2 md:col-span-5 md:col-start-8">
            Eight shades, one shift. Scroll through a healthcare worker’s day — from the first alarm to the quiet hours — and find the color for every part of it.
          </p>
        </div>
      </section>

      <section ref={wrap} className="relative overflow-hidden md:h-screen" aria-label="A day in eight shades">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden px-10 pt-24 md:block">
          <div className="h-px w-full bg-line">
            <div data-progress className="h-px origin-left scale-x-0 bg-ink" />
          </div>
        </div>
        <div ref={track} className="flex flex-col gap-16 px-5 md:h-full md:w-max md:flex-row md:items-center md:gap-0 md:px-10">
          {DAY.map((f, i) => (
            <article key={f.t} className={cx('relative md:mr-[6vw] md:w-[34vw] md:shrink-0', i % 2 === 1 && 'md:mt-[18vh]', i % 3 === 2 && 'md:w-[28vw]')}>
              <div className="relative aspect-[4/5] overflow-hidden" style={{ background: f.shade.hex }}>
                <div data-frame-img className="absolute -inset-x-[10%] inset-y-0">
                  <ShadeImage photo={f.shade.photo} tint={f.shade.hex} alt={`${f.shade.name} Unifit Scrub Suit — ${f.title}`} className="absolute inset-0" sizes="(min-width: 768px) 34vw, 90vw" />
                </div>
                <span className="display absolute right-0 top-0 bg-bone px-3 pb-1 pt-2 text-4xl md:text-5xl">{f.t}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h2 className="display text-3xl italic md:text-4xl">{f.title}</h2>
                  <p className="mt-1 max-w-xs text-sm text-ink-2">{f.note}</p>
                </div>
                <Link to={`/product/unifit-${f.shade.id}`} className="eyebrow flex shrink-0 items-center gap-2 pt-2 link-underline">
                  <span className="size-2.5 rounded-full" style={{ background: f.shade.hex }} />
                  {f.shade.name}
                </Link>
              </div>
            </article>
          ))}
          <article className="flex flex-col justify-center md:h-[70vh] md:w-[40vw] md:shrink-0 md:pr-10">
            <p className="eyebrow text-mute">Off duty</p>
            <p className="display mt-4 text-6xl italic md:text-8xl">Pick tomorrow’s shade.</p>
            <Link to="/shop" className="eyebrow mt-8 flex h-12 w-max items-center gap-3 bg-ink px-6 text-bone">
              Shop all twelve <ArrowRight className="size-4" />
            </Link>
          </article>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[1600px] px-5 pb-28 md:mt-0 md:px-10 md:pb-40">
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-[21/9]">
          <ShadeImage photo="unifit-collection-flatlay" alt="All Unifit shades folded together" tint="#d9d2c6" className="absolute inset-0" position="50% 45%" sizes="100vw" />
        </div>
        <div className="mt-4 flex justify-between">
          <p className="eyebrow">The full spectrum</p>
          <p className="eyebrow text-mute">Twelve shades · One Unifit</p>
        </div>
      </section>
    </Page>
  )
}
