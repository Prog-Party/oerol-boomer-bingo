'use client'

import BingoCell from '@/components/BingoCell'
import BingoModal from '@/components/BingoModal'
import BingoOverview from '@/components/BingoOverview'
import SocialShare from '@/components/SocialShare'
import { BingoData } from '@/lib/azure'
import { createBingoGame, extractNameFromSlug } from '@/lib/bingoUtils'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface BingoBoardPageProps {
  params: { slug: string }
}

export default function BingoBoardPage({ params }: BingoBoardPageProps) {
  const { slug } = params
  const router = useRouter()

  const [bingoData, setBingoData] = useState<BingoData | null>(null)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [error, setError] = useState('')
  const [showBingoModal, setShowBingoModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [bingoCompletedAt, setBingoCompletedAt] = useState<string | null>(null)
  const lastFetchedSlug = useRef<string | null>(null)

  useEffect(() => {
    // Only fetch if we haven't already fetched for this slug
    if (!slug || slug === lastFetchedSlug.current) {
      return
    }

    lastFetchedSlug.current = slug
    fetchBingoData()
  }, [slug])

  const handleStartNewBingo = async () => {

    setIsCreatingNew(true)
    try {
      const name = extractNameFromSlug(slug)
      const newSlug = await createBingoGame(name.trim())
      router.push(`/${newSlug}`)
    } catch (error) {
      console.error('Error creating new bingo:', error)
      setError('Failed to create new bingo game')
    } finally {
      setIsCreatingNew(false)
    }
  }

  const createNewBingoGameForSlug = async () => {

    // Automatically create a bingo game for this unused URL
    try {
      setIsCreatingNew(true)
      const name = extractNameFromSlug(slug)
      const newSlug = await createBingoGame(name)

      console.log("slug", slug, "Current name", name, "new slug", newSlug)

      // If the new slug is different, redirect to it
      if (newSlug !== slug) {
        router.replace(`/${newSlug}`)
        return
      }

      // Otherwise, try fetching again
      const newResponse = await fetch(`/api/bingo/${slug}`)
      if (newResponse.ok) {
        const data: BingoData = await newResponse.json()
        setBingoData(data)
        setCheckedItems(data.checked)
        return
      }
    } catch (createError) {
      console.error('Error auto-creating bingo game:', createError)
      // Fall back to redirecting to homepage
      router.push('/')
      return
    } finally {
      setIsCreatingNew(false)
    }
  }

  const fetchBingoData = async () => {
    if (!slug) return

    try {
      const response = await fetch(`/api/bingo/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          createNewBingoGameForSlug()
          return
        }
        throw new Error('Failed to fetch bingo data')
      }

      const data: BingoData = await response.json()
      setBingoData(data)
      setCheckedItems(data.checked)

      // Check if bingo was already completed when loading
      if (data.checked.length >= 24) {
        setShowBingoModal(true)
        setBingoCompletedAt(data.updatedAt)
      }
    } catch (err) {
      setError('Failed to load bingo game')
      console.error('Error fetching bingo data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCellClick = async (item: string) => {
    if (!bingoData) return

    const newCheckedItems = checkedItems.includes(item)
      ? checkedItems.filter(id => id !== item)
      : [...checkedItems, item]

    setCheckedItems(newCheckedItems)
    setShowConfetti(true)

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 2000)

    // Check if this completed the bingo
    const justCompletedBingo = newCheckedItems.length >= 24 && checkedItems.length < 24

    try {
      await fetch(`/api/bingo/${slug}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checked: newCheckedItems,
          // Als bingo net voltooid is, stuur completion flag mee
          ...(justCompletedBingo && { completed: true })
        }),
      })

      // Als bingo net voltooid is, toon modal
      if (justCompletedBingo) {
        const completionTime = new Date().toISOString()
        setBingoCompletedAt(completionTime)
        setShowBingoModal(true)
      }
    } catch (error) {
      console.error('Error updating bingo data:', error)
      // Revert on error
      setCheckedItems(checkedItems)
    }
  }

  if (isLoading) {
    return (
      <div
        className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
        style={{ height: '95vh' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bingo wordt ingeladen...</p>
        </div>
      </div>
    )
  }
  if (isCreatingNew) {
    return (
      <div
        className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
        style={{ height: '95vh' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bingo wordt aangemaakt...</p>
        </div>
      </div>
    )
  }

  if (error || !bingoData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Bingo game not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Create 5x5 grid with FREE in center
  const gridItems = [...bingoData.items]
  gridItems.splice(12, 0, 'GRATIS') // Insert FREE at position 12 (center of 5x5 grid)

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden min-h-screen">
      <div className="flex-grow container mx-auto px-4 py-6 max-w-full">
        <div className="max-w-2xl mx-auto w-full">
          <header className="text-center mb-6 md:w-full md:min-h-0 min-h-[200px]" style={{ width: 'calc(100% - 200px)' }}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Oerol Boomerbingo
            </h1>
            <p className="text-gray-600">
              Voortgang: {checkedItems.length}/24
            </p>
          </header>

          <div className='mt-6 text-center'>
            <SocialShare />
          </div>

          {/* Mobile Overview Card - only show on mobile, make it sticky */}
          <div className="md:hidden fixed top-0 bottom-0 right-0 z-20 pt-2 pb-4 px-4"
            style={{ height: '240px', width: '200px' }}>
            <BingoOverview gridItems={gridItems} checkedItems={checkedItems} />
          </div>

          {/* Desktop Grid - hidden on mobile */}
          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 overflow-hidden">
              <div className="grid grid-cols-5 gap-2 md:gap-3 w-full max-w-full">
                {gridItems.map((item, index) => {
                  const isFree = item === 'GRATIS'
                  const isChecked = isFree || checkedItems.includes(item)

                  return (
                    <BingoCell
                      key={index}
                      item={item}
                      isChecked={isChecked}
                      isFree={isFree}
                      onClick={() => !isFree && handleCellClick(item)}
                      index={index}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile List View - only show on mobile */}
          <div className="md:hidden grid grid-cols-1 gap-2">
            {gridItems.map((item, index) => {
              const isFree = item === 'GRATIS'
              const isChecked = isFree || checkedItems.includes(item)

              if (isFree) return null // Skip the GRATIS item in mobile list

              return (
                <button
                  key={index}
                  onClick={() => !isFree && handleCellClick(item)}
                  disabled={isFree}
                  className={`
                    p-3 rounded-lg text-left transition-all duration-200 border-2 h-15 relative
                    ${isChecked
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  `}
                >
                  <div className="flex items-center h-full pr-8">
                    <span className="font-medium text-xs leading-tight line-clamp-3 flex-1">{item}</span>
                  </div>
                  {isChecked && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className='mt-6 text-center'>
            <p className="text-gray-600 text-sm">
              Het middelste vakje krijg je <b>gratis</b> (net zoals boomers altijd alles gratis hebben gekregen).
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleStartNewBingo}
              disabled={isCreatingNew}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreatingNew ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Bingo wordt aangemaakt...
                </div>
              ) : (
                <>Start een nieuwe Bingo</>
              )}
            </button>
          </div>
        </div>
      </div>

      {showBingoModal && bingoData && (
        <BingoModal
          isOpen={showBingoModal}
          onClose={() => {
            setShowBingoModal(false)
            setBingoCompletedAt(null)
          }}
          createdAt={bingoData.createdAt}
          updatedAt={bingoCompletedAt || bingoData.updatedAt}
        />
      )}

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-yellow-400 bg-opacity-20 animate-pulse"></div>
        </div>
      )}
    </div>
  )
} 