import { describe, expect, it } from 'vitest'

import { headingVariants } from './Heading.cva'

describe('Heading Component', () => {
  describe('headingVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = headingVariants()
      expect(result).toContain('font-sans')
      expect(result).toContain('tracking-tight')
    })
  })

  describe('headingVariants - Default Variants', () => {
    it('should apply default variants (h2, sans, bold, fg, left)', () => {
      const result = headingVariants()
      // Level h2
      expect(result).toContain('text-2xl')
      expect(result).toContain('sm:text-3xl')
      expect(result).toContain('md:text-4xl')
      // Font sans
      expect(result).toContain('font-sans')
      // Weight bold
      expect(result).toContain('font-bold')
      // Color fg
      expect(result).toContain('text-fg')
      // Align left
      expect(result).toContain('text-left')
    })
  })

  describe('headingVariants - Level Prop', () => {
    it('should render h1 with correct responsive sizes', () => {
      const result = headingVariants({ level: 'h1' })
      expect(result).toContain('text-3xl')
      expect(result).toContain('sm:text-4xl')
      expect(result).toContain('md:text-5xl')
      expect(result).toContain('lg:text-6xl')
      expect(result).toContain('font-bold')
    })

    it('should render h2 with correct responsive sizes', () => {
      const result = headingVariants({ level: 'h2' })
      expect(result).toContain('text-2xl')
      expect(result).toContain('sm:text-3xl')
      expect(result).toContain('md:text-4xl')
      expect(result).toContain('font-bold')
    })

    it('should render h3 with correct responsive sizes', () => {
      const result = headingVariants({ level: 'h3' })
      expect(result).toContain('text-xl')
      expect(result).toContain('sm:text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).toContain('font-semibold')
    })

    it('should render h4 with correct responsive sizes', () => {
      const result = headingVariants({ level: 'h4' })
      expect(result).toContain('text-lg')
      expect(result).toContain('sm:text-xl')
      expect(result).toContain('font-semibold')
    })

    it('should render h5 with correct responsive sizes', () => {
      const result = headingVariants({ level: 'h5' })
      expect(result).toContain('text-base')
      expect(result).toContain('sm:text-lg')
      expect(result).toContain('font-semibold')
    })

    it('should render h6 with correct responsive sizes', () => {
      const result = headingVariants({ level: 'h6' })
      expect(result).toContain('text-sm')
      expect(result).toContain('sm:text-base')
      expect(result).toContain('font-semibold')
    })
  })

  describe('headingVariants - Font Prop', () => {
    it('should apply sans font', () => {
      const result = headingVariants({ font: 'sans' })
      expect(result).toContain('font-sans')
    })

    it('should apply mono font', () => {
      const result = headingVariants({ font: 'mono' })
      expect(result).toContain('font-mono')
    })

    it('should override base font when mono is specified', () => {
      const result = headingVariants({ font: 'mono' })
      expect(result).toContain('font-mono')
      // Should still have font-sans from base, but font-mono will override it in CSS cascade
    })
  })

  describe('headingVariants - Weight Prop', () => {
    it('should apply normal weight', () => {
      const result = headingVariants({ weight: 'normal' })
      expect(result).toContain('font-normal')
    })

    it('should apply medium weight', () => {
      const result = headingVariants({ weight: 'medium' })
      expect(result).toContain('font-medium')
    })

    it('should apply semibold weight', () => {
      const result = headingVariants({ weight: 'semibold' })
      expect(result).toContain('font-semibold')
    })

    it('should apply bold weight', () => {
      const result = headingVariants({ weight: 'bold' })
      expect(result).toContain('font-bold')
    })
  })

  describe('headingVariants - Color Prop', () => {
    it('should apply fg color', () => {
      const result = headingVariants({ color: 'fg' })
      expect(result).toContain('text-fg')
    })

    it('should apply muted color', () => {
      const result = headingVariants({ color: 'muted' })
      expect(result).toContain('text-muted')
    })

    it('should apply primary color', () => {
      const result = headingVariants({ color: 'primary' })
      expect(result).toContain('text-primary')
    })

    it('should apply accent color', () => {
      const result = headingVariants({ color: 'accent' })
      expect(result).toContain('text-accent')
    })
  })

  describe('headingVariants - Align Prop', () => {
    it('should apply left alignment', () => {
      const result = headingVariants({ align: 'left' })
      expect(result).toContain('text-left')
    })

    it('should apply center alignment', () => {
      const result = headingVariants({ align: 'center' })
      expect(result).toContain('text-center')
    })

    it('should apply right alignment', () => {
      const result = headingVariants({ align: 'right' })
      expect(result).toContain('text-right')
    })
  })

  describe('headingVariants - Compound Variants (Weight Override)', () => {
    it('should override h1 default bold with normal', () => {
      const result = headingVariants({ level: 'h1', weight: 'normal' })
      expect(result).toContain('font-normal')
      expect(result).toContain('text-3xl')
    })

    it('should override h1 default bold with medium', () => {
      const result = headingVariants({ level: 'h1', weight: 'medium' })
      expect(result).toContain('font-medium')
    })

    it('should override h1 default bold with semibold', () => {
      const result = headingVariants({ level: 'h1', weight: 'semibold' })
      expect(result).toContain('font-semibold')
    })

    it('should override h2 default bold with normal', () => {
      const result = headingVariants({ level: 'h2', weight: 'normal' })
      expect(result).toContain('font-normal')
      expect(result).toContain('text-2xl')
    })

    it('should override h3 default semibold with normal', () => {
      const result = headingVariants({ level: 'h3', weight: 'normal' })
      expect(result).toContain('font-normal')
      expect(result).toContain('text-xl')
    })

    it('should override h3 default semibold with medium', () => {
      const result = headingVariants({ level: 'h3', weight: 'medium' })
      expect(result).toContain('font-medium')
    })

    it('should override h3 default semibold with bold', () => {
      const result = headingVariants({ level: 'h3', weight: 'bold' })
      expect(result).toContain('font-bold')
    })

    it('should override h6 default semibold with normal', () => {
      const result = headingVariants({ level: 'h6', weight: 'normal' })
      expect(result).toContain('font-normal')
      expect(result).toContain('text-sm')
    })
  })

  describe('headingVariants - Responsive Sizing', () => {
    it('should have responsive classes for h1', () => {
      const result = headingVariants({ level: 'h1' })
      expect(result).toContain('text-3xl') // Base
      expect(result).toContain('sm:text-4xl') // Small screens
      expect(result).toContain('md:text-5xl') // Medium screens
      expect(result).toContain('lg:text-6xl') // Large screens
    })

    it('should have responsive classes for h2', () => {
      const result = headingVariants({ level: 'h2' })
      expect(result).toContain('text-2xl')
      expect(result).toContain('sm:text-3xl')
      expect(result).toContain('md:text-4xl')
    })

    it('should have responsive classes for all levels', () => {
      const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
      levels.forEach((level) => {
        const result = headingVariants({ level })
        // Check that result contains at least one responsive class (sm:)
        expect(result).toMatch(/sm:text-/)
      })
    })
  })

  describe('headingVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = headingVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('text-2xl') // Default h2 level still applied
    })

    it('should support multiple custom classes', () => {
      const result = headingVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })
  })

  describe('headingVariants - All Combinations', () => {
    const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
    const fonts = ['sans', 'mono'] as const
    const weights = ['normal', 'medium', 'semibold', 'bold'] as const
    const colors = ['fg', 'muted', 'primary', 'accent'] as const
    const aligns = ['left', 'center', 'right'] as const

    it('should generate valid classes for all levels', () => {
      levels.forEach((level) => {
        const result = headingVariants({ level })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should work with all font options', () => {
      fonts.forEach((font) => {
        const result = headingVariants({ font })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all weight options', () => {
      weights.forEach((weight) => {
        const result = headingVariants({ weight })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all color options', () => {
      colors.forEach((color) => {
        const result = headingVariants({ color })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all align options', () => {
      aligns.forEach((align) => {
        const result = headingVariants({ align })
        expect(result).toBeTruthy()
      })
    })
  })

  describe('headingVariants - Edge Cases', () => {
    it('should handle undefined level (use default h2)', () => {
      const result = headingVariants({ level: undefined })
      expect(result).toContain('text-2xl')
      expect(result).toContain('sm:text-3xl')
    })

    it('should handle undefined font (use default sans)', () => {
      const result = headingVariants({ font: undefined })
      expect(result).toContain('font-sans')
    })

    it('should handle undefined weight (use default bold)', () => {
      const result = headingVariants({ weight: undefined })
      expect(result).toContain('font-bold')
    })

    it('should handle undefined color (use default fg)', () => {
      const result = headingVariants({ color: undefined })
      expect(result).toContain('text-fg')
    })

    it('should handle undefined align (use default left)', () => {
      const result = headingVariants({ align: undefined })
      expect(result).toContain('text-left')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = headingVariants({})
      expect(result).toContain('text-2xl') // h2
      expect(result).toContain('font-sans')
      expect(result).toContain('font-bold')
      expect(result).toContain('text-fg')
      expect(result).toContain('text-left')
    })

    it('should handle null class gracefully', () => {
      const result = headingVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = headingVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })

  describe('headingVariants - Semantic Usage', () => {
    it('should provide appropriate hierarchy sizing', () => {
      const h1 = headingVariants({ level: 'h1' })
      const h2 = headingVariants({ level: 'h2' })
      const h3 = headingVariants({ level: 'h3' })

      // h1 should be larger than h2, h2 larger than h3
      expect(h1).toContain('text-3xl')
      expect(h2).toContain('text-2xl')
      expect(h3).toContain('text-xl')
    })

    it('should support mono font for technical content', () => {
      const result = headingVariants({ font: 'mono' })
      expect(result).toContain('font-mono')
    })

    it('should support brand colors for emphasis', () => {
      const primary = headingVariants({ color: 'primary' })
      const accent = headingVariants({ color: 'accent' })

      expect(primary).toContain('text-primary')
      expect(accent).toContain('text-accent')
    })

    it('should support flexible alignment', () => {
      const left = headingVariants({ align: 'left' })
      const center = headingVariants({ align: 'center' })
      const right = headingVariants({ align: 'right' })

      expect(left).toContain('text-left')
      expect(center).toContain('text-center')
      expect(right).toContain('text-right')
    })
  })

  describe('headingVariants - Consistency', () => {
    it('should maintain consistent base styles across all levels', () => {
      const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const
      levels.forEach((level) => {
        const result = headingVariants({ level })
        expect(result).toContain('font-sans')
        expect(result).toContain('tracking-tight')
      })
    })

    it('should have consistent weight defaults for h1-h2', () => {
      const h1 = headingVariants({ level: 'h1' })
      const h2 = headingVariants({ level: 'h2' })
      expect(h1).toContain('font-bold')
      expect(h2).toContain('font-bold')
    })

    it('should have consistent weight defaults for h3-h6', () => {
      const h3 = headingVariants({ level: 'h3' })
      const h4 = headingVariants({ level: 'h4' })
      const h5 = headingVariants({ level: 'h5' })
      const h6 = headingVariants({ level: 'h6' })
      expect(h3).toContain('font-semibold')
      expect(h4).toContain('font-semibold')
      expect(h5).toContain('font-semibold')
      expect(h6).toContain('font-semibold')
    })
  })
})
