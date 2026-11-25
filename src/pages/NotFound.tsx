import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { SHADES } from '../data/products'

export default function NotFound() {
  return (
    <Page title="Not found">
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-5 pt-24 text-center">
        <p className="eyebrow text-mute">Error 404</p>
        <h1 className="display mt-6 text-[22vw] italic leading-none md:text-[14vw]">Off duty.</h1>
        <p className="mt-6 max-w-sm text-ink-2">This page clocked out. The scrubs are still here, though.</p>
        <div className="mt-8 flex h-2 w-64">
          {SHADES.map((s) => (
            <span key={s.id} className="flex-1" style={{ background: s.hex }} />
          ))}
        </div>
        <Link to="/shop" className="eyebrow mt-10 flex h-12 items-center bg-ink px-6 text-bone">
          Back to the shop
        </Link>
      </section>
    </Page>
  )
}
