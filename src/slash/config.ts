import type { Message } from '../components/MessageBlock.js'
import { getModel, setModel } from '../engine/sdk.js'

let nextId = 6000
function uid() { return String(++nextId) }

export function handleConfig(args: string): Message[] {
  const sub = args.trim()

  if (!sub) {
    const key = process.env.ANTHROPIC_API_KEY
    const authToken = process.env.ANTHROPIC_AUTH_TOKEN
    const baseUrl = process.env.ANTHROPIC_BASE_URL
    const keyDisplay = key ? '****' + key.slice(-4) : authToken ? '****' + authToken.slice(-4) : '(not set)'

    const lines = [
      'Configuration',
      '',
      `  model:      ${getModel()}`,
      `  api-key:    ${keyDisplay}`,
      `  base-url:   ${baseUrl || 'https://api.anthropic.com'}`,
      `  cwd:        ${process.cwd()}`,
      '',
      'Usage:',
      '  /config model <name>      Switch model',
      '  /config api-key <key>     Set API key',
      '  /config base-url <url>    Set API base URL',
      '',
      'Environment Variables (.env):',
      '  # Anthropic official',
      '  ANTHROPIC_API_KEY=sk-ant-...',
      '  ANTHROPIC_BASE_URL=https://api.anthropic.com',
      '  ANTHROPIC_MODEL=claude-sonnet-4-20250514',
      '',
      '  # Anthropic-compatible provider (e.g. DeepSeek)',
      '  ANTHROPIC_API_KEY=sk-02091b29aca7...',
      '  ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic',
      '  ANTHROPIC_MODEL=deepseek-v4-pro',
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
