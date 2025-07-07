import { updateBingoData } from '@/lib/azure'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { checked, completed } = await request.json()
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      )
    }
    
    if (!Array.isArray(checked)) {
      return NextResponse.json(
        { error: 'Checked array is required' },
        { status: 400 }
      )
    }
    
    await updateBingoData(slug, checked, completed)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating bingo data:', error)
    return NextResponse.json(
      { error: 'Failed to update bingo data' },
      { status: 500 }
    )
  }
} 