import { NextRequest, NextResponse } from 'next/server'
import { getBingoData } from '@/lib/azure'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }
    
    const bingoData = await getBingoData(slug)
    
    if (!bingoData) {
      return NextResponse.json(
        { error: 'Bingo game not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(bingoData)
  } catch (error) {
    console.error('Error getting bingo data:', error)
    return NextResponse.json(
      { error: 'Failed to get bingo data' },
      { status: 500 }
    )
  }
} 