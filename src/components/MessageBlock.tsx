import React from 'react'
import { Box, Text } from 'ink'

export interface Message {
  id: string
  type: 'user' | 'assistant' | 'tool' | 'info' | 'error' | 'result'
  text: string
  toolName?: string
}

export default function MessageBlock({ message }: { message: Message }) {
  switch (message.type) {
    case 'user':
      return (
        <Box marginTop={1}>
          <Text color="green" bold>❯ </Text>
          <Text>{message.text}</Text>
        </Box>
      )

    case 'assistant':
      return (
        <Box marginLeft={2} flexDirection="column">
          <Text wrap="wrap">{message.text}</Text>
        </Box>
      )

    case 'tool':
      return (
        <Box marginLeft={2}>
          <Text dimColor>  ⎿ </Text>
          <Text color="cyan" dimColor>{message.toolName || 'Tool'}</Text>
          <Text dimColor> {message.text}</Text>
        </Box>
      )

    case 'info':
      return (
        <Box marginLeft={2}>
          <Text color="blue">{message.text}</Text>
        </Box>
      )

    case 'error':
      return (
        <Box marginLeft={2}>
          <Text color="red">✗ {message.text}</Text>
        </Box>
      )

    case 'result':
      return (
        <Box marginLeft={2} marginTop={1}>
          <Text dimColor>{message.text}</Text>
        </Box>
      )

    default:
      return null
  }
}
