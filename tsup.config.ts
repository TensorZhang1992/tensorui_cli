import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.tsx'],
    format: ['esm'],
    target: 'node20',
    outDir: 'dist',
    clean: true,
    minify: true,
    banner: {
      js: '#!/usr/bin/env node',
    },
    esbuildOptions(options) {
      options.jsx = 'automatic'
      options.jsxImportSource = 'react'
    },
  },
  {
    entry: ['src/mcp/design-system-server.ts'],
    format: ['esm'],
    target: 'node20',
    outDir: 'dist',
    clean: false,
    minify: true,
  },
])
