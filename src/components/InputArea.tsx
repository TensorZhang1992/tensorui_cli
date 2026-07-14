import React from 'react'
import { Box, Text } from 'ink'
import { TextInput } from '@inkjs/ui'

export const SLASH_COMMANDS = [
  '/help',
  '/clone',
  '/model',
  '/config',
  '/resume',
]

interface InputAreaProps {
  inputKey: number
  onSubmit: (value: string) => void
  onChange: (value: string) => void
  isActive: boolean
  currentValue: string
}

export default function InputArea({ inputKey, onSubmit, onChange, isActive, currentValue }: InputAreaProps) {
  const cols = process.stdout.columns || 80

  return (
    <Box flexDirection="column">
      <Box marginTop={1}>
        <Text bold>❯ </Text>
        <TextInput
          key={inputKey}
          isDisabled={!isActive}
          defaultValue={currentValue}
          placeholder='Type a message or /help...'
          suggestions={SLASH_COMMANDS}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </Box>
      <Text dimColor>{'─'.repeat(cols)}</Text>
      <Text dimColor>  ctrl+c to interrupt · /help for commands</Text>
    </Box>
  )
}
