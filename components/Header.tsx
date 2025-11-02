'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone, Instagram, Facebook } from 'lucide-react'
import siteData from '@/lib/content.json'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { label: 'SOBRE', href: '#sobre' },
    { label: 'CORPO CLÍNICO', href: '#corpo-clinico' },
    { label: 'SERVIÇOS', href: '#servicos' },
    { label: 'CONVÊNIOS', href: '#convenios' },
    { label: 'CONTATO', href: '#contato' },
  ]

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      {/* Top Bar */}
      <div className="bg-teal text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center gap-4 text-sm">
          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/clinicaolhares/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.facebook.com/olharesclinica" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
          
          {/* Contact Phones */}
          <div className="flex items-center gap-4">
            <a href={`tel:${siteData.site.contact.phones[0].number}`} className="flex items-center gap-2 hover:opacity-80">
              <Phone className="w-4 h-4" />
              {siteData.site.contact.phones[0].number}
            </a>
            <a href={`https://wa.me/55${siteData.site.contact.phones[1].number.replace(/[^0-9]/g, '')}`} className="flex items-center gap-2 hover:opacity-80">
              <Phone className="w-4 h-4" />
              {siteData.site.contact.phones[1].number}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.jpg"
              alt={siteData.site.brand}
              width={220}
              height={100}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5537991200049?text=Olá! Gostaria de agendar uma consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-teal transition-colors font-medium"
            >
              Agendar Consulta
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/5537991200049?text=Olá! Gostaria de agendar uma consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-3 rounded-full hover:bg-teal transition-colors font-medium text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Agendar Consulta
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

