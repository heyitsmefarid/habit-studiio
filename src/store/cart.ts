import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Size } from '../data/products'
import { getProduct } from '../data/products'
import { FREE_SHIPPING_MIN_QTY, SHIPPING, type Region } from '../config/store'

export type CartLine = { slug: string; size: Size; qty: number }

type CartState = {
  lines: CartLine[]
  open: boolean
  lastAdded: string | null
  add: (slug: string, size: Size, qty?: number) => void
  setQty: (slug: string, size: Size, qty: number) => void
  remove: (slug: string, size: Size) => void
  clear: () => void
  setOpen: (open: boolean) => void
}

const same = (a: CartLine, slug: string, size: Size) => a.slug === slug && a.size === size

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      lastAdded: null,
      add: (slug, size, qty = 1) =>
        set((s) => {
          const exists = s.lines.find((l) => same(l, slug, size))
          const lines = exists
            ? s.lines.map((l) => (same(l, slug, size) ? { ...l, qty: Math.min(20, l.qty + qty) } : l))
            : [...s.lines, { slug, size, qty }]
          return { lines, open: true, lastAdded: `${slug}:${size}` }
        }),
      setQty: (slug, size, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => !same(l, slug, size)) : s.lines.map((l) => (same(l, slug, size) ? { ...l, qty: Math.min(20, qty) } : l)),
        })),
      remove: (slug, size) => set((s) => ({ lines: s.lines.filter((l) => !same(l, slug, size)) })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: 'habit-cart', partialize: (s) => ({ lines: s.lines }) },
  ),
)

export const lineItems = (lines: CartLine[]) =>
  lines
    .map((l) => {
      const product = getProduct(l.slug)
      return product ? { ...l, product, total: product.price * l.qty } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)

export const totals = (lines: CartLine[], region?: Region, codFee = 0) => {
  const items = lineItems(lines)
  const qty = items.reduce((a, i) => a + i.qty, 0)
  const subtotal = items.reduce((a, i) => a + i.total, 0)
  const freeShip = FREE_SHIPPING_MIN_QTY > 0 && qty >= FREE_SHIPPING_MIN_QTY
  const shipping = !region || qty === 0 ? 0 : freeShip ? 0 : SHIPPING[region]
  return { items, qty, subtotal, shipping, freeShip, codFee, total: subtotal + shipping + codFee }
}
