import { cookies } from 'next/headers'
import { getIronSession, type SessionOptions } from 'iron-session'

export interface AdminSession {
  userId?: string
  username?: string
}

function sessionPassword(): string {
  const pwd = process.env.SESSION_PASSWORD
  if (!pwd || pwd.length < 32) {
    throw new Error(
      'SESSION_PASSWORD ausente ou com menos de 32 caracteres. Defina no .env.local.'
    )
  }
  return pwd
}

export function sessionOptions(): SessionOptions {
  return {
    password: sessionPassword(),
    cookieName: 'olhares_admin_session',
    cookieOptions: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    },
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<AdminSession>(cookieStore, sessionOptions())
}
