'use client'

import { MessageCircle } from 'lucide-react'
import siteData from '@/lib/content.json'

export default function WhatsAppButton() {
  const whatsappNumber = siteData.site.contact.phones[1].number.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=Olá! Gostaria de agendar uma consulta.`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 whatsapp-float"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle size={32} />
    </a>
  )
}

