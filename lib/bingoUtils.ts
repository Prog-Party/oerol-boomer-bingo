export async function createBingoGame(name: string): Promise<string> {
  const response = await fetch('/api/bingo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name.trim() }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to create bingo game')
  }

  const { slug } = await response.json()
  return slug
}

// Extract name from slug (reverse the slug generation process)
export function extractNameFromSlug(slug: string): string {
  // Remove random suffix and replace dashes with spaces
  const nameWithoutSuffix = slug.replace(/-[a-z0-9]{6}$/, '')
  return nameWithoutSuffix.replace(/-/g, ' ')
}
