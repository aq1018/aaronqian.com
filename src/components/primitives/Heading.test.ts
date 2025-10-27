import { describe, expect, it } from 'vitest'

import { headingVariants } from './typography.cva'

describe('Heading Component', () => {
  describe('headingVariants - Base Classes', () => {
    it('should include font-sans and tracking-tight in all variants', () => {
      const result = headingVariants()
      expect(result).toContain('font-sans')
      expect(result).toContain('tracking-tight')
    })
  })

  describe('headingVariants - Default Variants', () => {
    it('should apply default size (h2)', () => {
      const result = headingVariants()
      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
      expect(result).toContain('font-semibold')
    })

    it('should apply default tone (inherit)', () => {
      const result = headingVariants()
      expect(result).toContain('text-inherit')
    })

    it('should apply default whitespace (normal)', () => {
      const result = headingVariants()
      expect(result).toContain('whitespace-normal')
    })

    it('should apply default truncate (false)', () => {
      const result = headingVariants()
      expect(result).not.toContain('truncate')
    })

    it('should apply default break (normal)', () => {
      const result = headingVariants()
      expect(result).toContain('break-normal')
    })
  })

  describe('headingVariants - Size Prop', () => {
    it('should apply display-2 size', () => {
      const result = headingVariants({ size: 'display-2' })
      expect(result).toContain('text-6xl')
      expect(result).toContain('md:text-7xl')
      expect(result).toContain('font-bold')
      expect(result).toContain('leading-[0.95]')
    })

    it('should apply display-1 size', () => {
      const result = headingVariants({ size: 'display-1' })
      expect(result).toContain('text-5xl')
      expect(result).toContain('md:text-6xl')
      expect(result).toContain('font-bold')
      expect(result).toContain('leading-[0.98]')
    })

    it('should apply h1 size', () => {
      const result = headingVariants({ size: 'h1' })
      expect(result).toContain('text-4xl')
      expect(result).toContain('md:text-5xl')
      expect(result).toContain('font-semibold')
      expect(result).toContain('leading-tight')
    })

    it('should apply h2 size (default)', () => {
      const result = headingVariants({ size: 'h2' })
      expect(result).toContain('text-3xl')
      expect(result).toContain('md:text-4xl')
      expect(result).toContain('font-semibold')
    })

    it('should apply h3 size', () => {
      const result = headingVariants({ size: 'h3' })
      expect(result).toContain('text-2xl')
      expect(result).toContain('md:text-3xl')
      expect(result).toContain('font-semibold')
    })

    it('should apply h4 size', () => {
      const result = headingVariants({ size: 'h4' })
      expect(result).toContain('text-xl')
      expect(result).toContain('md:text-2xl')
      expect(result).toContain('font-medium')
    })

    it('should apply h5 size', () => {
      const result = headingVariants({ size: 'h5' })
      expect(result).toContain('text-lg')
      expect(result).toContain('font-medium')
      expect(result).toContain('leading-normal')
    })

    it('should apply h6 size', () => {
      const result = headingVariants({ size: 'h6' })
      expect(result).toContain('text-base')
      expect(result).toContain('font-medium')
      expect(result).toContain('leading-normal')
    })
  })

  describe('headingVariants - Align Prop', () => {
    it('should apply start alignment', () => {
      const result = headingVariants({ align: 'start' })
      expect(result).toContain('text-start')
    })

    it('should apply center alignment', () => {
      const result = headingVariants({ align: 'center' })
      expect(result).toContain('text-center')
    })

    it('should apply end alignment', () => {
      const result = headingVariants({ align: 'end' })
      expect(result).toContain('text-end')
    })
  })

  describe('headingVariants - Color Prop', () => {
    it('should apply inherit color (default)', () => {
      const result = headingVariants({ color: 'inherit' })
      expect(result).toContain('text-inherit')
    })

    it('should apply default color', () => {
      const result = headingVariants({ color: 'default' })
      expect(result).toContain('text-content')
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

  describe('headingVariants - Whitespace Prop', () => {
    it('should apply normal whitespace (default)', () => {
      const result = headingVariants({ whitespace: 'normal' })
      expect(result).toContain('whitespace-normal')
    })

    it('should apply nowrap whitespace', () => {
      const result = headingVariants({ whitespace: 'nowrap' })
      expect(result).toContain('whitespace-nowrap')
    })
  })

  describe('headingVariants - Truncate Prop', () => {
    it('should not apply truncate when false (default)', () => {
      const result = headingVariants({ truncate: false })
      expect(result).not.toContain('truncate')
    })

    it('should apply truncate when true', () => {
      const result = headingVariants({ truncate: true })
      expect(result).toContain('truncate')
    })
  })

  describe('headingVariants - Break Prop', () => {
    it('should apply normal break (default)', () => {
      const result = headingVariants({ break: 'normal' })
      expect(result).toContain('break-normal')
    })

    it('should apply words break', () => {
      const result = headingVariants({ break: 'words' })
      expect(result).toContain('break-words')
    })

    it('should apply all break', () => {
      const result = headingVariants({ break: 'all' })
      expect(result).toContain('break-all')
    })
  })

  describe('headingVariants - Combined Props', () => {
    it('should work with multiple props combined', () => {
      const result = headingVariants({
        size: 'h1',
        align: 'center',
        color: 'primary',
        truncate: true,
      })
      expect(result).toContain('text-4xl')
      expect(result).toContain('text-center')
      expect(result).toContain('text-primary')
      expect(result).toContain('truncate')
    })
  })

  describe('headingVariants - Edge Cases', () => {
    it('should handle undefined size (use default)', () => {
      const result = headingVariants({ size: undefined })
      expect(result).toContain('text-3xl') // Default h2
    })

    it('should handle empty object (use all defaults)', () => {
      const result = headingVariants({})
      expect(result).toContain('font-sans')
      expect(result).toContain('tracking-tight')
      expect(result).toContain('text-3xl') // h2
      expect(result).toContain('text-inherit')
    })
  })
})
