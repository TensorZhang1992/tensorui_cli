import * as fs from 'node:fs'
import * as path from 'node:path'

export function hasAgentMd(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'AGENT.md'))
}

export function readTensorConfig(dir: string): Record<string, unknown> | null {
  const configPath = path.join(dir, '.tensor-ui.json')
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch {
    return null
  }
}
