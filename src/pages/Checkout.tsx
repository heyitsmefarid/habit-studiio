import { AnimatePresence, motion } from 'motion/react'
import { Banknote, Check, Copy, Lock, Smartphone } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Page } from '../components/Page'
import { ShadeImage } from '../components/ShadeImage'
import { COD, FREE_SHIPPING_MIN_QTY, GCASH, SHIPPING, type Region } from '../config/store'
import { SHADES } from '../data/products'
import { cx, peso } from '../lib/format'
import { totals, useCart } from '../store/cart'
import { newOrderId, useOrders, type Order } from '../store/orders'

const ease = [0.16, 1, 0.3, 1] as const
type Method = 'gcash' | 'cod'

type Form = {
  name: string
  phone: string
  email: string
  region: Region | ''
  province: string
  city: string
  barangay: string
  line: string
  zip: string
  notes: string
  reference: string
  senderName: string
  senderNumber: string
  codReady: boolean
  confirm: boolean
}

const EMPTY: Form = { name: '', phone: '', email: '', region: '', province: '', city: '', barangay: '', line: '', zip: '', notes: '', reference: '', senderName: '', senderNumber: '', codReady: false, confirm: false }

const digits = (s: string) => s.replace(/\D/g, '')
const validPhone = (s: string) => /^(09\d{9}|639\d{9})$/.test(digits(s))
const validRef = (s: string) => /^\d{13}$/.test(digits(s))

export default function Checkout() {
  const lines = useCart((s) => s.lines)
  const clear = useCart((s) => s.clear)
  const place = useOrders((s) => s.place)
  const navigate = useNavigate()
  const [f, setF] = useState<Form>(EMPTY)
  const [method, setMethod] = useState<Method>('gcash')
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const codFee = method === 'cod' ? COD.fee : 0
  const t = totals(lines, f.region || undefined, codFee)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const steps = useMemo(() => {
    const contact = f.name.trim().length > 1 && validPhone(f.phone)
    const delivery = !!f.region && !!f.city.trim() && !!f.barangay.trim() && !!f.line.trim() && !!f.province.trim()
    const payment = method === 'gcash' ? validRef(f.reference) && f.senderName.trim().length > 1 : f.codReady
    return { contact, delivery, payment }
  }, [f, method])

  const validate = () => {
    const e: Partial<Record<keyof Form, string>> = {}
    if (f.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!validPhone(f.phone)) e.phone = 'Use an 11-digit PH mobile number, e.g. 0917 123 4567.'
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'That email doesn’t look right.'
    if (!f.region) e.region = 'Choose your region for shipping.'
    if (!f.province.trim()) e.province = 'Required.'
    if (!f.city.trim()) e.city = 'Required.'
    if (!f.barangay.trim()) e.barangay = 'Required.'
    if (!f.line.trim()) e.line = 'House no., street, building or unit.'
    if (method === 'gcash') {
      if (!validRef(f.reference)) e.reference = 'GCash reference numbers have 13 digits.'
      if (f.senderName.trim().length < 2) e.senderName = 'Name on the GCash account that sent the payment.'
      if (f.senderNumber && !validPhone(f.senderNumber)) e.senderNumber = 'Use an 11-digit mobile number.'
    } else if (!f.codReady) e.codReady = 'Please confirm you’ll prepare the cash amount.'
    if (!f.confirm) e.confirm = 'Please confirm your order details.'
    return e
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const first = Object.keys(e)[0]
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.focus()
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      return
    }
    setSubmitting(true)
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      lines,
      customer: { name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim() },
      address: { line: f.line.trim(), barangay: f.barangay.trim(), city: f.city.trim(), province: f.province.trim(), region: f.region as Region, zip: f.zip.trim(), notes: f.notes.trim() },
      payment: method === 'gcash' ? { method: 'gcash', reference: digits(f.reference), senderName: f.senderName.trim(), senderNumber: f.senderNumber.trim() } : { method: 'cod' },
      totals: { subtotal: t.subtotal, shipping: t.shipping, codFee: t.codFee, total: t.total, qty: t.qty },
    }
    setTimeout(() => {
      place(order)
      clear()
      navigate(`/order/${order.id}`)
    }, 900)
  }

  if (t.items.length === 0) {
    return (
      <Page title="Checkout">
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-5 pt-24 text-center">
          <p className="eyebrow text-mute">Checkout</p>
          <h1 className="display mt-6 text-6xl italic md:text-8xl">Your bag is empty.</h1>
          <p className="mt-5 max-w-sm text-ink-2">Pick something first — then come back to pay with GCash or Cash on Delivery.</p>
          <div className="mt-8 flex h-2 w-64">
            {SHADES.map((s) => (
              <span key={s.id} className="flex-1" style={{ background: s.hex }} />
            ))}
          </div>
          <Link to="/shop" className="eyebrow mt-10 flex h-12 items-center bg-ink px-6 text-bone">
            Shop the collection
          </Link>
        </section>
      </Page>
    )
  }

  return (
    <Page title="Checkout">
      <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-24 md:px-10 md:pt-36">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <h1 className="display text-[16vw] italic md:text-8xl">Checkout</h1>
          <ol className="flex gap-6" aria-label="Progress">
            {(
              [
                ['Contact', steps.contact],
                ['Delivery', steps.delivery],
                ['Payment', steps.payment],
              ] as const
            ).map(([label, done], i) => (
              <li key={label} className="eyebrow flex items-center gap-2">
                <span className={cx('grid size-6 place-items-center rounded-full border font-mono text-[10px] transition-colors duration-500', done ? 'border-ink bg-ink text-bone' : 'border-line')}>{done ? <Check className="size-3" /> : i + 1}</span>
                <span className={cx(!done && 'text-mute')}>{label}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <form ref={formRef} onSubmit={submit} noValidate className="lg:col-span-7">
            {/* 01 contact */}
            <Section n="01" title="Contact">
              <div className="grid gap-x-6 md:grid-cols-2">
                <Field label="Full name" name="name" value={f.name} onChange={(v) => set('name', v)} error={errors.name} autoComplete="name" required className="md:col-span-2" />
                <Field label="Mobile number" name="phone" value={f.phone} onChange={(v) => set('phone', v)} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="0917 123 4567" required />
                <Field label="Email (optional)" name="email" value={f.email} onChange={(v) => set('email', v)} error={errors.email} autoComplete="email" type="email" />
              </div>
            </Section>

            {/* 02 delivery */}
            <Section n="02" title="Delivery">
              <fieldset>
                <legend className="eyebrow mb-3 text-mute">Region</legend>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {(Object.keys(SHIPPING) as Region[]).map((r) => (
                    <label key={r} className={cx('cursor-pointer border p-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1', f.region === r ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink', errors.region && 'border-[#a4302a]/50')}>
                      <input type="radio" name="region" value={r} checked={f.region === r} onChange={() => set('region', r)} className="sr-only" />
                      <span className="block text-sm font-medium leading-tight">{r}</span>
                      <span className={cx('mt-1 block font-mono text-xs', f.region === r ? 'text-bone/60' : 'text-mute')}>{t.freeShip ? 'Free' : peso(SHIPPING[r])}</span>
                    </label>
                  ))}
                </div>
                {errors.region && <p className="mt-2 text-sm text-[#a4302a]" role="alert">{errors.region}</p>}
              </fieldset>
              <div className="mt-2 grid gap-x-6 md:grid-cols-2">
                <Field label="House no., street, building / unit" name="line" value={f.line} onChange={(v) => set('line', v)} error={errors.line} autoComplete="address-line1" required className="md:col-span-2" />
                <Field label="Barangay" name="barangay" value={f.barangay} onChange={(v) => set('barangay', v)} error={errors.barangay} required />
                <Field label="City / Municipality" name="city" value={f.city} onChange={(v) => set('city', v)} error={errors.city} autoComplete="address-level2" required />
                <Field label="Province" name="province" value={f.province} onChange={(v) => set('province', v)} error={errors.province} autoComplete="address-level1" placeholder={f.region === 'Metro Manila' ? 'Metro Manila' : ''} required />
                <Field label="ZIP code (optional)" name="zip" value={f.zip} onChange={(v) => set('zip', v)} autoComplete="postal-code" inputMode="numeric" />
                <Field label="Landmark / delivery notes (optional)" name="notes" value={f.notes} onChange={(v) => set('notes', v)} className="md:col-span-2" placeholder="e.g. Blue gate beside the sari-sari store" />
              </div>
            </Section>

            {/* 03 payment */}
            <Section n="03" title="Payment">
              <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                <PayOption on={method === 'gcash'} onSelect={() => setMethod('gcash')} icon={<Smartphone className="size-5" strokeWidth={1.3} />} title="GCash" sub="Send payment, then enter your reference no." />
                {COD.enabled && <PayOption on={method === 'cod'} onSelect={() => setMethod('cod')} icon={<Banknote className="size-5" strokeWidth={1.3} />} title="Cash on Delivery" sub={COD.fee ? `Pay the rider · +${peso(COD.fee)} fee` : 'Pay the rider when it arrives'} />}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {method === 'gcash' ? (
                  <motion.div key="gcash" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="mt-6 border border-line bg-paper">
                    <ol className="divide-y divide-line">
                      <li className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-7">
                        <StepNo n={1} />
                        <div>
                          <p className="font-medium">Send exactly {peso(t.total)} via GCash</p>
                          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                            <div className="space-y-2">
                              <CopyRow label="GCash number" value={GCASH.number} />
                              <CopyRow label="Account name" value={GCASH.accountName} copy={false} />
                              <CopyRow label="Amount" value={String(t.total)} display={peso(t.total)} />
                            </div>
                            {GCASH.qrImage ? (
                              <img src={GCASH.qrImage} alt="GCash QR code for Habit Studio" className="size-36 border border-line bg-white object-contain p-2" />
                            ) : (
                              <div className="grid size-36 place-items-center border border-dashed border-line p-3 text-center text-[11px] leading-snug text-mute">Scan-to-pay QR shows here once added</div>
                            )}
                          </div>
                          {!f.region && <p className="mt-3 text-xs text-mute">Choose your region above — the total includes shipping.</p>}
                        </div>
                      </li>
                      <li className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-7">
                        <StepNo n={2} />
                        <div>
                          <p className="font-medium">Enter your GCash reference number</p>
                          <div className="mt-4 grid items-start gap-6 md:grid-cols-[1fr_200px]">
                            <div>
                              <Field label="Reference no. (13 digits)" name="reference" value={f.reference} onChange={(v) => set('reference', v.replace(/[^\d ]/g, '').slice(0, 16))} error={errors.reference} inputMode="numeric" placeholder="1234 567 891234" required mono />
                              <Field label="Sender’s GCash name" name="senderName" value={f.senderName} onChange={(v) => set('senderName', v)} error={errors.senderName} required />
                              <Field label="Sender’s GCash number (optional)" name="senderNumber" value={f.senderNumber} onChange={(v) => set('senderNumber', v)} error={errors.senderNumber} inputMode="tel" />
                            </div>
                            <ReceiptHint highlight={digits(f.reference)} amount={t.total} />
                          </div>
                        </div>
                      </li>
                      <li className="grid gap-6 p-5 md:grid-cols-[auto_1fr] md:p-7">
                        <StepNo n={3} />
                        <div className="text-sm text-ink-2">
                          <p className="font-medium text-ink">We verify, then ship</p>
                          <p className="mt-1">We match your reference number with our GCash records, then pack your order. Keep your GCash receipt until your order arrives.</p>
                        </div>
                      </li>
                    </ol>
                  </motion.div>
                ) : (
                  <motion.div key="cod" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="mt-6 border border-line bg-paper p-5 md:p-7">
                    <p className="display text-4xl">{peso(t.total)}</p>
                    <p className="eyebrow mt-1 text-mute">To pay the rider{f.region ? '' : ' · choose region for shipping'}</p>
                    <p className="mt-4 text-sm text-ink-2">{COD.note}</p>
                    <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm">
                      <Checkbox name="codReady" checked={f.codReady} onChange={(v) => set('codReady', v)} invalid={!!errors.codReady} />
                      <span>I’ll prepare {peso(t.total)} in cash and keep my phone on for the rider’s call.</span>
                    </label>
                    {errors.codReady && <p className="mt-2 text-sm text-[#a4302a]" role="alert">{errors.codReady}</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>

            <div className="mt-10">
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <Checkbox name="confirm" checked={f.confirm} onChange={(v) => set('confirm', v)} invalid={!!errors.confirm} />
                <span>My name, number and address are correct. I understand Habit Studio will contact me to confirm this order.</span>
              </label>
              {errors.confirm && <p className="mt-2 text-sm text-[#a4302a]" role="alert">{errors.confirm}</p>}
              <button type="submit" disabled={submitting} className="group relative mt-8 flex h-16 w-full items-center justify-between overflow-hidden bg-ink px-6 text-bone disabled:opacity-80">
                <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100" aria-hidden />
                <span className="eyebrow relative flex items-center gap-2">
                  <Lock className="size-3.5" /> {submitting ? 'Placing your order…' : method === 'gcash' ? 'Submit order & reference' : 'Place COD order'}
                </span>
                <span className="relative font-mono">{peso(t.total)}</span>
              </button>
              {Object.values(errors).some(Boolean) && (
                <p className="mt-3 text-sm text-[#a4302a]" role="alert">
                  A few details need your attention above.
                </p>
              )}
            </div>
          </form>

          {/* summary */}
          <aside className="lg:col-span-5" aria-label="Order summary">
            <div className="bg-paper p-6 lg:sticky lg:top-28 md:p-8">
              <div className="flex items-baseline justify-between">
                <h2 className="display text-3xl italic">Your order</h2>
                <span className="eyebrow text-mute">{t.qty} {t.qty === 1 ? 'item' : 'items'}</span>
              </div>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {t.items.map((it) => (
                  <li key={it.slug + it.size} className="flex items-center gap-4 py-4">
                    <div className="relative">
                      <ShadeImage photo={it.product.shade.photo} crop={it.product.shade.crop} tint={it.product.shade.hex} alt="" className="h-20 w-16" sizes="64px" />
                      <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-ink font-mono text-[10px] text-bone">{it.qty}</span>
                    </div>
                    <div className="flex-1">
                      <p className="display text-xl">{it.product.shade.name}</p>
                      <p className="eyebrow mt-0.5 text-mute">
                        {it.product.line === 'tee' ? it.product.name : it.product.shade.plain} · Size {it.size}
                      </p>
                    </div>
                    <p className="font-mono text-sm">{peso(it.total)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-2">Subtotal</dt>
                  <dd className="font-mono">{peso(t.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-2">Shipping {f.region && <span className="text-mute">· {f.region}</span>}</dt>
                  <dd className="font-mono">{t.freeShip ? 'Free' : f.region ? peso(t.shipping) : '—'}</dd>
                </div>
                {t.codFee > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink-2">COD fee</dt>
                    <dd className="font-mono">{peso(t.codFee)}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-ink pt-5">
                <span className="eyebrow">Total</span>
                <motion.span key={t.total} initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} className="display text-5xl">
                  {peso(t.total)}
                </motion.span>
              </div>
              {FREE_SHIPPING_MIN_QTY > 0 && !t.freeShip && (
                <p className="mt-4 text-xs text-mute">
                  Add {FREE_SHIPPING_MIN_QTY - t.qty} more {FREE_SHIPPING_MIN_QTY - t.qty === 1 ? 'item' : 'items'} for free shipping.{' '}
                  <Link to="/shop" className="underline underline-offset-2">
                    Keep shopping
                  </Link>
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </Page>
  )
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-10 first:pt-0" aria-labelledby={`sec-${n}`}>
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-mono text-xs text-mute">{n}</span>
        <h2 id={`sec-${n}`} className="display text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function Field({ label, name, value, onChange, error, className, mono, ...rest }: { label: string; name: string; value: string; onChange: (v: string) => void; error?: string; className?: string; mono?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'name'>) {
  const id = `f-${name}`
  return (
    <div className={cx('pt-4', className)}>
      <label htmlFor={id} className="eyebrow block text-mute">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <input id={id} name={name} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cx('field', mono && 'font-mono tracking-wider')} {...rest} />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs text-[#a4302a]">
          {error}
        </p>
      )}
    </div>
  )
}

function Checkbox({ name, checked, onChange, invalid }: { name: string; checked: boolean; onChange: (v: boolean) => void; invalid?: boolean }) {
  return (
    <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
      <input type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={invalid} className={cx('peer size-5 appearance-none border bg-transparent transition-colors checked:border-ink checked:bg-ink', invalid ? 'border-[#a4302a]' : 'border-ink/40')} />
      <Check className="pointer-events-none absolute size-3.5 text-bone opacity-0 peer-checked:opacity-100" />
    </span>
  )
}

function PayOption({ on, onSelect, icon, title, sub }: { on: boolean; onSelect: () => void; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <button type="button" role="radio" aria-checked={on} onClick={onSelect} className={cx('flex items-start gap-4 border p-5 text-left transition-colors', on ? 'border-ink bg-ink text-bone' : 'border-line hover:border-ink')}>
      <span className="mt-0.5">{icon}</span>
      <span>
        <span className="display block text-2xl">{title}</span>
        <span className={cx('mt-1 block text-xs', on ? 'text-bone/60' : 'text-mute')}>{sub}</span>
      </span>
      <span className={cx('ml-auto mt-1 size-4 shrink-0 rounded-full border', on ? 'border-bone bg-bone shadow-[inset_0_0_0_3px_var(--color-ink)]' : 'border-line')} aria-hidden />
    </button>
  )
}

function StepNo({ n }: { n: number }) {
  return <span className="display grid size-10 place-items-center rounded-full border border-ink text-xl italic">{n}</span>
}

function CopyRow({ label, value, display, copy = true }: { label: string; value: string; display?: string; copy?: boolean }) {
  const [done, setDone] = useState(false)
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
      <span className="eyebrow text-mute">{label}</span>
      <span className="flex items-center gap-2">
        <span className="font-mono text-sm">{display ?? value}</span>
        {copy && (
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value.replace(/\s/g, ''))
                setDone(true)
                setTimeout(() => setDone(false), 1500)
              } catch {}
            }}
            className="grid size-7 place-items-center hover:bg-sand"
            aria-label={`Copy ${label}`}
          >
            {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" strokeWidth={1.4} />}
          </button>
        )}
      </span>
    </div>
  )
}

/** Mini GCash receipt that shows where the reference number is, filled live as you type. */
function ReceiptHint({ highlight, amount }: { highlight: string; amount: number }) {
  const ref = (highlight + '•••••••••••••').slice(0, 13)
  const fmt = `${ref.slice(0, 4)} ${ref.slice(4, 7)} ${ref.slice(7)}`
  return (
    <figure className="hidden md:block" aria-label="Where to find your reference number">
      <div className="rounded-xl border border-line bg-white p-4 text-[11px] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-3 grid size-8 place-items-center rounded-full bg-ink text-bone">
          <Check className="size-4" />
        </div>
        <p className="text-center text-[10px] text-mute">Sent via GCash</p>
        <p className="mt-1 text-center font-mono text-base">{peso(amount)}</p>
        <div className="mt-3 space-y-1 border-t border-dashed border-line pt-3 text-mute">
          <div className="flex justify-between">
            <span>Amount</span>
            <span className="font-mono">{amount.toFixed(2)}</span>
          </div>
          <div className="-mx-2 flex justify-between rounded bg-[#fff3c4] px-2 py-1 text-ink">
            <span>Ref No.</span>
            <span className="font-mono">{fmt}</span>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <span className="font-mono">Today</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 text-center text-[11px] text-mute">Find “Ref No.” on your GCash receipt</figcaption>
    </figure>
  )
}
