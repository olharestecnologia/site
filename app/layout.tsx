import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KV36QHGZ');`}
        </Script>
      </head>
      <body>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KV36QHGZ"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

