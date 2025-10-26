import { describe, expect, it } from 'vitest'

import { badgeVariants } from './Badge.cva'

describe('Badge Component', () => {
  describe('badgeVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = badgeVariants()
      expect(result).toContain('inline-flex')
      expect(result).toContain('items-center')
      expect(result).toContain('rounded')
      expect(result).toContain('font-mono')
      expect(result).toContain('font-semibold')
      expect(result).toContain('whitespace-nowrap')
    })
  })

  describe('badgeVariants - Default Variants', () => {
    it('should apply default variants (size: sm, color: neutral, variant: solid)', () => {
      const result = badgeVariants()
      // Size sm
      expect(result).toContain('text-xs')
      expect(result).toContain('px-2')
      expect(result).toContain('py-1')
      // Color neutral + style solid
      expect(result).toContain('bg-neutral')
      expect(result).toContain('text-neutral-content')
      // No pulse or uppercase
      expect(result).not.toContain('animate-pulse-subtle')
      expect(result).not.toContain('uppercase')
    })
  })

  describe('badgeVariants - Size Variants', () => {
    it('should render xs size correctly', () => {
      const result = badgeVariants({ size: 'xs' })
      expect(result).toContain('text-xs')
      expect(result).toContain('px-1.5')
      expect(result).toContain('py-0.5')
    })

    it('should render sm size correctly', () => {
      const result = badgeVariants({ size: 'sm' })
      expect(result).toContain('text-xs')
      expect(result).toContain('px-2')
      expect(result).toContain('py-1')
    })

    it('should render md size correctly', () => {
      const result = badgeVariants({ size: 'md' })
      expect(result).toContain('text-sm')
      expect(result).toContain('px-2.5')
      expect(result).toContain('py-1')
    })
  })

  describe('badgeVariants - Color Variants with Solid Variant', () => {
    it('should render primary color correctly', () => {
      const result = badgeVariants({ color: 'primary', variant: 'solid' })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-primary-content')
    })

    it('should render accent color correctly', () => {
      const result = badgeVariants({ color: 'accent', variant: 'solid' })
      expect(result).toContain('bg-accent')
      expect(result).toContain('text-accent-content')
    })

    it('should render secondary color correctly', () => {
      const result = badgeVariants({ color: 'secondary', variant: 'solid' })
      expect(result).toContain('bg-secondary')
      expect(result).toContain('text-secondary-content')
    })

    it('should render success color correctly', () => {
      const result = badgeVariants({ color: 'success', variant: 'solid' })
      expect(result).toContain('bg-success')
      expect(result).toContain('text-success-content')
    })

    it('should render warning color correctly', () => {
      const result = badgeVariants({ color: 'warning', variant: 'solid' })
      expect(result).toContain('bg-warning')
      expect(result).toContain('text-warning-content')
    })

    it('should render danger color correctly', () => {
      const result = badgeVariants({ color: 'danger', variant: 'solid' })
      expect(result).toContain('bg-danger')
      expect(result).toContain('text-danger-content')
    })

    it('should render info color correctly', () => {
      const result = badgeVariants({ color: 'info', variant: 'solid' })
      expect(result).toContain('bg-info')
      expect(result).toContain('text-info-content')
    })

    it('should render neutral color correctly', () => {
      const result = badgeVariants({ color: 'neutral', variant: 'solid' })
      expect(result).toContain('bg-neutral')
      expect(result).toContain('text-neutral-content')
    })

    it('should render muted color correctly', () => {
      const result = badgeVariants({ color: 'muted', variant: 'solid' })
      expect(result).toContain('bg-muted/20')
      expect(result).toContain('text-muted')
    })
  })

  describe('badgeVariants - Color Variants with Outline Variant', () => {
    it('should render primary outline correctly', () => {
      const result = badgeVariants({ color: 'primary', variant: 'outline' })
      expect(result).toContain('border-2')
      expect(result).toContain('border-primary')
      expect(result).toContain('text-primary')
      expect(result).toContain('bg-transparent')
    })

    it('should render danger outline correctly', () => {
      const result = badgeVariants({ color: 'danger', variant: 'outline' })
      expect(result).toContain('border-2')
      expect(result).toContain('border-danger')
      expect(result).toContain('text-danger')
      expect(result).toContain('bg-transparent')
    })

    it('should render muted outline correctly', () => {
      const result = badgeVariants({ color: 'muted', variant: 'outline' })
      expect(result).toContain('border-2')
      expect(result).toContain('border-muted')
      expect(result).toContain('text-muted')
      expect(result).toContain('bg-transparent')
    })
  })

  describe('badgeVariants - Color Variants with Soft Variant', () => {
    it('should render primary soft correctly', () => {
      const result = badgeVariants({ color: 'primary', variant: 'soft' })
      expect(result).toContain('bg-primary/20')
      expect(result).toContain('text-primary')
    })

    it('should render success soft correctly', () => {
      const result = badgeVariants({ color: 'success', variant: 'soft' })
      expect(result).toContain('bg-success/20')
      expect(result).toContain('text-success')
    })

    it('should render muted soft correctly', () => {
      const result = badgeVariants({ color: 'muted', variant: 'soft' })
      expect(result).toContain('bg-muted/10')
      expect(result).toContain('text-muted')
    })
  })

  describe('badgeVariants - Pulse Modifier', () => {
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

    it('should work with pulse on primary color', () => {
      const result = badgeVariants({ color: 'primary', pulse: true })
      expect(result).toContain('bg-primary')
      expect(result).toContain('animate-pulse-subtle')
    })
  })

  describe('badgeVariants - Uppercase Modifier', () => {
    it('should not apply uppercase by default', () => {
      const result = badgeVariants()
      expect(result).not.toContain('uppercase')
      expect(result).not.toContain('tracking-wider')
    })

    it('should apply uppercase when true', () => {
      const result = badgeVariants({ uppercase: true })
      expect(result).toContain('uppercase')
      expect(result).toContain('tracking-wider')
    })

    it('should not apply uppercase when false', () => {
      const result = badgeVariants({ uppercase: false })
      expect(result).not.toContain('uppercase')
    })
  })

  describe('badgeVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = badgeVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('bg-neutral') // Default color still applied
    })

    it('should support multiple custom classes', () => {
      const result = badgeVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })

    it('should merge custom classes with specific variants', () => {
      const result = badgeVariants({ color: 'primary', size: 'md', class: 'custom-badge' })
      expect(result).toContain('custom-badge')
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-sm')
    })
  })

  describe('badgeVariants - Variant Combinations', () => {
    const sizes = ['xs', 'sm', 'md'] as const
    const colors = [
      'primary',
      'accent',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
      'neutral',
      'muted',
    ] as const
    const variants = ['solid', 'outline', 'soft'] as const

    it('should generate valid classes for all size combinations', () => {
      sizes.forEach((size) => {
        const result = badgeVariants({ size })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for all color combinations', () => {
      colors.forEach((color) => {
        const result = badgeVariants({ color })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for all variant combinations', () => {
      variants.forEach((variant) => {
        const result = badgeVariants({ variant })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for color × variant combinations', () => {
      colors.forEach((color) => {
        variants.forEach((variant) => {
          const result = badgeVariants({ color, variant })
          expect(result).toBeTruthy()
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        })
      })
    })

    it('should handle all modifiers together', () => {
      const result = badgeVariants({
        size: 'md',
        color: 'primary',
        variant: 'solid',
        pulse: true,
        uppercase: true,
      })
      expect(result).toContain('text-sm')
      expect(result).toContain('bg-primary')
      expect(result).toContain('animate-pulse-subtle')
      expect(result).toContain('uppercase')
    })
  })

  describe('badgeVariants - Edge Cases', () => {
    it('should handle undefined size (use default)', () => {
      const result = badgeVariants({ size: undefined })
      expect(result).toContain('text-xs')
      expect(result).toContain('px-2')
    })

    it('should handle undefined color (use default)', () => {
      const result = badgeVariants({ color: undefined })
      expect(result).toContain('bg-neutral')
    })

    it('should handle undefined variant (use default)', () => {
      const result = badgeVariants({ variant: undefined })
      expect(result).toContain('bg-neutral')
      expect(result).not.toContain('bg-transparent')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = badgeVariants({})
      expect(result).toContain('bg-neutral')
      expect(result).toContain('text-xs')
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
    it('should provide appropriate styles for LIVE status badges', () => {
      const result = badgeVariants({ color: 'primary', pulse: true })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-primary-content')
      expect(result).toContain('animate-pulse-subtle')
    })

    it('should provide appropriate styles for status labels', () => {
      const result = badgeVariants({ color: 'primary', variant: 'outline', uppercase: true })
      expect(result).toContain('border-primary')
      expect(result).toContain('uppercase')
      expect(result).toContain('tracking-wider')
    })

    it('should provide appropriate styles for content tags', () => {
      const result = badgeVariants({ color: 'muted', variant: 'soft' })
      expect(result).toContain('bg-muted/10')
      expect(result).toContain('text-muted')
    })

    it('should provide appropriate styles for keyboard shortcuts', () => {
      const result = badgeVariants({ color: 'neutral', size: 'xs' })
      expect(result).toContain('bg-neutral')
      expect(result).toContain('px-1.5')
      expect(result).toContain('py-0.5')
    })

    it('should provide appropriate styles for log entry tags', () => {
      const result = badgeVariants({ color: 'danger', variant: 'outline', size: 'xs' })
      expect(result).toContain('border-danger')
      expect(result).toContain('text-danger')
      expect(result).toContain('px-1.5')
    })
  })

  describe('badgeVariants - Consistency', () => {
    it('should maintain consistent base classes across all variants', () => {
      const primary = badgeVariants({ color: 'primary' })
      const muted = badgeVariants({ color: 'muted' })
      const success = badgeVariants({ color: 'success' })

      // All should have same base classes
      ;[primary, muted, success].forEach((result) => {
        expect(result).toContain('inline-flex')
        expect(result).toContain('items-center')
        expect(result).toContain('rounded')
        expect(result).toContain('font-mono')
        expect(result).toContain('font-semibold')
      })
    })

    it('should maintain consistent size classes across color variants', () => {
      const primarySm = badgeVariants({ color: 'primary', size: 'sm' })
      const mutedSm = badgeVariants({ color: 'muted', size: 'sm' })

      expect(primarySm).toContain('text-xs')
      expect(mutedSm).toContain('text-xs')
      expect(primarySm).toContain('px-2')
      expect(mutedSm).toContain('px-2')
    })
  })

  describe('badgeVariants - Visual Hierarchy', () => {
    it('should have clear visual distinction between variants', () => {
      const solid = badgeVariants({ color: 'primary', variant: 'solid' })
      const outline = badgeVariants({ color: 'primary', variant: 'outline' })
      const soft = badgeVariants({ color: 'primary', variant: 'soft' })

      // Solid: filled background
      expect(solid).toContain('bg-primary')
      expect(solid).not.toContain('bg-transparent')

      // Outline: transparent background with border
      expect(outline).toContain('bg-transparent')
      expect(outline).toContain('border-2')

      // Soft: subtle background
      expect(soft).toContain('bg-primary/20')
      expect(soft).not.toContain('bg-transparent')

      // All three should produce different class strings
      expect(solid).not.toBe(outline)
      expect(outline).not.toBe(soft)
      expect(solid).not.toBe(soft)
    })

    it('should have clear visual distinction between semantic colors', () => {
      const success = badgeVariants({ color: 'success' })
      const danger = badgeVariants({ color: 'danger' })
      const warning = badgeVariants({ color: 'warning' })

      expect(success).toContain('bg-success')
      expect(danger).toContain('bg-danger')
      expect(warning).toContain('bg-warning')

      // All should produce different class strings
      expect(success).not.toBe(danger)
      expect(danger).not.toBe(warning)
      expect(success).not.toBe(warning)
    })
  })

  describe('badgeVariants - Design Token Integration', () => {
    it('should use semantic color tokens for brand colors', () => {
      const primary = badgeVariants({ color: 'primary' })
      const accent = badgeVariants({ color: 'accent' })
      const secondary = badgeVariants({ color: 'secondary' })

      expect(primary).toContain('bg-primary')
      expect(primary).toContain('text-primary-content')
      expect(accent).toContain('bg-accent')
      expect(accent).toContain('text-accent-content')
      expect(secondary).toContain('bg-secondary')
      expect(secondary).toContain('text-secondary-content')
    })

    it('should use semantic color tokens for status colors', () => {
      const success = badgeVariants({ color: 'success' })
      const warning = badgeVariants({ color: 'warning' })
      const danger = badgeVariants({ color: 'danger' })
      const info = badgeVariants({ color: 'info' })

      expect(success).toContain('bg-success')
      expect(warning).toContain('bg-warning')
      expect(danger).toContain('bg-danger')
      expect(info).toContain('bg-info')
    })

    it('should use content pairing for accessible contrast', () => {
      const primary = badgeVariants({ color: 'primary', variant: 'solid' })
      const success = badgeVariants({ color: 'success', variant: 'solid' })

      expect(primary).toContain('text-primary-content')
      expect(success).toContain('text-success-content')
    })
  })
})
