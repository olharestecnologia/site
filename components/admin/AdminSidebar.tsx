'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Stethoscope } from 'lucide-react'

const items = [
  { href: '/admin/medicos', label: 'Médicos', icon: Stethoscope },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-gray-200 md:bg-white">
      <div className="px-6 py-5 border-b border-gray-200">
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
  )
}
