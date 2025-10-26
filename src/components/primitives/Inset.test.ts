import { describe, expect, it } from 'vitest'

import { insetCva } from './Inset.cva'

describe('Inset Component', () => {
  describe('insetCva - Default Variants', () => {
    it('should apply default space (md)', () => {
      const result = insetCva()
      expect(result).toContain('p-4')
      expect(result).toContain('md:p-5')
      expect(result).toContain('lg:p-6')
    })

    it('should apply default squish (none)', () => {
      const result = insetCva()
      // squish:none adds no classes
      expect(result).not.toContain('py-')
    })
  })

  describe('insetCva - Space Prop', () => {
    it('should apply none space', () => {
      const result = insetCva({ space: 'none' })
      expect(result).toContain('p-0')
    })

    it('should apply xs space with responsive values', () => {
      const result = insetCva({ space: 'xs' })
      expect(result).toContain('p-2') // 8px
      expect(result).toContain('md:p-3') // 12px
    })

    it('should apply sm space with responsive values', () => {
      const result = insetCva({ space: 'sm' })
      expect(result).toContain('p-3') // 12px
      expect(result).toContain('md:p-4') // 16px
      expect(result).toContain('lg:p-5') // 20px
    })

    it('should apply md space with responsive values (default)', () => {
      const result = insetCva({ space: 'md' })
      expect(result).toContain('p-4') // 16px
      expect(result).toContain('md:p-5') // 20px
      expect(result).toContain('lg:p-6') // 24px
    })

    it('should apply lg space with responsive values', () => {
      const result = insetCva({ space: 'lg' })
      expect(result).toContain('p-5') // 20px
      expect(result).toContain('md:p-6') // 24px
      expect(result).toContain('lg:p-8') // 32px
    })

    it('should apply xl space with responsive values', () => {
      const result = insetCva({ space: 'xl' })
      expect(result).toContain('p-6') // 24px
      expect(result).toContain('md:p-8') // 32px
      expect(result).toContain('lg:p-10') // 40px
    })
  })

  describe('insetCva - Squish Prop', () => {
    it('should apply no squish when none (default)', () => {
      const result = insetCva({ squish: 'none' })
      // Just the base space padding, no py- override
      expect(result).not.toContain('py-2')
      expect(result).not.toContain('py-3')
      expect(result).not.toContain('py-4')
    })

    it('should apply sm squish (reduced vertical padding)', () => {
      const result = insetCva({ squish: 'sm' })
      expect(result).toContain('py-2') // 8px vertical
    })

    it('should apply md squish', () => {
      const result = insetCva({ squish: 'md' })
      expect(result).toContain('py-3') // 12px vertical
    })

    it('should apply lg squish', () => {
      const result = insetCva({ squish: 'lg' })
      expect(result).toContain('py-4') // 16px vertical
    })
  })

  describe('insetCva - Space + Squish Combinations', () => {
    it('should combine space and squish (squish overrides vertical)', () => {
      const result = insetCva({ space: 'lg', squish: 'sm' })
      expect(result).toContain('p-5') // Base padding from space:lg
      expect(result).toContain('py-2') // Vertical override from squish:sm
    })

    it('should work with all space and squish combinations', () => {
      const spaces = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
      const squishes = ['none', 'sm', 'md', 'lg'] as const

      spaces.forEach((space) => {
        squishes.forEach((squish) => {
          const result = insetCva({ space, squish })
          expect(result).toBeTruthy()
          expect(result).toContain('p-')
        })
      })
    })
  })

  describe('insetCva - Responsive Padding', () => {
    it('should apply responsive padding for xs', () => {
      const result = insetCva({ space: 'xs' })
      expect(result).toMatch(/p-\d+/)
      expect(result).toMatch(/md:p-\d+/)
    })

    it('should apply responsive padding for sm/md/lg/xl', () => {
      const spaces = ['sm', 'md', 'lg', 'xl'] as const
      spaces.forEach((space) => {
        const result = insetCva({ space })
        expect(result).toMatch(/p-\d+/)
        expect(result).toMatch(/md:p-\d+/)
        expect(result).toMatch(/lg:p-\d+/)
      })
    })
  })

  describe('insetCva - Edge Cases', () => {
    it('should handle undefined space (use default)', () => {
      const result = insetCva({ space: undefined })
      expect(result).toContain('p-4') // Default md
    })

    it('should handle undefined squish (use default)', () => {
      const result = insetCva({ squish: undefined })
      // No py- override
      expect(result).not.toContain('py-2')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = insetCva({})
      expect(result).toContain('p-4')
      expect(result).toContain('md:p-5')
      expect(result).toContain('lg:p-6')
    })
  })
})
