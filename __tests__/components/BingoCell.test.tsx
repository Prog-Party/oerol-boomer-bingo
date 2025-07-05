import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BingoCell from '@/components/BingoCell'

describe('BingoCell', () => {
  const defaultProps = {
    item: 'Test Item',
    isChecked: false,
    isFree: false,
    onClick: jest.fn(),
    index: 0,
  }

  it('renders with correct content', () => {
    render(<BingoCell {...defaultProps} />)
    
    expect(screen.getByText('Test Item')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = jest.fn()
    render(<BingoCell {...defaultProps} onClick={onClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies checked styles when isChecked is true', () => {
    render(<BingoCell {...defaultProps} isChecked={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('checked')
  })

  it('applies free styles when isFree is true', () => {
    render(<BingoCell {...defaultProps} isFree={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('free')
    expect(screen.getByText('FREE')).toBeInTheDocument()
  })

  it('is disabled when isFree is true', () => {
    render(<BingoCell {...defaultProps} isFree={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('has correct aria attributes', () => {
    render(<BingoCell {...defaultProps} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Test Item - unchecked')
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('has correct aria attributes when checked', () => {
    render(<BingoCell {...defaultProps} isChecked={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Test Item - checked')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('has correct aria attributes when free', () => {
    render(<BingoCell {...defaultProps} isFree={true} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Free space (already checked)')
    expect(button).toHaveAttribute('tabIndex', '-1')
  })

  it('has correct data-testid', () => {
    render(<BingoCell {...defaultProps} index={5} />)
    
    expect(screen.getByTestId('bingo-cell-5')).toBeInTheDocument()
  })
}) 