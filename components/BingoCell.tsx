import React from 'react'

interface BingoCellProps {
  item: string
  isChecked: boolean
  isFree: boolean
  onClick: () => void
  index: number
}

export default function BingoCell({ item, isChecked, isFree, onClick, index }: BingoCellProps) {
  const cellClasses = [
    'bingo-cell',
    'min-h-[80px]',
    'md:min-h-[100px]',
    'text-xs',
    'md:text-sm',
    'lg:text-base',
    'rounded-lg',
    'select-none',
    'touch-manipulation'
  ]

  if (isFree) {
    cellClasses.push('free')
  } else if (isChecked) {
    cellClasses.push('checked')
  }

  return (
    <button
      style={{
        fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
        lineHeight: '1.3',
        textAlign: 'center',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      className={cellClasses.join(' ')}
      onClick={onClick}
      disabled={isFree}
      aria-label={isFree ? 'Free space (already checked)' : `${item} - ${isChecked ? 'checked' : 'unchecked'}`}
      aria-pressed={isChecked}
      tabIndex={isFree ? -1 : 0}
      role="button"
      data-testid={`bingo-cell-${index}`}
    >
      <span className="px-1 break-words">
        {isFree ? 'Boomers hebben altijd alles gratis gekregen' : item}
      </span>
    </button>
  )
} 