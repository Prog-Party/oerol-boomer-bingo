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
      className={cellClasses.join(' ')}
      onClick={onClick}
      disabled={isFree}
      aria-label={isFree ? 'Gratis vakje (al aangevinkt)' : `${item} - ${isChecked ? 'aangevinkt' : 'niet aangevinkt'}`}
      aria-pressed={isChecked}
      tabIndex={isFree ? -1 : 0}
      role="button"
      data-testid={`bingo-cell-${index}`}
      style={{
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 'clamp(0.65rem, 2vw, 0.85rem)',
        lineHeight: '1.2',
        fontWeight: '500'
      }}
    >
      <span className="break-words hyphens-auto leading-tight">
        {isFree ? 'GRATIS' : item}
      </span>
    </button>
  )
} 