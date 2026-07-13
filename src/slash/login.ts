import * as http from 'node:http'
import * as https from 'node:https'
import { exec } from 'node:child_process'
import type { Message } from '../components/MessageBlock.js'
import { saveToken, saveSubscription, getAuthData, applyProxyEnv } from '../engine/auth.js'

let nextId = 5000
function uid() { return String(++nextId) }

const LOGIN_URL = process.env.TENSOR_LOGIN_URL || 'http://localhost:3000/login'
const API_BASE = process.env.TENSOR_API_URL || 'http://localhost:3001'

const CALLBACK_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>TensorUI Login</title>
<style>
  body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0a0a0a; color: #fafafa; }
  .card { text-align: center; padding: 2rem; }
  .ok { color: #22c55e; font-size: 1.25rem; }
  .err { color: #ef4444; }
</style></head>
<body><div class="card" id="msg">Logging in...</div>
<script>
(function() {
  var hash = window.location.hash.substring(1);
  var params = new URLSearchParams(hash);
  var token = params.get('access_token');
  if (!token) {
    var q = new URLSearchParams(window.location.search);
    token = q.get('access_token');
  }
  if (token) {
    fetch('/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token })
    }).then(function() {
      document.getElementById('msg').innerHTML = '<p class="ok">Login successful!</p><p>You can close this tab and return to the terminal.</p>';
    }).catch(function() {
      document.getElementById('msg').innerHTML = '<p class="err">Failed to send token to CLI.</p>';
    });
  } else {
    document.getElementById('msg').innerHTML = '<p class="err">No token found in callback.</p>';
  }
})();
</script></body></html>`

function openBrowser(url: string) {
  const cmd = process.platform === 'darwin' ? 'open'
    : process.platform === 'win32' ? 'start'
    : 'xdg-open'
  exec(`${cmd} "${url}"`)
}

async function fetchJson(url: string, token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { headers: { Authorization: `Bearer ${token}` } }, (res) => {
      let body = ''
      res.on('data', (chunk: Buffer) => { body += chunk.toString() })
      res.on('end', () => {
        try { resolve(JSON.parse(body)) }
        catch { reject(new Error(`Invalid JSON from ${url}`)) }
      })
    })
    req.on('error', reject)
  })
}

async function fetchSubscription(token: string): Promise<{ plan: string; expiresAt?: string } | null> {
  try {
    const res = await fetchJson(`${API_BASE}/api/v1/subscriptions/me`, token)
    if (res.code === 0 && res.data) {
      return {
        plan: res.data.plan,
        expiresAt: res.data.current_period_end || undefined,
      }
    }
  } catch {}
  return null
}

function startCallbackServer(): Promise<{ token: string; email?: string }> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (req.method === 'GET' && req.url?.startsWith('/callback')) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(CALLBACK_HTML)
        return
      }

      if (req.method === 'POST' && req.url === '/token') {
        let body = ''
        req.on('data', (chunk: Buffer) => { body += chunk.toString() })
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
          res.end('{"ok":true}')
          try {
            const data = JSON.parse(body)
            server.close()
            resolve({ token: data.token, email: data.email })
          } catch {
            server.close()
            reject(new Error('Invalid callback data'))
          }
        })
        return
      }

      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        })
        res.end()
        return
      }

      res.writeHead(404)
      res.end()
    })

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      if (!addr || typeof addr === 'string') {
        reject(new Error('Failed to start callback server'))
        return
      }
      const port = addr.port
      const callbackUrl = `http://localhost:${port}/callback`
      const loginUrl = `${LOGIN_URL}?cli_redirect=${encodeURIComponent(callbackUrl)}`
      openBrowser(loginUrl)
    })

    const timeout = setTimeout(() => {
      server.close()
      reject(new Error('Login timed out (120s). Try /login <token> to paste a token directly.'))
    }, 120_000)

    server.on('close', () => clearTimeout(timeout))
  })
}

async function loginAndFetchPlan(token: string, email?: string): Promise<Message[]> {
  saveToken(token, email)

  const sub = await fetchSubscription(token)
  const msgs: Message[] = []

  if (sub) {
    const proxyUrl = `${API_BASE}/api/v1/ai`
    saveSubscription(sub.plan, sub.expiresAt, proxyUrl)
    if (sub.plan === 'pro') {
      applyProxyEnv()
      const expiry = sub.expiresAt ? ` (expires ${new Date(sub.expiresAt).toLocaleDateString()})` : ''
      msgs.push({ id: uid(), type: 'info', text: `Login successful${email ? ` as ${email}` : ''}. Plan: Pro${expiry}` })
    } else {
      msgs.push({ id: uid(), type: 'info', text: `Login successful${email ? ` as ${email}` : ''}. Plan: ${sub.plan}` })
      msgs.push({ id: uid(), type: 'error', text: 'Pro subscription required to use TensorUI. Upgrade at https://tensor-ui.com/pricing or set ANTHROPIC_API_KEY in .env' })
    }
  } else {
    msgs.push({ id: uid(), type: 'info', text: `Login successful${email ? ` as ${email}` : ''}.` })
    msgs.push({ id: uid(), type: 'error', text: 'Could not verify subscription. Set ANTHROPIC_API_KEY in .env as fallback.' })
  }

  return msgs
}

export async function handleLogin(args: string): Promise<Message[]> {
  const token = args.trim()

  if (token) {
    return await loginAndFetchPlan(token)
  }

  const auth = getAuthData()
  if (auth?.token) {
    const planInfo = auth.plan ? ` (${auth.plan})` : ''
    const expiryInfo = auth.plan === 'pro' && auth.planExpiresAt
      ? ` expires ${new Date(auth.planExpiresAt).toLocaleDateString()}`
      : ''
    return [{ id: uid(), type: 'info', text: `Already logged in${auth.email ? ` as ${auth.email}` : ''}${planInfo}${expiryInfo}.\nUse /logout to sign out, or /login <token> to update.` }]
  }

  try {
    const result = await startCallbackServer()
    return await loginAndFetchPlan(result.token, result.email)
  } catch (err: any) {
    return [{ id: uid(), type: 'error', text: err.message }]
  }
}
