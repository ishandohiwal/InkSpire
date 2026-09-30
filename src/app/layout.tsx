import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'InkSpire - Social Reading & Publishing Platform',
  description: 'A modern social reading platform for serialized fiction, community interaction, and creative storytelling.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink-900 text-ink-300">{children}</body>
    </html>
  )
}
