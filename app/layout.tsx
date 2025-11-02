import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import siteData from '@/lib/content.json'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: siteData.site.seo.title,
  description: siteData.site.seo.description,
  keywords: siteData.site.seo.keywords.join(', '),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  )
}

