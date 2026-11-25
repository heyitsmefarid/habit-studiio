# Habit Studio by Arianne — online store

A static storefront for **Habit Studio by Arianne** (Quezon City · Official HTP Basics Distributor), built around their real listing: the **5-Pocket Unifit Scrub Suit, ₱950**, in twelve shades.

React 19 · Vite · TypeScript · Tailwind CSS v4 · Motion · GSAP ScrollTrigger · Lenis · Zustand · Lucide

## Run it

```bash
npm install
npm run photos     # downloads the brand's Facebook photos into public/images (do this first)
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

### About the photos

All product images are Habit Studio's own photos from their Facebook page. `npm run photos` saves the originals as JPG plus optimized WebP (1600px and 720px) into `public/images/`:

| File | What it is |
| --- | --- |
| `unifit-midnight-black` … `unifit-merlot-maroon` | 8 model shots, one per shade |
| `unifit-collection-flatlay` | flat-lay of the collection (also used for close-ups and the 4 shades without a model shot) |
| `brand-cover` | Facebook cover graphic |
| `brand-logo` | profile logo (200px only — the site uses a redrawn SVG monogram instead) |

**Facebook links expire** (around 1 Dec 2026). If `npm run photos` reports `HTTP 403`, open the Facebook page, right-click each photo → *Copy image address*, paste the new links into `src/data/photo-sources.json`, and run it again. Or just save the photos by hand into `public/images/` with the filenames above — the site picks up `.jpg` files on their own.

Until photos exist, every image falls back to a flat field in that shade's color, so the site never shows a broken image.

## Before going live — edit `src/config/store.ts`

Items marked ✎ are placeholders:

- **GCash** account name and number (currently `0917 000 0000`), and optionally a QR image at `public/images/gcash-qr.png`
- **Shipping fees** per region (currently ₱100 Metro Manila → ₱210 Mindanao)
- **Free shipping** threshold (currently 3 sets; set `0` to turn off)
- **COD** on/off and any COD fee

Also confirm the **size chart** in `src/data/products.ts` (`SIZE_CHART`) — the numbers there are typical unisex scrub measurements, not HTP's official chart.

## How ordering works (no backend)

1. Customer adds shades/sizes to the bag (saved in their browser).
2. Checkout collects contact + delivery details and payment:
   - **GCash:** the page shows the number and exact amount; the customer enters their 13-digit reference number and sender name.
   - **Cash on Delivery:** customer confirms they'll prepare the cash.
3. The confirmation page gives an order number (e.g. `HS-261126-K3QF`) and asks the customer to **send it** — by *Email my order* (pre-filled email to habitstudiobyarianne@gmail.com) or *Copy order details* to paste into Facebook Messenger.

There's no database, so orders only reach the shop through that email/message step. To receive orders automatically later, the natural next step is a form service (Formspree, Web3Forms) or a small Supabase table.

## Structure

```
src/
  config/store.ts        ← shop settings (GCash, shipping, COD, contact)
  data/products.ts       ← shades, moods, product details, size chart
  data/photo-sources.json
  components/            ← Header, CartDrawer, SearchOverlay, ProductCard, ShadeImage, Preloader…
  sections/              ← homepage sections (Hero shade accordion, Anatomy, Shade finder…)
  pages/                 ← Home, Shop, Product, Lookbook, Story, Checkout, OrderConfirmed
  store/                 ← cart + orders (Zustand, persisted to localStorage)
scripts/fetch-photos.mjs
```

## Deploy

Vercel: import the repo, framework **Vite**. `vercel.json` already rewrites routes to `index.html`. Commit `public/images/` so the photos ship with the site.

Keyboard: press `/` or `Ctrl+K` anywhere to search shades.
