import { describe, expect, it } from 'vitest'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

import { sheetCva } from './Sheet.cva'

describe('Sheet.cva', () => {
  testBaseClasses(sheetCva, ['overflow-hidden'])

  testDefaultVariants(sheetCva, ['border-2', 'border-neutral', 'p-6'])

  describe('Variant Prop', () => {
    testAllVariants(sheetCva, 'variant', ['outline', 'soft', 'bar'])

    it('should render outline variant correctly', () => {
      expect(sheetCva({ variant: 'outline' })).toContainClasses(['border-2', 'rounded'])
    })

    it('should render soft variant correctly', () => {
      expect(sheetCva({ variant: 'soft' })).not.toContain('border-2')
    })

    it('should render bar variant correctly', () => {
      expect(sheetCva({ variant: 'bar' })).toContainClasses(['bg-transparent', 'border-l-2'])
    })
  })

  describe('Color Prop', () => {
    testAllVariants(sheetCva, 'color', [
      'primary',
      'accent',
      'secondary',
      'neutral',
      'danger',
      'success',
      'warning',
      'info',
    ])
  })

  describe('Padding Prop', () => {
    testAllVariants(sheetCva, 'padding', ['none', 'sm', 'md', 'lg'])

    it('should render none padding correctly', () => {
      expect(sheetCva({ padding: 'none' })).toContainClasses(['p-0'])
    })

    it('should render sm padding correctly', () => {
      expect(sheetCva({ padding: 'sm' })).toContainClasses(['p-4'])
    })

    it('should render md padding correctly', () => {
      expect(sheetCva({ padding: 'md' })).toContainClasses(['p-6'])
    })

    it('should render lg padding correctly', () => {
      expect(sheetCva({ padding: 'lg' })).toContainClasses(['p-8'])
    })
  })

  describe('Hover Prop', () => {
    it('should not apply transition by default', () => {
      expect(sheetCva()).not.toContain('transition-colors')
    })

    it('should apply transition when hover is true', () => {
      expect(sheetCva({ hover: true })).toContainClasses(['transition-colors'])
    })

    it('should not apply transition when hover is false', () => {
      expect(sheetCva({ hover: false })).not.toContain('transition-colors')
    })
  })

  describe('Compound Variants - Outline', () => {
    it('should render primary outline without hover', () => {
      expect(sheetCva({ color: 'primary', hover: false, variant: 'outline' })).toContainClasses([
        'border-2',
        'border-primary',
      ])
    })

    it('should render primary outline with hover', () => {
      expect(sheetCva({ color: 'primary', hover: true, variant: 'outline' })).toContainClasses([
        'border-primary',
        'hover:bg-primary/5',
        'transition-colors',
      ])
    })

    it('should render danger outline with hover', () => {
      expect(sheetCva({ color: 'danger', hover: true, variant: 'outline' })).toContainClasses([
        'border-danger',
        'hover:bg-danger/5',
      ])
    })
  })

  describe('Compound Variants - Soft', () => {
    it('should render primary soft without hover', () => {
      expect(sheetCva({ color: 'primary', hover: false, variant: 'soft' })).toContainClasses([
        'bg-primary/10',
      ])
    })

    it('should render primary soft with hover', () => {
      expect(sheetCva({ color: 'primary', hover: true, variant: 'soft' })).toContainClasses([
        'bg-primary/10',
        'hover:bg-primary/15',
        'transition-colors',
      ])
    })

    it('should render success soft with hover', () => {
      expect(sheetCva({ color: 'success', hover: true, variant: 'soft' })).toContainClasses([
        'bg-success/10',
        'hover:bg-success/15',
      ])
    })
  })

  describe('Compound Variants - Bar', () => {
    it('should render primary bar without hover', () => {
      expect(sheetCva({ color: 'primary', hover: false, variant: 'bar' })).toContainClasses([
        'bg-transparent',
        'border-l-2',
        'border-l-primary/30',
      ])
    })

    it('should render primary bar with hover', () => {
      expect(sheetCva({ color: 'primary', hover: true, variant: 'bar' })).toContainClasses([
        'bg-transparent',
        'border-l-2',
        'border-l-neutral/30',
        'hover:border-l-primary',
        'transition-colors',
      ])
    })

    it('should render danger bar with hover', () => {
      expect(sheetCva({ color: 'danger', hover: true, variant: 'bar' })).toContainClasses([
        'border-l-neutral/30',
        'hover:border-l-danger',
      ])
    })
  })

  // Test variant combinations (excluding hover boolean prop from testCompoundVariants)
  testCompoundVariants(sheetCva, {
    color: ['primary', 'accent', 'secondary', 'neutral', 'danger', 'success', 'warning', 'info'],
    variant: ['outline', 'soft', 'bar'],
  })

  describe('Hover Variants', () => {
    it('should generate valid classes for hover true', () => {
      const result = sheetCva({ hover: true })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for hover false', () => {
      const result = sheetCva({ hover: false })
      expect(result).toBeTruthy()
    })
  })

  testEdgeCases(sheetCva, { color: 'neutral', padding: 'md', variant: 'outline' }, [
    'border-neutral',
    'p-6',
  ])

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for empty states', () => {
      expect(
        sheetCva({ color: 'neutral', hover: false, padding: 'lg', variant: 'soft' }),
      ).toContainClasses(['bg-neutral/10', 'p-8'])
    })

    it('should provide appropriate styles for project list items', () => {
      expect(
        sheetCva({ color: 'neutral', hover: true, padding: 'sm', variant: 'bar' }),
      ).toContainClasses([
        'bg-transparent',
        'border-l-2',
        'border-l-neutral/30',
        'hover:border-l-neutral',
        'p-4',
        'transition-colors',
      ])
    })

    it('should provide appropriate styles for danger alerts', () => {
      expect(
        sheetCva({ color: 'danger', hover: false, padding: 'md', variant: 'outline' }),
      ).toContainClasses(['border-2', 'border-danger', 'p-6'])
    })
  })

  describe('Consistency', () => {
    it('should maintain overflow-hidden across all variants', () => {
      const outline = sheetCva({ variant: 'outline' })
      const soft = sheetCva({ variant: 'soft' })
      const bar = sheetCva({ variant: 'bar' })

      expect(outline).toContain('overflow-hidden')
      expect(soft).toContain('overflow-hidden')
      expect(bar).toContain('overflow-hidden')
    })

    it('should maintain consistent padding classes across variant types', () => {
      const outlineLg = sheetCva({ padding: 'lg', variant: 'outline' })
      const softLg = sheetCva({ padding: 'lg', variant: 'soft' })
      const barLg = sheetCva({ padding: 'lg', variant: 'bar' })

      expect(outlineLg).toContain('p-8')
      expect(softLg).toContain('p-8')
      expect(barLg).toContain('p-8')
    })
  })

  describe('Visual Hierarchy', () => {
    it('should have clear visual distinction between variants', () => {
      const outline = sheetCva({ color: 'primary', hover: true, variant: 'outline' })
      const soft = sheetCva({ color: 'primary', hover: true, variant: 'soft' })
      const bar = sheetCva({ color: 'primary', hover: true, variant: 'bar' })

      // Outline: border with hover background
      expect(outline).toContainClasses(['border-2', 'border-primary', 'hover:bg-primary/5'])

      // Soft: background with hover
      expect(soft).toContainClasses(['bg-primary/10', 'hover:bg-primary/15'])
      expect(soft).not.toContain('border-2')

      // Bar: left border with opacity shift
      expect(bar).toContainClasses([
        'bg-transparent',
        'border-l-2',
        'border-l-neutral/30',
        'hover:border-l-primary',
      ])
    })

    it('should have clear visual distinction between hover states', () => {
      const noHover = sheetCva({ color: 'primary', hover: false, variant: 'outline' })
      const withHover = sheetCva({ color: 'primary', hover: true, variant: 'outline' })

      expect(noHover).not.toContain('transition-colors')
      expect(noHover).not.toContain('hover:bg')

      expect(withHover).toContainClasses(['transition-colors', 'hover:bg-primary/5'])
    })
  })

  describe('Design Token Integration', () => {
    it('should use semantic color tokens for brand colors', () => {
      expect(sheetCva({ color: 'primary', variant: 'outline' })).toContain('border-primary')
      expect(sheetCva({ color: 'accent', variant: 'outline' })).toContain('border-accent')
      expect(sheetCva({ color: 'secondary', variant: 'outline' })).toContain('border-secondary')
    })

    it('should use semantic color tokens for status colors', () => {
      expect(sheetCva({ color: 'success', variant: 'soft' })).toContain('bg-success/10')
      expect(sheetCva({ color: 'warning', variant: 'soft' })).toContain('bg-warning/10')
      expect(sheetCva({ color: 'danger', variant: 'soft' })).toContain('bg-danger/10')
      expect(sheetCva({ color: 'info', variant: 'soft' })).toContain('bg-info/10')
    })
  })
})
