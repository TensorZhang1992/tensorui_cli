import * as fs from 'node:fs'
import * as path from 'node:path'
import * as os from 'node:os'
import * as http from 'node:http'
import * as https from 'node:https'

const CONFIG_DIR = path.join(os.homedir(), '.tensor')
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json')
const API_BASE = process.env.TENSOR_API_URL || 'http://localhost:3001'

interface AuthData {
  token: string
  email?: string
  plan?: string
  planExpiresAt?: string
  proxyUrl?: string
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
  const existing = getAuthData()
  const data: AuthData = {
    ...existing,
    token,
    ...(email && { email }),
  }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), { mode: 0o600 })
}

export function saveSubscription(plan: string, expiresAt?: string, proxyUrl?: string): void {
  ensureDir()
  const existing = getAuthData()
  if (!existing) return
  const data: AuthData = {
    ...existing,
    plan,
    planExpiresAt: expiresAt,
    ...(proxyUrl && { proxyUrl }),
  }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), { mode: 0o600 })
}

export function getProxyUrl(): string {
  const auth = getAuthData()
  return auth?.proxyUrl || `${API_BASE}/api/v1/ai`
}

export function clearToken(): void {
  try {
    fs.unlinkSync(AUTH_FILE)
  } catch {}
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}

export function hasApiKey(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)
}

function fetchJson(url: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { headers: { Authorization: `Bearer ${token}` } }, (res) => {
      let body = ''
      res.on('data', (chunk: Buffer) => { body += chunk.toString() })
      res.on('end', () => {
        try { resolve(JSON.parse(body)) }
        catch { reject(new Error('Invalid JSON')) }
      })
    })
    req.on('error', reject)
    req.setTimeout(10_000, () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

async function refreshSubscription(): Promise<{ plan: string; expiresAt?: string } | null> {
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetchJson(`${API_BASE}/api/v1/subscriptions/me`, token)
    if (res?.code === 0 && res.data) {
      const sub = { plan: res.data.plan, expiresAt: res.data.current_period_end || undefined }
      saveSubscription(sub.plan, sub.expiresAt)
      return sub
    }
  } catch {}
  return null
}

export async function canUse(): Promise<{ ok: boolean; reason?: string }> {
  if (hasApiKey()) return { ok: true }

  if (!isLoggedIn()) {
    return { ok: false, reason: 'Not logged in. Run /login to authenticate, or set ANTHROPIC_API_KEY in .env' }
  }

  const auth = getAuthData()

  if (auth?.plan === 'pro') {
    if (!auth.planExpiresAt || new Date(auth.planExpiresAt) >= new Date()) {
      return { ok: true }
    }
    const refreshed = await refreshSubscription()
    if (refreshed?.plan === 'pro') {
      if (!refreshed.expiresAt || new Date(refreshed.expiresAt) >= new Date()) {
        return { ok: true }
      }
    }
    return { ok: false, reason: `Pro subscription expired on ${auth.planExpiresAt}. Renew at https://tensor-ui.com/pricing or set ANTHROPIC_API_KEY in .env` }
  }

  return { ok: false, reason: 'Pro subscription required. Upgrade at https://tensor-ui.com/pricing or set ANTHROPIC_API_KEY in .env' }
}

export function applyProxyEnv(): void {
  if (process.env.ANTHROPIC_API_KEY) return
  const auth = getAuthData()
  if (!auth?.token || auth.plan !== 'pro') return
  process.env.ANTHROPIC_BASE_URL = getProxyUrl()
  process.env.ANTHROPIC_AUTH_TOKEN = auth.token
}
