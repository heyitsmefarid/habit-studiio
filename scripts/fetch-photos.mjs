// Downloads Habit Studio's original Facebook photos into public/images
// and writes optimized WebP versions next to them.
//
//   npm run photos
//
// Facebook CDN links are signed and expire after a few days. If a download
// fails with 403, open the Facebook page, right-click each photo → "Copy image
// address", and paste the new links into src/data/photo-sources.json.
import { mkdir, writeFile, access } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const out = path.join(root, 'public', 'images')
const { photos } = JSON.parse(readFileSync(path.join(root, 'src/data/photo-sources.json'), 'utf8'))

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('sharp not installed — saving JPGs only.')
}

await mkdir(out, { recursive: true })
const force = process.argv.includes('--force')
let ok = 0
let failed = 0

for (const [name, url] of Object.entries(photos)) {
  const jpg = path.join(out, `${name}.jpg`)
  if (!force) {
    try {
      await access(jpg)
      console.log(`✓ ${name}.jpg (already saved)`)
      ok++
      continue
    } catch {}
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await writeFile(jpg, buf)
    if (sharp) {
      const base = sharp(buf).rotate()
      await base.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(out, `${name}.webp`))
      await base.clone().resize({ width: 720, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(out, `${name}-720.webp`))
    }
    console.log(`↓ ${name}.jpg  (${Math.round(buf.length / 1024)} KB)`)
    ok++
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`)
    failed++
  }
}

console.log(`\n${ok} saved, ${failed} failed → ${path.relative(root, out)}`)
if (failed) process.exitCode = 1
