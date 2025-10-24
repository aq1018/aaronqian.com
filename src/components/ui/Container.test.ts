import { describe, expect, it } from 'vitest'

import { containerVariants } from './Container.cva'

describe('Container Component', () => {
  describe('containerVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = containerVariants()
      expect(result).toContain('mx-auto')
      expect(result).toContain('px-4')
      expect(result).toContain('sm:px-6')
      expect(result).toContain('lg:px-8')
    })
  })

  describe('containerVariants - Default Variants', () => {
    it('should apply default variant (default size)', () => {
      const result = containerVariants()
      // Default size: default
      expect(result).toContain('max-w-4xl')
    })
  })

  describe('containerVariants - Size Prop', () => {
    it('should apply narrow size correctly', () => {
      const result = containerVariants({ size: 'narrow' })
      expect(result).toContain('max-w-3xl')
      expect(result).not.toContain('max-w-4xl')
      expect(result).not.toContain('max-w-7xl')
    })

    it('should apply default size correctly', () => {
      const result = containerVariants({ size: 'default' })
      expect(result).toContain('max-w-4xl')
      expect(result).not.toContain('max-w-3xl')
      expect(result).not.toContain('max-w-7xl')
    })

    it('should apply wide size correctly', () => {
      const result = containerVariants({ size: 'wide' })
      expect(result).toContain('max-w-7xl')
      expect(result).not.toContain('max-w-3xl')
      expect(result).not.toContain('max-w-4xl')
    })
  })

  describe('containerVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = containerVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('max-w-4xl') // Default variant still applied
    })

    it('should support multiple custom classes', () => {
      const result = containerVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })

    it('should allow custom classes to be merged with variant classes', () => {
      const result = containerVariants({ size: 'narrow', class: 'py-8' })
      // Both variant and custom classes should be present
      expect(result).toContain('max-w-3xl')
      expect(result).toContain('py-8')
    })
  })

  describe('containerVariants - All Size Combinations', () => {
    const sizes = ['narrow', 'default', 'wide'] as const

    it('should generate valid classes for all size combinations', () => {
      sizes.forEach((size) => {
        const result = containerVariants({ size })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should always include base classes regardless of size', () => {
      sizes.forEach((size) => {
        const result = containerVariants({ size })
        expect(result).toContain('mx-auto')
        expect(result).toContain('px-4')
        expect(result).toContain('sm:px-6')
        expect(result).toContain('lg:px-8')
      })
    })
  })

  describe('containerVariants - Edge Cases', () => {
    it('should handle undefined size (use default)', () => {
      const result = containerVariants({ size: undefined })
      expect(result).toContain('max-w-4xl') // Default
    })

    it('should handle empty object (use all defaults)', () => {
      const result = containerVariants({})
      expect(result).toContain('max-w-4xl')
      expect(result).toContain('mx-auto')
    })

    it('should handle null class gracefully', () => {
      const result = containerVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = containerVariants({ class: '' })
      expect(result).toBeTruthy()
      expect(result).toContain('max-w-4xl')
    })
  })

  describe('containerVariants - TypeScript Types', () => {
    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid size combinations', () => {
      // These should all compile without TypeScript errors
      containerVariants({ size: 'narrow' })
      containerVariants({ size: 'default' })
      containerVariants({ size: 'wide' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept custom class string', () => {
      containerVariants({ class: 'custom-class' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept multiple props together', () => {
      containerVariants({
        size: 'wide',
        class: 'custom',
      })
    })
  })

  describe('containerVariants - Responsive Behavior', () => {
    it('should include responsive padding classes', () => {
      const result = containerVariants()
      // Base mobile padding
      expect(result).toContain('px-4')
      // Small breakpoint
      expect(result).toContain('sm:px-6')
      // Large breakpoint
      expect(result).toContain('lg:px-8')
    })

    it('should maintain responsive padding across all sizes', () => {
      const narrow = containerVariants({ size: 'narrow' })
      const defaultSize = containerVariants({ size: 'default' })
      const wide = containerVariants({ size: 'wide' })

      ;[narrow, defaultSize, wide].forEach((result) => {
        expect(result).toContain('px-4')
        expect(result).toContain('sm:px-6')
        expect(result).toContain('lg:px-8')
      })
    })
  })

  describe('containerVariants - Layout Behavior', () => {
    it('should center container with mx-auto', () => {
      const result = containerVariants()
      expect(result).toContain('mx-auto')
    })

    it('should maintain centering across all sizes', () => {
      const narrow = containerVariants({ size: 'narrow' })
      const defaultSize = containerVariants({ size: 'default' })
      const wide = containerVariants({ size: 'wide' })

      ;[narrow, defaultSize, wide].forEach((result) => {
        expect(result).toContain('mx-auto')
      })
    })
  })
})
