import { parseArgs } from 'node:util'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { execSync } from 'node:child_process'
import React from 'react'
import { render } from 'ink'
import { setModel } from './engine/sdk.js'
import App from './app.js'

const pkgDir = path.dirname(new URL(import.meta.url).pathname)
const envPaths = [
  path.join(pkgDir, '.env'),
  path.join(pkgDir, '..', '.env'),
]
for (const envPath of envPaths) {
  try {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const val = trimmed.slice(eq + 1).trim()
      process.env[key] = val
    }
    break
  } catch {}
}

const { values } = parseArgs({
  options: {
    model: { type: 'string', short: 'm' },
    'api-key': { type: 'string' },
    'base-url': { type: 'string' },
    resume: { type: 'string', short: 'r' },
    continue: { type: 'boolean', short: 'c' },
  },
  strict: false,
})

if (values['api-key']) process.env.ANTHROPIC_API_KEY = values['api-key']
if (values['base-url']) process.env.ANTHROPIC_BASE_URL = values['base-url']
if (values.model) setModel(values.model)

const cwd = process.cwd()

function rewriteImports(dir: string) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      rewriteImports(full)
    } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf-8')
      let changed = false
      const replaced = content
        .replace(/from\s+['"]@\/components\/ui\/([^'"]+)['"]/g, () => {
          changed = true
          return `from '@tensor-ui/core'`
        })
        .replace(/from\s+['"]@\/components\/theme-provider['"]/g, () => {
          changed = true
          return `from '@tensor-ui/core'`
        })
        .replace(/from\s+['"]@\/components\/theme-toggle['"]/g, () => {
          changed = true
          return `from '@tensor-ui/core'`
        })
        .replace(/from\s+['"]@\/lib\/utils['"]/g, () => {
          changed = true
          return `from '@tensor-ui/core'`
        })
      if (changed) {
        const lines = replaced.split('\n')
        const seen = new Set<string>()
        const deduped: string[] = []
        for (const line of lines) {
          const importMatch = line.match(/^import\s+\{([^}]+)\}\s+from\s+['"]@tensor-ui\/core['"]/)
          if (importMatch) {
            const key = '@tensor-ui/core'
            if (seen.has(key)) {
              const prevIdx = deduped.findIndex(l => l.includes("from '@tensor-ui/core'") && l.startsWith('import {'))
              if (prevIdx !== -1) {
                const prevImports = deduped[prevIdx]!.match(/\{([^}]+)\}/)![1]!.split(',').map(s => s.trim())
                const newImports = importMatch[1]!.split(',').map(s => s.trim())
                const merged = [...new Set([...prevImports, ...newImports])].join(', ')
                deduped[prevIdx] = `import { ${merged} } from '@tensor-ui/core'`
              }
            } else {
              seen.add(key)
              deduped.push(line)
            }
          } else {
            deduped.push(line)
          }
        }
        fs.writeFileSync(full, deduped.join('\n'))
      }
    }
  }
}

const DEFAULT_BASE = path.join(os.homedir(), 'Desktop', 'research', 'f1', 'Airbnb-design-system')
const isEmptyProject = !fs.existsSync(path.join(cwd, 'package.json'))

if (isEmptyProject && fs.existsSync(DEFAULT_BASE)) {
  const SKIP = new Set(['node_modules', '.next', '.git', 'AGENT.md', 'CLAUDE.md', 'CODEX.md', '.DS_Store', 'components', 'lib'])
  function copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      if (SKIP.has(entry.name)) continue
      const s = path.join(src, entry.name)
      const d = path.join(dest, entry.name)
      if (entry.isDirectory()) copyDir(s, d)
      else fs.copyFileSync(s, d)
    }
  }
  process.stdout.write('Initializing project from default design system...\n')
  copyDir(DEFAULT_BASE, cwd)

  const tgzSrc = path.resolve(pkgDir, '..', 'assets', 'tensor-ui-core-0.1.0.tgz')
  if (fs.existsSync(tgzSrc)) {
    const tgzDest = path.join(cwd, 'tensor-ui-core-0.1.0.tgz')
    fs.copyFileSync(tgzSrc, tgzDest)
  }

  process.stdout.write('Installing dependencies...\n')
  try {
    execSync('npm install --legacy-peer-deps', { cwd, stdio: 'inherit' })
    const tgzLocal = path.join(cwd, 'tensor-ui-core-0.1.0.tgz')
    if (fs.existsSync(tgzLocal)) {
      execSync('npm install ./tensor-ui-core-0.1.0.tgz --legacy-peer-deps', { cwd, stdio: 'inherit' })
      fs.unlinkSync(tgzLocal)
    }
  } catch {}
  process.stdout.write('Ready.\n\n')

  rewriteImports(cwd)

  const globalsCss = path.join(cwd, 'app', 'globals.css')
  if (fs.existsSync(globalsCss)) {
    let css = fs.readFileSync(globalsCss, 'utf-8')
    if (!css.includes('@source')) {
      css = `@source "../node_modules/@tensor-ui/core/dist";\n` + css
    }
    fs.writeFileSync(globalsCss, css)
  }
}

const claudeDir = path.join(cwd, '.claude')
const claudeMdPath = path.join(claudeDir, 'CLAUDE.md')

if (!fs.existsSync(claudeMdPath)) {
  if (!fs.existsSync(claudeDir)) fs.mkdirSync(claudeDir, { recursive: true })
  fs.writeFileSync(claudeMdPath, [
    '# tensor-ui Design System',
    '',
    'This project uses a tensor-ui design system.',
    'Before generating any UI code, you MUST call the `get_design_system` tool from the tensor-design MCP server to load the design specification.',
    'Follow ALL rules, constraints, and patterns returned by that tool.',
    '',
    '## Component Imports',
    '',
    'All UI components are available from `@tensor-ui/core`:',
    '```tsx',
    "import { Button, Card, Badge, Input, Label, Dialog, ... } from '@tensor-ui/core'",
    '```',
    'Do NOT import from `@/components/ui/` — always use `@tensor-ui/core`.',
    'Do NOT try to read the compiled JS source — it is minified and unreadable.',
    '',
    '## Component API Reference',
    '',
    'To see all available components and their props/types, read the type declaration file:',
    '```',
    'node_modules/@tensor-ui/core/dist/index.d.ts',
    '```',
    'This file contains the full TypeScript API for every exported component.',
    '',
    '## Key Components',
    '',
    'Form: `Form, FormField, FormItem, FormLabel, FormControl, FormMessage` (wraps react-hook-form)',
    'Layout: `Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter`',
    'Inputs: `Input, Textarea, Select, Checkbox, Switch, RadioGroup, Slider, Calendar`',
    'Feedback: `Alert, Badge, Progress, Skeleton, Spinner, Toaster`',
    'Overlay: `Dialog, Sheet, Drawer, AlertDialog, Popover, Tooltip, HoverCard`',
    'Navigation: `Tabs, Accordion, Breadcrumb, NavigationMenu, Menubar, Sidebar, Pagination`',
    'Data: `Table, TableHeader, TableBody, TableRow, TableHead, TableCell`',
    'Utility: `Button, Label, Separator, ScrollArea, Toggle, ToggleGroup, Kbd`',
    'Theme: `ThemeProvider, ThemeToggle`',
    '',
    'Global styles: `import \'@tensor-ui/core/globals.css\'`',
    '',
    '## Available MCP tools',
    '',
    '- `get_design_system` — Get the full design system spec (brand, tokens, components, layout rules)',
    '- `get_design_section` — Get a specific section by keyword (e.g. "typography", "layout", "components")',
  ].join('\n'))
}

const gitignorePath = path.join(cwd, '.gitignore')
if (fs.existsSync(gitignorePath)) {
  const gi = fs.readFileSync(gitignorePath, 'utf-8')
  if (!gi.includes('.claude/')) {
    fs.appendFileSync(gitignorePath, '\n.claude/\n')
  }
}

const { waitUntilExit } = render(
  <App
    resumeSessionId={values.resume}
    continueSession={values.continue}
  />,
  { exitOnCtrlC: false },
)
await waitUntilExit()
