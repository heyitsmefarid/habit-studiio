import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `SINGLEFILE=1 vite build` produces one self-contained index.html (used for previews).
const single = process.env.SINGLEFILE === '1'

export default defineConfig({
  plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
  build: single ? { outDir: 'dist-single', assetsInlineLimit: 100_000_000 } : undefined,
})
