import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'

const CONFIG_DIR = path.join(os.homedir(), '.tensor')
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json')

interface AuthData {
  token: string
  email?: string
}

function ensureDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 })
  }
}

export function getToken(): string | null {
  try {
    const data: AuthData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'))
    return data.token || null
  } catch {
    return null
  }
}

export function getAuthData(): AuthData | null {
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'))
  } catch {
    return null
  }
}

export function saveToken(token: string, email?: string): void {
  ensureDir()
  const data: AuthData = { token, ...(email && { email }) }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), { mode: 0o600 })
}

export function clearToken(): void {
  try {
    fs.unlinkSync(AUTH_FILE)
  } catch {}
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}
