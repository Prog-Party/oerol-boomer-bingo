import { formatCompletionTime } from '@/lib/utils'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface BingoModalProps {
  isOpen: boolean
  onClose: () => void
  createdAt: string
  updatedAt: string
}

export default function BingoModal({ isOpen, onClose, createdAt, updatedAt }: BingoModalProps) {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
  const [randomGif, setRandomGif] = useState<string>('')

  // Selecteer een willekeurige GIF
  useEffect(() => {
    if (isOpen) {
      const randomNum = Math.floor(Math.random() * 3) + 1 // 1, 2, of 3
      const gifPath = `/videos/party/Boomer viert feest (${randomNum}).gif`
      setRandomGif(gifPath)
      
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, [isOpen])

  if (!isOpen) return null

  const completionTime = formatCompletionTime(createdAt, updatedAt)

  return (
    <>
      <Confetti
        width={windowDimensions.width}
        height={windowDimensions.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-2xl p-8 max-w-lg w-full mx-4 text-center shadow-2xl">
          {/* Willekeurige party GIF - 2x groter */}
          {randomGif && (
            <div className="mb-6">
              <img 
                src={randomGif} 
                alt="Boomer viert feest!" 
                className="w-64 h-64 mx-auto rounded-lg object-cover"
              />
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-green-600 mb-2">BINGO!</h2>
            <p className="text-lg text-gray-600">
              Gefeliciteerd! Je hebt de bingo voltooid in
            </p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {completionTime}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Sluiten
          </button>
        </div>
      </div>
    </>
  )
} 