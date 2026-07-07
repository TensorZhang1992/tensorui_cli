import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/lib/utils.ts',
    'src/components/ui/*.tsx',
    'src/components/ui/*.ts',
    'src/components/theme-provider.tsx',
    'src/components/theme-toggle.tsx',
  ],
  format: ['esm'],
  dts: true,
  bundle: false,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
    options.jsxImportSource = 'react'
  },
  onSuccess: 'node scripts/postbuild.cjs',
})
