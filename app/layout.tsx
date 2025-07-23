import Footer from '@/components/Footer'
import type { Metadata } from 'next'
import React from 'react'
import { setGoogleTag, useGoogleTag } from '../hooks';
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
    useGoogleTag()
    setGoogleTag('G-FRBDNMMBS8')

  return (
    <html lang="en">
      <body className="min-h-screen">
        <main>{children}</main>
        <Footer />
      </body >
    </html >
  )
} 