import React from 'react'
import type { Metadata } from 'next'
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
      <body className="min-h-screen flex flex-col">
        <main className="flex-grow overflow-y-auto">{children}</main>
        <footer className="text-center text-white text-sm"
          style={{
            backgroundColor: '#945f14',
            clipPath: 'polygon(0 20%,100% 0,100% 100%,0% 100%)',
            padding: '1rem 0'
          }}
        >
          <p className="text-sm">
            Idee door{' '}
            <a
              href="https://www.andriestunru.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline"
            >
              Andries Tunru
            </a>
            . Volg mij op{' '}
            <a href="https://www.instagram.com/andriestunru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline"
            >
              Instagram @AndriesTunru
            </a>
          </p>
          Realisatie door ProgParty
        </footer>
      </body >
    </html >
  )
} 