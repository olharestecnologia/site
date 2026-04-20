import { NextResponse, type NextRequest } from 'next/server'
import { put } from '@vercel/blob'
import { getSession } from '@/lib/session'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 })
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: 'invalid_type', allowed: Array.from(ALLOWED) },
      { status: 400 }
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file_too_large', max: MAX_BYTES }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const pathname = `doctors/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url, pathname: blob.pathname })
}
