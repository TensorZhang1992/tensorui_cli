export function hasApiKey(): boolean {
  return !!(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN)
}

export async function canUse(): Promise<{ ok: boolean; reason?: string }> {
  if (hasApiKey()) return { ok: true }
  return {
    ok: false,
    reason: 'ANTHROPIC_API_KEY not set. Add it to your .env file or pass --api-key <key>',
  }
}
