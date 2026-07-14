import type { Message } from '../components/MessageBlock.js'
import { getModel } from '../engine/sdk.js'

let nextId = 2000
function uid() { return String(++nextId) }

export function handleHelp(_args: string): Message[] {
  const lines = [
    'tensorui  Design System AI Terminal',
    `Model: ${getModel()}`,
    '',
    'Commands',
    '  /clone <url>         Clone a design system from a URL',
    '  /model [name]        Show or switch the current model',
    '  /config [key val]    View or update configuration',
    '  /resume              List recent sessions',
    '  /help                Show this help message',
    '',
    'Usage',
    '  Just type naturally to generate or modify code.',
    '  The AI follows the AGENT.md design rules in your project.',
    '',
    'Resume',
    '  tensorui --continue         Resume most recent session',
    '  tensorui --resume <id>      Resume a specific session',
    '',
    'Examples',
    '  ❯ 创建一个定价页面，三栏对比',
    '  ❯ Add a hero section with gradient background',
    '  ❯ 给 dashboard 加一个用户增长折线图',
    '',
    'Environment (.env)',
    '  ANTHROPIC_API_KEY=sk-ant-...           # Required',
    '  ANTHROPIC_BASE_URL=https://...         # Optional (default: api.anthropic.com)',
    '  ANTHROPIC_MODEL=claude-sonnet-4-...    # Optional (default: deepseek-v4-pro)',
    '',
    '  # Works with any Anthropic-compatible provider',
    '  ANTHROPIC_API_KEY=sk-02091b29aca7...',
    '  ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic',
    '  ANTHROPIC_MODEL=deepseek-v4-pro',
  ]
  return [{ id: uid(), type: 'info', text: lines.join('\n') }]
}
