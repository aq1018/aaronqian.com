import { describe, expect, it } from 'vitest'

import { surfaceCva } from './Surface.cva'

describe('Surface Component', () => {
  describe('surfaceCva - Base Classes', () => {
    it('should include relative and w-full in all variants', () => {
      const result = surfaceCva()
      expect(result).toContain('relative')
      expect(result).toContain('w-full')
    })
  })

  describe('surfaceCva - Default Variants', () => {
    it('should apply default padY (md)', () => {
      const result = surfaceCva()
      expect(result).toContain('py-16')
      expect(result).toContain('sm:py-20')
      expect(result).toContain('lg:py-24')
    })
  })

  describe('surfaceCva - PadY Prop', () => {
    it('should apply none padY', () => {
      const result = surfaceCva({ padY: 'none' })
      expect(result).toContain('py-0')
    })

    it('should apply sm padY with responsive values', () => {
      const result = surfaceCva({ padY: 'sm' })
      expect(result).toContain('py-12') // 48px
      expect(result).toContain('sm:py-14') // 56px
      expect(result).toContain('lg:py-16') // 64px
    })

    it('should apply md padY with responsive values (default)', () => {
      const result = surfaceCva({ padY: 'md' })
      expect(result).toContain('py-16') // 64px
      expect(result).toContain('sm:py-20') // 80px
      expect(result).toContain('lg:py-24') // 96px
    })

    it('should apply lg padY with responsive values', () => {
      const result = surfaceCva({ padY: 'lg' })
      expect(result).toContain('py-20') // 80px
      expect(result).toContain('sm:py-24') // 96px
      expect(result).toContain('lg:py-28') // 112px
    })

    it('should apply xl padY with responsive values', () => {
      const result = surfaceCva({ padY: 'xl' })
      expect(result).toContain('py-24') // 96px
      expect(result).toContain('sm:py-28') // 112px
      expect(result).toContain('lg:py-32') // 128px
    })
  })

  describe('surfaceCva - Responsive Padding', () => {
    it('should apply responsive padding for all non-none variants', () => {
      const padYs = ['sm', 'md', 'lg', 'xl'] as const
      padYs.forEach((padY) => {
        const result = surfaceCva({ padY })
        expect(result).toMatch(/py-\d+/)
        expect(result).toMatch(/sm:py-\d+/)
        expect(result).toMatch(/lg:py-\d+/)
      })
    })
  })

  describe('surfaceCva - Edge Cases', () => {
    it('should handle undefined padY (use default)', () => {
      const result = surfaceCva({ padY: undefined })
      expect(result).toContain('py-16') // Default md
    })

    it('should handle empty object (use default)', () => {
      const result = surfaceCva({})
      expect(result).toContain('relative')
      expect(result).toContain('w-full')
      expect(result).toContain('py-16')
    })
  })
})
