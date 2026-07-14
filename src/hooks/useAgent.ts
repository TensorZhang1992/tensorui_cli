import { useState, useCallback, useRef, useEffect } from 'react'
import { query, listSessions, getSessionMessages } from '@anthropic-ai/claude-agent-sdk'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getModel } from '../engine/sdk.js'
import { canUse } from '../engine/auth.js'
import type { Message } from '../components/MessageBlock.js'
import { handleSlashCommand } from '../slash/index.js'

let nextId = 0
function uid() { return String(++nextId) }

function tryReadFile(filePath: string): string | null {
  try { return fs.readFileSync(filePath, 'utf-8') } catch { return null }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s
}

function toolSummary(block: any): { name: string; text: string } {
  const name: string = block.name || 'unknown'
  const input = block.input || {}
  switch (name) {
    case 'Read': return { name: 'Read', text: input.file_path || '' }
    case 'Write': return { name: 'Write', text: input.file_path || '' }
    case 'Edit': return { name: 'Edit', text: input.file_path || '' }
    case 'Bash': return { name: 'Bash', text: truncate(input.command || '', 60) }
    case 'Glob': return { name: 'Glob', text: input.pattern || '' }
    case 'Grep': return { name: 'Grep', text: `${input.pattern || ''} ${input.path || ''}` }
    default: return { name, text: '' }
  }
}

function sessionMessageToUiMessages(sm: any): Message[] {
  const msgs: Message[] = []
  if (sm.type === 'user') {
    const content = sm.message?.content
    if (typeof content === 'string') {
      msgs.push({ id: uid(), type: 'user', text: content })
    } else if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'text' && block.text) {
          msgs.push({ id: uid(), type: 'user', text: block.text })
        }
      }
    }
  } else if (sm.type === 'assistant') {
    const content = sm.message?.content
    if (Array.isArray(content)) {
      let text = ''
      for (const block of content) {
        if (block.type === 'text' && block.text) {
          text += block.text
        } else if (block.type === 'tool_use') {
          if (text) {
            msgs.push({ id: uid(), type: 'assistant', text })
            text = ''
          }
          const { name, text: toolText } = toolSummary(block)
          msgs.push({ id: uid(), type: 'tool', text: toolText, toolName: name })
        }
      }
      if (text) {
        msgs.push({ id: uid(), type: 'assistant', text })
      }
    }
  }
  return msgs
}

interface UseAgentOptions {
  resumeSessionId?: string
  continueSession?: boolean
}

export function useAgent(options: UseAgentOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [activeText, setActiveText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const sessionIdRef = useRef<string | null>(options.resumeSessionId || null)
  const isResumedRef = useRef(false)

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg])
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      const cwd = process.cwd()
      let targetSessionId = options.resumeSessionId

      if (!targetSessionId && options.continueSession) {
        try {
          const sessions = await listSessions({ dir: cwd, limit: 1 })
          if (sessions.length > 0) {
            targetSessionId = sessions[0]!.sessionId
          }
        } catch {}
      }

      if (!targetSessionId) return

      sessionIdRef.current = targetSessionId
      isResumedRef.current = true

      try {
        const history = await getSessionMessages(targetSessionId, { dir: cwd })
        if (cancelled) return

        const uiMessages: Message[] = []
        for (const sm of history) {
          uiMessages.push(...sessionMessageToUiMessages(sm))
        }
        if (uiMessages.length > 0) {
          setMessages(uiMessages)
        }
      } catch {}
    }

    if (options.resumeSessionId || options.continueSession) {
      loadHistory()
    }

    return () => { cancelled = true }
  }, [])

  const sendMessage = useCallback(async (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return

    if (trimmed.startsWith('/')) {
      const [cmd, ...rest] = trimmed.slice(1).split(/\s+/)
      const args = rest.join(' ')
      const result = await handleSlashCommand(cmd, args)
      for (const msg of result) {
        addMessage(msg)
      }
      return
    }

    addMessage({ id: uid(), type: 'user', text: trimmed })

    const access = await canUse()
    if (!access.ok) {
      addMessage({ id: uid(), type: 'error', text: access.reason! })
      return
    }

    setIsLoading(true)
    setActiveText('')

    const cwd = process.cwd()
    const pkgDir = path.dirname(fileURLToPath(import.meta.url))
    const mcpServerPath = path.resolve(pkgDir, 'design-system-server.js')
    const hasMcpServer = fs.existsSync(mcpServerPath)

    const systemPrompt = { type: 'preset' as const, preset: 'claude_code' as const }

    const abortController = new AbortController()
    abortRef.current = abortController

    let accumulated = ''

    const flushText = () => {
      if (accumulated) {
        addMessage({ id: uid(), type: 'assistant', text: accumulated })
        accumulated = ''
        setActiveText('')
      }
    }

    const queryOptions: any = {
      systemPrompt,
      cwd,
      allowedTools: [
        'Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep',
        'mcp__tensor-design__get_design_system',
        'mcp__tensor-design__get_design_section',
      ],
      permissionMode: 'acceptEdits' as any,
      maxTurns: 200,
      model: getModel(),
      abortController,
    }

    if (hasMcpServer) {
      queryOptions.mcpServers = {
        'tensor-design': {
          command: 'node',
          args: [mcpServerPath],
          env: {
            ...process.env,
            TENSOR_CWD: cwd,
          },
        },
      }
    }

    if (isResumedRef.current && sessionIdRef.current) {
      queryOptions.resume = sessionIdRef.current
      isResumedRef.current = false
    }

    try {
      const q = query({
        prompt: trimmed,
        options: queryOptions,
      })

      for await (const message of q) {
        if (message.type === 'assistant') {
          const msg = (message as any).message || message
          const content = msg.content || []
          for (const block of content) {
            if (block.type === 'text' && block.text) {
              accumulated += block.text
              setActiveText(accumulated)
            } else if (block.type === 'tool_use') {
              flushText()
              const { name, text } = toolSummary(block)
              addMessage({ id: uid(), type: 'tool', text, toolName: name })
            }
          }
        } else if (message.type === 'result') {
          flushText()
          const result = message as any
          const parts: string[] = []
          if (result.duration_ms) parts.push(`${(result.duration_ms / 1000).toFixed(1)}s`)
          if (result.total_cost_usd) parts.push(`$${result.total_cost_usd.toFixed(4)}`)
          if (result.num_turns) parts.push(`${result.num_turns} turn${result.num_turns > 1 ? 's' : ''}`)
          if (parts.length) {
            addMessage({ id: uid(), type: 'result', text: parts.join(' · ') })
          }
        } else if (message.type === 'system') {
          const sys = message as any
          if (sys.session_id) {
            sessionIdRef.current = sys.session_id
          }
          if (sys.subtype === 'status' && sys.status) {
            addMessage({ id: uid(), type: 'info', text: sys.status })
          }
        } else if (message.type === 'tool_progress') {
          const tp = message as any
          if (tp.tool_name) {
            addMessage({ id: uid(), type: 'tool', text: tp.content || '', toolName: tp.tool_name })
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        addMessage({ id: uid(), type: 'error', text: err.message || String(err) })
      }
    }

    flushText()
    setIsLoading(false)
    abortRef.current = null
  }, [addMessage])

  const resumeSession = useCallback(async (sessionId: string) => {
    const cwd = process.cwd()
    sessionIdRef.current = sessionId
    isResumedRef.current = true

    try {
      const history = await getSessionMessages(sessionId, { dir: cwd })
      const uiMessages: Message[] = []
      for (const sm of history) {
        uiMessages.push(...sessionMessageToUiMessages(sm))
      }
      setMessages(uiMessages)
    } catch {
      setMessages([])
    }
  }, [])

  const interrupt = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
      addMessage({ id: uid(), type: 'info', text: '(interrupted)' })
      setIsLoading(false)
      setActiveText('')
    }
  }, [addMessage])

  return { messages, activeText, isLoading, sendMessage, interrupt, resumeSession, sessionId: sessionIdRef.current }
}
