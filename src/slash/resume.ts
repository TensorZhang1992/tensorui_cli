import { listSessions } from '@anthropic-ai/claude-agent-sdk'
import type { Message } from '../components/MessageBlock.js'

let nextId = 4000
function uid() { return String(++nextId) }

function timeAgo(ms: number): string {
  const seconds = Math.floor((Date.now() - ms) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export async function handleResume(_args: string): Promise<Message[]> {
  const cwd = process.cwd()

  try {
    const sessions = await listSessions({ dir: cwd, limit: 10 })

    if (sessions.length === 0) {
      return [{ id: uid(), type: 'info', text: 'No previous sessions found in this directory.' }]
    }

    const lines = ['Recent Sessions', '']
    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i]!
      const time = timeAgo(s.lastModified)
      const summary = s.summary || s.firstPrompt || '(no summary)'
      const truncated = summary.length > 60 ? summary.slice(0, 57) + '...' : summary
      lines.push(`  ${i + 1}. ${truncated}`)
      lines.push(`     ${time} · ${s.sessionId}`)
    }
    lines.push('')
    lines.push('To resume a session:')
    lines.push('  tensorui --resume <session-id>')
    lines.push('  tensorui --continue  (resume most recent)')

    return [{ id: uid(), type: 'info', text: lines.join('\n') }]
  } catch (err: any) {
    return [{ id: uid(), type: 'error', text: `Failed to list sessions: ${err.message || err}` }]
  }
}
