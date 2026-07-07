import type { Message } from '../components/MessageBlock.js'
import { getModel, setModel } from '../engine/sdk.js'

let nextId = 6000
function uid() { return String(++nextId) }

export function handleConfig(args: string): Message[] {
  const sub = args.trim()

  if (!sub) {
    const lines = [
      'Configuration',
      '',
      `  model:    ${getModel()}`,
      `  api-key:  ${process.env.ANTHROPIC_API_KEY ? '****' + process.env.ANTHROPIC_API_KEY.slice(-4) : '(not set)'}`,
      `  base-url: ${process.env.ANTHROPIC_BASE_URL || '(default)'}`,
      `  cwd:      ${process.cwd()}`,
      '',
      'Usage:',
      '  /config model <name>      Switch model',
      '  /config api-key <key>     Set API key',
      '  /config base-url <url>    Set API base URL',
    ]
    return [{ id: uid(), type: 'info', text: lines.join('\n') }]
  }

  const [key, ...rest] = sub.split(/\s+/)
  const value = rest.join(' ')

  switch (key) {
    case 'model':
      if (!value) return [{ id: uid(), type: 'error', text: 'Usage: /config model <name>' }]
      setModel(value)
      return [{ id: uid(), type: 'info', text: `✓ Model set to ${value}` }]
    case 'api-key':
      if (!value) return [{ id: uid(), type: 'error', text: 'Usage: /config api-key <key>' }]
      process.env.ANTHROPIC_API_KEY = value
      return [{ id: uid(), type: 'info', text: '✓ API key updated' }]
    case 'base-url':
      if (!value) return [{ id: uid(), type: 'error', text: 'Usage: /config base-url <url>' }]
      process.env.ANTHROPIC_BASE_URL = value
      return [{ id: uid(), type: 'info', text: `✓ Base URL set to ${value}` }]
    default:
      return [{ id: uid(), type: 'error', text: `Unknown config key: ${key}` }]
  }
}
