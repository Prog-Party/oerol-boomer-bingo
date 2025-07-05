import { NextRequest, NextResponse } from 'next/server'
import { fetchMasterBingoData, saveBingoData } from '@/lib/azure'
import { generateSlug, selectRandomItems } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    // Fetch master bingo data from Azure
    const masterData = await fetchMasterBingoData()
    
    // Select 24 random items and shuffle them
    const selectedItems = selectRandomItems(masterData.items, 24)
    
    // Generate slug
    const slug = generateSlug(name.trim())
    
    // Save bingo data to Azure
    await saveBingoData(slug, {
      items: selectedItems,
      checked: [],
    })
    
    return NextResponse.json({ slug })
  } catch (error) {
    console.error('Error creating bingo:', error)
    return NextResponse.json(
      { error: 'Failed to create bingo game' },
      { status: 500 }
    )
  }
} 