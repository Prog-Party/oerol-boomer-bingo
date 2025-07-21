'use client'

import { createBingoGame } from '@/lib/bingoUtils'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function HomePage() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const slug = await createBingoGame(name.trim())
      router.push(`/${slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col relative items-center justify-center"
      style={{
        backgroundImage: "url('/images/Phone bingo red pencil.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-md w-full  mt-8 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Turf je frustratie van je af met de
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ✨ Oerol Boomerbingo ✨
            </h1>
            <p className="text-gray-600 mt-2">
              Volle kaart? Dan win je een ANWB-abonnement en een paar premium Nordicwalking-sokken.
            </p>
            <p className="text-gray-600 mt-2">
              Vragen? Opmerkingen? Tips voor de kaart van volgend jaar? -&gt;
              <a
                href="https://www.instagram.com/andriestunru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                &nbsp;@AndriesTunru&nbsp;
              </a>op Instagram
            </p>
            <p className='text-gray-600 mt-2 text-sm'>
              (Voor de boomers: Instagram is een soort{' '}
              <a
                href="https://nl.wikipedia.org/wiki/Polaroid_Corporation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:underline"
              >
                Polaroid
              </a>{' '}
              maar dan met een app)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Je naam
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Voer je naam in"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Bingokaart wordt aangemaakt...
                </div>
              ) : <>Start de Bingo</>}
            </button>
          </form>
        </div>
      </div>
    </div >
  )
} 