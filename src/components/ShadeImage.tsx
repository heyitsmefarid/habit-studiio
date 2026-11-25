import { useState } from 'react'
import sources from '../data/photo-sources.json'
import type { Crop, PhotoName } from '../data/products'
import { cx } from '../lib/format'

const REMOTE = sources.photos as Record<string, string>

type Props = {
  photo: PhotoName
  alt: string
  /** shade color shown while loading and if the photo is missing */
  tint?: string
  crop?: Crop
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  /** object-position for un-cropped photos */
  position?: string
}

/**
 * Brand photo with a graceful fallback chain:
 * optimized WebP → original JPG (public/images) → Facebook CDN → color field.
 */
export function ShadeImage({ photo, alt, tint = '#e4dccf', crop, className, imgClassName, sizes = '(min-width: 1024px) 50vw, 100vw', priority, position = '50% 30%' }: Props) {
  const chain = [`/images/${photo}.webp`, `/images/${photo}.jpg`, REMOTE[photo]].filter(Boolean)
  const [step, setStep] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const src = chain[step]
  const failed = step >= chain.length

  // Crops centre a point of a square photo inside the box, using container units.
  const S = crop ? `(max(100cqw, 100cqh) * ${crop.zoom})` : ''
  const style: React.CSSProperties = crop
    ? {
        position: 'absolute',
        width: `calc${S}`,
        height: `calc${S}`,
        maxWidth: 'none',
        left: `clamp(calc(100cqw - ${S}), calc(50cqw - ${crop.x} * ${S}), 0px)`,
        top: `clamp(calc(100cqh - ${S}), calc(50cqh - ${crop.y} * ${S}), 0px)`,
        inset: 'auto',
      }
    : { objectPosition: position }

  return (
    <div className={cx(!className?.includes('absolute') && 'relative', 'overflow-hidden', className)} style={{ backgroundColor: tint, containerType: crop ? 'size' : undefined }}>
      {!failed && (
        <img
          key={src}
          src={src}
          srcSet={step === 0 ? `/images/${photo}-720.webp 720w, /images/${photo}.webp 1600w` : undefined}
          sizes={step === 0 ? sizes : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setStep((s) => s + 1)
          }}
          className={cx(
            crop ? 'transition-[opacity,filter] duration-700 ease-out' : 'absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-700 ease-out',
            loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
            imgClassName,
          )}
          style={style}
        />
      )}
      {failed && (
        <div role="img" aria-label={alt} className="absolute inset-0 grain" />
      )}
    </div>
  )
}
