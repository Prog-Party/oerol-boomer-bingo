'use client'

import BingoCell from '@/components/BingoCell'
import BingoModal from '@/components/BingoModal'
import { BingoData } from '@/lib/azure'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BingoBoardPageProps {
  params: { slug: string }
}

export default function BingoBoardPage({ params }: BingoBoardPageProps) {
  const { slug } = params
  const router = useRouter()
  
  const [bingoData, setBingoData] = useState<BingoData | null>(null)
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBingoModal, setShowBingoModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [bingoCompletedAt, setBingoCompletedAt] = useState<string | null>(null)

  useEffect(() => {
    fetchBingoData()
  }, [slug])

  const fetchBingoData = async () => {
    try {
      const response = await fetch(`/api/bingo/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/')
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

  const checkBingoCompletion = () => {
    if (!bingoData) return false
    // Check if all 24 non-FREE cells are checked
    return checkedItems.length >= 24
  }

  // Verwijder de automatische useEffect - modal wordt nu direct getoond bij completion

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bingo wordt ingeladen...</p>
        </div>
      </div>
    )
  }

  if (error || !bingoData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Oerol Boomer Bingo
            </h1>
            <p className="text-gray-600">
              Voortgang: {checkedItems.length}/24
            </p>
          </header>
          
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            <div className="grid grid-cols-5 gap-2 md:gap-3">
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

          <div className='mt-6 text-center'>
            <p className="text-gray-600 text-sm">
              <b>GRATIS</b>: Het middelste vakje is gratis. Boomers hebben altijd alles gratis gekregen.
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Start een nieuwe Bingo
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

      <footer className="text-center text-white text-sm mt-8" style={{ backgroundColor: '#945f14', clipPath: 'polygon(0 20%,100% 0,100% 100%,0% 100%)', marginTop: 'auto', padding: '1rem 0' }}>
      </footer>
    </div>
  )
} 