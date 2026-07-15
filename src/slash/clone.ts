import * as path from 'node:path'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as https from 'node:https'
import * as http from 'node:http'
import type { Message } from '../components/MessageBlock.js'

let nextId = 4000
function uid() { return String(++nextId) }

const TENSOR_DIR = path.join(os.homedir(), '.tensor')

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function renderProgress(received: number, total: number | null): void {
  const width = 30
  if (total && total > 0) {
    const pct = Math.min(received / total, 1)
    const filled = Math.round(width * pct)
    const bar = '█'.repeat(filled) + '░'.repeat(width - filled)
    process.stdout.write(`\r  ⏳ Downloading [${bar}] ${Math.round(pct * 100)}% ${formatBytes(received)}/${formatBytes(total)}`)
  } else {
    process.stdout.write(`\r  ⏳ Downloading... ${formatBytes(received)}`)
  }
}

async function downloadToFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadToFile(res.headers.location, dest).then(resolve, reject)
        return
      }
      if (res.statusCode && res.statusCode >= 400) {
        let body = ''
        res.on('data', (chunk: Buffer) => { body += chunk.toString() })
        res.on('end', () => reject(new Error(`Download failed (${res.statusCode}): ${body}`)))
        return
      }
      const total = res.headers['content-length'] ? parseInt(res.headers['content-length'], 10) : null
      let received = 0
      const ws = fs.createWriteStream(dest)
      res.on('data', (chunk: Buffer) => {
        received += chunk.length
        renderProgress(received, total)
      })
      res.pipe(ws)
      ws.on('finish', () => {
        process.stdout.write('\r' + ' '.repeat(80) + '\r')
        ws.close()
        resolve()
      })
      ws.on('error', reject)
    })
    req.on('error', reject)
  })
}

export async function handleClone(args: string): Promise<Message[]> {
  const url = args.trim()
  if (!url || !/^https?:\/\//.test(url)) {
    return [{
      id: uid(),
      type: 'info',
      text: 'Usage: /clone <url>\nExample: /clone https://api.tensor-ui.com/api/v1/projects/xxx/download',
    }]
  }

  const tmpZip = path.join(os.tmpdir(), `tensorui-${Date.now()}.zip`)

  try {
    await downloadToFile(url, tmpZip)

    process.stdout.write('  📦 Extracting...\r')
    const extractZip = (await import('extract-zip')).default
    const dest = process.cwd()
    await extractZip(tmpZip, { dir: dest })
    process.stdout.write(' '.repeat(40) + '\r')

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
      JSON.stringify({ source: url, clonedAt: new Date().toISOString() }, null, 2),
    )

    return msgs
  } catch (err: any) {
    return [{ id: uid(), type: 'error', text: `Clone failed: ${err.message}` }]
  } finally {
    try { fs.unlinkSync(tmpZip) } catch {}
  }
}
