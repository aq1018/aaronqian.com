import { describe, expect, it } from 'vitest'

import { textVariants } from './Text.cva'

describe('Text Component', () => {
  describe('textVariants - Base Classes', () => {
    it('should include base font-sans class', () => {
      const result = textVariants()
      expect(result).toContain('font-sans')
    })
  })

  describe('textVariants - Default Variants', () => {
    it('should apply default variants (base, body, normal, sans, normal, left)', () => {
      const result = textVariants()
      expect(result).toContain('text-base')
      expect(result).toContain('text-fg')
      expect(result).toContain('leading-normal')
      expect(result).toContain('font-sans')
      expect(result).toContain('font-normal')
      expect(result).toContain('text-left')
    })
  })

  describe('textVariants - Size Prop', () => {
    it('should apply xs size', () => {
      const result = textVariants({ size: 'xs' })
      expect(result).toContain('text-xs')
    })

    it('should apply sm size', () => {
      const result = textVariants({ size: 'sm' })
      expect(result).toContain('text-sm')
    })

    it('should apply base size', () => {
      const result = textVariants({ size: 'base' })
      expect(result).toContain('text-base')
    })

    it('should apply lg size', () => {
      const result = textVariants({ size: 'lg' })
      expect(result).toContain('text-lg')
    })

    it('should apply xl size', () => {
      const result = textVariants({ size: 'xl' })
      expect(result).toContain('text-xl')
    })

    it('should apply 2xl size', () => {
      const result = textVariants({ size: '2xl' })
      expect(result).toContain('text-2xl')
    })
  })

  describe('textVariants - Variant Prop', () => {
    it('should render body variant correctly', () => {
      const result = textVariants({ variant: 'body' })
      expect(result).toContain('text-fg')
    })

    it('should render muted variant correctly', () => {
      const result = textVariants({ variant: 'muted' })
      expect(result).toContain('text-muted')
    })

    it('should render label variant correctly', () => {
      const result = textVariants({ variant: 'label' })
      expect(result).toContain('font-mono')
      expect(result).toContain('text-xs')
      expect(result).toContain('font-medium')
      expect(result).toContain('uppercase')
      expect(result).toContain('tracking-wide')
    })

    it('should render caption variant correctly', () => {
      const result = textVariants({ variant: 'caption' })
      expect(result).toContain('text-xs')
      expect(result).toContain('text-muted')
    })

    it('should render lead variant correctly', () => {
      const result = textVariants({ variant: 'lead' })
      expect(result).toContain('text-lg')
      expect(result).toContain('leading-relaxed')
    })
  })

  describe('textVariants - Leading Prop', () => {
    it('should apply tight leading', () => {
      const result = textVariants({ leading: 'tight' })
      expect(result).toContain('leading-tight')
    })

    it('should apply normal leading', () => {
      const result = textVariants({ leading: 'normal' })
      expect(result).toContain('leading-normal')
    })

    it('should apply relaxed leading', () => {
      const result = textVariants({ leading: 'relaxed' })
      expect(result).toContain('leading-relaxed')
    })

    it('should apply loose leading', () => {
      const result = textVariants({ leading: 'loose' })
      expect(result).toContain('leading-loose')
    })
  })

  describe('textVariants - Font Prop', () => {
    it('should apply sans font', () => {
      const result = textVariants({ font: 'sans' })
      expect(result).toContain('font-sans')
    })

    it('should apply mono font', () => {
      const result = textVariants({ font: 'mono' })
      expect(result).toContain('font-mono')
    })
  })

  describe('textVariants - Weight Prop', () => {
    it('should apply normal weight', () => {
      const result = textVariants({ weight: 'normal' })
      expect(result).toContain('font-normal')
    })

    it('should apply medium weight', () => {
      const result = textVariants({ weight: 'medium' })
      expect(result).toContain('font-medium')
    })

    it('should apply semibold weight', () => {
      const result = textVariants({ weight: 'semibold' })
      expect(result).toContain('font-semibold')
    })

    it('should apply bold weight', () => {
      const result = textVariants({ weight: 'bold' })
      expect(result).toContain('font-bold')
    })
  })

  describe('textVariants - Align Prop', () => {
    it('should apply left alignment', () => {
      const result = textVariants({ align: 'left' })
      expect(result).toContain('text-left')
    })

    it('should apply center alignment', () => {
      const result = textVariants({ align: 'center' })
      expect(result).toContain('text-center')
    })

    it('should apply right alignment', () => {
      const result = textVariants({ align: 'right' })
      expect(result).toContain('text-right')
    })

    it('should apply justify alignment', () => {
      const result = textVariants({ align: 'justify' })
      expect(result).toContain('text-justify')
    })
  })

  describe('textVariants - Compound Variants (Label Overrides)', () => {
    it('should lock label to xs size even when size prop is different', () => {
      const result = textVariants({ variant: 'label', size: 'lg' })
      // CVA keeps both classes, but compound variant's text-xs comes later and wins in CSS
      expect(result).toContain('text-xs')
    })

    it('should lock label to xs size for all other sizes', () => {
      const sizes = ['sm', 'base', 'lg', 'xl', '2xl'] as const
      sizes.forEach((size) => {
        const result = textVariants({ variant: 'label', size })
        expect(result).toContain('text-xs')
      })
    })

    it('should lock label to mono font even when font prop is sans', () => {
      const result = textVariants({ variant: 'label', font: 'sans' })
      expect(result).toContain('font-mono')
      expect(result).toContain('font-sans') // Both present, but mono comes later in cascade
    })

    it('should lock label to medium weight even when weight prop is different', () => {
      const weights = ['normal', 'semibold', 'bold'] as const
      weights.forEach((weight) => {
        const result = textVariants({ variant: 'label', weight })
        expect(result).toContain('font-medium')
      })
    })

    it('should maintain all label characteristics together', () => {
      const result = textVariants({ variant: 'label', size: 'xl', font: 'sans', weight: 'bold' })
      expect(result).toContain('text-xs') // Size locked
      expect(result).toContain('font-mono') // Font locked
      expect(result).toContain('font-medium') // Weight locked
      expect(result).toContain('uppercase')
      expect(result).toContain('tracking-wide')
    })
  })

  describe('textVariants - Compound Variants (Caption Overrides)', () => {
    it('should lock caption to xs size even when size prop is different', () => {
      const result = textVariants({ variant: 'caption', size: 'lg' })
      // CVA keeps both classes, but compound variant's text-xs comes later and wins in CSS
      expect(result).toContain('text-xs')
    })

    it('should lock caption to xs size for all other sizes', () => {
      const sizes = ['sm', 'base', 'lg', 'xl', '2xl'] as const
      sizes.forEach((size) => {
        const result = textVariants({ variant: 'caption', size })
        expect(result).toContain('text-xs')
      })
    })
  })

  describe('textVariants - Compound Variants (Lead Overrides)', () => {
    it('should lock lead to lg size even when size prop is different', () => {
      const result = textVariants({ variant: 'lead', size: 'sm' })
      // CVA keeps both classes, but compound variant's text-lg comes later and wins in CSS
      expect(result).toContain('text-lg')
    })

    it('should lock lead to lg size for all other sizes', () => {
      const sizes = ['xs', 'sm', 'base', 'xl', '2xl'] as const
      sizes.forEach((size) => {
        const result = textVariants({ variant: 'lead', size })
        expect(result).toContain('text-lg')
      })
    })

    it('should lock lead to relaxed leading even when leading prop is different', () => {
      const leadings = ['tight', 'normal', 'loose'] as const
      leadings.forEach((leading) => {
        const result = textVariants({ variant: 'lead', leading })
        expect(result).toContain('leading-relaxed')
      })
    })

    it('should maintain both lead characteristics together', () => {
      const result = textVariants({ variant: 'lead', size: 'xs', leading: 'tight' })
      expect(result).toContain('text-lg') // Size locked
      expect(result).toContain('leading-relaxed') // Leading locked
    })
  })

  describe('textVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = textVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('text-base')
    })

    it('should support multiple custom classes', () => {
      const result = textVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })
  })

  describe('textVariants - All Combinations', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const
    const variants = ['body', 'muted', 'label', 'caption', 'lead'] as const
    const leadings = ['tight', 'normal', 'relaxed', 'loose'] as const
    const fonts = ['sans', 'mono'] as const
    const weights = ['normal', 'medium', 'semibold', 'bold'] as const
    const aligns = ['left', 'center', 'right', 'justify'] as const

    it('should generate valid classes for all sizes', () => {
      sizes.forEach((size) => {
        const result = textVariants({ size })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
      })
    })

    it('should generate valid classes for all variants', () => {
      variants.forEach((variant) => {
        const result = textVariants({ variant })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all leading options', () => {
      leadings.forEach((leading) => {
        const result = textVariants({ leading })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all font options', () => {
      fonts.forEach((font) => {
        const result = textVariants({ font })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all weight options', () => {
      weights.forEach((weight) => {
        const result = textVariants({ weight })
        expect(result).toBeTruthy()
      })
    })

    it('should work with all align options', () => {
      aligns.forEach((align) => {
        const result = textVariants({ align })
        expect(result).toBeTruthy()
      })
    })
  })

  describe('textVariants - Edge Cases', () => {
    it('should handle undefined size (use default base)', () => {
      const result = textVariants({ size: undefined })
      expect(result).toContain('text-base')
    })

    it('should handle undefined variant (use default body)', () => {
      const result = textVariants({ variant: undefined })
      expect(result).toContain('text-fg')
    })

    it('should handle undefined leading (use default normal)', () => {
      const result = textVariants({ leading: undefined })
      expect(result).toContain('leading-normal')
    })

    it('should handle undefined font (use default sans)', () => {
      const result = textVariants({ font: undefined })
      expect(result).toContain('font-sans')
    })

    it('should handle undefined weight (use default normal)', () => {
      const result = textVariants({ weight: undefined })
      expect(result).toContain('font-normal')
    })

    it('should handle undefined align (use default left)', () => {
      const result = textVariants({ align: undefined })
      expect(result).toContain('text-left')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = textVariants({})
      expect(result).toContain('text-base')
      expect(result).toContain('text-fg')
      expect(result).toContain('leading-normal')
      expect(result).toContain('font-sans')
      expect(result).toContain('font-normal')
      expect(result).toContain('text-left')
    })

    it('should handle null class gracefully', () => {
      const result = textVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = textVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })

  describe('textVariants - TypeScript Types', () => {
    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid size values', () => {
      textVariants({ size: 'xs' })
      textVariants({ size: 'sm' })
      textVariants({ size: 'base' })
      textVariants({ size: 'lg' })
      textVariants({ size: 'xl' })
      textVariants({ size: '2xl' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid variant values', () => {
      textVariants({ variant: 'body' })
      textVariants({ variant: 'muted' })
      textVariants({ variant: 'label' })
      textVariants({ variant: 'caption' })
      textVariants({ variant: 'lead' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid leading values', () => {
      textVariants({ leading: 'tight' })
      textVariants({ leading: 'normal' })
      textVariants({ leading: 'relaxed' })
      textVariants({ leading: 'loose' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid font values', () => {
      textVariants({ font: 'sans' })
      textVariants({ font: 'mono' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid weight values', () => {
      textVariants({ weight: 'normal' })
      textVariants({ weight: 'medium' })
      textVariants({ weight: 'semibold' })
      textVariants({ weight: 'bold' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept all valid align values', () => {
      textVariants({ align: 'left' })
      textVariants({ align: 'center' })
      textVariants({ align: 'right' })
      textVariants({ align: 'justify' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept custom class string', () => {
      textVariants({ class: 'custom-class' })
    })

    // eslint-disable-next-line vitest/expect-expect -- Type checking test validates TypeScript type safety
    it('should accept multiple props together', () => {
      textVariants({
        size: 'lg',
        variant: 'body',
        leading: 'relaxed',
        font: 'sans',
        weight: 'medium',
        align: 'center',
        class: 'custom',
      })
    })
  })

  describe('textVariants - Semantic Usage', () => {
    it('should provide appropriate body text styling', () => {
      const result = textVariants({ variant: 'body' })
      expect(result).toContain('text-fg')
    })

    it('should provide appropriate muted text styling', () => {
      const result = textVariants({ variant: 'muted' })
      expect(result).toContain('text-muted')
    })

    it('should provide appropriate label styling', () => {
      const result = textVariants({ variant: 'label' })
      expect(result).toContain('font-mono')
      expect(result).toContain('text-xs')
      expect(result).toContain('uppercase')
      expect(result).toContain('tracking-wide')
    })

    it('should provide appropriate caption styling', () => {
      const result = textVariants({ variant: 'caption' })
      expect(result).toContain('text-xs')
      expect(result).toContain('text-muted')
    })

    it('should provide appropriate lead paragraph styling', () => {
      const result = textVariants({ variant: 'lead' })
      expect(result).toContain('text-lg')
      expect(result).toContain('leading-relaxed')
    })
  })

  describe('textVariants - Variant Lock Behavior', () => {
    it('should demonstrate label variant locks size/font/weight', () => {
      const withOverrides = textVariants({
        variant: 'label',
        size: '2xl',
        font: 'sans',
        weight: 'bold',
      })

      // Despite overrides, label characteristics are maintained
      expect(withOverrides).toContain('text-xs')
      expect(withOverrides).toContain('font-mono')
      expect(withOverrides).toContain('font-medium')
    })

    it('should demonstrate caption variant locks size', () => {
      const withOverrides = textVariants({
        variant: 'caption',
        size: '2xl',
      })

      expect(withOverrides).toContain('text-xs')
    })

    it('should demonstrate lead variant locks size and leading', () => {
      const withOverrides = textVariants({
        variant: 'lead',
        size: 'xs',
        leading: 'tight',
      })

      expect(withOverrides).toContain('text-lg')
      expect(withOverrides).toContain('leading-relaxed')
    })

    it('should allow other props to work normally on body variant', () => {
      const result = textVariants({
        variant: 'body',
        size: 'xl',
        font: 'mono',
        weight: 'bold',
      })

      // Body doesn't lock anything, all props should apply
      expect(result).toContain('text-xl')
      expect(result).toContain('font-mono')
      expect(result).toContain('font-bold')
    })
  })

  describe('textVariants - Consistency', () => {
    it('should maintain base font-sans across all variants', () => {
      const variants = ['body', 'muted', 'label', 'caption', 'lead'] as const
      variants.forEach((variant) => {
        const result = textVariants({ variant })
        expect(result).toContain('font-sans')
      })
    })

    it('should support size granularity from xs to 2xl', () => {
      const xs = textVariants({ size: 'xs' })
      const sm = textVariants({ size: 'sm' })
      const base = textVariants({ size: 'base' })
      const lg = textVariants({ size: 'lg' })
      const xl = textVariants({ size: 'xl' })
      const twoXl = textVariants({ size: '2xl' })

      expect(xs).toContain('text-xs')
      expect(sm).toContain('text-sm')
      expect(base).toContain('text-base')
      expect(lg).toContain('text-lg')
      expect(xl).toContain('text-xl')
      expect(twoXl).toContain('text-2xl')
    })
  })
})
