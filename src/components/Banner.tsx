import React from 'react'
import { Box, Text } from 'ink'
import { getModel } from '../engine/sdk.js'

export default function Banner() {
  const cwd = process.cwd()
  const home = process.env.HOME || ''
  const displayCwd = home && cwd.startsWith(home) ? '~' + cwd.slice(home.length) : cwd
  const cols = process.stdout.columns || 80
  const model = getModel()

  const title = ` tensor-ui v0.1.0 `
  const dashCount = Math.max(0, cols - title.length - 4)
  const topLine = '── ' + title + '─'.repeat(dashCount)
  const bottomLine = '─'.repeat(cols)

  return (
    <Box flexDirection="column">
      <Text dimColor>{topLine}</Text>
      <Text> </Text>
      <Text>  <Text bold>{model}</Text><Text dimColor> · /model</Text></Text>
      <Text>  <Text dimColor>{displayCwd}</Text></Text>
      <Text> </Text>
      <Text dimColor>  Tips: 直接输入自然语言生成代码，或用 /clone 加载设计系统</Text>
      <Text> </Text>
      <Text dimColor>{bottomLine}</Text>
    </Box>
  )
}
