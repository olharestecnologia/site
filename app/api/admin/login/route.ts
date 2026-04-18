import { NextResponse, type NextRequest } from 'next/server'
import { loginSchema } from '@/lib/validators'
import {
  checkRateLimit,
  rateLimitKey,
  resetRateLimit,
  verifyCredentials,
} from '@/lib/auth'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = loginSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null
  const key = rateLimitKey(ip, parsed.data.username)
  if (!checkRateLimit(key)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  const result = await verifyCredentials(parsed.data.username, parsed.data.password)
  if (!result.ok) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 })
  }

  resetRateLimit(key)
  const session = await getSession()
  session.userId = result.userId
  session.username = result.username
  await session.save()

  return NextResponse.json({ ok: true })
}
