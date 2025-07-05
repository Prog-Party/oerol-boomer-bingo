import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { formatCompletionTime } from '@/lib/utils'

interface BingoModalProps {
  isOpen: boolean
  onClose: () => void
  createdAt: string
  updatedAt: string
}

export default function BingoModal({ isOpen, onClose, createdAt, updatedAt }: BingoModalProps) {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (isOpen) {
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
        
        <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-green-600 mb-2">BINGO!</h2>
            <p className="text-lg text-gray-600">
              Congratulations! You completed the bingo in
            </p>
            <p className="text-3xl font-bold text-primary-600 mt-2">
              {completionTime}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
} 