import { parseArgs } from 'node:util'
import * as fs from 'node:fs'
import * as path from 'node:path'
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

const DEFAULT_CLONE_URL = 'http://www.tensorui.cn/api/projects/1e69bd8c-c014-4ccd-adb3-ec7d4061b5ba/download'

const isEmptyProject = !fs.existsSync(path.join(cwd, 'package.json'))
if (isEmptyProject) {
  process.stdout.write(`No project found. Run this to get started:\n  /clone ${DEFAULT_CLONE_URL}\n\n`)
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
