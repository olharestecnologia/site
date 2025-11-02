'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ConveniosSection() {
  const convenios = [
    { name: 'AMAGIS', slug: 'amagis', ext: 'png' },
    { name: 'Bradesco', slug: 'bradesco-saude', ext: 'png' },
    { name: 'Cassi', slug: 'cassi', ext: 'png' },
    { name: 'Cemig Saúde', slug: 'cemig-saude', ext: 'png' },
    { name: 'IPSEMG', slug: 'ipsemg', ext: 'jpg' },
    { name: 'Libertas', slug: 'libertas', ext: 'jpg' },
    { name: 'Polícia Militar (IPSM)', slug: 'policia-militar-ipsm', ext: 'jpg' },
    { name: 'Postal Saúde', slug: 'postal-saude', ext: 'png' },
    { name: 'Saúde Caixa', slug: 'saude-caixa', ext: 'png' },
    { name: 'Sulamérica', slug: 'sulamerica', ext: 'png' },
    { name: 'Unimed', slug: 'unimed', ext: 'png' },
    { name: 'Vale', slug: 'vale-saude', ext: 'jpg' },
  ]

  const parceiros = [
    { name: 'AFFAB', slug: 'affab', ext: 'jpg' },
    { name: 'Cartão de Todos', slug: 'cartao-de-todos', ext: 'jpg' },
    { name: 'CDL Divinópolis', slug: 'cdl-divinopolis', ext: 'jpg' },
    { name: 'Divicard', slug: 'divicard', ext: 'jpg' },
    { name: 'Divimédicos', slug: 'divimedicos', ext: 'png' },
    { name: 'Estrututura do Viver', slug: 'estrututura-do-viver', ext: 'png' },
    { name: 'Farmax', slug: 'farmax', ext: 'png' },
    { name: 'Medprev', slug: 'medprev', ext: 'png' },
    { name: 'NASS', slug: 'nass', ext: 'jpg' },
    { name: 'Poupa Medic', slug: 'poupa-medic', ext: 'jpg' },
    { name: 'SAAE', slug: 'saae', ext: 'png' },
    { name: 'SIMETRAL', slug: 'simetral', ext: 'jpg' },
  ]

  return (
    <section id="convenios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Convênios e Parceiros
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Atendemos diversos planos de saúde e trabalhamos com parceiros de confiança
          </p>
        </div>

        {/* Convênios */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Convênios Aceitos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {convenios.map((convenio, index) => (
              <LogoCard key={index} item={convenio} type="convenio" />
            ))}
          </div>
        </div>

        {/* Parceiros */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Parceiros
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {parceiros.map((parceiro, index) => (
              <LogoCard key={index} item={parceiro} type="parceiro" />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center bg-primary/10 rounded-lg p-8">
          <p className="text-lg text-gray-700">
            <strong>Atendimento Particular:</strong> Também realizamos atendimentos particulares com valores acessíveis.
          </p>
        </div>
      </div>
    </section>
  )
}

function LogoCard({ item, type }: { item: { name: string; slug: string; ext: string }; type: 'convenio' | 'parceiro' }) {
  const [imageError, setImageError] = useState(false)
  const imagePath = `/images/convenios/${item.slug}.${item.ext}`
  const borderColor = type === 'convenio' ? 'hover:border-primary' : 'hover:border-teal'

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      className={`bg-white border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center ${borderColor} transition-colors min-h-[140px]`}
    >
      {!imageError ? (
        <>
          <div className="relative w-full h-20 flex items-center justify-center mb-3">
            <Image
              src={imagePath}
              alt={`Logo ${item.name}`}
              width={200}
              height={80}
              className="object-contain max-h-20"
              onError={handleImageError}
            />
          </div>
          <span className="text-gray-700 font-medium text-sm text-center">
            {item.name}
          </span>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <span className="text-gray-800 font-semibold text-sm">
            {item.name}
          </span>
        </div>
      )}
    </div>
  )
}

