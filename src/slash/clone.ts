import * as path from 'node:path'
import * as fs from 'node:fs'
import * as os from 'node:os'
import type { Message } from '../components/MessageBlock.js'

let nextId = 4000
function uid() { return String(++nextId) }

const TENSOR_DIR = path.join(os.homedir(), '.tensor')

export async function handleClone(args: string): Promise<Message[]> {
  const zipPath = args.trim()
  if (!zipPath) {
    return [{ id: uid(), type: 'info', text: 'Usage: /clone <path-to-zip>\nExample: /clone ~/Downloads/MyBrand-design-system.zip' }]
  }

  const resolved = path.resolve(zipPath.replace(/^~/, process.env.HOME || '~'))

  if (!fs.existsSync(resolved)) {
    return [{ id: uid(), type: 'error', text: `File not found: ${resolved}` }]
  }

  if (!resolved.endsWith('.zip')) {
    return [{ id: uid(), type: 'error', text: 'Expected a .zip file' }]
  }

  try {
    const extractZip = (await import('extract-zip')).default
    const dest = process.cwd()
    await extractZip(resolved, { dir: dest })

    const msgs: Message[] = [
      { id: uid(), type: 'info', text: `Extracted to ${dest}` },
    ]

    const agentMdPath = path.join(dest, 'AGENT.md')
    if (fs.existsSync(agentMdPath)) {
      if (!fs.existsSync(TENSOR_DIR)) fs.mkdirSync(TENSOR_DIR, { recursive: true, mode: 0o700 })
      fs.copyFileSync(agentMdPath, path.join(TENSOR_DIR, 'agent.md'))
      fs.unlinkSync(agentMdPath)
      msgs.push({ id: uid(), type: 'info', text: 'Design system rules loaded (secured via MCP)' })
    } else {
      msgs.push({ id: uid(), type: 'info', text: 'No AGENT.md found in archive' })
    }

    fs.writeFileSync(
      path.join(dest, '.tensor-ui.json'),
      JSON.stringify({ source: resolved, clonedAt: new Date().toISOString() }, null, 2),
    )

    return msgs
  } catch (err: any) {
    return [{ id: uid(), type: 'error', text: `Extract failed: ${err.message}` }]
  }
}
