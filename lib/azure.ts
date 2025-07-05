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

export async function updateBingoData(slug: string, checked: string[]): Promise<void> {
  try {
    const existingData = await getBingoData(slug)
    if (!existingData) {
      throw new Error('Bingo data not found')
    }
    
    const containerClient = getAzureClient()
    const blobClient = containerClient.getBlobClient(`${slug}.json`)
    const updatedData: BingoData = {
      ...existingData,
      checked,
      updatedAt: new Date().toISOString(),
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