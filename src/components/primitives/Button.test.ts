import { describe, expect, it } from 'vitest'

import { buttonVariants } from './Button.cva'

describe('Button Component', () => {
  describe('buttonVariants - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = buttonVariants()
      expect(result).toContain('inline-flex')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-center')
      expect(result).toContain('gap-2')
      expect(result).toContain('rounded-lg')
      expect(result).toContain('font-medium')
      expect(result).toContain('transition-colors')
      expect(result).toContain('focus-visible:outline')
      expect(result).toContain('focus-visible:outline-2')
      expect(result).toContain('focus-visible:outline-offset-2')
      expect(result).toContain('disabled:cursor-not-allowed')
      expect(result).toContain('disabled:opacity-50')
    })
  })

  describe('buttonVariants - Default Variants', () => {
    it('should apply default variants (solid, primary, md)', () => {
      const result = buttonVariants()
      // Default: solid + primary
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-primary-content')
      expect(result).toContain('hover:brightness-90')
      expect(result).toContain('dark:hover:brightness-110')
      expect(result).toContain('disabled:hover:brightness-100')
      // Default size: md
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })
  })

  describe('buttonVariants - Variant Prop', () => {
    it('should render solid variant correctly', () => {
      const result = buttonVariants({ variant: 'solid', color: 'primary' })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-primary-content')
      expect(result).toContain('hover:brightness-90')
      expect(result).toContain('dark:hover:brightness-110')
    })

    it('should render outline variant correctly', () => {
      const result = buttonVariants({ variant: 'outline', color: 'primary' })
      expect(result).toContain('border-2')
      expect(result).toContain('bg-transparent')
      expect(result).toContain('border-primary')
      expect(result).toContain('text-primary')
      expect(result).toContain('hover:bg-primary/10')
    })

    it('should render soft variant correctly', () => {
      const result = buttonVariants({ variant: 'soft', color: 'primary' })
      expect(result).toContain('bg-primary/20')
      expect(result).toContain('text-primary')
      expect(result).toContain('hover:bg-primary/30')
    })

    it('should render ghost variant correctly', () => {
      const result = buttonVariants({ variant: 'ghost', color: 'primary' })
      expect(result).toContain('bg-transparent')
      expect(result).toContain('text-primary')
      expect(result).toContain('hover:bg-primary/10')
    })
  })

  describe('buttonVariants - Color Prop', () => {
    describe('Primary Color', () => {
      it('should apply primary solid styles', () => {
        const result = buttonVariants({ variant: 'solid', color: 'primary' })
        expect(result).toContain('bg-primary')
        expect(result).toContain('text-primary-content')
        expect(result).toContain('focus-visible:outline-primary')
        expect(result).toContain('hover:brightness-90')
        expect(result).toContain('dark:hover:brightness-110')
      })

      it('should apply primary outline styles', () => {
        const result = buttonVariants({ variant: 'outline', color: 'primary' })
        expect(result).toContain('border-primary')
        expect(result).toContain('text-primary')
        expect(result).toContain('focus-visible:outline-primary')
        expect(result).toContain('hover:bg-primary/10')
      })

      it('should apply primary soft styles', () => {
        const result = buttonVariants({ variant: 'soft', color: 'primary' })
        expect(result).toContain('bg-primary/20')
        expect(result).toContain('text-primary')
        expect(result).toContain('focus-visible:outline-primary')
        expect(result).toContain('hover:bg-primary/30')
      })

      it('should apply primary ghost styles', () => {
        const result = buttonVariants({ variant: 'ghost', color: 'primary' })
        expect(result).toContain('text-primary')
        expect(result).toContain('focus-visible:outline-primary')
        expect(result).toContain('hover:bg-primary/10')
      })
    })

    describe('Accent Color', () => {
      it('should apply accent solid styles', () => {
        const result = buttonVariants({ variant: 'solid', color: 'accent' })
        expect(result).toContain('bg-accent')
        expect(result).toContain('text-accent-content')
        expect(result).toContain('focus-visible:outline-accent')
        expect(result).toContain('hover:brightness-90')
        expect(result).toContain('dark:hover:brightness-110')
      })

      it('should apply accent outline styles', () => {
        const result = buttonVariants({ variant: 'outline', color: 'accent' })
        expect(result).toContain('border-accent')
        expect(result).toContain('text-accent')
        expect(result).toContain('focus-visible:outline-accent')
        expect(result).toContain('hover:bg-accent/10')
      })

      it('should apply accent soft styles', () => {
        const result = buttonVariants({ variant: 'soft', color: 'accent' })
        expect(result).toContain('bg-accent/20')
        expect(result).toContain('text-accent')
        expect(result).toContain('focus-visible:outline-accent')
        expect(result).toContain('hover:bg-accent/30')
      })

      it('should apply accent ghost styles', () => {
        const result = buttonVariants({ variant: 'ghost', color: 'accent' })
        expect(result).toContain('text-accent')
        expect(result).toContain('focus-visible:outline-accent')
        expect(result).toContain('hover:bg-accent/10')
      })
    })

    describe('Neutral Color', () => {
      it('should apply neutral solid styles', () => {
        const result = buttonVariants({ variant: 'solid', color: 'neutral' })
        expect(result).toContain('bg-neutral')
        expect(result).toContain('text-neutral-content')
        expect(result).toContain('focus-visible:outline-neutral')
        expect(result).toContain('hover:brightness-90')
        expect(result).toContain('dark:hover:brightness-110')
      })

      it('should apply neutral outline styles', () => {
        const result = buttonVariants({ variant: 'outline', color: 'neutral' })
        expect(result).toContain('border-neutral')
        expect(result).toContain('text-neutral')
        expect(result).toContain('focus-visible:outline-neutral')
        expect(result).toContain('hover:bg-neutral/10')
      })

      it('should apply neutral soft styles', () => {
        const result = buttonVariants({ variant: 'soft', color: 'neutral' })
        expect(result).toContain('bg-neutral/20')
        expect(result).toContain('text-neutral')
        expect(result).toContain('focus-visible:outline-neutral')
        expect(result).toContain('hover:bg-neutral/30')
      })

      it('should apply neutral ghost styles', () => {
        const result = buttonVariants({ variant: 'ghost', color: 'neutral' })
        expect(result).toContain('text-neutral')
        expect(result).toContain('focus-visible:outline-neutral')
        expect(result).toContain('hover:bg-neutral/10')
      })
    })
  })

  describe('buttonVariants - Size Prop', () => {
    it('should apply sm size correctly', () => {
      const result = buttonVariants({ size: 'sm' })
      expect(result).toContain('px-3')
      expect(result).toContain('py-1.5')
    })

    it('should apply md size correctly', () => {
      const result = buttonVariants({ size: 'md' })
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })

    it('should apply lg size correctly', () => {
      const result = buttonVariants({ size: 'lg' })
      expect(result).toContain('px-6')
      expect(result).toContain('py-3')
    })
  })

  describe('buttonVariants - FullWidth Prop', () => {
    it('should not apply full width by default', () => {
      const result = buttonVariants()
      expect(result).not.toContain('w-full')
    })

    it('should apply full width when true', () => {
      const result = buttonVariants({ fullWidth: true })
      expect(result).toContain('w-full')
    })

    it('should not apply full width when false', () => {
      const result = buttonVariants({ fullWidth: false })
      expect(result).not.toContain('w-full')
    })
  })

  describe('buttonVariants - Edge Cases', () => {
    it('should merge custom classes with variant classes', () => {
      const result = buttonVariants({ variant: 'solid', color: 'primary', class: 'custom-class' })
      expect(result).toContain('bg-primary')
      expect(result).toContain('custom-class')
    })

    it('should support multiple custom classes', () => {
      const result = buttonVariants({ class: 'class1 class2 class3' })
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })

    it('should combine variant and color correctly for primary solid', () => {
      const result = buttonVariants({ variant: 'solid', color: 'primary' })
      expect(result).toContain('bg-primary')
      expect(result).toContain('text-primary-content')
    })

    it('should combine variant and color correctly for accent outline', () => {
      const result = buttonVariants({ variant: 'outline', color: 'accent' })
      expect(result).toContain('border-accent')
      expect(result).toContain('text-accent')
    })

    it('should combine variant and color correctly for neutral ghost', () => {
      const result = buttonVariants({ variant: 'ghost', color: 'neutral' })
      expect(result).toContain('text-neutral')
      expect(result).toContain('bg-transparent')
    })

    it('should generate valid classes for all variant combinations', () => {
      const colors = ['primary', 'accent', 'neutral'] as const
      const variants = ['solid', 'outline', 'soft', 'ghost'] as const

      colors.forEach((color) => {
        variants.forEach((variant) => {
          const result = buttonVariants({ variant, color })
          expect(result).toBeTruthy()
          expect(result.length).toBeGreaterThan(0)
        })
      })
    })

    it('should apply correct size classes for all variants', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      sizes.forEach((size) => {
        const result = buttonVariants({ size })
        expect(result).toBeTruthy()
      })
    })

    it('should handle undefined variant (use default)', () => {
      const result = buttonVariants({ variant: undefined })
      expect(result).toContain('bg-primary') // default solid + primary
    })

    it('should handle undefined color (use default)', () => {
      const result = buttonVariants({ color: undefined })
      expect(result).toContain('bg-primary') // default solid + primary
    })

    it('should handle undefined size (use default)', () => {
      const result = buttonVariants({ size: undefined })
      expect(result).toContain('px-4') // default md
      expect(result).toContain('py-2')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = buttonVariants({})
      expect(result).toContain('bg-primary')
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
    })

    it('should handle null class gracefully', () => {
      const result = buttonVariants({ class: null })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = buttonVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })
})
