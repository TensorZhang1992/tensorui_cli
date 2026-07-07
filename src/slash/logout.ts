import type { Message } from '../components/MessageBlock.js'
import { clearToken, isLoggedIn } from '../engine/auth.js'

let nextId = 5100
function uid() { return String(++nextId) }

export function handleLogout(_args: string): Message[] {
  if (!isLoggedIn()) {
    return [{ id: uid(), type: 'info', text: 'Not logged in.' }]
  }
  clearToken()
  return [{ id: uid(), type: 'info', text: 'Logged out. Token removed.' }]
}
