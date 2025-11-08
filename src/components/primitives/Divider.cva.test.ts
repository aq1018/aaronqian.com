import { describe, expect, it } from 'vitest'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

import { dividerCva } from './Divider.cva'

describe('Divider.cva', () => {
  testBaseClasses(dividerCva, [])

  testDefaultVariants(dividerCva, ['w-full', 'border-t', 'border-border/65'])

  describe('Orientation Variants', () => {
    testAllVariants(dividerCva, 'orientation', ['horizontal', 'vertical'])

    it('should apply horizontal orientation (default)', () => {
      const result = dividerCva({ orientation: 'horizontal' })
      expect(result).toContainClasses(['w-full', 'border-t'])
      expect(result).not.toContain('border-l')
    })

    it('should apply vertical orientation', () => {
      const result = dividerCva({ orientation: 'vertical' })
      expect(result).toContainClasses(['self-stretch', 'w-px', 'border-l'])
      expect(result).not.toContain('border-t')
    })
  })

  describe('Weight Variants', () => {
    testAllVariants(dividerCva, 'weight', ['subtle', 'default', 'strong'])

    it('should apply subtle weight (50% opacity)', () => {
      expect(dividerCva({ weight: 'subtle' })).toContainClasses(['border-border/50'])
    })

    it('should apply default weight (65% opacity)', () => {
      expect(dividerCva({ weight: 'default' })).toContainClasses(['border-border/65'])
    })

    it('should apply strong weight (80% opacity)', () => {
      expect(dividerCva({ weight: 'strong' })).toContainClasses(['border-border/80'])
    })
  })

  testCompoundVariants(dividerCva, {
    orientation: ['horizontal', 'vertical'],
    weight: ['subtle', 'default', 'strong'],
  })

  testEdgeCases(dividerCva, { orientation: 'horizontal', weight: 'default' }, [
    'w-full',
    'border-t',
  ])

  describe('Orientation + Weight Combinations', () => {
    it('should maintain orientation-specific classes with different weights', () => {
      const horizontalSubtle = dividerCva({ orientation: 'horizontal', weight: 'subtle' })
      expect(horizontalSubtle).toContainClasses(['w-full', 'border-t', 'border-border/50'])

      const verticalStrong = dividerCva({ orientation: 'vertical', weight: 'strong' })
      expect(verticalStrong).toContainClasses(['w-px', 'border-l', 'border-border/80'])
    })
  })
})
