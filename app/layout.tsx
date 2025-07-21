import Footer from '@/components/Footer'
import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Oerol Boomerbingo',
  description: 'A mobile-first bingo game for Oerol festival',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className='bg-gradient-to-br from-blue-50 to-indigo-100' style={{ paddingBottom: '6rem' }}>{children}</main>
        <Footer />
      </body >
    </html >
  )
} 