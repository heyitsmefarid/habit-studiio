import { cx } from '../lib/format'

/** HS monogram, redrawn from Habit Studio's logo (interlocked H + S with a dot). */
export function Monogram({ className, title = 'Habit Studio' }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title}>
      <text x="9" y="38" fontFamily="var(--font-display)" fontSize="34" fontWeight="500" fill="currentColor">
        H
      </text>
      <text x="25" y="53" fontFamily="var(--font-display)" fontSize="34" fontWeight="400" fill="currentColor">
        S
      </text>
      <circle cx="49" cy="51" r="1.9" fill="currentColor" />
    </svg>
  )
}

/** Stacked wordmark: HABIT / — STUDIO — / by Arianne */
export function Wordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cx('inline-flex flex-col items-center leading-none select-none', className)}>
      <span className="display text-[1.35em] tracking-[0.22em] pl-[0.22em]" style={{ lineHeight: 1 }}>
        HABIT
      </span>
      {!compact && (
        <>
          <span className="mt-[0.3em] flex items-center gap-[0.45em] text-[0.42em] tracking-[0.5em] pl-[0.5em] font-sans">
            <span className="h-px w-[1.6em] bg-current opacity-60" />
            STUDIO
            <span className="h-px w-[1.6em] bg-current opacity-60" />
          </span>
          <span className="font-script text-[0.7em] -mt-[0.05em] text-gold">by Arianne</span>
        </>
      )}
    </span>
  )
}

/** Small medical-cross glyph used as a separator. */
export function Cross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={cx('inline-block', className)} aria-hidden>
      <path d="M4.5 0h3v4.5H12v3H7.5V12h-3V7.5H0v-3h4.5z" fill="currentColor" />
    </svg>
  )
}
