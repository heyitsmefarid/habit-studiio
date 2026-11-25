import { motion } from 'motion/react'
import { Check, Copy, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Page } from '../components/Page'
import { ShadeImage } from '../components/ShadeImage'
import { GCASH, STORE } from '../config/store'
import { lineItems } from '../store/cart'
import { colorLabel } from '../data/products'
import { useOrders, type Order } from '../store/orders'
import { cx, peso } from '../lib/format'
import NotFound from './NotFound'

const ease = [0.16, 1, 0.3, 1] as const

const summaryText = (o: Order) => {
  const items = lineItems(o.lines)
  const pay = o.payment.method === 'gcash' ? `GCash — Ref No. ${o.payment.reference} (sent by ${o.payment.senderName}${o.payment.senderNumber ? `, ${o.payment.senderNumber}` : ''}) to ${GCASH.number}` : 'Cash on Delivery'
  return [
    `HABIT STUDIO ORDER ${o.id}`,
    `Placed: ${new Date(o.createdAt).toLocaleString('en-PH')}`,
    '',
    'ITEMS',
    ...items.map((i) => `• ${i.qty} × ${i.product.name} — ${colorLabel(i.product)}, size ${i.size} — ${peso(i.total)}`),
    '',
    `Subtotal: ${peso(o.totals.subtotal)}`,
    `Shipping (${o.address.region}): ${o.totals.shipping ? peso(o.totals.shipping) : 'Free'}`,
    ...(o.totals.codFee ? [`COD fee: ${peso(o.totals.codFee)}`] : []),
    `TOTAL: ${peso(o.totals.total)}`,
    '',
    `PAYMENT: ${pay}`,
    '',
    'DELIVER TO',
    o.customer.name,
    `${o.customer.phone}${o.customer.email ? ` · ${o.customer.email}` : ''}`,
    `${o.address.line}, Brgy. ${o.address.barangay}, ${o.address.city}, ${o.address.province}${o.address.zip ? ` ${o.address.zip}` : ''}`,
    ...(o.address.notes ? [`Notes: ${o.address.notes}`] : []),
  ].join('\n')
}

export default function OrderConfirmed() {
  const { id } = useParams()
  const order = useOrders((s) => s.orders.find((o) => o.id === id))
  const [copied, setCopied] = useState(false)
  if (!order) return <NotFound />

  const items = lineItems(order.lines)
  const first = order.customer.name.split(' ')[0]
  const gcash = order.payment.method === 'gcash'
  const text = summaryText(order)
  const mailto = `mailto:${STORE.email}?subject=${encodeURIComponent(`New order ${order.id} — ${order.customer.name}`)}&body=${encodeURIComponent(text)}`

  const timeline = [
    { t: 'Order placed', d: 'Saved on this device', done: true },
    { t: gcash ? 'Payment check' : 'Order confirmation', d: gcash ? 'We match your GCash reference' : 'We call or message to confirm', done: false, current: true },
    { t: 'Packed', d: 'Folded with care in Quezon City', done: false },
    { t: 'On the way', d: gcash ? 'Courier delivers to your door' : `Pay the rider ${peso(order.totals.total)}`, done: false },
  ]

  return (
    <Page title={`Order ${order.id}`}>
      <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-28 md:px-10 md:pt-40">
        <div className="flex h-2">
          {items.map((i, n) => (
            <motion.span key={n} className="flex-1 origin-left" style={{ background: i.product.shade.hex }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, ease, delay: 0.3 + n * 0.1 }} />
          ))}
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-2 text-mute">
              <span className="grid size-5 place-items-center rounded-full bg-ink text-bone">
                <Check className="size-3" />
              </span>
              Order {order.id}
            </p>
            <h1 className="display mt-6 text-[17vw] leading-[0.9] md:text-[8rem]">
              Salamat,
              <br />
              <span className="italic">{first}.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-2">
              {gcash ? `We’ve got your GCash reference (${order.payment.method === 'gcash' ? order.payment.reference : ''}). One last step so we can verify it and pack your order:` : 'Your Cash on Delivery order is ready. One last step so we can confirm and pack it:'}
            </p>

            {/* send step */}
            <div className="mt-8 border border-ink p-6 md:p-8">
              <p className="eyebrow">Send your order to Habit Studio</p>
              <p className="mt-2 text-sm text-ink-2">This shop runs without accounts, so your order reaches us when you email it or paste it into a Facebook message.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={mailto} className="eyebrow flex h-12 items-center gap-2 bg-ink px-5 text-bone">
                  <Mail className="size-4" strokeWidth={1.4} /> Email my order
                </a>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(text)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    } catch {}
                  }}
                  className="eyebrow flex h-12 items-center gap-2 border border-ink px-5"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" strokeWidth={1.4} />} {copied ? 'Copied' : 'Copy order details'}
                </button>
                <a href={STORE.facebook} target="_blank" rel="noreferrer" className="eyebrow flex h-12 items-center px-3 link-underline">
                  Message us on Facebook ↗
                </a>
              </div>
            </div>

            <ol className="mt-12 grid gap-px bg-line sm:grid-cols-4" aria-label="Order status">
              {timeline.map((s, i) => (
                <li key={s.t} className="bg-bone p-4 pt-5">
                  <span className={cx('grid size-6 place-items-center rounded-full border font-mono text-[10px]', s.done ? 'border-ink bg-ink text-bone' : s.current ? 'border-ink' : 'border-line text-mute')}>{s.done ? <Check className="size-3" /> : i + 1}</span>
                  <p className={cx('mt-4 font-medium', !s.done && !s.current && 'text-mute')}>{s.t}</p>
                  <p className="mt-1 text-xs text-mute">{s.d}</p>
                  {s.current && <span className="eyebrow mt-3 inline-block bg-sand px-1.5 py-0.5 text-[10px]">Next</span>}
                </li>
              ))}
            </ol>
          </div>

          <aside className="lg:col-span-5">
            <div className="bg-paper p-6 md:p-8">
              <h2 className="display text-3xl italic">Summary</h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {items.map((it) => (
                  <li key={it.slug + it.size} className="flex items-center gap-4 py-3">
                    <ShadeImage photo={it.product.shade.photo} crop={it.product.shade.crop} tint={it.product.shade.hex} alt="" className="h-16 w-[52px]" sizes="52px" />
                    <div className="flex-1">
                      <p className="display text-xl">{it.product.shade.name}</p>
                      <p className="eyebrow text-mute">
                        {it.product.line === 'tee' ? `${it.product.name} · ` : ''}{it.qty} × size {it.size}
                      </p>
                    </div>
                    <p className="font-mono text-sm">{peso(it.total)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 text-sm">
                <Row k="Subtotal" v={peso(order.totals.subtotal)} />
                <Row k={`Shipping · ${order.address.region}`} v={order.totals.shipping ? peso(order.totals.shipping) : 'Free'} />
                {order.totals.codFee > 0 && <Row k="COD fee" v={peso(order.totals.codFee)} />}
                <div className="flex items-baseline justify-between border-t border-ink pt-4">
                  <dt className="eyebrow">Total</dt>
                  <dd className="display text-4xl">{peso(order.totals.total)}</dd>
                </div>
              </dl>
              <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
                <div>
                  <p className="eyebrow mb-2 text-mute">Deliver to</p>
                  <p>{order.customer.name}</p>
                  <p className="text-ink-2">{order.customer.phone}</p>
                  <p className="mt-1 text-ink-2">
                    {order.address.line}, Brgy. {order.address.barangay}, {order.address.city}, {order.address.province}
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-2 text-mute">Payment</p>
                  {order.payment.method === 'gcash' ? (
                    <>
                      <p>GCash</p>
                      <p className="font-mono text-ink-2">Ref {order.payment.reference}</p>
                      <p className="text-ink-2">from {order.payment.senderName}</p>
                    </>
                  ) : (
                    <>
                      <p>Cash on Delivery</p>
                      <p className="text-ink-2">Prepare {peso(order.totals.total)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Link to="/shop" className="eyebrow mt-6 inline-block border-b border-ink pb-1">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>
    </Page>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-2">{k}</dt>
      <dd className="font-mono">{v}</dd>
    </div>
  )
}
