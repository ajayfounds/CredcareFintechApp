import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Figma Make emits imports with pinned versions, e.g. `from "sonner@2.0.3"`.
// Standard bundlers can't resolve those. This plugin rewrites any bare
// specifier of the form `pkg@x.y.z` (scoped or not) back to `pkg` so normal
// node resolution works. Leaving source untouched keeps re-pushes from Make safe.
function stripVersionedImports() {
  const re = /^(@?[^@/]+(?:\/[^@/]+)?)@\d+\.\d+\.\d+.*$/
  return {
    name: 'strip-versioned-imports',
    enforce: 'pre' as const,
    async resolveId(id: string, importer: string | undefined) {
      const m = id.match(re)
      if (!m) return null
      const clean = m[1]
      const resolved = await this.resolve(clean, importer, { skipSelf: true })
      return resolved ? resolved.id : clean
    },
  }
}

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    stripVersionedImports(),
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})
