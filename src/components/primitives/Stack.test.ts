import { describe, expect, it } from 'vitest'

import { stackCva } from './Stack.cva'
import { getDirectionClasses } from './Stack.utils'

describe('Stack Component', () => {
  describe('stackCva - Base Classes', () => {
    it('should include flex (direction controlled separately)', () => {
      const result = stackCva()
      expect(result).toContain('flex')
      // Note: flex-col is now added via getDirectionClasses(), not in CVA base
    })
  })

  describe('stackCva - Default Variants', () => {
    it('should apply default space (md)', () => {
      const result = stackCva()
      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
      expect(result).toContain('lg:gap-6')
    })

    it('should apply default align (stretch)', () => {
      const result = stackCva()
      expect(result).toContain('items-stretch')
    })
  })

  describe('stackCva - Space Prop', () => {
    it('should apply none space correctly', () => {
      const result = stackCva({ space: 'none' })
      expect(result).toContain('gap-0')
    })

    it('should apply xs space with responsive values', () => {
      const result = stackCva({ space: 'xs' })
      expect(result).toContain('gap-2') // 8px
      expect(result).toContain('md:gap-3') // 12px
    })

    it('should apply sm space with responsive values', () => {
      const result = stackCva({ space: 'sm' })
      expect(result).toContain('gap-3') // 12px
      expect(result).toContain('md:gap-4') // 16px
      expect(result).toContain('lg:gap-5') // 20px
    })

    it('should apply md space with responsive values (default)', () => {
      const result = stackCva({ space: 'md' })
      expect(result).toContain('gap-4') // 16px
      expect(result).toContain('md:gap-5') // 20px
      expect(result).toContain('lg:gap-6') // 24px
    })

    it('should apply lg space with responsive values', () => {
      const result = stackCva({ space: 'lg' })
      expect(result).toContain('gap-5') // 20px
      expect(result).toContain('md:gap-6') // 24px
      expect(result).toContain('lg:gap-8') // 32px
    })

    it('should apply xl space with responsive values', () => {
      const result = stackCva({ space: 'xl' })
      expect(result).toContain('gap-6') // 24px
      expect(result).toContain('md:gap-8') // 32px
      expect(result).toContain('lg:gap-10') // 40px
    })
  })

  describe('stackCva - Align Prop', () => {
    it('should apply start alignment correctly', () => {
      const result = stackCva({ align: 'start' })
      expect(result).toContain('items-start')
      expect(result).not.toContain('items-center')
      expect(result).not.toContain('items-end')
    })

    it('should apply center alignment correctly', () => {
      const result = stackCva({ align: 'center' })
      expect(result).toContain('items-center')
      expect(result).not.toContain('items-start')
      expect(result).not.toContain('items-end')
    })

    it('should apply end alignment correctly', () => {
      const result = stackCva({ align: 'end' })
      expect(result).toContain('items-end')
      expect(result).not.toContain('items-start')
      expect(result).not.toContain('items-center')
    })

    it('should apply stretch alignment correctly (default)', () => {
      const result = stackCva({ align: 'stretch' })
      expect(result).toContain('items-stretch')
    })
  })

  describe('stackCva - Space + Align Combinations', () => {
    const spaces = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
    const aligns = ['start', 'center', 'end', 'stretch'] as const

    it('should work with all space and align combinations', () => {
      spaces.forEach((space) => {
        aligns.forEach((align) => {
          const result = stackCva({ space, align })
          expect(result).toBeTruthy()
          expect(result).toContain('flex')
          expect(result).toContain('gap-')
          expect(result).toContain('items-')
        })
      })
    })
  })

  describe('stackCva - Responsive Spacing', () => {
    it('should apply responsive spacing for xs', () => {
      const result = stackCva({ space: 'xs' })
      expect(result).toMatch(/gap-\d+/)
      expect(result).toMatch(/md:gap-\d+/)
    })

    it('should apply responsive spacing for sm/md/lg/xl', () => {
      const spaces = ['sm', 'md', 'lg', 'xl'] as const
      spaces.forEach((space) => {
        const result = stackCva({ space })
        expect(result).toMatch(/gap-\d+/)
        expect(result).toMatch(/md:gap-\d+/)
        expect(result).toMatch(/lg:gap-\d+/)
      })
    })
  })

  describe('stackCva - Edge Cases', () => {
    it('should handle undefined space (use default)', () => {
      const result = stackCva({ space: undefined })
      expect(result).toContain('gap-4') // Default md
    })

    it('should handle undefined align (use default)', () => {
      const result = stackCva({ align: undefined })
      expect(result).toContain('items-stretch') // Default stretch
    })

    it('should handle empty object (use all defaults)', () => {
      const result = stackCva({})
      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
      expect(result).toContain('lg:gap-6')
      expect(result).toContain('items-stretch')
    })
  })

  describe('getDirectionClasses - Simple Values', () => {
    it('should return empty string for undefined', () => {
      expect(getDirectionClasses(undefined)).toBe('')
    })

    it('should handle column direction (default)', () => {
      expect(getDirectionClasses('column')).toBe('flex-col')
    })

    it('should handle row direction', () => {
      expect(getDirectionClasses('row')).toBe('flex-row')
    })

    it('should handle row-reverse direction', () => {
      expect(getDirectionClasses('row-reverse')).toBe('flex-row-reverse')
    })

    it('should handle column-reverse direction', () => {
      expect(getDirectionClasses('column-reverse')).toBe('flex-col-reverse')
    })
  })

  describe('getDirectionClasses - Responsive Objects', () => {
    it('should handle xs breakpoint (no prefix)', () => {
      expect(getDirectionClasses({ xs: 'column' })).toBe('flex-col')
      expect(getDirectionClasses({ xs: 'row' })).toBe('flex-row')
    })

    it('should handle sm breakpoint', () => {
      expect(getDirectionClasses({ sm: 'row' })).toBe('sm:flex-row')
      expect(getDirectionClasses({ sm: 'column' })).toBe('sm:flex-col')
    })

    it('should handle md breakpoint', () => {
      expect(getDirectionClasses({ md: 'row' })).toBe('md:flex-row')
      expect(getDirectionClasses({ md: 'column' })).toBe('md:flex-col')
    })

    it('should handle lg breakpoint', () => {
      expect(getDirectionClasses({ lg: 'row' })).toBe('lg:flex-row')
      expect(getDirectionClasses({ lg: 'column' })).toBe('lg:flex-col')
    })

    it('should handle xl breakpoint', () => {
      expect(getDirectionClasses({ xl: 'row' })).toBe('xl:flex-row')
      expect(getDirectionClasses({ xl: 'column' })).toBe('xl:flex-col')
    })

    it('should handle multiple breakpoints (column on mobile, row on desktop)', () => {
      const result = getDirectionClasses({
        xs: 'column',
        md: 'row',
      })
      expect(result).toBe('flex-col md:flex-row')
    })

    it('should handle all breakpoints', () => {
      const result = getDirectionClasses({
        xs: 'column',
        sm: 'column',
        md: 'row',
        lg: 'row',
        xl: 'row',
      })
      expect(result).toBe('flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row')
    })

    it('should handle reverse directions', () => {
      const result = getDirectionClasses({
        xs: 'column-reverse',
        md: 'row-reverse',
      })
      expect(result).toBe('flex-col-reverse md:flex-row-reverse')
    })

    it('should skip undefined breakpoints', () => {
      const result = getDirectionClasses({
        xs: 'column',
        sm: undefined,
        md: 'row',
      })
      expect(result).toBe('flex-col md:flex-row')
    })

    it('should handle empty responsive object', () => {
      expect(getDirectionClasses({})).toBe('')
    })
  })

  describe('getDirectionClasses - All Combinations', () => {
    it('should generate valid classes for all directions across all breakpoints', () => {
      const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const
      const directions = ['row', 'column', 'row-reverse', 'column-reverse'] as const

      breakpoints.forEach((bp) => {
        directions.forEach((dir) => {
          const result = getDirectionClasses({ [bp]: dir })
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

  describe('Real-World Usage Patterns', () => {
    it('should support default column layout (vertical stack)', () => {
      const direction = getDirectionClasses('column')
      const space = stackCva({ space: 'md' })
      expect(direction).toBe('flex-col')
      expect(space).toContain('gap-4')
    })

    it('should support horizontal layout (inline elements)', () => {
      const direction = getDirectionClasses('row')
      const space = stackCva({ space: 'sm' })
      expect(direction).toBe('flex-row')
      expect(space).toContain('gap-3')
    })

    it('should support responsive stacking (column on mobile, row on desktop)', () => {
      const direction = getDirectionClasses({ xs: 'column', md: 'row' })
      const space = stackCva({ space: 'md' })
      expect(direction).toBe('flex-col md:flex-row')
      expect(space).toContain('gap-4')
    })

    it('should support responsive inline layout (row on mobile, column on desktop)', () => {
      const direction = getDirectionClasses({ xs: 'row', md: 'column' })
      const space = stackCva({ space: 'xs', align: 'start' })
      expect(direction).toBe('flex-row md:flex-col')
      expect(space).toContain('gap-2')
      expect(space).toContain('items-start')
    })
  })
})
