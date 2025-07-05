# Oerol Boomer Bingo

A mobile-first React-based web app for creating and playing bingo games, built with Next.js 14, React 18, and Tailwind CSS.

## Features

- **Mobile-first responsive design** with Tailwind CSS
- **Create custom bingo games** with random item selection
- **Real-time game state** with instant UI updates
- **Azure Blob Storage integration** for data persistence
- **Accessibility features** with ARIA roles and keyboard navigation
- **Confetti animations** on cell interactions
- **Bingo completion detection** with completion time tracking
- **Unit tests** with Jest and React Testing Library

## Prerequisites

- Node.js 18+ 
- Azure Blob Storage account
- Master bingo data JSON file uploaded to Azure Blob Storage

## Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd oerol-boomer-bingo
npm install
```

### 2. Configure Azure Blob Storage

1. Create an Azure Storage account
2. Create a container named `bingo-data` (or configure a custom name)
3. Upload your master bingo data as `master-bingo-data.json` with the following format:

```json
{
  "items": [
    "Item 1",
    "Item 2",
    "Item 3",
    // ... ~100 items total
  ]
}
```

### 3. Environment Configuration

Copy the example environment file and configure your Azure credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Azure Storage connection string:

```env
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your-account-name;AccountKey=your-account-key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=bingo-data
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Usage

### Creating a New Bingo Game

1. Navigate to the home page (`/`)
2. Enter your name in the form
3. Click "Create a new Bingo"
4. The app will:
   - Fetch master data from Azure Blob Storage
   - Randomly select 24 items
   - Generate a unique slug
   - Save the game data
   - Redirect to the bingo board

### Playing the Game

1. The bingo board displays a 5×5 grid
2. The center cell is marked "FREE" and is permanently checked
3. Click cells to toggle their checked state
4. Progress is tracked (X/24 items checked)
5. When all 24 non-FREE cells are checked, a "BINGO!" modal appears
6. The modal shows completion time and triggers confetti animation

### Game Features

- **Instant UI updates** - Cell states update immediately
- **Persistent state** - Game progress is saved to Azure Blob Storage
- **Keyboard navigation** - Use Tab to navigate between cells
- **Mobile optimized** - Touch-friendly interface with responsive design
- **Accessibility** - ARIA labels and roles for screen readers

## API Routes

### POST `/api/bingo`
Creates a new bingo game.

**Request:**
```json
{
  "name": "Player Name"
}
```

**Response:**
```json
{
  "slug": "player-name-abc123"
}
```

### GET `/api/bingo/[slug]`
Retrieves bingo game data.

**Response:**
```json
{
  "items": ["Item 1", "Item 2", ...],
  "checked": ["Item 1"],
  "createdAt": "2023-01-01T10:00:00.000Z",
  "updatedAt": "2023-01-01T10:05:30.000Z"
}
```

### PATCH `/api/bingo/[slug]/update`
Updates the checked items for a bingo game.

**Request:**
```json
{
  "checked": ["Item 1", "Item 2"]
}
```

**Response:**
```json
{
  "success": true
}
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── [slug]/            # Dynamic bingo board page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── BingoCell.tsx      # Individual bingo cell
│   └── BingoModal.tsx     # Bingo completion modal
├── lib/                   # Utility libraries
│   ├── azure.ts           # Azure Blob Storage functions
│   └── utils.ts           # Helper functions
├── __tests__/             # Test files
└── public/                # Static assets
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Azure Blob Storage** - Data persistence
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **react-confetti** - Confetti animations

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

Make sure to configure the environment variables for Azure Blob Storage access.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.