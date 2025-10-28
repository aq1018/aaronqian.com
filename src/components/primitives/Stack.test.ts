import { describe, expect, it } from 'vitest'

import { stackCva } from './Stack.cva'

describe('Stack Component', () => {
  describe('stackCva - Base Classes', () => {
    it('should include flex and default direction', () => {
      const result = stackCva()
      expect(result).toContain('flex')
      expect(result).toContain('flex-col') // Default direction=column
    })
  })

  describe('stackCva - Default Variants', () => {
    it('should apply default direction (column)', () => {
      const result = stackCva()
      expect(result).toContain('flex-col')
    })

    it('should apply default space (md)', () => {
      const result = stackCva()
      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
      expect(result).toContain('lg:gap-6')
    })

    it('should apply default align (stretch)', () => {
      const result = stackCva()
      expect(result).toContain('items-stretch')
    })

    it('should apply default justify (start)', () => {
      const result = stackCva()
      expect(result).toContain('justify-start')
    })
  })

  describe('stackCva - Direction Prop (direction)', () => {
    it('should apply row direction', () => {
      const result = stackCva({ direction: 'row' })
      expect(result).toContain('flex-row')
      expect(result).not.toContain('flex-col')
    })

    it('should apply column direction (default)', () => {
      const result = stackCva({ direction: 'column' })
      expect(result).toContain('flex-col')
    })

    it('should apply row-reverse direction', () => {
      const result = stackCva({ direction: 'row-reverse' })
      expect(result).toContain('flex-row-reverse')
    })

    it('should apply column-reverse direction', () => {
      const result = stackCva({ direction: 'column-reverse' })
      expect(result).toContain('flex-col-reverse')
    })
  })

  describe('stackCva - Responsive Direction (direction-sm/md/lg/xl)', () => {
    it('should apply sm breakpoint direction', () => {
      const result = stackCva({ direction: 'column', 'direction-sm': 'row' })
      expect(result).toContain('flex-col')
      expect(result).toContain('sm:flex-row')
    })

    it('should apply md breakpoint direction', () => {
      const result = stackCva({ direction: 'column', 'direction-md': 'row' })
      expect(result).toContain('flex-col')
      expect(result).toContain('md:flex-row')
    })

    it('should apply lg breakpoint direction', () => {
      const result = stackCva({ direction: 'column', 'direction-lg': 'row' })
      expect(result).toContain('flex-col')
      expect(result).toContain('lg:flex-row')
    })

    it('should apply xl breakpoint direction', () => {
      const result = stackCva({ direction: 'column', 'direction-xl': 'row' })
      expect(result).toContain('flex-col')
      expect(result).toContain('xl:flex-row')
    })

    it('should apply multiple breakpoint directions', () => {
      const result = stackCva({
        direction: 'column',
        'direction-md': 'row',
        'direction-xl': 'column',
      })
      expect(result).toContain('flex-col')
      expect(result).toContain('md:flex-row')
      expect(result).toContain('xl:flex-col')
    })
  })

  describe('stackCva - Space Prop', () => {
    it('should apply none space correctly', () => {
      const result = stackCva({ space: 'none' })
      expect(result).toContain('gap-0')
    })

    it('should apply xs space with responsive values', () => {
      const result = stackCva({ space: 'xs' })
      expect(result).toContain('gap-2') // 8px
      expect(result).toContain('md:gap-3') // 12px
    })

    it('should apply sm space with responsive values', () => {
      const result = stackCva({ space: 'sm' })
      expect(result).toContain('gap-3') // 12px
      expect(result).toContain('md:gap-4') // 16px
      expect(result).toContain('lg:gap-5') // 20px
    })

    it('should apply md space with responsive values (default)', () => {
      const result = stackCva({ space: 'md' })
      expect(result).toContain('gap-4') // 16px
      expect(result).toContain('md:gap-5') // 20px
      expect(result).toContain('lg:gap-6') // 24px
    })

    it('should apply lg space with responsive values', () => {
      const result = stackCva({ space: 'lg' })
      expect(result).toContain('gap-5') // 20px
      expect(result).toContain('md:gap-6') // 24px
      expect(result).toContain('lg:gap-8') // 32px
    })

    it('should apply xl space with responsive values', () => {
      const result = stackCva({ space: 'xl' })
      expect(result).toContain('gap-6') // 24px
      expect(result).toContain('md:gap-8') // 32px
      expect(result).toContain('lg:gap-10') // 40px
    })
  })

  describe('stackCva - Align Prop', () => {
    it('should apply start alignment', () => {
      const result = stackCva({ align: 'start' })
      expect(result).toContain('items-start')
    })

    it('should apply center alignment', () => {
      const result = stackCva({ align: 'center' })
      expect(result).toContain('items-center')
    })

    it('should apply end alignment', () => {
      const result = stackCva({ align: 'end' })
      expect(result).toContain('items-end')
    })

    it('should apply stretch alignment (default)', () => {
      const result = stackCva({ align: 'stretch' })
      expect(result).toContain('items-stretch')
    })

    it('should apply baseline alignment', () => {
      const result = stackCva({ align: 'baseline' })
      expect(result).toContain('items-baseline')
    })
  })

  describe('stackCva - Justify Prop', () => {
    it('should apply start justify (default)', () => {
      const result = stackCva({ justify: 'start' })
      expect(result).toContain('justify-start')
    })

    it('should apply center justify', () => {
      const result = stackCva({ justify: 'center' })
      expect(result).toContain('justify-center')
    })

    it('should apply end justify', () => {
      const result = stackCva({ justify: 'end' })
      expect(result).toContain('justify-end')
    })

    it('should apply between justify', () => {
      const result = stackCva({ justify: 'between' })
      expect(result).toContain('justify-between')
    })

    it('should apply around justify', () => {
      const result = stackCva({ justify: 'around' })
      expect(result).toContain('justify-around')
    })

    it('should apply evenly justify', () => {
      const result = stackCva({ justify: 'evenly' })
      expect(result).toContain('justify-evenly')
    })
  })

  describe('Real-World Usage Patterns', () => {
    it('should support mobile-first responsive direction', () => {
      const result = stackCva({
        direction: 'column',
        'direction-lg': 'row',
        space: 'md',
        align: 'center',
      })
      expect(result).toContain('flex')
      expect(result).toContain('flex-col')
      expect(result).toContain('lg:flex-row')
      expect(result).toContain('gap-4')
      expect(result).toContain('items-center')
    })

    it('should combine all variants correctly', () => {
      const result = stackCva({
        direction: 'row',
        'direction-md': 'column',
        'direction-xl': 'row',
        space: 'lg',
        align: 'center',
        justify: 'between',
      })
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
      expect(result).toContain('md:flex-col')
      expect(result).toContain('xl:flex-row')
      expect(result).toContain('gap-5')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-between')
    })
  })
})
