import type { Metadata } from 'next'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
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

  if (!session.userId) {
    return <main className="min-h-screen bg-gray-50">{children}</main>
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <Link
              href="/admin/medicos"
              className="md:hidden text-base font-semibold text-primary"
            >
              Olhares · Admin
            </Link>
            <div className="flex items-center gap-4 text-sm ml-auto">
              <span className="text-gray-500">{session.username}</span>
              <LogoutButton />
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
