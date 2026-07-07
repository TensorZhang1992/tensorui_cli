import React, { useState, useRef, useCallback, useMemo } from 'react'
import { Box, Static, Text, useApp, useInput } from 'ink'
import { Select, Spinner } from '@inkjs/ui'
import { listSessions } from '@anthropic-ai/claude-agent-sdk'
import Banner from './components/Banner.js'
import MessageBlock from './components/MessageBlock.js'
import InputArea, { SLASH_COMMANDS } from './components/InputArea.js'
import { useAgent } from './hooks/useAgent.js'
import type { Message } from './components/MessageBlock.js'

type StaticItem = { id: string; kind: 'banner' } | (Message & { kind: 'message' })

type SessionOption = { label: string; value: string }

interface AppProps {
  resumeSessionId?: string
  continueSession?: boolean
}

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

export default function App({ resumeSessionId, continueSession }: AppProps) {
  const { messages, activeText, isLoading, sendMessage, interrupt, resumeSession } = useAgent({
    resumeSessionId,
    continueSession,
  })
  const [inputKey, setInputKey] = useState(0)
  const [currentValue, setCurrentValue] = useState('')
  const [sessionPicker, setSessionPicker] = useState<SessionOption[] | null>(null)
  const { exit } = useApp()

  const history = useRef<string[]>([])
  const historyIndex = useRef(-1)

  useInput((input, key) => {
    if (key.ctrl && input === 'd') {
      exit()
      return
    }

    if (key.escape || (key.ctrl && input === 'c') || (key.ctrl && input === 'z')) {
      if (sessionPicker) {
        setSessionPicker(null)
        return
      }
      if (isLoading) {
        interrupt()
      } else {
        exit()
      }
      return
    }

    if (sessionPicker) return

    if (key.tab) {
      if (currentValue.length > 0) {
        const match = SLASH_COMMANDS.find(c => c.startsWith(currentValue) && c !== currentValue)
        if (match) {
          setCurrentValue(match)
          setInputKey(k => k + 1)
        }
      }
      return
    }

    if (key.upArrow) {
      if (history.current.length > 0) {
        const newIndex = Math.min(historyIndex.current + 1, history.current.length - 1)
        historyIndex.current = newIndex
        setCurrentValue(history.current[newIndex]!)
        setInputKey(k => k + 1)
      }
      return
    }

    if (key.downArrow) {
      if (historyIndex.current > 0) {
        historyIndex.current -= 1
        setCurrentValue(history.current[historyIndex.current]!)
        setInputKey(k => k + 1)
      } else if (historyIndex.current === 0) {
        historyIndex.current = -1
        setCurrentValue('')
        setInputKey(k => k + 1)
      }
      return
    }
  })

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim()
    if (trimmed) {
      history.current.unshift(trimmed)
      historyIndex.current = -1
    }
    setCurrentValue('')
    setInputKey(k => k + 1)

    if (trimmed === '/resume') {
      const cwd = process.cwd()
      listSessions({ dir: cwd, limit: 15 }).then(sessions => {
        if (sessions.length === 0) {
          sendMessage(trimmed)
          return
        }
        const options: SessionOption[] = sessions.map(s => {
          const summary = s.summary || s.firstPrompt || '(no summary)'
          const label = `${summary.length > 50 ? summary.slice(0, 47) + '...' : summary}  ${timeAgo(s.lastModified)}`
          return { label, value: s.sessionId }
        })
        setSessionPicker(options)
      }).catch(() => {
        sendMessage(trimmed)
      })
      return
    }

    sendMessage(value)
  }, [sendMessage])

  const handleSessionSelect = useCallback((sessionId: string) => {
    setSessionPicker(null)
    resumeSession(sessionId)
  }, [resumeSession])

  const handleChange = useCallback((value: string) => {
    setCurrentValue(value)
  }, [])

  const staticItems = useMemo<StaticItem[]>(() => [
    { id: '_banner', kind: 'banner' },
    ...messages.map(m => ({ ...m, kind: 'message' as const })),
  ], [messages])

  return (
    <Box flexDirection="column">
      <Static items={staticItems}>
        {(item) =>
          item.kind === 'banner'
            ? <Banner key="_banner" />
            : <MessageBlock key={item.id} message={item} />
        }
      </Static>

      {activeText && (
        <MessageBlock message={{ id: '_active', type: 'assistant', text: activeText }} />
      )}

      {isLoading && !activeText && (
        <Box marginLeft={2} marginTop={1}>
          <Spinner label="Thinking..." />
        </Box>
      )}

      {sessionPicker ? (
        <Box flexDirection="column" marginTop={1}>
          <Text bold>  Select a session to resume:</Text>
          <Box marginLeft={2} marginTop={1}>
            <Select
              options={sessionPicker}
              onChange={handleSessionSelect}
            />
          </Box>
          <Text dimColor>  ↑↓ navigate · Enter select · Esc cancel</Text>
        </Box>
      ) : (
        <InputArea
          inputKey={inputKey}
          onSubmit={handleSubmit}
          onChange={handleChange}
          isActive={!isLoading}
          currentValue={currentValue}
        />
      )}
    </Box>
  )
}
