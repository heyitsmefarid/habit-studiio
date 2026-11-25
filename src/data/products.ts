// Catalog built from Habit Studio's real Facebook listings:
// 1. "5-Pocket Unifit Scrub Suit Collection" by HTP Basics — SRP ₱950.
//    Eight shades are photographed on a model; four more appear in the
//    collection flat-lay, so those use a crop of that photo.
// 2. HTP Basics Premium Basic Tee (posted 5 Nov 2026) — Aqua, Olive, Red,
//    Sage Green, Taupe; women's ₱450, men's ₱490; XS–3XL.

export type Line = 'unifit' | 'tee'
export type Fit = 'women' | 'men'

type TeePhoto = `tee-${Fit}-${'aqua' | 'olive' | 'red' | 'sage' | 'taupe'}` | `tee-size-guide-${Fit}`

export type PhotoName =
  | TeePhoto
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
  /** close-up crop used as a detail shot (of the flat-lay unless detailPhoto is set); scrubs only */
  flatlay?: Crop
  /** shades missing from the flat-lay use a crop of their own photo */
  detailPhoto?: PhotoName
  vibe: string
}

export type Product = {
  slug: string
  line: Line
  /** tees come in a women's and a men's cut, sold as separate products */
  fit?: Fit
  name: string
  shade: Shade
  price: number
  sizes: Size[]
  isNew?: boolean
}

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'] as const
/** HTP Basics tee sizing, exactly as on their size guide */
export const TEE_SIZES = ['XS', 'SM', 'ML', 'XL', '2XL', '3XL'] as const
export type Size = (typeof SIZES)[number] | (typeof TEE_SIZES)[number]

/** Scrub-suit shades. Hero, lookbook, story and home sections are built from these. */
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

/** Basic tee colors, named as Habit Studio lists them. `photo` is the women's shot. */
export const TEE_COLORS: Shade[] = [
  { id: 'aqua', name: 'Aqua', plain: 'Aqua', hex: '#7fb3bd', on: 'dark', mood: 'soft', photo: 'tee-women-aqua', vibe: 'Cool, clean, and easy on a hot day.' },
  { id: 'sage', name: 'Sage Green', plain: 'Sage Green', hex: '#b3ab8a', on: 'dark', mood: 'soft', photo: 'tee-women-sage', vibe: 'Soft and earthy, goes with every pair of jeans.' },
  { id: 'taupe', name: 'Taupe', plain: 'Taupe', hex: '#b9a08c', on: 'dark', mood: 'soft', photo: 'tee-women-taupe', vibe: 'The neutral you reach for without thinking.' },
  { id: 'olive', name: 'Olive', plain: 'Olive', hex: '#8a6a35', on: 'light', mood: 'deep', photo: 'tee-women-olive', vibe: 'Warm and grounded, made for weekends.' },
  { id: 'red', name: 'Red', plain: 'Red', hex: '#8c2026', on: 'light', mood: 'bold', photo: 'tee-women-red', vibe: 'A little bold, still totally basic.' },
]

export const TEE_PRICE: Record<Fit, number> = { women: 450, men: 490 }
export const FIT_LABEL: Record<Fit, string> = { women: 'Women', men: 'Men' }

/** Photo of a tee color in a given cut. */
export const teePhoto = (fit: Fit, colorId: string) => `tee-${fit}-${colorId}` as PhotoName

const unifits: Product[] = SHADES.map((shade) => ({
  slug: `unifit-${shade.id}`,
  line: 'unifit',
  name: 'Unifit Scrub Suit',
  shade,
  price: PRICE,
  sizes: [...SIZES],
  isNew: ['saffron', 'papaya', 'guava'].includes(shade.id),
}))

const tees: Product[] = (['women', 'men'] as const).flatMap((fit) =>
  TEE_COLORS.map((c) => ({
    slug: `tee-${fit}-${c.id}`,
    line: 'tee' as const,
    fit,
    name: fit === 'women' ? "Women's Basic Tee" : "Men's Basic Tee",
    shade: { ...c, photo: teePhoto(fit, c.id) },
    price: TEE_PRICE[fit],
    sizes: [...TEE_SIZES],
    isNew: true,
  })),
)

export const PRODUCTS: Product[] = [...unifits, ...tees]

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug)

/** Products that sit together in a color switcher: same line, same fit. */
export const siblings = (p: Product) => PRODUCTS.filter((x) => x.line === p.line && x.fit === p.fit)

/** The same tee color in the other cut. */
export const otherFit = (p: Product) => (p.fit ? getProduct(`tee-${p.fit === 'women' ? 'men' : 'women'}-${p.shade.id}`) : undefined)

/** "Midnight (Black)" for scrubs, "Aqua" for tees where both names are the same. */
export const colorLabel = (p: Product) => (p.shade.plain === p.shade.name ? p.shade.name : `${p.shade.name} (${p.shade.plain})`)

/** Second line under a product name on cards, search results and the bag. */
export const subtitle = (p: Product) => (p.line === 'tee' ? p.name : `${p.shade.plain} · ${MOODS[p.shade.mood].title}`)

export const LINES: Record<Line, { title: string; short: string; eyebrow: string; intro: string }> = {
  unifit: {
    title: 'Unifit Scrub Suits',
    short: 'Scrub suits',
    eyebrow: 'The Unifit Collection · 5-Pocket Scrub Suit · ₱950',
    intro: 'One honest uniform, twelve ways to wear it. Every shade is the same Unifit set — choose the one that feels like you.',
  },
  tee: {
    title: 'Basic Tees',
    short: 'Tees',
    eyebrow: 'HTP Basics · Premium Basic Tee · Women ₱450 · Men ₱490',
    intro: 'Simple, comfy, and easy to style — the everyday tee you’ll keep reaching for. Five colors, women’s and men’s cuts, XS to 3XL.',
  },
}

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

/** From the Facebook post and HTP Basics' own size guides (updated March 2025). */
export const TEE_DETAILS = {
  summary:
    'Simple, comfy, and easy to style — because looking good doesn’t have to be complicated. Whether you’re dressing up or keeping it casual, this basic tee is a wardrobe essential you’ll keep reaching for.',
  features: [
    { k: 'Neckline', v: 'Round neck, short sleeve' },
    { k: 'Fabric', v: 'Firm and soft cotton' },
    { k: 'Weight', v: '200–220 GSM' },
    { k: 'Fit', v: 'Regular' },
    { k: 'Stretch', v: 'Slight' },
    { k: 'Made by', v: 'HTP Basics · HTP Clothing' },
  ],
  care: ['Machine wash cold with similar colors', 'Do not bleach', 'Line dry in shade', 'Warm iron inside out if needed'],
}

export type SizeGuideData = {
  title: string
  caption: string
  columns: string[]
  rows: { size: Size; values: string[] }[]
  note: string
  /** the brand's own size-guide photo, shown below the table */
  photo?: PhotoName
}

const TEE_COLUMNS = ['Length', 'Body width', 'Shoulder', 'Arm hole', 'Sleeve hole']
const teeRows = (rows: [Size, ...string[]][]) => rows.map(([size, ...values]) => ({ size, values }))

const SIZE_GUIDES: Record<'unifit' | `tee-${Fit}`, SizeGuideData> = {
  unifit: {
    title: 'Unifit Scrub Suit',
    caption: 'Garment measurements in inches',
    columns: ['Top chest', 'Top length', 'Waist (stretch)', 'Inseam'],
    rows: SIZE_CHART.map((r) => ({ size: r.size, values: [r.chest, r.length, r.waist, r.inseam] })),
    note: 'The Unifit is a relaxed, unisex cut. Between sizes? Size down for a neater fit, or up for more room on long shifts. Measurements are approximate — message us your height and usual size and we’ll help you choose.',
  },
  'tee-women': {
    title: 'Premium Round Neck Tee for Women',
    caption: 'Garment measurements in inches, from the HTP Basics size guide',
    columns: TEE_COLUMNS,
    rows: teeRows([
      ['XS', '21', '32', '13', '14', '11'],
      ['SM', '22', '34', '13.5', '15', '11.5'],
      ['ML', '23', '36', '14', '16', '12'],
      ['XL', '24', '38', '14.5', '17', '12.5'],
      ['2XL', '25', '40', '15', '18', '13'],
      ['3XL', '26', '42', '15.5', '19', '13.5'],
    ]),
    note: 'Regular fit with slight stretch. Body width is measured flat across the chest. Sizes can vary by up to 1 inch. The model is 5′3″ (35–29–40 in) and wears SM.',
    photo: 'tee-size-guide-women',
  },
  'tee-men': {
    title: 'Premium Tee for Men',
    caption: 'Garment measurements in inches, from the HTP Basics size guide',
    columns: TEE_COLUMNS,
    rows: teeRows([
      ['XS', '26', '38', '16', '18', '11'],
      ['SM', '27', '40', '17', '18', '12'],
      ['ML', '28', '42', '18', '19', '13'],
      ['XL', '29', '44', '19', '20', '14'],
      ['2XL', '30', '46', '20', '21', '15'],
      ['3XL', '31', '48', '21', '22', '16'],
    ]),
    note: 'Regular fit with slight stretch. Body width is measured flat across the chest. Sizes can vary by up to 1 inch. The model is 5′8″ (40–39–41 in) and wears ML.',
    photo: 'tee-size-guide-men',
  },
}

export const sizeGuideFor = (p: Product) => SIZE_GUIDES[p.line === 'tee' ? (`tee-${p.fit ?? 'women'}` as const) : 'unifit']