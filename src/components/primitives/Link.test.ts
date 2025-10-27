import { describe, expect, it } from 'vitest'

import { linkVariants } from './Link.cva'

describe('Link Component', () => {
  describe('linkVariants - Base Classes', () => {
    it('should include base transition-colors class', () => {
      const result = linkVariants()
      expect(result).toContain('transition-colors')
    })
  })

  describe('linkVariants - Default Variants', () => {
    it('should apply default variant (content)', () => {
      const result = linkVariants()
      expect(result).toContain('text-link')
      expect(result).toContain('underline')
      expect(result).toContain('decoration-transparent')
      expect(result).toContain('hover:decoration-link')
    })

    it('should apply default active state (false)', () => {
      const result = linkVariants()
      // Active false is default, no special classes for content variant when inactive
      expect(result).toBeTruthy()
    })
  })

  describe('linkVariants - Variant Prop', () => {
    it('should render content variant correctly', () => {
      const result = linkVariants({ variant: 'content' })
      expect(result).toContain('text-link')
      expect(result).toContain('underline')
      expect(result).toContain('decoration-transparent')
      expect(result).toContain('hover:decoration-link')
    })

    it('should render nav variant correctly (inactive)', () => {
      const result = linkVariants({ variant: 'nav', active: false })
      expect(result).toContain('hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]')
      expect(result).toContain('text-muted')
    })

    it('should render nav variant correctly (active)', () => {
      const result = linkVariants({ variant: 'nav', active: true })
      expect(result).toContain('hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]')
      expect(result).toContain('text-primary')
    })

    it('should render back variant correctly', () => {
      const result = linkVariants({ variant: 'back' })
      expect(result).toContain('group')
      expect(result).toContain('inline-flex')
      expect(result).toContain('items-center')
      expect(result).toContain('gap-2')
      expect(result).toContain('font-mono')
      expect(result).toContain('text-sm')
      expect(result).toContain('text-muted')
      expect(result).toContain('hover:text-link')
    })
  })

  describe('linkVariants - Active Prop', () => {
    it('should handle active state for nav variant', () => {
      const inactive = linkVariants({ variant: 'nav', active: false })
      const active = linkVariants({ variant: 'nav', active: true })

      // Inactive nav link
      expect(inactive).toContain('text-muted')

      // Active nav link
      expect(active).toContain('text-primary')
      expect(active).not.toContain('text-muted')
    })

    it('should not affect content variant with active prop', () => {
      const result = linkVariants({ variant: 'content', active: true })
      // Content variant doesn't have compound variants for active state
      expect(result).toContain('text-link')
      expect(result).toContain('underline')
    })

    it('should not affect back variant with active prop', () => {
      const result = linkVariants({ variant: 'back', active: true })
      // Back variant doesn't have compound variants for active state
      expect(result).toContain('text-muted')
      expect(result).toContain('hover:text-link')
    })
  })

  describe('linkVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = linkVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('text-link') // Default content variant still applied
    })

    it('should support multiple custom classes', () => {
      const result = linkVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })

    it('should merge custom classes with nav variant', () => {
      const result = linkVariants({ variant: 'nav', class: 'custom-nav' })
      expect(result).toContain('custom-nav')
      expect(result).toContain('hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]')
    })

    it('should merge custom classes with back variant', () => {
      const result = linkVariants({ variant: 'back', class: 'custom-back' })
      expect(result).toContain('custom-back')
      expect(result).toContain('font-mono')
    })
  })

  describe('linkVariants - Compound Variants', () => {
    it('should apply nav active compound variant correctly', () => {
      const result = linkVariants({ variant: 'nav', active: true })
      expect(result).toContain('text-primary')
    })

    it('should apply nav inactive compound variant correctly', () => {
      const result = linkVariants({ variant: 'nav', active: false })
      expect(result).toContain('text-muted')
    })

    it('should not have compound variants for content variant', () => {
      const active = linkVariants({ variant: 'content', active: true })
      const inactive = linkVariants({ variant: 'content', active: false })
      // Both should have same styling (no compound variant)
      expect(active).toContain('text-link')
      expect(inactive).toContain('text-link')
    })
  })

  describe('linkVariants - All Variant Combinations', () => {
    const variants = ['content', 'nav', 'back'] as const

    it('should generate valid classes for all variants', () => {
      variants.forEach((variant) => {
        const result = linkVariants({ variant })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for nav with both active states', () => {
      const active = linkVariants({ variant: 'nav', active: true })
      const inactive = linkVariants({ variant: 'nav', active: false })

      expect(active).toBeTruthy()
      expect(inactive).toBeTruthy()
      expect(active).not.toBe(inactive)
    })
  })

  describe('linkVariants - Edge Cases', () => {
    it('should handle undefined variant (use default)', () => {
      const result = linkVariants({ variant: undefined })
      expect(result).toContain('text-link')
      expect(result).toContain('underline')
    })

    it('should handle undefined active (use default false)', () => {
      const result = linkVariants({ variant: 'nav', active: undefined })
      expect(result).toContain('text-muted')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = linkVariants({})
      expect(result).toContain('text-link')
      expect(result).toContain('underline')
    })

    it('should handle null class gracefully', () => {
      const result = linkVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = linkVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })

  describe('linkVariants - Semantic Usage', () => {
    it('should provide appropriate styles for inline content links', () => {
      const result = linkVariants({ variant: 'content' })
      expect(result).toContain('underline')
      expect(result).toContain('text-link')
      expect(result).toContain('hover:decoration-link')
    })

    it('should provide appropriate styles for navigation links', () => {
      const result = linkVariants({ variant: 'nav' })
      expect(result).toContain('hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]')
    })

    it('should provide appropriate styles for back navigation', () => {
      const result = linkVariants({ variant: 'back' })
      expect(result).toContain('font-mono')
      expect(result).toContain('text-sm')
      expect(result).toContain('gap-2') // For icon spacing
    })

    it('should distinguish active navigation clearly', () => {
      const active = linkVariants({ variant: 'nav', active: true })
      const inactive = linkVariants({ variant: 'nav', active: false })

      // Active should be visually distinct
      expect(active).toContain('text-primary')

      // Inactive should be muted
      expect(inactive).toContain('text-muted')
    })
  })

  describe('linkVariants - Accessibility Considerations', () => {
    it('should have appropriate hover states for all variants', () => {
      const content = linkVariants({ variant: 'content' })
      const nav = linkVariants({ variant: 'nav' })
      const back = linkVariants({ variant: 'back' })

      expect(content).toContain('hover:decoration-link')
      expect(nav).toContain('hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]')
      expect(back).toContain('hover:text-link')
    })

    it('should have focus-visible support via transition-colors', () => {
      const result = linkVariants()
      // Base transition-colors enables smooth focus state transitions
      expect(result).toContain('transition-colors')
    })
  })
})
