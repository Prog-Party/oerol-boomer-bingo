'use client'

interface DonateOption {
  euroAmount: number
  guldenAmount: number
  description: string
  payNlLink?: string
}

const donateOptions: DonateOption[] = [
  {
    euroAmount: ConvertGuilderToEuro(2.50),
    guldenAmount: 2.50,
    description: "De waarde van een kop koffie in 1995 ☕",
    payNlLink: "https://connect.pay.nl/doneren/SL-8058-1783/0Lc5a11?amount_min=100&extra1%5BGeef+een+compliment%5D=Wat+een+leuke+bingo%21" // Te vullen door gebruiker
  },
  {
    euroAmount: ConvertGuilderToEuro(8.0),
    guldenAmount: 8.0,
    description: "Ik weet niet wat het kost, maar m'n kind regelt m'n internetbankieren 💻",
    payNlLink: "https://connect.pay.nl/doneren/SL-8058-1783/0Lc5a11?amount_min=100&extra1%5BGeef+een+compliment%5D=Wat+een+leuke+bingo%21" // Te vullen door gebruiker
  },
  {
    euroAmount: ConvertGuilderToEuro(20.0),
    guldenAmount: 20.0,
    description: "Ik ben een gulle boomer 🧓",
    payNlLink: "https://connect.pay.nl/doneren/SL-8058-1783/0Lc5a11?amount_min=100&extra1%5BGeef+een+compliment%5D=Wat+een+leuke+bingo%21" // Te vullen door gebruiker
  },
  {
    euroAmount: ConvertGuilderToEuro(22000.0),
    guldenAmount: 22000.0,
    description: "Ik gun je de overwaarde van mijn tweede huis 🏠",
    payNlLink: "https://connect.pay.nl/doneren/SL-8058-1783/0Lc5a11?amount_min=100&extra1%5BGeef+een+compliment%5D=Wat+een+leuke+bingo%21" // Te vullen door gebruiker
  }
]

function ConvertGuilderToEuro(gulden: number): number {
  return gulden / 2.20371
}

export default function DonateDropdown() {

  const handleDonateClick = (option: DonateOption) => {
    if (option.payNlLink && option.euroAmount > 0) {
      const donateAmount: number = option.euroAmount * 100
      window.open(`${option.payNlLink}&amount=${donateAmount.toFixed(0)}`, '_blank')
    } else {
      alert(`Pay.nl link voor €${option.euroAmount} nog niet ingesteld`)
    }
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
    <div className="shadow-xl">
      <p className="w-full bg-green-600 text-white py-3 px-6 rounded-t-lg font-semibold flex items-center justify-between">
        <span>Doneren - Vond je het leuk?</span>
      </p>
      <div className="bg-white rounded-b-lg overflow-hidden border border-gray-200">
        <div className="py-2">
          {donateOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleDonateClick(option)}
              className="w-full px-4 py-3 text-left border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-green-600 mb-1">
                    ƒ {formatGuldenAmount(option.guldenAmount)}*
                    <span className="text-xs text-gray-500 ml-2">
                      ( {formatAmount(option.euroAmount)} )
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
            * Voor de Gen Z'ers: een&nbsp;
            <a
              href="https://nl.wikipedia.org/wiki/Nederlandse_gulden"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              gulden
            </a>
            &nbsp;is het betaalmiddel van vóór 2001.
          </p>
        </div>
      </div>
    </div>
  )
}
