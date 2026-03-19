import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurum Estates | Immobilier de Luxe Tanger',
  description: 'Découvrez des propriétés exceptionnelles à Tanger. Aurum Estates propose l\'immobilier de prestige pour les acheteurs et locataires exigeants en quête de luxe.',
  keywords: ['immobilier tanger', 'propriétés de luxe', 'acheter propriété', 'louer maison de luxe', 'villa', 'penthouse', 'tanger maroc'],
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
