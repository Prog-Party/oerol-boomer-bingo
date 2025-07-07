'use client'

import { useEffect, useRef, useState } from 'react'

interface DonateOption {
  amount: number
  guldenAmount: number
  description: string
  payNlLink?: string
}

const donateOptions: DonateOption[] = [
  {
    amount: 1,
    guldenAmount: 2.20,
    description: "De waarde van een kop koffie in 1995 ☕",
    payNlLink: "" // Te vullen door gebruiker
  },
  {
    amount: 3.50,
    guldenAmount: 7.71,
    description: "Ik weet niet wat het kost, maar m'n kind regelt m'n internetbankieren 💻",
    payNlLink: "" // Te vullen door gebruiker
  },
  {
    amount: 8,
    guldenAmount: 17.62,
    description: "Ik ben een gulle boomer 🧓",
    payNlLink: "" // Te vullen door gebruiker
  },
  {
    amount: 50000,
    guldenAmount: 110197.5,
    description: "Ik gun je de overwaarde van mijn tweede huis 🏠",
    payNlLink: "" // Te vullen door gebruiker
  }
]

export default function DonateDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sluit dropdown wanneer er buiten geklikt wordt
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleDonateClick = (option: DonateOption) => {
    if (option.payNlLink) {
      window.open(option.payNlLink, '_blank')
    } else {
      alert(`Pay.nl link voor €${option.amount} nog niet ingesteld`)
    }
    setIsOpen(false)
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2
    })
  }

  const formatGuldenAmount = (guldenAmount: number) => {
    return guldenAmount.toLocaleString('nl-NL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Doneren</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion content - klapt naar beneden uit */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="py-2">
            {donateOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleDonateClick(option)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-green-600 mb-1">
                      {formatAmount(option.amount)}
                      <span className="text-xs text-gray-500 ml-2">
                        (ƒ {formatGuldenAmount(option.guldenAmount)}*)
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 leading-tight">
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Voetnoot */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-tight">
              * Voor de Gen Z'ers: een gulden is het betaalmiddel van vóór 2001.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
