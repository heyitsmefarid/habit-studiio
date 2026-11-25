export const peso = (n: number) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const pad = (n: number, l = 2) => String(n).padStart(l, '0')

/** Mix two hex colors: t=0 → a, t=1 → b */
export const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const [x, y] = [p(a), p(b)]
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')
}
