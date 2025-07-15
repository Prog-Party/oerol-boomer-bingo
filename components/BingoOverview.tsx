interface BingoOverviewProps {
  gridItems: string[]
  checkedItems: string[]
}

export default function BingoOverview({ gridItems, checkedItems }: BingoOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-3 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Bingo Overzicht</h3>
      <div className="grid grid-cols-5 gap-1">
        {gridItems.map((item, index) => {
          const isFree = item === 'GRATIS'
          const isChecked = isFree || checkedItems.includes(item)
          
          return (
            <div
              key={index}
              className={`
                w-6 h-6 text-xs flex items-center justify-center border rounded
                ${isFree 
                  ? 'bg-blue-100 border-blue-300 text-blue-700 font-bold' 
                  : isChecked 
                    ? 'bg-green-100 border-green-300 text-green-700' 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }
              `}
            >
              {isFree ? 'G' : isChecked ? '✓' : ''}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {checkedItems.length}/24 voltooid
      </p>
    </div>
  )
}
