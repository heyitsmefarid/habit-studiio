import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartLine } from './cart'
import type { Region } from '../config/store'

export type Order = {
  id: string
  createdAt: string
  lines: CartLine[]
  customer: { name: string; phone: string; email: string }
  address: { line: string; barangay: string; city: string; province: string; region: Region; zip: string; notes: string }
  payment: { method: 'gcash'; reference: string; senderName: string; senderNumber: string } | { method: 'cod' }
  totals: { subtotal: number; shipping: number; codFee: number; total: number; qty: number }
}

type OrdersState = { orders: Order[]; place: (o: Order) => void }

export const useOrders = create<OrdersState>()(
  persist((set) => ({ orders: [], place: (o) => set((s) => ({ orders: [o, ...s.orders].slice(0, 20) })) }), { name: 'habit-orders' }),
)

export const newOrderId = () => {
  const d = new Date()
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `HS-${ymd}-${rand}`
}
