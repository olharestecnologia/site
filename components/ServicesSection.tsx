'use client'

import { Eye, Stethoscope, Cross } from 'lucide-react'
import siteData from '@/lib/content.json'

export default function ServicesSection() {
  const services = siteData.pages[3]?.services

  const serviceIcons = {
    consultas: <Stethoscope className="w-12 h-12" />,
    exames: <Eye className="w-12 h-12" />,
    cirurgias: <Cross className="w-12 h-12" />,
  }

  if (!services) return null

  return (
    <section id="servicos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Atendimento completo em oftalmologia com tecnologia de ponta
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(services).map(([key, service]: [string, any]) => (
            <div
              key={key}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-primary transition-all"
            >
              <div className="text-primary mb-4">
                {serviceIcons[key as keyof typeof serviceIcons]}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              {service.list && (
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {service.list.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {service.includes && (
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {service.includes.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

