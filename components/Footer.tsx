import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import siteData from '@/lib/content.json'

export default function Footer() {
  const address = siteData.site.contact.address

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <Image
              src="/images/logo-footer.png"
              alt={siteData.site.brand}
              width={180}
              height={80}
              className="mb-4"
            />
            <p className="text-gray-400 text-sm">
              {siteData.site.tagline}
            </p>
          </div>

          {/* Links Institucionais */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li><Link href="#sobre" className="text-gray-400 hover:text-white transition-colors">A Clínica</Link></li>
              <li><Link href="#corpo-clinico" className="text-gray-400 hover:text-white transition-colors">Corpo Clínico</Link></li>
              <li><Link href="#servicos" className="text-gray-400 hover:text-white transition-colors">Serviços</Link></li>
              <li><Link href="#convenios" className="text-gray-400 hover:text-white transition-colors">Convênios</Link></li>
              <li><Link href="#contato" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock size={20} />
              Horário de Funcionamento
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Segunda a Sexta: 07:45 às 18:00</li>
              <li>Sábado: 07:45 às 12:00</li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>
                  {address.street}<br />
                  {address.neighborhood}<br />
                  {address.city} - {address.state}<br />
                  CEP: {address.postal_code}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href={`tel:${siteData.site.contact.phones[0].number}`} className="hover:text-white">
                  {siteData.site.contact.phones[0].number}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <a href={`tel:${siteData.site.contact.phones[1].number}`} className="hover:text-white">
                  {siteData.site.contact.phones[1].number}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold">Siga-nos nas Redes Sociais</h3>
            <div className="flex items-center gap-6">
              <a 
                href="https://www.instagram.com/clinicaolhares/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-8 h-8" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.facebook.com/olharesclinica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-8 h-8" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} {siteData.site.brand} - Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  )
}

