'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Menu, Stethoscope, X } from 'lucide-react'

const items = [
  { href: '/admin/medicos', label: 'Médicos', icon: Stethoscope },
]

interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar requires AdminSidebarProvider')
  return ctx
}

export function AdminMobileToggle() {
  const { setOpen } = useSidebar()
  return (
    <button
      type="button"
      aria-label="Abrir menu"
      onClick={() => setOpen(true)}
      className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:bg-gray-100"
    >
      <Menu size={22} />
    </button>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { open, setOpen } = useSidebar()

  return (
    <>
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900/50 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 md:shrink-0 flex flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <Link href="/admin/medicos" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Clínica Olhares"
              width={40}
              height={40}
              className="rounded-md"
              priority
            />
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              Clínica Olhares
            </span>
          </Link>
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default AdminSidebar
