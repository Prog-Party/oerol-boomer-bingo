import { BlobServiceClient } from '@azure/storage-blob'

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'bingo-data'

function getAzureClient() {
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING environment variable is required')
  }
  
  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  return blobServiceClient.getContainerClient(containerName)
}

export interface BingoData {
  items: string[]
  checked: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface MasterBingoData {
  items: string[]
}

export async function fetchMasterBingoData(): Promise<MasterBingoData> {
  try {
    const containerClient = getAzureClient()
    console.log("Start fetching")
    const blobClient = containerClient.getBlobClient('master-bingo-data.json')
    console.log("Fetched")
    const response = await blobClient.download()
    const content = await streamToString(response.readableStreamBody!)
    return JSON.parse(content)
  } catch (error) {
    console.error('Error fetching master bingo data:', error)
    throw new Error('Failed to fetch master bingo data')
  }
}

export async function saveBingoData(slug: string, data: Omit<BingoData, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const containerClient = getAzureClient()
    const blobClient = containerClient.getBlobClient(`${slug}.json`)
    const now = new Date().toISOString()
    const bingoData: BingoData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const jsonData = JSON.stringify(bingoData)
    const blockBlobClient = blobClient.getBlockBlobClient()
    await blockBlobClient.upload(jsonData, jsonData.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' }
    })
  } catch (error) {
    console.error('Error saving bingo data:', error)
    throw new Error('Failed to save bingo data')
  }
}

export async function getBingoData(slug: string): Promise<BingoData | null> {
  try {
    const containerClient = getAzureClient()
    const blobClient = containerClient.getBlobClient(`${slug}.json`)
    const exists = await blobClient.exists()
    
    if (!exists) {
      return null
    }
    
    const response = await blobClient.download()
    const content = await streamToString(response.readableStreamBody!)
    return JSON.parse(content)
  } catch (error) {
    console.error('Error getting bingo data:', error)
    return null
  }
}

export async function updateBingoData(slug: string, checked: string[], completed?: boolean): Promise<void> {
  try {
    const existingData = await getBingoData(slug)
    if (!existingData) {
      throw new Error('Bingo data not found')
    }
    
    const containerClient = getAzureClient()
    const blobClient = containerClient.getBlobClient(`${slug}.json`)
    const now = new Date().toISOString()
    
    const updatedData: BingoData = {
      ...existingData,
      checked,
      updatedAt: now,
      // Als bingo net voltooid is, gebruik de huidige tijd als voltooiingstijd
      ...(completed && checked.length >= 24 && { completedAt: now })
    }
    
    const jsonData = JSON.stringify(updatedData)
    const blockBlobClient = blobClient.getBlockBlobClient()
    await blockBlobClient.upload(jsonData, jsonData.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' }
    })
  } catch (error) {
    console.error('Error updating bingo data:', error)
    throw new Error('Failed to update bingo data')
  }
}

export async function slugExists(slug: string): Promise<boolean> {
  try {
    const containerClient = getAzureClient()
    const blobClient = containerClient.getBlobClient(`${slug}.json`)
    return await blobClient.exists()
  } catch (error) {
    console.error('Error checking if slug exists:', error)
    return false
  }
}

export async function getAllExistingSlugs(): Promise<string[]> {
  try {
    const containerClient = getAzureClient()
    const blobs = containerClient.listBlobsFlat()
    const slugs: string[] = []
    
    for await (const blob of blobs) {
      if (blob.name.endsWith('.json') && blob.name !== 'master-bingo-data.json') {
        // Remove .json extension to get the slug
        const slug = blob.name.replace('.json', '')
        slugs.push(slug)
      }
    }
    
    return slugs
  } catch (error) {
    console.error('Error getting existing slugs:', error)
    return []
  }
}

export async function findExistingBingoByName(name: string): Promise<{ slug: string; data: BingoData } | null> {
  try {
    const data = await getBingoData(name)
    if (data) {
      return { slug: name, data }
    }

    return null
  } catch (error) {
    console.error('Error finding existing bingo by name:', error)
    return null
  }
}

async function streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    readableStream.on('data', (data) => {
      chunks.push(Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'))
    })
    readableStream.on('error', reject)
  })
} 