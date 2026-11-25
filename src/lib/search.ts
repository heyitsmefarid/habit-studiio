import { MOODS, PRODUCTS, PRODUCT_DETAILS, type Product } from '../data/products'

export const FAMILIES = {
  neutral: { label: 'Neutrals', ids: ['midnight', 'dove'] },
  cool: { label: 'Blues & Greens', ids: ['harbor', 'fern'] },
  warm: { label: 'Warms', ids: ['saffron', 'papaya', 'terracotta', 'blush'] },
  berry: { label: 'Pinks & Purples', ids: ['guava', 'merlot', 'dusk', 'plum'] },
} as const
export type Family = keyof typeof FAMILIES

const familyOf = (id: string) => (Object.entries(FAMILIES).find(([, f]) => (f.ids as readonly string[]).includes(id))?.[1].label ?? '')

const haystack = (p: Product) =>
  [p.name, p.shade.name, p.shade.plain, p.shade.vibe, MOODS[p.shade.mood].title, familyOf(p.shade.id), 'scrubs scrub suit uniform unifit htp', ...PRODUCT_DETAILS.professions]
    .join(' ')
    .toLowerCase()

export function searchProducts(q: string): Product[] {
  const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return PRODUCTS
  return PRODUCTS.map((p) => {
    const h = haystack(p)
    let score = 0
    for (const t of terms) {
      if (!h.includes(t)) return { p, score: -1 }
      if (p.shade.name.toLowerCase().startsWith(t) || p.shade.plain.toLowerCase().startsWith(t)) score += 3
      else score += 1
    }
    return { p, score }
  })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
}

/** perceived lightness 0–1 for sorting */
export const lightness = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}
