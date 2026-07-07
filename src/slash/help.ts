import type { Message } from '../components/MessageBlock.js'
import { getModel } from '../engine/sdk.js'

let nextId = 2000
function uid() { return String(++nextId) }

export function handleHelp(_args: string): Message[] {
  const lines = [
    'tensor-ui  Design System AI Terminal',
    `Model: ${getModel()}`,
    '',
    'Commands',
    '  /clone <zip-path>    Load a design system from a ZIP export',
    '  /model [name]        Show or switch the current model',
    '  /config [key val]    View or update configuration',
    '  /login [token]       Login with your tensor-ui token',
    '  /logout              Sign out and remove token',
    '  /resume              List recent sessions',
    '  /login               Account login (coming soon)',
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
    'Environment',
    '  ANTHROPIC_MODEL      Model name (default: claude-haiku-4-5-20251001)',
    '  ANTHROPIC_API_KEY    API key',
    '  ANTHROPIC_BASE_URL   API gateway URL',
  ]
  return [{ id: uid(), type: 'info', text: lines.join('\n') }]
}
