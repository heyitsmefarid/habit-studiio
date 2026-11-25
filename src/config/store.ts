// ─────────────────────────────────────────────────────────────
//  STORE SETTINGS — edit these before going live.
//  Items marked ✎ are placeholders that need Habit Studio's real details.
// ─────────────────────────────────────────────────────────────

export const STORE = {
  name: 'Habit Studio',
  byline: 'by Arianne',
  tagline: 'Built into your routine.',
  intro: 'A curated label for everyday living. Thoughtfully made. Effortlessly worn.',
  city: 'Quezon City, Philippines',
  email: 'habitstudiobyarianne@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61595347124328',
  distributor: 'Official HTP Basics Distributor',
} as const

export const GCASH = {
  accountName: 'Habit Studio by A.', // ✎ name exactly as shown in GCash
  number: '0917 000 0000', // ✎ GCash mobile number
  /** Optional: put a QR image in public/images/gcash-qr.png and set this to '/images/gcash-qr.png' */
  qrImage: '' as string,
}

/** Shipping fee by region (₱). ✎ adjust to the courier rates Habit Studio uses. */
export const SHIPPING = {
  'Metro Manila': 100,
  'North & South Luzon': 160,
  Visayas: 190,
  Mindanao: 210,
} as const
export type Region = keyof typeof SHIPPING

/** Free shipping once this many sets are in the bag. ✎ set to 0 to turn off. */
export const FREE_SHIPPING_MIN_QTY = 3

export const COD = {
  enabled: true,
  fee: 0, // ✎ extra handling fee for Cash on Delivery, if any
  note: 'Pay the rider in cash when your order arrives. Please prepare the exact amount.',
}
