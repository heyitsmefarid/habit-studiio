// Catalog built from Habit Studio's real Facebook listing:
// "5-Pocket Unifit Scrub Suit Collection" by HTP Basics — SRP ₱950.
// Eight shades are photographed on a model; four more appear in the
// collection flat-lay, so those use a crop of that photo.

export type PhotoName =
  | 'unifit-midnight-black'
  | 'unifit-harbor-steel-blue'
  | 'unifit-saffron-mustard'
  | 'unifit-fern-olive'
  | 'unifit-papaya-orange'
  | 'unifit-dusk-mauve'
  | 'unifit-guava-pink'
  | 'unifit-merlot-maroon'
  | 'unifit-collection-flatlay'
  | 'brand-cover'

export type Mood = 'soft' | 'bold' | 'deep'

/** Focus point inside the flat-lay photo (0–1) and zoom factor. */
export type Crop = { x: number; y: number; zoom: number }

export type Shade = {
  id: string
  name: string
  /** the everyday color name customers use when messaging */
  plain: string
  hex: string
  /** text color that reads on top of `hex` */
  on: 'light' | 'dark'
  mood: Mood
  photo: PhotoName
  crop?: Crop
  /** close-up crop used as a detail shot (of the flat-lay unless detailPhoto is set) */
  flatlay: Crop
  /** shades missing from the flat-lay use a crop of their own photo */
  detailPhoto?: PhotoName
  vibe: string
}

export type Product = {
  slug: string
  name: string
  shade: Shade
  price: number
  sizes: Size[]
  isNew?: boolean
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const
export type Size = (typeof SIZES)[number]

export const SHADES: Shade[] = [
  { id: 'midnight', name: 'Midnight', plain: 'Black', hex: '#1d1c1f', on: 'light', mood: 'deep', photo: 'unifit-midnight-black', flatlay: { x: 0.15, y: 0.72, zoom: 3.2 }, vibe: 'Quiet authority. Never misses a chart.' },
  { id: 'harbor', name: 'Harbor', plain: 'Steel Blue', hex: '#33698a', on: 'light', mood: 'soft', photo: 'unifit-harbor-steel-blue', flatlay: { x: 0.4, y: 0.8, zoom: 3.2 }, vibe: 'Calm under pressure, steady on rounds.' },
  { id: 'saffron', name: 'Saffron', plain: 'Mustard', hex: '#d59a1e', on: 'dark', mood: 'bold', photo: 'unifit-saffron-mustard', flatlay: { x: 0.15, y: 0.22, zoom: 3.2 }, vibe: 'The ward’s resident morning person.' },
  { id: 'fern', name: 'Fern', plain: 'Olive Green', hex: '#4d5a22', on: 'light', mood: 'deep', photo: 'unifit-fern-olive', flatlay: { x: 0.92, y: 0.5, zoom: 3.2 }, vibe: 'Grounded, unbothered, always prepared.' },
  { id: 'papaya', name: 'Papaya', plain: 'Orange', hex: '#e96b3d', on: 'dark', mood: 'bold', photo: 'unifit-papaya-orange', detailPhoto: 'unifit-papaya-orange', flatlay: { x: 0.5, y: 0.32, zoom: 2.6 }, vibe: 'Bright energy, even on hour eleven.' },
  { id: 'dusk', name: 'Dusk', plain: 'Mauve', hex: '#93687f', on: 'light', mood: 'soft', photo: 'unifit-dusk-mauve', detailPhoto: 'unifit-dusk-mauve', flatlay: { x: 0.5, y: 0.34, zoom: 2.6 }, vibe: 'Soft-spoken, sharp-minded.' },
  { id: 'guava', name: 'Guava', plain: 'Pink', hex: '#dc5f7f', on: 'dark', mood: 'bold', photo: 'unifit-guava-pink', flatlay: { x: 0.68, y: 0.68, zoom: 3.2 }, vibe: 'The one everyone wants on their shift.' },
  { id: 'merlot', name: 'Merlot', plain: 'Maroon', hex: '#871f35', on: 'light', mood: 'deep', photo: 'unifit-merlot-maroon', flatlay: { x: 0.43, y: 0.22, zoom: 3.2 }, vibe: 'Classic, composed, a little dramatic.' },
  { id: 'terracotta', name: 'Terracotta', plain: 'Coral', hex: '#cc6a55', on: 'dark', mood: 'bold', photo: 'unifit-collection-flatlay', crop: { x: 0.13, y: 0.45, zoom: 2.4 }, flatlay: { x: 0.13, y: 0.45, zoom: 3.2 }, vibe: 'Warm bedside manner, warmer smile.' },
  { id: 'blush', name: 'Blush', plain: 'Peach', hex: '#efcdb6', on: 'dark', mood: 'soft', photo: 'unifit-collection-flatlay', crop: { x: 0.43, y: 0.45, zoom: 2.4 }, flatlay: { x: 0.43, y: 0.45, zoom: 3.2 }, vibe: 'Gentle hands, clear head.' },
  { id: 'plum', name: 'Plum', plain: 'Eggplant', hex: '#3b2b4a', on: 'light', mood: 'deep', photo: 'unifit-collection-flatlay', crop: { x: 0.75, y: 0.4, zoom: 2.4 }, flatlay: { x: 0.75, y: 0.4, zoom: 3.2 }, vibe: 'Night-shift royalty.' },
  { id: 'dove', name: 'Dove', plain: 'Gray', hex: '#a6a8b7', on: 'dark', mood: 'soft', photo: 'unifit-collection-flatlay', crop: { x: 0.68, y: 0.22, zoom: 2.4 }, flatlay: { x: 0.68, y: 0.22, zoom: 3.2 }, vibe: 'Minimal, clean, zero fuss.' },
]

export const MOODS: Record<Mood, { title: string; line: string; index: string }> = {
  soft: { title: 'Soft & Classy', line: 'Muted tones for the quietly confident.', index: 'I' },
  bold: { title: 'Bold & Beautiful', line: 'Color that walks into the ward first.', index: 'II' },
  deep: { title: 'Deep & Grounded', line: 'Rich darks built for long nights.', index: 'III' },
}

export const PRICE = 950

export const PRODUCTS: Product[] = SHADES.map((shade) => ({
  slug: `unifit-${shade.id}`,
  name: 'Unifit Scrub Suit',
  shade,
  price: PRICE,
  sizes: [...SIZES],
  isNew: ['saffron', 'papaya', 'guava'].includes(shade.id),
}))

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)

export const PRODUCT_DETAILS = {
  summary:
    'A two-piece scrub suit cut to fit every body on every shift — a relaxed V-neck top and tapered jogger pants with an elastic waist. Five pockets across the set keep pens, penlights and your phone within reach.',
  features: [
    { k: 'Set', v: 'V-neck top + jogger pants' },
    { k: 'Pockets', v: '5 across the set, incl. chest pocket' },
    { k: 'Fit', v: 'Unifit — relaxed, unisex cut' },
    { k: 'Waist', v: 'Elastic, pull-on' },
    { k: 'Made by', v: 'HTP Basics · Basic Scrubs by HTP' },
  ],
  care: ['Machine wash cold with similar colors', 'Do not bleach', 'Tumble dry low or line dry in shade', 'Warm iron if needed'],
  professions: ['Doctors', 'Nurses', 'Physical Therapists', 'Medtechs', 'Pharmacists', 'Dentists', 'Caregivers', 'Students'],
}

/** Approximate garment measurements in inches. Confirm with Habit Studio. */
export const SIZE_CHART: { size: Size; chest: string; length: string; waist: string; inseam: string }[] = [
  { size: 'XS', chest: '36', length: '25', waist: '24–28', inseam: '27' },
  { size: 'S', chest: '38', length: '26', waist: '26–30', inseam: '27.5' },
  { size: 'M', chest: '40', length: '27', waist: '28–32', inseam: '28' },
  { size: 'L', chest: '42', length: '28', waist: '30–34', inseam: '28.5' },
  { size: 'XL', chest: '44', length: '29', waist: '32–36', inseam: '29' },
  { size: '2XL', chest: '46', length: '30', waist: '34–38', inseam: '29.5' },
]
