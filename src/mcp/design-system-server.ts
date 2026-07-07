import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import { z } from 'zod'

const server = new McpServer({
  name: 'tensor-design',
  version: '0.1.0',
})

function loadAgentMd(): string | null {
  const candidates = [
    process.env.TENSOR_AGENT_MD_PATH,
    path.join(os.homedir(), '.tensor', 'agent.md'),
  ]
  const cwd = process.env.TENSOR_CWD || process.cwd()
  candidates.push(
    path.join(cwd, 'AGENT.md'),
    path.join(cwd, '.tensor', 'AGENT.md'),
  )
  for (const p of candidates) {
    if (!p) continue
    try { return fs.readFileSync(p, 'utf-8') } catch {}
  }
  return null
}

const agentMd = loadAgentMd()

server.tool(
  'get_design_system',
  'Get the full design system specification including brand rules, component constraints, design tokens, layout patterns, and coding conventions. Call this before generating any UI code.',
  async () => {
    if (!agentMd) {
      return { content: [{ type: 'text', text: 'No design system loaded. Use /login to authenticate and load a design system.' }] }
    }
    return { content: [{ type: 'text', text: agentMd }] }
  },
)

server.tool(
  'get_design_section',
  'Get a specific section of the design system by keyword (e.g. "typography", "shape", "elevation", "components", "layout", "token", "coding").',
  { keyword: z.string().describe('Section keyword to search for') },
  async ({ keyword }) => {
    if (!agentMd) {
      return { content: [{ type: 'text', text: 'No design system loaded.' }] }
    }
    const sections = agentMd.split(/^## /m)
    const matched = sections.filter(s =>
      s.toLowerCase().includes(keyword.toLowerCase())
    )
    if (matched.length === 0) {
      return { content: [{ type: 'text', text: `No section matching "${keyword}" found.` }] }
    }
    const result = matched.map(s => '## ' + s).join('\n')
    return { content: [{ type: 'text', text: result }] }
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)
