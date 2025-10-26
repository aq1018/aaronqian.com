import { describe, expect, it } from 'vitest'

import { textVariants } from './typography.cva'

describe('Text Component', () => {
  describe('textVariants - Default Variants', () => {
    it('should apply default size (body)', () => {
      const result = textVariants()
      expect(result).toContain('text-base')
      expect(result).toContain('leading-7')
    })

    it('should apply default tone (inherit)', () => {
      const result = textVariants()
      expect(result).toContain('text-inherit')
    })

    it('should not apply uppercase by default', () => {
      const result = textVariants()
      expect(result).not.toContain('uppercase')
    })

    it('should not apply strong by default', () => {
      const result = textVariants()
      expect(result).not.toContain('font-semibold')
    })

    it('should not apply italic by default', () => {
      const result = textVariants()
      expect(result).not.toContain('italic')
    })

    it('should not apply strike by default', () => {
      const result = textVariants()
      expect(result).not.toContain('line-through')
    })
  })

  describe('textVariants - Size Prop', () => {
    it('should apply lead size', () => {
      const result = textVariants({ size: 'lead' })
      expect(result).toContain('text-lg')
      expect(result).toContain('leading-8')
    })

    it('should apply body size (default)', () => {
      const result = textVariants({ size: 'body' })
      expect(result).toContain('text-base')
      expect(result).toContain('leading-7')
    })

    it('should apply body-dense size', () => {
      const result = textVariants({ size: 'body-dense' })
      expect(result).toContain('text-base')
      expect(result).toContain('leading-6')
    })

    it('should apply small size', () => {
      const result = textVariants({ size: 'small' })
      expect(result).toContain('text-sm')
      expect(result).toContain('leading-6')
    })

    it('should apply small-dense size', () => {
      const result = textVariants({ size: 'small-dense' })
      expect(result).toContain('text-sm')
      expect(result).toContain('leading-5')
    })

    it('should apply micro size', () => {
      const result = textVariants({ size: 'micro' })
      expect(result).toContain('text-xs')
      expect(result).toContain('leading-5')
    })

    it('should apply label-lg size', () => {
      const result = textVariants({ size: 'label-lg' })
      expect(result).toContain('text-base')
      expect(result).toContain('leading-6')
      expect(result).toContain('tracking-wide')
    })

    it('should apply label size', () => {
      const result = textVariants({ size: 'label' })
      expect(result).toContain('text-sm')
      expect(result).toContain('leading-5')
      expect(result).toContain('tracking-wide')
    })

    it('should apply label-sm size', () => {
      const result = textVariants({ size: 'label-sm' })
      expect(result).toContain('text-xs')
      expect(result).toContain('leading-4')
      expect(result).toContain('tracking-wider')
    })
  })

  describe('textVariants - Align Prop', () => {
    it('should apply start alignment', () => {
      const result = textVariants({ align: 'start' })
      expect(result).toContain('text-start')
    })

    it('should apply center alignment', () => {
      const result = textVariants({ align: 'center' })
      expect(result).toContain('text-center')
    })

    it('should apply end alignment', () => {
      const result = textVariants({ align: 'end' })
      expect(result).toContain('text-end')
    })

    it('should apply justify alignment', () => {
      const result = textVariants({ align: 'justify' })
      expect(result).toContain('text-justify')
    })
  })

  describe('textVariants - Tone Prop', () => {
    it('should apply inherit tone (default)', () => {
      const result = textVariants({ tone: 'inherit' })
      expect(result).toContain('text-inherit')
    })

    it('should apply default tone', () => {
      const result = textVariants({ tone: 'default' })
      expect(result).toContain('text-fg')
    })

    it('should apply muted tone', () => {
      const result = textVariants({ tone: 'muted' })
      expect(result).toContain('text-muted')
    })

    it('should apply primary tone', () => {
      const result = textVariants({ tone: 'primary' })
      expect(result).toContain('text-primary')
    })

    it('should apply accent tone', () => {
      const result = textVariants({ tone: 'accent' })
      expect(result).toContain('text-accent')
    })
  })

  describe('textVariants - Boolean Style Props', () => {
    it('should apply uppercase when true', () => {
      const result = textVariants({ uppercase: true })
      expect(result).toContain('uppercase')
    })

    it('should not apply uppercase when false (default)', () => {
      const result = textVariants({ uppercase: false })
      expect(result).not.toContain('uppercase')
    })

    it('should apply strong when true', () => {
      const result = textVariants({ strong: true })
      expect(result).toContain('font-semibold')
    })

    it('should not apply strong when false (default)', () => {
      const result = textVariants({ strong: false })
      expect(result).not.toContain('font-semibold')
    })

    it('should apply italic when true', () => {
      const result = textVariants({ italic: true })
      expect(result).toContain('italic')
    })

    it('should not apply italic when false (default)', () => {
      const result = textVariants({ italic: false })
      expect(result).not.toContain('italic')
    })

    it('should apply strike when true', () => {
      const result = textVariants({ strike: true })
      expect(result).toContain('line-through')
    })

    it('should not apply strike when false (default)', () => {
      const result = textVariants({ strike: false })
      expect(result).not.toContain('line-through')
    })
  })

  describe('textVariants - Whitespace Prop', () => {
    it('should apply normal whitespace (default)', () => {
      const result = textVariants({ whitespace: 'normal' })
      expect(result).toContain('whitespace-normal')
    })

    it('should apply nowrap whitespace', () => {
      const result = textVariants({ whitespace: 'nowrap' })
      expect(result).toContain('whitespace-nowrap')
    })
  })

  describe('textVariants - Truncate Prop', () => {
    it('should not apply truncate when false (default)', () => {
      const result = textVariants({ truncate: false })
      expect(result).not.toContain('truncate')
    })

    it('should apply truncate when true', () => {
      const result = textVariants({ truncate: true })
      expect(result).toContain('truncate')
    })
  })

  describe('textVariants - Break Prop', () => {
    it('should apply normal break (default)', () => {
      const result = textVariants({ break: 'normal' })
      expect(result).toContain('break-normal')
    })

    it('should apply words break', () => {
      const result = textVariants({ break: 'words' })
      expect(result).toContain('break-words')
    })

    it('should apply all break', () => {
      const result = textVariants({ break: 'all' })
      expect(result).toContain('break-all')
    })
  })

  describe('textVariants - Combined Props', () => {
    it('should work with multiple props combined', () => {
      const result = textVariants({
        size: 'small',
        tone: 'muted',
        strong: true,
        uppercase: true,
        align: 'center',
      })
      expect(result).toContain('text-sm')
      expect(result).toContain('text-muted')
      expect(result).toContain('font-semibold')
      expect(result).toContain('uppercase')
      expect(result).toContain('text-center')
    })

    it('should work with all boolean styles combined', () => {
      const result = textVariants({
        uppercase: true,
        strong: true,
        italic: true,
        strike: true,
      })
      expect(result).toContain('uppercase')
      expect(result).toContain('font-semibold')
      expect(result).toContain('italic')
      expect(result).toContain('line-through')
    })
  })

  describe('textVariants - Label Variants', () => {
    it('should apply proper tracking for all label variants', () => {
      const result1 = textVariants({ size: 'label-lg' })
      const result2 = textVariants({ size: 'label' })
      const result3 = textVariants({ size: 'label-sm' })

      expect(result1).toContain('tracking-wide')
      expect(result2).toContain('tracking-wide')
      expect(result3).toContain('tracking-wider')
    })
  })

  describe('textVariants - Edge Cases', () => {
    it('should handle undefined size (use default)', () => {
      const result = textVariants({ size: undefined })
      expect(result).toContain('text-base') // Default body
    })

    it('should handle empty object (use all defaults)', () => {
      const result = textVariants({})
      expect(result).toContain('text-base')
      expect(result).toContain('leading-7')
      expect(result).toContain('text-inherit')
    })
  })
})
