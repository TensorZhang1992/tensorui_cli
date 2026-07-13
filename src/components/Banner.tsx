import React from 'react'
import { Box, Text } from 'ink'
import { getModel } from '../engine/sdk.js'
import { hasApiKey, isLoggedIn, getAuthData } from '../engine/auth.js'

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

  let statusLine: React.ReactNode
  if (hasApiKey()) {
    statusLine = <Text color="green">  API Key configured</Text>
  } else if (isLoggedIn()) {
    const auth = getAuthData()
    if (auth?.plan === 'pro') {
      const expired = auth.planExpiresAt && new Date(auth.planExpiresAt) < new Date()
      if (expired) {
        statusLine = <Text color="yellow">  Pro expired — run /login to refresh or set ANTHROPIC_API_KEY</Text>
      } else {
        const expiry = auth.planExpiresAt ? ` (expires ${new Date(auth.planExpiresAt).toLocaleDateString()})` : ''
        statusLine = <Text color="green">  Pro{expiry} · {auth.email || 'logged in'}</Text>
      }
    } else {
      statusLine = <Text color="red">  Pro required — upgrade at https://tensor-ui.com/pricing or set ANTHROPIC_API_KEY</Text>
    }
  } else {
    statusLine = <Text color="red">  Not ready — run /login or set ANTHROPIC_API_KEY in .env</Text>
  }

  return (
    <Box flexDirection="column">
      <Text dimColor>{topLine}</Text>
      <Text> </Text>
      <Text>  <Text bold>{model}</Text><Text dimColor> · /model</Text></Text>
      <Text>  <Text dimColor>{displayCwd}</Text></Text>
      {statusLine}
      <Text> </Text>
      <Text dimColor>  Tips: 直接输入自然语言生成代码，或用 /clone 加载设计系统</Text>
      <Text> </Text>
      <Text dimColor>{bottomLine}</Text>
    </Box>
  )
}
