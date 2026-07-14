import type { Message } from '../components/MessageBlock.js'
import { handleClone } from './clone.js'
import { handleModel } from './model.js'
import { handleHelp } from './help.js'
import { handleConfig } from './config.js'
import { handleResume } from './resume.js'

type SlashHandler = (args: string) => Message[] | Promise<Message[]>

const commands: Record<string, SlashHandler> = {
  clone: handleClone,
  model: handleModel,
  config: handleConfig,
  help: handleHelp,
  resume: handleResume,
}

let nextId = 1000
function uid() { return String(++nextId) }

export async function handleSlashCommand(cmd: string, args: string): Promise<Message[]> {
  const handler = commands[cmd]
  if (!handler) {
    return [
      { id: uid(), type: 'error', text: `Unknown command: /${cmd}` },
      { id: uid(), type: 'info', text: 'Type /help to see available commands.' },
    ]
  }
  return await handler(args)
}
