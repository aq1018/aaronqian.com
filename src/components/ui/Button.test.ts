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
      expect(result).toContain('bg-primary-600')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-primary-700')
      // Default size: md
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
      expect(result).toContain('text-base')
    })
  })

  describe('buttonVariants - Variant Prop', () => {
    it('should render solid variant correctly', () => {
      const result = buttonVariants({ variant: 'solid', color: 'primary' })
      expect(result).toContain('bg-primary-600')
      expect(result).toContain('text-white')
      expect(result).toContain('hover:bg-primary-700')
    })

    it('should render outline variant correctly', () => {
      const result = buttonVariants({ variant: 'outline', color: 'primary' })
      expect(result).toContain('border-2')
      expect(result).toContain('bg-transparent')
      expect(result).toContain('border-primary-600')
      expect(result).toContain('text-primary-700')
      expect(result).toContain('hover:bg-primary-50')
    })

    it('should render ghost variant correctly', () => {
      const result = buttonVariants({ variant: 'ghost', color: 'primary' })
      expect(result).toContain('bg-transparent')
      expect(result).toContain('text-primary-700')
      expect(result).toContain('hover:bg-primary-100')
    })
  })

  describe('buttonVariants - Color Prop', () => {
    describe('Primary Color', () => {
      it('should apply primary solid styles', () => {
        const result = buttonVariants({ variant: 'solid', color: 'primary' })
        expect(result).toContain('bg-primary-600')
        expect(result).toContain('text-white')
        expect(result).toContain('hover:bg-primary-700')
        expect(result).toContain('dark:bg-primary-500')
        expect(result).toContain('dark:hover:bg-primary-400')
      })

      it('should apply primary outline styles', () => {
        const result = buttonVariants({ variant: 'outline', color: 'primary' })
        expect(result).toContain('border-primary-600')
        expect(result).toContain('text-primary-700')
        expect(result).toContain('hover:bg-primary-50')
        expect(result).toContain('dark:border-primary-400')
        expect(result).toContain('dark:text-primary-300')
      })

      it('should apply primary ghost styles', () => {
        const result = buttonVariants({ variant: 'ghost', color: 'primary' })
        expect(result).toContain('text-primary-700')
        expect(result).toContain('hover:bg-primary-100')
        expect(result).toContain('dark:text-primary-300')
        expect(result).toContain('dark:hover:bg-primary-900')
      })
    })

    describe('Accent Color', () => {
      it('should apply accent solid styles', () => {
        const result = buttonVariants({ variant: 'solid', color: 'accent' })
        expect(result).toContain('bg-accent-500')
        expect(result).toContain('text-gray-900')
        expect(result).toContain('hover:bg-accent-600')
        expect(result).toContain('dark:bg-accent-600')
        expect(result).toContain('dark:hover:bg-accent-500')
      })

      it('should apply accent outline styles', () => {
        const result = buttonVariants({ variant: 'outline', color: 'accent' })
        expect(result).toContain('border-accent-600')
        expect(result).toContain('text-accent-700')
        expect(result).toContain('hover:bg-accent-50')
        expect(result).toContain('dark:border-accent-500')
        expect(result).toContain('dark:text-accent-400')
      })

      it('should apply accent ghost styles', () => {
        const result = buttonVariants({ variant: 'ghost', color: 'accent' })
        expect(result).toContain('text-accent-700')
        expect(result).toContain('hover:bg-accent-100')
        expect(result).toContain('dark:text-accent-400')
        expect(result).toContain('dark:hover:bg-accent-900')
      })
    })

    describe('Neutral Color', () => {
      it('should apply neutral solid styles', () => {
        const result = buttonVariants({ variant: 'solid', color: 'neutral' })
        expect(result).toContain('bg-gray-800')
        expect(result).toContain('text-white')
        expect(result).toContain('hover:bg-gray-900')
        expect(result).toContain('dark:bg-gray-200')
        expect(result).toContain('dark:text-gray-900')
      })

      it('should apply neutral outline styles', () => {
        const result = buttonVariants({ variant: 'outline', color: 'neutral' })
        expect(result).toContain('border-gray-400')
        expect(result).toContain('text-gray-700')
        expect(result).toContain('hover:bg-gray-100')
        expect(result).toContain('dark:border-gray-600')
        expect(result).toContain('dark:text-gray-300')
      })

      it('should apply neutral ghost styles', () => {
        const result = buttonVariants({ variant: 'ghost', color: 'neutral' })
        expect(result).toContain('text-fg')
        expect(result).toContain('hover:bg-gray-100')
        expect(result).toContain('dark:hover:bg-gray-900')
      })
    })
  })

  describe('buttonVariants - Size Prop', () => {
    it('should apply sm size correctly', () => {
      const result = buttonVariants({ size: 'sm' })
      expect(result).toContain('px-3')
      expect(result).toContain('py-1.5')
      expect(result).toContain('text-sm')
    })

    it('should apply md size correctly', () => {
      const result = buttonVariants({ size: 'md' })
      expect(result).toContain('px-4')
      expect(result).toContain('py-2')
      expect(result).toContain('text-base')
    })

    it('should apply lg size correctly', () => {
      const result = buttonVariants({ size: 'lg' })
      expect(result).toContain('px-6')
      expect(result).toContain('py-3')
      expect(result).toContain('text-lg')
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

  describe('buttonVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = buttonVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('bg-primary-600') // Default variant still applied
    })

    it('should support multiple custom classes', () => {
      const result = buttonVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })
  })

  describe('buttonVariants - Compound Variants', () => {
    it('should combine variant and color correctly for primary solid', () => {
      const result = buttonVariants({ variant: 'solid', color: 'primary' })
      expect(result).toContain('bg-primary-600')
      expect(result).toContain('hover:bg-primary-700')
      expect(result).toContain('focus-visible:outline-primary-600')
    })

    it('should combine variant and color correctly for accent outline', () => {
      const result = buttonVariants({ variant: 'outline', color: 'accent' })
      expect(result).toContain('border-accent-600')
      expect(result).toContain('hover:bg-accent-50')
      expect(result).toContain('focus-visible:outline-accent-600')
    })

    it('should combine variant and color correctly for neutral ghost', () => {
      const result = buttonVariants({ variant: 'ghost', color: 'neutral' })
      expect(result).toContain('text-fg')
      expect(result).toContain('hover:bg-gray-100')
    })
  })

  describe('buttonVariants - All Combinations', () => {
    const variants = ['solid', 'outline', 'ghost'] as const
    const colors = ['primary', 'accent', 'neutral'] as const
    const sizes = ['sm', 'md', 'lg'] as const

    it('should generate valid classes for all variant combinations', () => {
      variants.forEach((variant) => {
        colors.forEach((color) => {
          sizes.forEach((size) => {
            const result = buttonVariants({ variant, color, size })
            expect(result).toBeTruthy()
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
          })
        })
      })
    })

    it('should apply correct size classes for all variants', () => {
      variants.forEach((variant) => {
        const small = buttonVariants({ variant, size: 'sm' })
        const medium = buttonVariants({ variant, size: 'md' })
        const large = buttonVariants({ variant, size: 'lg' })

        expect(small).toContain('text-sm')
        expect(medium).toContain('text-base')
        expect(large).toContain('text-lg')
      })
    })
  })

  describe('buttonVariants - Edge Cases', () => {
    it('should handle undefined variant (use default)', () => {
      const result = buttonVariants({ variant: undefined })
      expect(result).toContain('bg-primary-600') // Default solid + primary
    })

    it('should handle undefined color (use default)', () => {
      const result = buttonVariants({ color: undefined })
      expect(result).toContain('bg-primary-600') // Default primary
    })

    it('should handle undefined size (use default)', () => {
      const result = buttonVariants({ size: undefined })
      expect(result).toContain('px-4')
      expect(result).toContain('text-base') // Default md
    })

    it('should handle empty object (use all defaults)', () => {
      const result = buttonVariants({})
      expect(result).toContain('bg-primary-600')
      expect(result).toContain('px-4')
      expect(result).toContain('text-base')
    })

    it('should handle null class gracefully', () => {
      const result = buttonVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = buttonVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })
})
