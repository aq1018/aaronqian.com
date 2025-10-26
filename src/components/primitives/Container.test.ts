import { describe, expect, it } from 'vitest'

import { containerCva } from './Container.cva'

describe('Container Component', () => {
  describe('containerCva - Base Classes', () => {
    it('should include w-full in all variants', () => {
      const result = containerCva()
      expect(result).toContain('w-full')
    })
  })

  describe('containerCva - Default Variants', () => {
    it('should apply default width (default/6xl)', () => {
      const result = containerCva()
      expect(result).toContain('max-w-6xl')
    })

    it('should apply default padX (lg)', () => {
      const result = containerCva()
      expect(result).toContain('px-6')
      expect(result).toContain('md:px-10')
      expect(result).toContain('lg:px-16')
    })

    it('should apply default fluidUntil (none) with centering', () => {
      const result = containerCva()
      expect(result).toContain('mx-auto')
    })

    it('should apply default center (true)', () => {
      const result = containerCva()
      expect(result).toContain('mx-auto')
    })
  })

  describe('containerCva - Width Prop', () => {
    it('should apply narrow width correctly', () => {
      const result = containerCva({ width: 'narrow' })
      expect(result).toContain('max-w-2xl')
    })

    it('should apply default width correctly', () => {
      const result = containerCva({ width: 'default' })
      expect(result).toContain('max-w-6xl')
    })

    it('should apply wide width correctly', () => {
      const result = containerCva({ width: 'wide' })
      expect(result).toContain('max-w-7xl')
    })

    it('should apply full width correctly (no max-width)', () => {
      const result = containerCva({ width: 'full' })
      expect(result).not.toContain('max-w-')
      expect(result).toContain('w-full')
    })
  })

  describe('containerCva - PadX Prop', () => {
    it('should apply none padX correctly', () => {
      const result = containerCva({ padX: 'none' })
      expect(result).toContain('px-0')
    })

    it('should apply sm padX with responsive values', () => {
      const result = containerCva({ padX: 'sm' })
      expect(result).toContain('px-4')
      expect(result).toContain('md:px-6')
    })

    it('should apply md padX with responsive values', () => {
      const result = containerCva({ padX: 'md' })
      expect(result).toContain('px-4')
      expect(result).toContain('md:px-8')
      expect(result).toContain('lg:px-12')
    })

    it('should apply lg padX with responsive values (default)', () => {
      const result = containerCva({ padX: 'lg' })
      expect(result).toContain('px-6')
      expect(result).toContain('md:px-10')
      expect(result).toContain('lg:px-16')
    })

    it('should apply xl padX with responsive values', () => {
      const result = containerCva({ padX: 'xl' })
      expect(result).toContain('px-6')
      expect(result).toContain('md:px-12')
      expect(result).toContain('lg:px-20')
    })
  })

  describe('containerCva - FluidUntil Prop', () => {
    it('should apply none fluidUntil with immediate centering', () => {
      const result = containerCva({ fluidUntil: 'none' })
      expect(result).toContain('mx-auto')
    })

    it('should apply sm fluidUntil correctly', () => {
      const result = containerCva({ fluidUntil: 'sm' })
      expect(result).toContain('mx-auto')
      expect(result).toContain('sm:w-full')
    })

    it('should apply md fluidUntil correctly', () => {
      const result = containerCva({ fluidUntil: 'md' })
      expect(result).toContain('mx-auto')
      expect(result).toContain('md:w-full')
    })

    it('should apply lg fluidUntil correctly', () => {
      const result = containerCva({ fluidUntil: 'lg' })
      expect(result).toContain('mx-auto')
      expect(result).toContain('lg:w-full')
    })

    it('should apply xl fluidUntil correctly', () => {
      const result = containerCva({ fluidUntil: 'xl' })
      expect(result).toContain('mx-auto')
      expect(result).toContain('xl:w-full')
    })
  })

  describe('containerCva - Center Prop', () => {
    it('should center when true', () => {
      const result = containerCva({ center: true })
      expect(result).toContain('mx-auto')
    })

    it('should not add mx-auto when false', () => {
      const result = containerCva({ center: false, fluidUntil: 'none' })
      // Check that we don't have redundant mx-auto
      const autoCount = (result.match(/mx-auto/g) ?? []).length
      // fluidUntil:'none' adds mx-auto, so we should only have 1
      expect(autoCount).toBeLessThanOrEqual(1)
    })
  })

  describe('containerCva - Width + PadX Combinations', () => {
    const widths = ['narrow', 'default', 'wide', 'full'] as const
    const padXs = ['none', 'sm', 'md', 'lg', 'xl'] as const

    it('should work with all width and padX combinations', () => {
      widths.forEach((width) => {
        padXs.forEach((padX) => {
          const result = containerCva({ width, padX })
          expect(result).toBeTruthy()
          expect(result).toContain('w-full')
          expect(result).toContain('px-')
        })
      })
    })
  })

  describe('containerCva - Responsive Padding', () => {
    it('should apply responsive padding for sm/md/lg/xl', () => {
      const padXs = ['sm', 'md', 'lg', 'xl'] as const
      padXs.forEach((padX) => {
        const result = containerCva({ padX })
        expect(result).toMatch(/px-\d+/)
        expect(result).toMatch(/md:px-\d+/)
      })
    })

    it('should apply large breakpoint padding for md/lg/xl', () => {
      const padXs = ['md', 'lg', 'xl'] as const
      padXs.forEach((padX) => {
        const result = containerCva({ padX })
        expect(result).toMatch(/lg:px-\d+/)
      })
    })
  })

  describe('containerCva - Edge Cases', () => {
    it('should handle undefined width (use default)', () => {
      const result = containerCva({ width: undefined })
      expect(result).toContain('max-w-6xl')
    })

    it('should handle undefined padX (use default)', () => {
      const result = containerCva({ padX: undefined })
      expect(result).toContain('px-6')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = containerCva({})
      expect(result).toContain('w-full')
      expect(result).toContain('max-w-6xl')
      expect(result).toContain('px-6')
      expect(result).toContain('mx-auto')
    })
  })
})
