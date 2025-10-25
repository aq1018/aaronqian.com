import { describe, expect, it } from 'vitest'

import { badgeVariants } from './Badge.cva'

describe('Badge Component', () => {
  describe('badgeVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = badgeVariants()
      expect(result).toContain('rounded')
      expect(result).toContain('px-2')
      expect(result).toContain('py-0.5')
      expect(result).toContain('text-xs')
      expect(result).toContain('font-bold')
    })
  })

  describe('badgeVariants - Default Variants', () => {
    it('should apply default variant (status) and pulse (false)', () => {
      const result = badgeVariants()
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-gray-950')
      expect(result).not.toContain('animate-pulse-subtle')
    })
  })

  describe('badgeVariants - Variant Prop', () => {
    it('should render status variant correctly', () => {
      const result = badgeVariants({ variant: 'status' })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-gray-950')
    })

    it('should render tag variant correctly', () => {
      const result = badgeVariants({ variant: 'tag' })
      expect(result).toContain('bg-highlight')
      expect(result).toContain('text-muted')
    })

    it('should render outline variant correctly', () => {
      const result = badgeVariants({ variant: 'outline' })
      expect(result).toContain('border-2')
      expect(result).toContain('border-primary')
      expect(result).toContain('text-primary')
      expect(result).toContain('bg-transparent')
    })
  })

  describe('badgeVariants - Pulse Prop', () => {
    it('should not apply pulse animation by default', () => {
      const result = badgeVariants()
      expect(result).not.toContain('animate-pulse-subtle')
    })

    it('should apply pulse animation when true', () => {
      const result = badgeVariants({ pulse: true })
      expect(result).toContain('animate-pulse-subtle')
    })

    it('should not apply pulse animation when false', () => {
      const result = badgeVariants({ pulse: false })
      expect(result).not.toContain('animate-pulse-subtle')
    })

    it('should work with pulse on status variant', () => {
      const result = badgeVariants({ variant: 'status', pulse: true })
      expect(result).toContain('bg-primary')
      expect(result).toContain('animate-pulse-subtle')
    })

    it('should work with pulse on tag variant', () => {
      const result = badgeVariants({ variant: 'tag', pulse: true })
      expect(result).toContain('bg-highlight')
      expect(result).toContain('animate-pulse-subtle')
    })

    it('should work with pulse on outline variant', () => {
      const result = badgeVariants({ variant: 'outline', pulse: true })
      expect(result).toContain('border-primary')
      expect(result).toContain('animate-pulse-subtle')
    })
  })

  describe('badgeVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = badgeVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('bg-primary') // Default status variant still applied
    })

    it('should support multiple custom classes', () => {
      const result = badgeVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })

    it('should merge custom classes with tag variant', () => {
      const result = badgeVariants({ variant: 'tag', class: 'custom-tag' })
      expect(result).toContain('custom-tag')
      expect(result).toContain('bg-highlight')
    })

    it('should merge custom classes with outline variant', () => {
      const result = badgeVariants({ variant: 'outline', class: 'custom-outline' })
      expect(result).toContain('custom-outline')
      expect(result).toContain('border-primary')
    })
  })

  describe('badgeVariants - All Variant Combinations', () => {
    const variants = ['status', 'tag', 'outline'] as const
    const pulseStates = [true, false] as const

    it('should generate valid classes for all variant combinations', () => {
      variants.forEach((variant) => {
        pulseStates.forEach((pulse) => {
          const result = badgeVariants({ variant, pulse })
          expect(result).toBeTruthy()
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        })
      })
    })

    it('should apply pulse correctly across all variants', () => {
      variants.forEach((variant) => {
        const withPulse = badgeVariants({ variant, pulse: true })
        const withoutPulse = badgeVariants({ variant, pulse: false })

        expect(withPulse).toContain('animate-pulse-subtle')
        expect(withoutPulse).not.toContain('animate-pulse-subtle')
      })
    })
  })

  describe('badgeVariants - Edge Cases', () => {
    it('should handle undefined variant (use default)', () => {
      const result = badgeVariants({ variant: undefined })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-gray-950')
    })

    it('should handle undefined pulse (use default false)', () => {
      const result = badgeVariants({ pulse: undefined })
      expect(result).not.toContain('animate-pulse-subtle')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = badgeVariants({})
      expect(result).toContain('bg-primary')
      expect(result).not.toContain('animate-pulse-subtle')
    })

    it('should handle null class gracefully', () => {
      const result = badgeVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = badgeVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })

  describe('badgeVariants - Semantic Usage', () => {
    it('should provide appropriate styles for status badges (e.g., LIVE)', () => {
      const result = badgeVariants({ variant: 'status' })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-gray-950')
      // Status badges should be visually prominent
      expect(result).toContain('font-bold')
    })

    it('should provide appropriate styles for content tags', () => {
      const result = badgeVariants({ variant: 'tag' })
      expect(result).toContain('bg-highlight')
      expect(result).toContain('text-muted')
      // Tags should be more subtle
    })

    it('should provide appropriate styles for outlined badges', () => {
      const result = badgeVariants({ variant: 'outline' })
      expect(result).toContain('border-2')
      expect(result).toContain('bg-transparent')
      // Outline should be lightweight and non-intrusive
    })

    it('should support pulsing status indicators', () => {
      const result = badgeVariants({ variant: 'status', pulse: true })
      expect(result).toContain('bg-primary')
      expect(result).toContain('animate-pulse-subtle')
      // Useful for "LIVE" or active status indicators
    })
  })

  describe('badgeVariants - Consistency', () => {
    it('should maintain consistent base sizing across all variants', () => {
      const status = badgeVariants({ variant: 'status' })
      const tag = badgeVariants({ variant: 'tag' })
      const outline = badgeVariants({ variant: 'outline' })

      // All should have same base size classes
      expect(status).toContain('text-xs')
      expect(tag).toContain('text-xs')
      expect(outline).toContain('text-xs')

      expect(status).toContain('px-2')
      expect(tag).toContain('px-2')
      expect(outline).toContain('px-2')

      expect(status).toContain('py-0.5')
      expect(tag).toContain('py-0.5')
      expect(outline).toContain('py-0.5')
    })

    it('should maintain consistent font weight across all variants', () => {
      const status = badgeVariants({ variant: 'status' })
      const tag = badgeVariants({ variant: 'tag' })
      const outline = badgeVariants({ variant: 'outline' })

      expect(status).toContain('font-bold')
      expect(tag).toContain('font-bold')
      expect(outline).toContain('font-bold')
    })

    it('should maintain consistent border radius across all variants', () => {
      const status = badgeVariants({ variant: 'status' })
      const tag = badgeVariants({ variant: 'tag' })
      const outline = badgeVariants({ variant: 'outline' })

      expect(status).toContain('rounded')
      expect(tag).toContain('rounded')
      expect(outline).toContain('rounded')
    })
  })

  describe('badgeVariants - Visual Hierarchy', () => {
    it('should have clear visual distinction between variants', () => {
      const status = badgeVariants({ variant: 'status' })
      const tag = badgeVariants({ variant: 'tag' })
      const outline = badgeVariants({ variant: 'outline' })

      // Status is most prominent (solid primary)
      expect(status).toContain('bg-primary')

      // Tag is subtle (muted colors)
      expect(tag).toContain('text-muted')

      // Outline is lightweight (transparent background)
      expect(outline).toContain('bg-transparent')

      // All three should produce different class strings
      expect(status).not.toBe(tag)
      expect(tag).not.toBe(outline)
      expect(status).not.toBe(outline)
    })
  })
})
