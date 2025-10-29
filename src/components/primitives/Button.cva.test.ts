import { describe, expect, it } from 'vitest'

import { buttonVariants } from './Button.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Button.cva', () => {
  testBaseClasses(buttonVariants, [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-lg',
    'font-medium',
    'font-mono',
    'uppercase',
    'tracking-wider',
    'transition-colors',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ])

  testDefaultVariants(buttonVariants, [
    'bg-primary', // variant: solid, color: primary
    'text-primary-content',
    'px-4', // size: md
    'py-2',
  ])

  describe('Variant Prop', () => {
    testAllVariants(buttonVariants, 'variant', ['solid', 'outline', 'soft', 'ghost', 'link'])

    it('should render solid variant correctly', () => {
      expect(buttonVariants({ variant: 'solid', color: 'primary' })).toContainClasses([
        'bg-primary',
        'text-primary-content',
        'hover:brightness-90',
        'dark:hover:brightness-110',
      ])
    })

    it('should render outline variant correctly', () => {
      expect(buttonVariants({ variant: 'outline', color: 'primary' })).toContainClasses([
        'border-2',
        'bg-transparent',
        'border-primary',
        'text-primary',
        'hover:bg-primary/10',
      ])
    })

    it('should render soft variant correctly', () => {
      expect(buttonVariants({ variant: 'soft', color: 'primary' })).toContainClasses([
        'bg-primary/20',
        'text-primary',
        'hover:bg-primary/30',
      ])
    })

    it('should render ghost variant correctly', () => {
      expect(buttonVariants({ variant: 'ghost', color: 'primary' })).toContainClasses([
        'bg-transparent',
        'text-primary',
        'hover:bg-primary/10',
      ])
    })

    it('should render link variant correctly', () => {
      expect(buttonVariants({ variant: 'link', color: 'primary' })).toContainClasses([
        'bg-transparent',
        'underline-offset-4',
        'hover:underline',
        'text-primary',
      ])
    })
  })

  describe('Color Prop', () => {
    testAllVariants(buttonVariants, 'color', [
      'primary',
      'accent',
      'secondary',
      'neutral',
      'danger',
      'success',
      'warning',
      'info',
    ])

    it('should apply primary focus outline', () => {
      expect(buttonVariants({ color: 'primary' })).toContain('focus-visible:outline-primary')
    })

    it('should apply danger focus outline', () => {
      expect(buttonVariants({ color: 'danger' })).toContain('focus-visible:outline-danger')
    })
  })

  describe('Size Prop', () => {
    testAllVariants(buttonVariants, 'size', ['sm', 'md', 'lg'])

    it('should render sm size correctly', () => {
      expect(buttonVariants({ size: 'sm' })).toContainClasses(['px-3', 'py-1.5'])
    })

    it('should render md size correctly', () => {
      expect(buttonVariants({ size: 'md' })).toContainClasses(['px-4', 'py-2'])
    })

    it('should render lg size correctly', () => {
      expect(buttonVariants({ size: 'lg' })).toContainClasses(['px-6', 'py-3'])
    })
  })

  describe('FullWidth Prop', () => {
    it('should not apply full width by default', () => {
      expect(buttonVariants()).not.toContain('w-full')
    })

    it('should apply full width when true', () => {
      expect(buttonVariants({ fullWidth: true })).toContain('w-full')
    })
  })

  describe('Compound Variants - Solid', () => {
    it('should render primary solid correctly', () => {
      expect(buttonVariants({ variant: 'solid', color: 'primary' })).toContainClasses([
        'bg-primary',
        'text-primary-content',
      ])
    })

    it('should render danger solid correctly', () => {
      expect(buttonVariants({ variant: 'solid', color: 'danger' })).toContainClasses([
        'bg-danger',
        'text-danger-content',
      ])
    })

    it('should render success solid correctly', () => {
      expect(buttonVariants({ variant: 'solid', color: 'success' })).toContainClasses([
        'bg-success',
        'text-success-content',
      ])
    })
  })

  describe('Compound Variants - Outline', () => {
    it('should render primary outline correctly', () => {
      expect(buttonVariants({ variant: 'outline', color: 'primary' })).toContainClasses([
        'border-primary',
        'text-primary',
        'hover:bg-primary/10',
      ])
    })

    it('should render danger outline correctly', () => {
      expect(buttonVariants({ variant: 'outline', color: 'danger' })).toContainClasses([
        'border-danger',
        'text-danger',
        'hover:bg-danger/10',
      ])
    })
  })

  describe('Compound Variants - Soft', () => {
    it('should render primary soft correctly', () => {
      expect(buttonVariants({ variant: 'soft', color: 'primary' })).toContainClasses([
        'bg-primary/20',
        'text-primary',
        'hover:bg-primary/30',
      ])
    })

    it('should render danger soft correctly', () => {
      expect(buttonVariants({ variant: 'soft', color: 'danger' })).toContainClasses([
        'bg-danger/20',
        'text-danger',
        'hover:bg-danger/30',
      ])
    })
  })

  describe('Compound Variants - Ghost', () => {
    it('should render primary ghost correctly', () => {
      expect(buttonVariants({ variant: 'ghost', color: 'primary' })).toContainClasses([
        'text-primary',
        'hover:bg-primary/10',
      ])
    })

    it('should render danger ghost correctly', () => {
      expect(buttonVariants({ variant: 'ghost', color: 'danger' })).toContainClasses([
        'text-danger',
        'hover:bg-danger/10',
      ])
    })
  })

  describe('Compound Variants - Link', () => {
    it('should render primary link correctly', () => {
      expect(buttonVariants({ variant: 'link', color: 'primary' })).toContainClasses([
        'text-primary',
      ])
    })

    it('should render danger link correctly', () => {
      expect(buttonVariants({ variant: 'link', color: 'danger' })).toContainClasses(['text-danger'])
    })
  })

  testCompoundVariants(buttonVariants, {
    variant: ['solid', 'outline', 'soft', 'ghost', 'link'],
    color: ['primary', 'accent', 'secondary', 'neutral', 'danger', 'success', 'warning', 'info'],
  })

  testEdgeCases(buttonVariants, { variant: 'solid', color: 'primary', size: 'md' }, [
    'bg-primary',
    'px-4',
  ])

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for primary CTA', () => {
      expect(buttonVariants({ variant: 'solid', color: 'primary', size: 'lg' })).toContainClasses([
        'bg-primary',
        'text-primary-content',
        'px-6',
        'py-3',
      ])
    })

    it('should provide appropriate styles for destructive action', () => {
      expect(buttonVariants({ variant: 'outline', color: 'danger' })).toContainClasses([
        'border-danger',
        'text-danger',
      ])
    })

    it('should provide appropriate styles for inline text button', () => {
      expect(buttonVariants({ variant: 'link', color: 'primary', size: 'sm' })).toContainClasses([
        'text-primary',
        'underline-offset-4',
      ])
    })
  })

  describe('Accessibility', () => {
    it('should include focus-visible outline styles', () => {
      const result = buttonVariants()
      expect(result).toContainClasses([
        'focus-visible:outline',
        'focus-visible:outline-2',
        'focus-visible:outline-offset-2',
        'focus-visible:outline-primary',
      ])
    })

    it('should include disabled styles', () => {
      const result = buttonVariants()
      expect(result).toContainClasses(['disabled:cursor-not-allowed', 'disabled:opacity-50'])
    })
  })

  describe('Responsive Behavior', () => {
    it('should support full width for mobile layouts', () => {
      expect(buttonVariants({ fullWidth: true })).toContain('w-full')
    })

    it('should respect motion-reduce preferences', () => {
      expect(buttonVariants()).toContain('motion-reduce:transition-none')
    })
  })
})
