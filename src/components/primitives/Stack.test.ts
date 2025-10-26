import { describe, expect, it } from 'vitest'

import { stackCva } from './Stack.cva'

describe('Stack Component', () => {
  describe('stackCva - Base Classes', () => {
    it('should include flex flex-col in all variants', () => {
      const result = stackCva()
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
    })
  })

  describe('stackCva - Default Variants', () => {
    it('should apply default space (md)', () => {
      const result = stackCva()
      expect(result).toContain('gap-y-4')
      expect(result).toContain('md:gap-y-5')
      expect(result).toContain('lg:gap-y-6')
    })

    it('should apply default align (stretch)', () => {
      const result = stackCva()
      expect(result).toContain('items-stretch')
    })
  })

  describe('stackCva - Space Prop', () => {
    it('should apply none space correctly', () => {
      const result = stackCva({ space: 'none' })
      expect(result).toContain('gap-y-0')
    })

    it('should apply xs space with responsive values', () => {
      const result = stackCva({ space: 'xs' })
      expect(result).toContain('gap-y-2') // 8px
      expect(result).toContain('md:gap-y-3') // 12px
    })

    it('should apply sm space with responsive values', () => {
      const result = stackCva({ space: 'sm' })
      expect(result).toContain('gap-y-3') // 12px
      expect(result).toContain('md:gap-y-4') // 16px
      expect(result).toContain('lg:gap-y-5') // 20px
    })

    it('should apply md space with responsive values (default)', () => {
      const result = stackCva({ space: 'md' })
      expect(result).toContain('gap-y-4') // 16px
      expect(result).toContain('md:gap-y-5') // 20px
      expect(result).toContain('lg:gap-y-6') // 24px
    })

    it('should apply lg space with responsive values', () => {
      const result = stackCva({ space: 'lg' })
      expect(result).toContain('gap-y-5') // 20px
      expect(result).toContain('md:gap-y-6') // 24px
      expect(result).toContain('lg:gap-y-8') // 32px
    })

    it('should apply xl space with responsive values', () => {
      const result = stackCva({ space: 'xl' })
      expect(result).toContain('gap-y-6') // 24px
      expect(result).toContain('md:gap-y-8') // 32px
      expect(result).toContain('lg:gap-y-10') // 40px
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
          expect(result).toContain('flex-col')
          expect(result).toContain('gap-y-')
          expect(result).toContain('items-')
        })
      })
    })
  })

  describe('stackCva - Responsive Spacing', () => {
    it('should apply responsive spacing for xs', () => {
      const result = stackCva({ space: 'xs' })
      expect(result).toMatch(/gap-y-\d+/)
      expect(result).toMatch(/md:gap-y-\d+/)
    })

    it('should apply responsive spacing for sm/md/lg/xl', () => {
      const spaces = ['sm', 'md', 'lg', 'xl'] as const
      spaces.forEach((space) => {
        const result = stackCva({ space })
        expect(result).toMatch(/gap-y-\d+/)
        expect(result).toMatch(/md:gap-y-\d+/)
        expect(result).toMatch(/lg:gap-y-\d+/)
      })
    })
  })

  describe('stackCva - Edge Cases', () => {
    it('should handle undefined space (use default)', () => {
      const result = stackCva({ space: undefined })
      expect(result).toContain('gap-y-4') // Default md
    })

    it('should handle undefined align (use default)', () => {
      const result = stackCva({ align: undefined })
      expect(result).toContain('items-stretch') // Default stretch
    })

    it('should handle empty object (use all defaults)', () => {
      const result = stackCva({})
      expect(result).toContain('gap-y-4')
      expect(result).toContain('md:gap-y-5')
      expect(result).toContain('lg:gap-y-6')
      expect(result).toContain('items-stretch')
    })
  })
})
