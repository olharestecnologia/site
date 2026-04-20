import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export interface AuthResult {
  ok: boolean
  userId?: string
  username?: string
  error?: 'invalid_credentials' | 'rate_limited'
}

const attempts = new Map<string, { count: number; firstAt: number }>()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

export function rateLimitKey(ip: string | null, username: string): string {
  return `${ip ?? 'unknown'}:${username.toLowerCase()}`
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count += 1
  return true
}

export function resetRateLimit(key: string): void {
  attempts.delete(key)
}

export async function verifyCredentials(
  username: string,
  password: string
): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return { ok: false, error: 'invalid_credentials' }
  }
  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    return { ok: false, error: 'invalid_credentials' }
  }
  return { ok: true, userId: user.id, username: user.username }
}
