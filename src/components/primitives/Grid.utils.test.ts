import { describe, expect, it } from 'vitest'

import { getOffsetClasses, getSizeClasses } from './Grid.utils'

describe('Grid.utils', () => {
  describe('getSizeClasses - Single Values', () => {
    it('should return empty string for undefined', () => {
      expect(getSizeClasses(undefined)).toBe('')
    })

    it('should handle numeric sizes 1-12', () => {
      const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
      sizes.forEach((size) => {
        const result = getSizeClasses(size)
        expect(result).toBe(`col-span-${size}`)
      })
    })

    it('should handle auto size', () => {
      expect(getSizeClasses('auto')).toBe('col-auto')
    })

    it('should handle grow size', () => {
      expect(getSizeClasses('grow')).toBe('col-span-full')
    })
  })

  describe('getSizeClasses - Responsive Objects', () => {
    it('should handle xs breakpoint (no prefix)', () => {
      expect(getSizeClasses({ xs: 4 })).toBe('col-span-4')
      expect(getSizeClasses({ xs: 'auto' })).toBe('col-auto')
      expect(getSizeClasses({ xs: 'grow' })).toBe('col-span-full')
    })

    it('should handle sm breakpoint', () => {
      expect(getSizeClasses({ sm: 6 })).toBe('sm:col-span-6')
      expect(getSizeClasses({ sm: 'auto' })).toBe('sm:col-auto')
      expect(getSizeClasses({ sm: 'grow' })).toBe('sm:col-span-full')
    })

    it('should handle md breakpoint', () => {
      expect(getSizeClasses({ md: 4 })).toBe('md:col-span-4')
      expect(getSizeClasses({ md: 'auto' })).toBe('md:col-auto')
      expect(getSizeClasses({ md: 'grow' })).toBe('md:col-span-full')
    })

    it('should handle lg breakpoint', () => {
      expect(getSizeClasses({ lg: 8 })).toBe('lg:col-span-8')
      expect(getSizeClasses({ lg: 'auto' })).toBe('lg:col-auto')
      expect(getSizeClasses({ lg: 'grow' })).toBe('lg:col-span-full')
    })

    it('should handle xl breakpoint', () => {
      expect(getSizeClasses({ xl: 12 })).toBe('xl:col-span-12')
      expect(getSizeClasses({ xl: 'auto' })).toBe('xl:col-auto')
      expect(getSizeClasses({ xl: 'grow' })).toBe('xl:col-span-full')
    })

    it('should handle multiple breakpoints', () => {
      const result = getSizeClasses({
        xs: 12,
        md: 6,
        lg: 4,
      })
      expect(result).toBe('col-span-12 md:col-span-6 lg:col-span-4')
    })

    it('should handle all breakpoints', () => {
      const result = getSizeClasses({
        xs: 12,
        sm: 8,
        md: 6,
        lg: 4,
        xl: 3,
      })
      expect(result).toBe('col-span-12 sm:col-span-8 md:col-span-6 lg:col-span-4 xl:col-span-3')
    })

    it('should handle mixed numeric and special values', () => {
      const result = getSizeClasses({
        xs: 'auto',
        md: 6,
        xl: 'grow',
      })
      expect(result).toBe('col-auto md:col-span-6 xl:col-span-full')
    })

    it('should skip undefined breakpoints', () => {
      const result = getSizeClasses({
        xs: 12,
        sm: undefined,
        md: 6,
      })
      expect(result).toBe('col-span-12 md:col-span-6')
    })

    it('should handle empty responsive object', () => {
      expect(getSizeClasses({})).toBe('')
    })
  })

  describe('getSizeClasses - All Responsive Combinations', () => {
    it('should generate valid classes for all sizes across all breakpoints', () => {
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
      const sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 'auto', 'grow'] as const

      breakpoints.forEach((bp) => {
        sizes.forEach((size) => {
          const result = getSizeClasses({ [bp]: size })
          expect(result).toBeTruthy()
          expect(result.length).toBeGreaterThan(0)

          // Verify correct prefix
          if (bp === 'xs') {
            expect(result).not.toContain(':')
          } else {
            expect(result).toContain(`${bp}:`)
          }
        })
      })
    })
  })

  describe('getOffsetClasses - Single Values', () => {
    it('should return empty string for undefined', () => {
      expect(getOffsetClasses(undefined)).toBe('')
    })

    it('should handle numeric offsets 1-12', () => {
      const offsets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
      offsets.forEach((offset) => {
        const result = getOffsetClasses(offset)
        expect(result).toBe(`col-start-${offset + 1}`)
      })
    })
  })

  describe('getOffsetClasses - Responsive Objects', () => {
    it('should handle xs breakpoint (no prefix)', () => {
      expect(getOffsetClasses({ xs: 2 })).toBe('col-start-3')
    })

    it('should handle sm breakpoint', () => {
      expect(getOffsetClasses({ sm: 4 })).toBe('sm:col-start-5')
    })

    it('should handle md breakpoint', () => {
      expect(getOffsetClasses({ md: 3 })).toBe('md:col-start-4')
    })

    it('should handle lg breakpoint', () => {
      expect(getOffsetClasses({ lg: 6 })).toBe('lg:col-start-7')
    })

    it('should handle xl breakpoint', () => {
      expect(getOffsetClasses({ xl: 8 })).toBe('xl:col-start-9')
    })

    it('should handle multiple breakpoints', () => {
      const result = getOffsetClasses({
        xs: 1,
        md: 3,
        lg: 5,
      })
      expect(result).toBe('col-start-2 md:col-start-4 lg:col-start-6')
    })

    it('should handle all breakpoints', () => {
      const result = getOffsetClasses({
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
      })
      expect(result).toBe('col-start-2 sm:col-start-3 md:col-start-4 lg:col-start-5 xl:col-start-6')
    })

    it('should skip undefined breakpoints', () => {
      const result = getOffsetClasses({
        xs: 2,
        sm: undefined,
        md: 4,
      })
      expect(result).toBe('col-start-3 md:col-start-5')
    })

    it('should handle empty responsive object', () => {
      expect(getOffsetClasses({})).toBe('')
    })
  })

  describe('getOffsetClasses - All Responsive Combinations', () => {
    it('should generate valid classes for all offsets across all breakpoints', () => {
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
      const offsets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

      breakpoints.forEach((bp) => {
        offsets.forEach((offset) => {
          const result = getOffsetClasses({ [bp]: offset })
          expect(result).toBeTruthy()
          expect(result.length).toBeGreaterThan(0)

          // Verify correct prefix
          if (bp === 'xs') {
            expect(result).not.toContain(':')
          } else {
            expect(result).toContain(`${bp}:`)
          }
        })
      })
    })
  })

  describe('Edge Cases', () => {
    it('getSizeClasses should handle undefined', () => {
      expect(getSizeClasses(undefined)).toBe('')
    })

    it('getOffsetClasses should handle undefined', () => {
      expect(getOffsetClasses(undefined)).toBe('')
    })

    it('getSizeClasses should handle empty responsive object', () => {
      expect(getSizeClasses({})).toBe('')
    })

    it('getOffsetClasses should handle empty responsive object', () => {
      expect(getOffsetClasses({})).toBe('')
    })

    it('getSizeClasses should skip undefined breakpoints in responsive object', () => {
      const result = getSizeClasses({
        xs: undefined,
        sm: undefined,
        md: undefined,
      })
      expect(result).toBe('')
    })

    it('getOffsetClasses should skip undefined breakpoints in responsive object', () => {
      const result = getOffsetClasses({
        xs: undefined,
        sm: undefined,
        md: undefined,
      })
      expect(result).toBe('')
    })
  })

  describe('Real-World Usage Patterns', () => {
    it('should support typical 3-column layout', () => {
      const result = getSizeClasses({ xs: 12, md: 4 })
      expect(result).toBe('col-span-12 md:col-span-4')
    })

    it('should support sidebar layout', () => {
      const sidebar = getSizeClasses({ xs: 12, md: 3 })
      const main = getSizeClasses({ xs: 12, md: 9 })
      expect(sidebar).toBe('col-span-12 md:col-span-3')
      expect(main).toBe('col-span-12 md:col-span-9')
    })

    it('should support responsive column layout with offsets', () => {
      const size = getSizeClasses({ xs: 12, md: 8 })
      const offset = getOffsetClasses({ md: 2 })
      expect(size).toBe('col-span-12 md:col-span-8')
      expect(offset).toBe('md:col-start-3')
    })

    it('should support auto-sized columns', () => {
      const result = getSizeClasses({ xs: 'auto', md: 4 })
      expect(result).toBe('col-auto md:col-span-4')
    })

    it('should support full-width with grow', () => {
      const result = getSizeClasses({ xs: 'grow', md: 6 })
      expect(result).toBe('col-span-full md:col-span-6')
    })
  })
})
