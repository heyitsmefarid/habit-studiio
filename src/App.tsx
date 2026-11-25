import { AnimatePresence } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { SearchOverlay } from './components/SearchOverlay'
import { useLenis } from './lib/smooth'
import Home from './pages/Home'

const Shop = lazy(() => import('./pages/Shop'))
const ProductPage = lazy(() => import('./pages/Product'))
const Lookbook = lazy(() => import('./pages/Lookbook'))
const Story = lazy(() => import('./pages/Story'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const location = useLocation()
  const lenis = useLenis()
  const [search, setSearch] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // key on pathname only, so filter changes (?mood=) don't replay the page transition
  const key = location.pathname

  return (
    <>
      <Preloader />
      <Header onSearch={() => setSearch(true)} />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
          else window.scrollTo(0, 0)
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }}
      >
        <Suspense fallback={<div className="h-screen" />} key={key}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/lookbook" element={<Lookbook />} />
            <Route path="/story" element={<Story />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:id" element={<OrderConfirmed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}
