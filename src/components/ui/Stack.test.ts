import { describe, expect, it } from 'vitest'

import { stackVariants } from './Stack.cva'

describe('Stack Component', () => {
  describe('stackVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = stackVariants()
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
    })
  })

  describe('stackVariants - Default Variants', () => {
    it('should apply default gap (medium)', () => {
      const result = stackVariants()
      expect(result).toContain('space-y-8')
      expect(result).toContain('sm:space-y-10')
      expect(result).toContain('lg:space-y-12')
    })
  })

  describe('stackVariants - Gap Prop', () => {
    it('should apply tight gap correctly', () => {
      const result = stackVariants({ gap: 'tight' })
      expect(result).toContain('space-y-2')
      expect(result).toContain('sm:space-y-3')
    })

    it('should apply small gap correctly', () => {
      const result = stackVariants({ gap: 'small' })
      expect(result).toContain('space-y-4')
      expect(result).toContain('sm:space-y-5')
      expect(result).toContain('lg:space-y-6')
    })

    it('should apply medium gap correctly', () => {
      const result = stackVariants({ gap: 'medium' })
      expect(result).toContain('space-y-8')
      expect(result).toContain('sm:space-y-10')
      expect(result).toContain('lg:space-y-12')
    })

    it('should apply large gap correctly', () => {
      const result = stackVariants({ gap: 'large' })
      expect(result).toContain('space-y-12')
      expect(result).toContain('sm:space-y-14')
      expect(result).toContain('lg:space-y-16')
    })
  })

  describe('stackVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = stackVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('space-y-8') // Default gap still applied
    })

    it('should support multiple custom classes', () => {
      const result = stackVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })

    it('should merge custom classes with all gap variants', () => {
      const gaps = ['tight', 'small', 'medium', 'large'] as const
      gaps.forEach((gap) => {
        const result = stackVariants({ gap, class: 'custom-spacing' })
        expect(result).toContain('custom-spacing')
        expect(result).toContain('space-y-')
      })
    })
  })

  describe('stackVariants - Edge Cases', () => {
    it('should handle undefined gap (use default)', () => {
      const result = stackVariants({ gap: undefined })
      expect(result).toContain('space-y-8') // Default medium
    })

    it('should handle empty object (use all defaults)', () => {
      const result = stackVariants({})
      expect(result).toContain('space-y-8')
      expect(result).toContain('sm:space-y-10')
      expect(result).toContain('lg:space-y-12')
    })

    it('should handle null class gracefully', () => {
      const result = stackVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = stackVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })

  describe('stackVariants - All Gap Variants', () => {
    const gaps = ['tight', 'small', 'medium', 'large'] as const

    it('should generate valid classes for all gap variants', () => {
      gaps.forEach((gap) => {
        const result = stackVariants({ gap })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
        expect(result).toContain('flex')
        expect(result).toContain('flex-col')
        expect(result).toContain('space-y-')
      })
    })

    it('should apply responsive spacing for all variants', () => {
      gaps.forEach((gap) => {
        const result = stackVariants({ gap })
        expect(result).toContain('sm:space-y-')
      })
    })

    it('should apply large breakpoint spacing for non-tight variants', () => {
      const nonTightGaps = ['small', 'medium', 'large'] as const
      nonTightGaps.forEach((gap) => {
        const result = stackVariants({ gap })
        expect(result).toContain('lg:space-y-')
      })
    })
  })

  describe('stackVariants - TypeScript Types', () => {
    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid gap combinations', () => {
      // These should all compile without TypeScript errors
      stackVariants({ gap: 'tight' })
      stackVariants({ gap: 'small' })
      stackVariants({ gap: 'medium' })
      stackVariants({ gap: 'large' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept custom class string', () => {
      stackVariants({ class: 'custom-class' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept multiple props together', () => {
      stackVariants({
        gap: 'large',
        class: 'custom',
      })
    })
  })

  describe('stackVariants - Spacing Values', () => {
    it('should have correct tight spacing values', () => {
      const result = stackVariants({ gap: 'tight' })
      expect(result).toContain('space-y-2') // 0.5rem
      expect(result).toContain('sm:space-y-3') // 0.75rem
    })

    it('should have correct small spacing values', () => {
      const result = stackVariants({ gap: 'small' })
      expect(result).toContain('space-y-4') // 1rem
      expect(result).toContain('sm:space-y-5') // 1.25rem
      expect(result).toContain('lg:space-y-6') // 1.5rem
    })

    it('should have correct medium spacing values', () => {
      const result = stackVariants({ gap: 'medium' })
      expect(result).toContain('space-y-8') // 2rem
      expect(result).toContain('sm:space-y-10') // 2.5rem
      expect(result).toContain('lg:space-y-12') // 3rem
    })

    it('should have correct large spacing values', () => {
      const result = stackVariants({ gap: 'large' })
      expect(result).toContain('space-y-12') // 3rem
      expect(result).toContain('sm:space-y-14') // 3.5rem
      expect(result).toContain('lg:space-y-16') // 4rem
    })
  })

  describe('stackVariants - Base Layout Classes', () => {
    it('should always include flex display', () => {
      const gaps = ['tight', 'small', 'medium', 'large'] as const
      gaps.forEach((gap) => {
        const result = stackVariants({ gap })
        expect(result).toContain('flex')
      })
    })

    it('should always include flex-col direction', () => {
      const gaps = ['tight', 'small', 'medium', 'large'] as const
      gaps.forEach((gap) => {
        const result = stackVariants({ gap })
        expect(result).toContain('flex-col')
      })
    })
  })
})
