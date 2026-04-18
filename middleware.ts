import { NextResponse, type NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type AdminSession } from '@/lib/session'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const session = await getIronSession<AdminSession>(req, res, sessionOptions())

  if (!session.userId) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}
