const { BlobServiceClient } = require('@azure/storage-blob')
const fs = require('fs')
const path = require('path')

async function setupAzure() {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'bingo-data'
  
  if (!connectionString) {
    console.error('❌ AZURE_STORAGE_CONNECTION_STRING environment variable is required')
    console.log('Please set it in your .env.local file')
    process.exit(1)
  }
  
  try {
    console.log('🔗 Connecting to Azure Blob Storage...')
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)
    
    // Create container if it doesn't exist
    console.log(`📦 Creating container '${containerName}' if it doesn't exist...`)
    await containerClient.createIfNotExists()
    
    // Upload master data
    const masterDataPath = path.join(__dirname, '..', 'sample-master-data.json')
    if (!fs.existsSync(masterDataPath)) {
      console.error('❌ sample-master-data.json not found')
      console.log('Please create this file with your master bingo data')
      process.exit(1)
    }
    
    console.log('📤 Uploading master bingo data...')
    const masterData = fs.readFileSync(masterDataPath, 'utf8')
    const blobClient = containerClient.getBlobClient('master-bingo-data.json')
    
    const blockBlobClient = blobClient.getBlockBlobClient()
    await blockBlobClient.upload(masterData, masterData.length, {
      blobHTTPHeaders: { blobContentType: 'application/json' }
    })
    
    console.log('✅ Azure setup completed successfully!')
    console.log('🎯 You can now run the development server with: npm run dev')
    
  } catch (error) {
    console.error('❌ Error setting up Azure:', error.message)
    process.exit(1)
  }
}

setupAzure() 