import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { MOODS } from '../data/products'
import { cx, peso } from '../lib/format'
import { useCart } from '../store/cart'
import { ShadeImage } from './ShadeImage'

export function ProductCard({ product, index = 0, wide = false, className }: { product: Product; index?: number; wide?: boolean; className?: string }) {
  const { shade } = product
  const add = useCart((s) => s.add)
  const modeled = !shade.crop
  return (
    <motion.article
      className={cx('group relative', className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
    >
      <div className={cx('relative overflow-hidden', wide ? 'aspect-[4/5] md:aspect-[8/5]' : 'aspect-[4/5]')}>
        <Link to={`/product/${product.slug}`} aria-label={`${shade.name} (${shade.plain}) ${product.name}, ${peso(product.price)}`} className="absolute inset-0">
          <ShadeImage
            photo={shade.photo}
            crop={shade.crop}
            tint={shade.hex}
            alt={`${shade.name} ${product.name} in ${shade.plain}`}
            className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            position={wide ? '50% 25%' : '50% 30%'}
            sizes={wide ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          />
          {/* hover: fabric close-up from the collection flat-lay */}
          <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 max-md:hidden" aria-hidden>
            <ShadeImage
              photo={shade.detailPhoto ?? 'unifit-collection-flatlay'}
              crop={modeled ? shade.flatlay : { ...shade.flatlay, zoom: 4.2 }}
              tint={shade.hex}
              alt=""
              className="absolute inset-0"
            />
          </div>
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
          {product.isNew && <span className="eyebrow bg-paper/90 px-2 py-1 text-[10px]">New shade</span>}
          {!modeled && <span className="eyebrow bg-paper/90 px-2 py-1 text-[10px]">Flat-lay</span>}
        </div>
        {/* quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-[120%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-focus-within:translate-y-0 group-hover:translate-y-0 max-md:hidden">
          <div className="flex items-center justify-between bg-paper/95 px-3 py-2 backdrop-blur">
            <span className="eyebrow text-[10px] text-mute">Quick add</span>
            <div className="flex gap-0.5">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => add(product.slug, s)} className="eyebrow min-w-8 px-1.5 py-1 text-[10px] transition-colors hover:bg-ink hover:text-bone" aria-label={`Add ${shade.name} size ${s} to bag`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="display text-[1.9rem] leading-none">
            <Link to={`/product/${product.slug}`} className="link-underline">
              {shade.name}
            </Link>
          </h3>
          <p className="eyebrow mt-2 text-mute">
            {shade.plain} · {MOODS[shade.mood].title}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-mono text-sm">{peso(product.price)}</span>
          <span className="size-3 rounded-full ring-1 ring-line ring-offset-2 ring-offset-bone" style={{ background: shade.hex }} aria-hidden />
        </div>
      </div>
    </motion.article>
  )
}
