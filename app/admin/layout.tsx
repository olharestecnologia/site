import type { Metadata } from 'next'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'
import { getSession } from '@/lib/session'

export const metadata: Metadata = {
  title: 'Admin — Olhares Oftalmologia',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {session.userId && (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/admin/medicos" className="text-lg font-semibold text-primary">
                Olhares · Admin
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link
                  href="/admin/medicos"
                  className="text-gray-700 hover:text-primary"
                >
                  Médicos
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">{session.username}</span>
              <LogoutButton />
            </div>
          </div>
        </header>
      )}
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
