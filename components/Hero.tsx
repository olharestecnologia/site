'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import siteData from '@/lib/content.json'

const heroImages = [
  '/images/hero-1.jpg',
  '/images/hero-4.jpg',
  '/images/hero-5.jpg',
]

export default function Hero() {
  const heroData = siteData.pages[0]?.hero
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  if (!heroData) return null

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentImageIndex])

  const nextImage = () => {
    setDirection('next')
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const previousImage = () => {
    setDirection('prev')
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToImage = (index: number) => {
    if (index !== currentImageIndex) {
      setDirection(index > currentImageIndex ? 'next' : 'prev')
      setCurrentImageIndex(index)
    }
  }

  return (
    <section className="relative h-[600px] flex items-center justify-center mt-24 overflow-hidden">
      {/* Background Images with Carousel */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => {
          const isActive = index === currentImageIndex
          const isPrev = index === (currentImageIndex - 1 + heroImages.length) % heroImages.length
          const isNext = index === (currentImageIndex + 1) % heroImages.length
          
          let transformClass = 'translate-x-full'
          let opacityClass = 'opacity-0'
          
          if (isActive) {
            transformClass = 'translate-x-0'
            opacityClass = 'opacity-100'
          } else if (isPrev) {
            transformClass = '-translate-x-full'
            opacityClass = 'opacity-0'
          } else if (isNext) {
            transformClass = 'translate-x-full'
            opacityClass = 'opacity-0'
          }
          
          return (
            <div
              key={image}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${transformClass} ${opacityClass}`}
            >
              <Image
                src={image}
                alt={`Clínica Olhares ${index + 1}`}
                fill
                className="object-cover brightness-50"
                priority={index === 0}
              />
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={previousImage}
        className="absolute left-4 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Imagem anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
        aria-label="Próxima imagem"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
          {heroData.headline}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {heroData.subheadline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/5537991200049?text=Olá! Gostaria de agendar uma consulta."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-teal text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors inline-block"
          >
            {heroData.primary_cta.label}
          </a>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentImageIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

