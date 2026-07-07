import type { Message } from '../components/MessageBlock.js'
import { saveToken, getAuthData } from '../engine/auth.js'

let nextId = 5000
function uid() { return String(++nextId) }

export function handleLogin(args: string): Message[] {
  const token = args.trim()
  if (!token) {
    const auth = getAuthData()
    if (auth) {
      return [{ id: uid(), type: 'info', text: `Already logged in${auth.email ? ` as ${auth.email}` : ''}.\nUse /logout to sign out.` }]
    }
    return [{ id: uid(), type: 'info', text: 'Usage: /login <token>\nGet your token at https://tensor-ui.com/settings/tokens' }]
  }
  saveToken(token)
  return [{ id: uid(), type: 'info', text: 'Token saved. Design system rules will load via MCP on next query.' }]
}
