import { describe, expect, it } from 'vitest'

import { inlineCva } from './Inline.cva'

describe('Inline Component', () => {
  describe('inlineCva - Base Classes', () => {
    it('should include flex flex-row in all variants', () => {
      const result = inlineCva()
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
    })
  })

  describe('inlineCva - Default Variants', () => {
    it('should apply default space (md)', () => {
      const result = inlineCva()
      expect(result).toContain('gap-x-4')
      expect(result).toContain('md:gap-x-5')
      expect(result).toContain('lg:gap-x-6')
    })

    it('should apply default align (center)', () => {
      const result = inlineCva()
      expect(result).toContain('items-center')
    })

    it('should apply default justify (start)', () => {
      const result = inlineCva()
      expect(result).toContain('justify-start')
    })

    it('should apply default wrap (false/nowrap)', () => {
      const result = inlineCva()
      expect(result).toContain('flex-nowrap')
    })
  })

  describe('inlineCva - Space Prop', () => {
    it('should apply none space correctly', () => {
      const result = inlineCva({ space: 'none' })
      expect(result).toContain('gap-x-0')
    })

    it('should apply xs space with responsive values', () => {
      const result = inlineCva({ space: 'xs' })
      expect(result).toContain('gap-x-2')
      expect(result).toContain('md:gap-x-3')
    })

    it('should apply sm space with responsive values', () => {
      const result = inlineCva({ space: 'sm' })
      expect(result).toContain('gap-x-3')
      expect(result).toContain('md:gap-x-4')
      expect(result).toContain('lg:gap-x-5')
    })

    it('should apply md space with responsive values (default)', () => {
      const result = inlineCva({ space: 'md' })
      expect(result).toContain('gap-x-4')
      expect(result).toContain('md:gap-x-5')
      expect(result).toContain('lg:gap-x-6')
    })

    it('should apply lg space with responsive values', () => {
      const result = inlineCva({ space: 'lg' })
      expect(result).toContain('gap-x-5')
      expect(result).toContain('md:gap-x-6')
      expect(result).toContain('lg:gap-x-8')
    })

    it('should apply xl space with responsive values', () => {
      const result = inlineCva({ space: 'xl' })
      expect(result).toContain('gap-x-6')
      expect(result).toContain('md:gap-x-8')
      expect(result).toContain('lg:gap-x-10')
    })
  })

  describe('inlineCva - Align Prop', () => {
    it('should apply start alignment', () => {
      const result = inlineCva({ align: 'start' })
      expect(result).toContain('items-start')
    })

    it('should apply center alignment (default)', () => {
      const result = inlineCva({ align: 'center' })
      expect(result).toContain('items-center')
    })

    it('should apply end alignment', () => {
      const result = inlineCva({ align: 'end' })
      expect(result).toContain('items-end')
    })

    it('should apply stretch alignment', () => {
      const result = inlineCva({ align: 'stretch' })
      expect(result).toContain('items-stretch')
    })

    it('should apply baseline alignment', () => {
      const result = inlineCva({ align: 'baseline' })
      expect(result).toContain('items-baseline')
    })
  })

  describe('inlineCva - Justify Prop', () => {
    it('should apply start justify (default)', () => {
      const result = inlineCva({ justify: 'start' })
      expect(result).toContain('justify-start')
    })

    it('should apply center justify', () => {
      const result = inlineCva({ justify: 'center' })
      expect(result).toContain('justify-center')
    })

    it('should apply end justify', () => {
      const result = inlineCva({ justify: 'end' })
      expect(result).toContain('justify-end')
    })

    it('should apply between justify', () => {
      const result = inlineCva({ justify: 'between' })
      expect(result).toContain('justify-between')
    })

    it('should apply around justify', () => {
      const result = inlineCva({ justify: 'around' })
      expect(result).toContain('justify-around')
    })

    it('should apply evenly justify', () => {
      const result = inlineCva({ justify: 'evenly' })
      expect(result).toContain('justify-evenly')
    })
  })

  describe('inlineCva - Wrap Prop', () => {
    it('should apply flex-nowrap when false (default)', () => {
      const result = inlineCva({ wrap: false })
      expect(result).toContain('flex-nowrap')
    })

    it('should apply flex-wrap when true', () => {
      const result = inlineCva({ wrap: true })
      expect(result).toContain('flex-wrap')
    })
  })

  describe('inlineCva - Combined Props', () => {
    it('should work with space + align + justify + wrap combinations', () => {
      const result = inlineCva({
        space: 'lg',
        align: 'baseline',
        justify: 'between',
        wrap: true,
      })
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
      expect(result).toContain('gap-x-5')
      expect(result).toContain('items-baseline')
      expect(result).toContain('justify-between')
      expect(result).toContain('flex-wrap')
    })
  })

  describe('inlineCva - Edge Cases', () => {
    it('should handle undefined space (use default)', () => {
      const result = inlineCva({ space: undefined })
      expect(result).toContain('gap-x-4')
    })

    it('should handle undefined align (use default)', () => {
      const result = inlineCva({ align: undefined })
      expect(result).toContain('items-center')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = inlineCva({})
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
      expect(result).toContain('gap-x-4')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-start')
      expect(result).toContain('flex-nowrap')
    })
  })
})
