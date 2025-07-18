import slugify from 'slugify'
import { slugExists } from './azure'

export function generateSlug(name: string): string {
  const baseSlug = slugify(name, { lower: true, strict: true })
  const randomChars = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}-${randomChars}`
}

export async function generateUniqueSlug(name: string, maxAttempts: number = 30): Promise<string> {
  
  const nameExists = await slugExists(name)
  if (!nameExists) {
    return name
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const slug = generateSlug(name)
    const exists = await slugExists(slug)
    
    if (!exists) {
      return slug
    }
  }
  
  // If we couldn't generate a unique slug after maxAttempts, throw an error
  throw new Error('Could not generate a unique slug after multiple attempts')
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function selectRandomItems<T>(array: T[], count: number): T[] {
  if (count >= array.length) {
    return shuffleArray(array)
  }
  
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

export function formatCompletionTime(createdAt: string, updatedAt: string): string {
  const start = new Date(createdAt)
  const end = new Date(updatedAt)
  const diffMs = end.getTime() - start.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffSecs = Math.floor((diffMs % 60000) / 1000)
  
  if (diffMins > 0) {
    return `${diffMins}m ${diffSecs}s`
  }
  return `${diffSecs}s`
} 