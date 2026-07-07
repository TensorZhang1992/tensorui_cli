import type { Message } from '../components/MessageBlock.js'
import { getModel, setModel } from '../engine/sdk.js'

let nextId = 3000
function uid() { return String(++nextId) }

const KNOWN_MODELS = [
  'claude-4.5-haiku',
  'claude-4.5-sonnet',
  'claude-4.0-sonnet',
  'claude-4.0-opus',
  'claude-4.1-opus',
  'claude-opus-4',
  'claude-opus-4-5-20251101',
  'claude-opus-4-6',
]

export function handleModel(args: string): Message[] {
  const modelName = args.trim()

  if (!modelName) {
    const current = getModel()
    const lines = [
      `Current model: ${current}`,
      '',
      'Available models:',
      ...KNOWN_MODELS.map(m => `  ${m}${m === current ? ' ← current' : ''}`),
      '',
      'Usage: /model <model-name>',
    ]
    return [{ id: uid(), type: 'info', text: lines.join('\n') }]
  }

  setModel(modelName)
  return [{ id: uid(), type: 'info', text: `✓ Model switched to ${modelName}` }]
}
