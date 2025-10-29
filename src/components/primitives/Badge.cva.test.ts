import { describe, expect, it } from 'vitest'

import { badgeVariants } from './Badge.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Badge.cva', () => {
  testBaseClasses(badgeVariants, [
    'inline-flex',
    'items-center',
    'rounded',
    'font-mono',
    'font-semibold',
    'whitespace-nowrap',
  ])

  testDefaultVariants(badgeVariants, [
    'text-xs', // Size sm
    'px-2',
    'py-1',
    'bg-neutral', // Color neutral
    'text-neutral-content', // Variant solid
  ])

  describe('Size Variants', () => {
    testAllVariants(badgeVariants, 'size', ['xs', 'sm', 'md'])

    it('should render xs size correctly', () => {
      expect(badgeVariants({ size: 'xs' })).toContainClasses(['text-xs', 'px-1.5', 'py-0.5'])
    })

    it('should render sm size correctly', () => {
      expect(badgeVariants({ size: 'sm' })).toContainClasses(['text-xs', 'px-2', 'py-1'])
    })

    it('should render md size correctly', () => {
      expect(badgeVariants({ size: 'md' })).toContainClasses(['text-sm', 'px-2.5', 'py-1'])
    })
  })

  describe('Color Variants', () => {
    testAllVariants(badgeVariants, 'color', [
      'primary',
      'accent',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
      'neutral',
      'muted',
    ])
  })

  describe('Style Variants', () => {
    testAllVariants(badgeVariants, 'variant', ['solid', 'outline', 'soft'])

    it('should apply outline variant correctly', () => {
      expect(badgeVariants({ variant: 'outline' })).toContainClasses(['bg-transparent'])
    })
  })

  describe('Compound Variants - Solid', () => {
    it('should render primary solid correctly', () => {
      expect(badgeVariants({ color: 'primary', variant: 'solid' })).toContainClasses([
        'bg-primary',
        'text-primary-content',
      ])
    })

    it('should render accent solid correctly', () => {
      expect(badgeVariants({ color: 'accent', variant: 'solid' })).toContainClasses([
        'bg-accent',
        'text-accent-content',
      ])
    })

    it('should render danger solid correctly', () => {
      expect(badgeVariants({ color: 'danger', variant: 'solid' })).toContainClasses([
        'bg-danger',
        'text-danger-content',
      ])
    })

    it('should render muted solid correctly', () => {
      expect(badgeVariants({ color: 'muted', variant: 'solid' })).toContainClasses([
        'bg-muted/20',
        'text-muted',
      ])
    })
  })

  describe('Compound Variants - Outline', () => {
    it('should render primary outline correctly', () => {
      expect(badgeVariants({ color: 'primary', variant: 'outline' })).toContainClasses([
        'border-2',
        'border-primary',
        'text-primary',
        'bg-transparent',
      ])
    })

    it('should render danger outline correctly', () => {
      expect(badgeVariants({ color: 'danger', variant: 'outline' })).toContainClasses([
        'border-2',
        'border-danger',
        'text-danger',
        'bg-transparent',
      ])
    })

    it('should render muted outline correctly', () => {
      expect(badgeVariants({ color: 'muted', variant: 'outline' })).toContainClasses([
        'border-2',
        'border-muted',
        'text-muted',
        'bg-transparent',
      ])
    })
  })

  describe('Compound Variants - Soft', () => {
    it('should render primary soft correctly', () => {
      expect(badgeVariants({ color: 'primary', variant: 'soft' })).toContainClasses([
        'bg-primary/20',
        'text-primary',
      ])
    })

    it('should render success soft correctly', () => {
      expect(badgeVariants({ color: 'success', variant: 'soft' })).toContainClasses([
        'bg-success/20',
        'text-success',
      ])
    })

    it('should render muted soft correctly', () => {
      expect(badgeVariants({ color: 'muted', variant: 'soft' })).toContainClasses([
        'bg-muted/10',
        'text-muted',
      ])
    })
  })

  describe('Pulse Modifier', () => {
    it('should not apply pulse animation by default', () => {
      const result = badgeVariants()
      expect(result).not.toContain('animate-pulse-subtle')
    })

    it('should apply pulse animation when true', () => {
      expect(badgeVariants({ pulse: true })).toContainClasses(['animate-pulse-subtle'])
    })

    it('should work with pulse on primary color', () => {
      expect(badgeVariants({ color: 'primary', pulse: true })).toContainClasses([
        'bg-primary',
        'animate-pulse-subtle',
      ])
    })
  })

  describe('Uppercase Modifier', () => {
    it('should not apply uppercase by default', () => {
      const result = badgeVariants()
      expect(result).not.toContain('uppercase')
      expect(result).not.toContain('tracking-wider')
    })

    it('should apply uppercase when true', () => {
      expect(badgeVariants({ uppercase: true })).toContainClasses(['uppercase', 'tracking-wider'])
    })
  })

  describe('Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      expect(badgeVariants({ class: 'custom-class' })).toContainClasses([
        'custom-class',
        'bg-neutral', // Default color
      ])
    })

    it('should support multiple custom classes', () => {
      expect(badgeVariants({ class: 'custom-1 custom-2 custom-3' })).toContainClasses([
        'custom-1',
        'custom-2',
        'custom-3',
      ])
    })
  })

  testCompoundVariants(badgeVariants, {
    color: [
      'primary',
      'accent',
      'secondary',
      'success',
      'warning',
      'danger',
      'info',
      'neutral',
      'muted',
    ],
    variant: ['solid', 'outline', 'soft'],
  })

  testEdgeCases(badgeVariants, { size: 'sm', color: 'neutral', variant: 'solid' }, [
    'bg-neutral',
    'text-xs',
  ])

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for LIVE status badges', () => {
      expect(badgeVariants({ color: 'primary', pulse: true })).toContainClasses([
        'bg-primary',
        'text-primary-content',
        'animate-pulse-subtle',
      ])
    })

    it('should provide appropriate styles for status labels', () => {
      expect(
        badgeVariants({ color: 'primary', variant: 'outline', uppercase: true }),
      ).toContainClasses(['border-primary', 'uppercase', 'tracking-wider'])
    })

    it('should provide appropriate styles for content tags', () => {
      expect(badgeVariants({ color: 'muted', variant: 'soft' })).toContainClasses([
        'bg-muted/10',
        'text-muted',
      ])
    })
  })

  describe('Consistency', () => {
    it('should maintain consistent base classes across all variants', () => {
      const primary = badgeVariants({ color: 'primary' })
      const muted = badgeVariants({ color: 'muted' })
      const success = badgeVariants({ color: 'success' })

      const baseClasses = ['inline-flex', 'items-center', 'rounded', 'font-mono', 'font-semibold']

      expect(primary).toContainClasses(baseClasses)
      expect(muted).toContainClasses(baseClasses)
      expect(success).toContainClasses(baseClasses)
    })

    it('should maintain consistent size classes across color variants', () => {
      const primarySm = badgeVariants({ color: 'primary', size: 'sm' })
      const mutedSm = badgeVariants({ color: 'muted', size: 'sm' })

      const sizeClasses = ['text-xs', 'px-2']

      expect(primarySm).toContainClasses(sizeClasses)
      expect(mutedSm).toContainClasses(sizeClasses)
    })
  })

  describe('Visual Hierarchy', () => {
    it('should have clear visual distinction between variants', () => {
      const solid = badgeVariants({ color: 'primary', variant: 'solid' })
      const outline = badgeVariants({ color: 'primary', variant: 'outline' })
      const soft = badgeVariants({ color: 'primary', variant: 'soft' })

      // Solid: filled background
      expect(solid).toContain('bg-primary')
      expect(solid).not.toContain('bg-transparent')

      // Outline: transparent background with border
      expect(outline).toContainClasses(['bg-transparent', 'border-2'])

      // Soft: subtle background
      expect(soft).toContain('bg-primary/20')
      expect(soft).not.toContain('bg-transparent')
    })

    it('should have clear visual distinction between semantic colors', () => {
      const success = badgeVariants({ color: 'success' })
      const danger = badgeVariants({ color: 'danger' })
      const warning = badgeVariants({ color: 'warning' })

      expect(success).toContain('bg-success')
      expect(danger).toContain('bg-danger')
      expect(warning).toContain('bg-warning')
    })
  })

  describe('Design Token Integration', () => {
    it('should use semantic color tokens for brand colors', () => {
      expect(badgeVariants({ color: 'primary' })).toContainClasses([
        'bg-primary',
        'text-primary-content',
      ])
      expect(badgeVariants({ color: 'accent' })).toContainClasses([
        'bg-accent',
        'text-accent-content',
      ])
      expect(badgeVariants({ color: 'secondary' })).toContainClasses([
        'bg-secondary',
        'text-secondary-content',
      ])
    })

    it('should use semantic color tokens for status colors', () => {
      expect(badgeVariants({ color: 'success' })).toContain('bg-success')
      expect(badgeVariants({ color: 'warning' })).toContain('bg-warning')
      expect(badgeVariants({ color: 'danger' })).toContain('bg-danger')
      expect(badgeVariants({ color: 'info' })).toContain('bg-info')
    })

    it('should use content pairing for accessible contrast', () => {
      expect(badgeVariants({ color: 'primary', variant: 'solid' })).toContain(
        'text-primary-content',
      )
      expect(badgeVariants({ color: 'success', variant: 'solid' })).toContain(
        'text-success-content',
      )
    })
  })
})
