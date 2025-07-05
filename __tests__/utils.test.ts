import { generateSlug, shuffleArray, selectRandomItems, formatCompletionTime } from '@/lib/utils'

describe('Utils', () => {
  describe('generateSlug', () => {
    it('should generate a slug from a name', () => {
      const name = 'John Doe'
      const slug = generateSlug(name)
      
      expect(slug).toMatch(/^john-doe-[a-z0-9]{6}$/)
    })
    
    it('should handle special characters', () => {
      const name = 'John & Doe!'
      const slug = generateSlug(name)
      
      expect(slug).toMatch(/^john-and-doe-[a-z0-9]{6}$/)
    })
    
    it('should handle empty string', () => {
      const name = ''
      const slug = generateSlug(name)
      
      expect(slug).toMatch(/^-[a-z0-9]{6}$/)
    })
  })
  
  describe('shuffleArray', () => {
    it('should shuffle an array', () => {
      const original = [1, 2, 3, 4, 5]
      const shuffled = shuffleArray(original)
      
      expect(shuffled).toHaveLength(5)
      expect(shuffled).toEqual(expect.arrayContaining(original))
      // Note: In rare cases, shuffle might return the same order
      // This test just ensures the array contains the same elements
    })
    
    it('should not mutate the original array', () => {
      const original = [1, 2, 3, 4, 5]
      const originalCopy = [...original]
      shuffleArray(original)
      
      expect(original).toEqual(originalCopy)
    })
  })
  
  describe('selectRandomItems', () => {
    it('should select random items from array', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const selected = selectRandomItems(array, 3)
      
      expect(selected).toHaveLength(3)
      expect(selected.every(item => array.includes(item))).toBe(true)
    })
    
    it('should return all items if count >= array length', () => {
      const array = [1, 2, 3]
      const selected = selectRandomItems(array, 5)
      
      expect(selected).toHaveLength(3)
      expect(selected).toEqual(expect.arrayContaining(array))
    })
  })
  
  describe('formatCompletionTime', () => {
    it('should format time in seconds', () => {
      const createdAt = '2023-01-01T10:00:00.000Z'
      const updatedAt = '2023-01-01T10:00:30.000Z'
      
      const result = formatCompletionTime(createdAt, updatedAt)
      expect(result).toBe('30s')
    })
    
    it('should format time in minutes and seconds', () => {
      const createdAt = '2023-01-01T10:00:00.000Z'
      const updatedAt = '2023-01-01T10:02:30.000Z'
      
      const result = formatCompletionTime(createdAt, updatedAt)
      expect(result).toBe('2m 30s')
    })
    
    it('should handle zero time difference', () => {
      const time = '2023-01-01T10:00:00.000Z'
      const result = formatCompletionTime(time, time)
      expect(result).toBe('0s')
    })
  })
}) 