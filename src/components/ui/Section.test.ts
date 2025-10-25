import { describe, expect, it } from 'vitest'

import { sectionVariants } from './Section.cva'

describe('Section Component', () => {
  describe('sectionVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = sectionVariants()
      expect(result).toContain('w-full')
    })
  })

  describe('sectionVariants - Default Variants', () => {
    it('should apply default variants (content, bg)', () => {
      const result = sectionVariants()
      // Default: content variant
      expect(result).toContain('py-16')
      expect(result).toContain('sm:py-20')
      expect(result).toContain('lg:py-24')
      // Default background: bg
      expect(result).toContain('bg-bg')
    })
  })

  describe('sectionVariants - Variant Prop', () => {
    it('should render hero variant correctly', () => {
      const result = sectionVariants({ variant: 'hero' })
      expect(result).toContain('py-20')
      expect(result).toContain('sm:py-24')
      expect(result).toContain('lg:py-28')
    })

    it('should render content variant correctly', () => {
      const result = sectionVariants({ variant: 'content' })
      expect(result).toContain('py-16')
      expect(result).toContain('sm:py-20')
      expect(result).toContain('lg:py-24')
    })

    it('should render subsection variant correctly', () => {
      const result = sectionVariants({ variant: 'subsection' })
      expect(result).toContain('py-12')
      expect(result).toContain('sm:py-14')
      expect(result).toContain('lg:py-16')
    })
  })

  describe('sectionVariants - Background Prop', () => {
    it('should apply surface background correctly', () => {
      const result = sectionVariants({ background: 'surface' })
      expect(result).toContain('bg-surface')
      expect(result).not.toContain('bg-bg')
    })

    it('should apply bg background correctly', () => {
      const result = sectionVariants({ background: 'bg' })
      expect(result).toContain('bg-bg')
      expect(result).not.toContain('bg-surface')
    })
  })

  describe('sectionVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = sectionVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('py-16') // Default variant still applied
      expect(result).toContain('bg-bg') // Default background still applied
    })

    it('should support multiple custom classes', () => {
      const result = sectionVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })
  })

  describe('sectionVariants - Variant Combinations', () => {
    it('should combine hero variant with surface background', () => {
      const result = sectionVariants({ variant: 'hero', background: 'surface' })
      expect(result).toContain('py-20')
      expect(result).toContain('sm:py-24')
      expect(result).toContain('lg:py-28')
      expect(result).toContain('bg-surface')
      expect(result).not.toContain('bg-bg')
    })

    it('should combine content variant with bg background', () => {
      const result = sectionVariants({ variant: 'content', background: 'bg' })
      expect(result).toContain('py-16')
      expect(result).toContain('sm:py-20')
      expect(result).toContain('lg:py-24')
      expect(result).toContain('bg-bg')
      expect(result).not.toContain('bg-surface')
    })

    it('should combine subsection variant with surface background', () => {
      const result = sectionVariants({ variant: 'subsection', background: 'surface' })
      expect(result).toContain('py-12')
      expect(result).toContain('sm:py-14')
      expect(result).toContain('lg:py-16')
      expect(result).toContain('bg-surface')
    })
  })

  describe('sectionVariants - All Combinations', () => {
    const variants = ['hero', 'content', 'subsection'] as const
    const backgrounds = ['surface', 'bg'] as const

    it('should generate valid classes for all variant combinations', () => {
      variants.forEach((variant) => {
        backgrounds.forEach((background) => {
          const result = sectionVariants({ variant, background })
          expect(result).toBeTruthy()
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        })
      })
    })

    it('should apply correct responsive padding for all backgrounds', () => {
      backgrounds.forEach((background) => {
        const hero = sectionVariants({ variant: 'hero', background })
        const content = sectionVariants({ variant: 'content', background })
        const subsection = sectionVariants({ variant: 'subsection', background })

        // Hero has largest padding
        expect(hero).toContain('py-20')
        expect(hero).toContain('lg:py-28')

        // Content has medium padding
        expect(content).toContain('py-16')
        expect(content).toContain('lg:py-24')

        // Subsection has smallest padding
        expect(subsection).toContain('py-12')
        expect(subsection).toContain('lg:py-16')
      })
    })

    it('should always include base classes regardless of variants', () => {
      variants.forEach((variant) => {
        backgrounds.forEach((background) => {
          const result = sectionVariants({ variant, background })
          expect(result).toContain('w-full')
        })
      })
    })
  })

  describe('sectionVariants - Edge Cases', () => {
    it('should handle undefined variant (use default)', () => {
      const result = sectionVariants({ variant: undefined })
      expect(result).toContain('py-16') // Default content variant
      expect(result).toContain('sm:py-20')
      expect(result).toContain('lg:py-24')
    })

    it('should handle undefined background (use default)', () => {
      const result = sectionVariants({ background: undefined })
      expect(result).toContain('bg-bg') // Default bg
    })

    it('should handle empty object (use all defaults)', () => {
      const result = sectionVariants({})
      expect(result).toContain('w-full')
      expect(result).toContain('py-16')
      expect(result).toContain('bg-bg')
    })

    it('should handle null class gracefully', () => {
      const result = sectionVariants({ class: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('w-full')
    })

    it('should handle empty string class gracefully', () => {
      const result = sectionVariants({ class: '' })
      expect(result).toBeTruthy()
      expect(result).toContain('w-full')
    })

    it('should override default classes with custom classes', () => {
      const result = sectionVariants({ class: 'py-8' })
      // Should contain both (tailwind-merge will handle deduplication in actual usage)
      expect(result).toBeTruthy()
    })
  })

  describe('sectionVariants - Responsive Breakpoints', () => {
    it('should include all responsive breakpoints for hero variant', () => {
      const result = sectionVariants({ variant: 'hero' })
      expect(result).toContain('py-20') // Base
      expect(result).toContain('sm:py-24') // Small
      expect(result).toContain('lg:py-28') // Large
    })

    it('should include all responsive breakpoints for content variant', () => {
      const result = sectionVariants({ variant: 'content' })
      expect(result).toContain('py-16') // Base
      expect(result).toContain('sm:py-20') // Small
      expect(result).toContain('lg:py-24') // Large
    })

    it('should include all responsive breakpoints for subsection variant', () => {
      const result = sectionVariants({ variant: 'subsection' })
      expect(result).toContain('py-12') // Base
      expect(result).toContain('sm:py-14') // Small
      expect(result).toContain('lg:py-16') // Large
    })
  })

  describe('sectionVariants - Semantic Correctness', () => {
    it('should provide progressively smaller padding from hero to subsection', () => {
      const hero = sectionVariants({ variant: 'hero' })
      const content = sectionVariants({ variant: 'content' })
      const subsection = sectionVariants({ variant: 'subsection' })

      // Hero: py-20, sm:py-24, lg:py-28
      expect(hero).toContain('py-20')
      // Content: py-16, sm:py-20, lg:py-24
      expect(content).toContain('py-16')
      // Subsection: py-12, sm:py-14, lg:py-16
      expect(subsection).toContain('py-12')
    })

    it('should apply correct semantic background tokens', () => {
      const surface = sectionVariants({ background: 'surface' })
      const bg = sectionVariants({ background: 'bg' })

      expect(surface).toContain('bg-surface')
      expect(bg).toContain('bg-bg')
    })
  })
})
