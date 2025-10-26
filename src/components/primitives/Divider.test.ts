import { describe, expect, it } from 'vitest'

import { dividerCva } from './Divider.cva'

describe('Divider Component', () => {
  describe('dividerCva - Default Variants', () => {
    it('should apply default orientation (horizontal)', () => {
      const result = dividerCva()
      expect(result).toContain('w-full')
      expect(result).toContain('border-t')
    })

    it('should apply default weight (default/65%)', () => {
      const result = dividerCva()
      expect(result).toContain('border-border/65')
    })
  })

  describe('dividerCva - Orientation Prop', () => {
    it('should apply horizontal orientation (default)', () => {
      const result = dividerCva({ orientation: 'horizontal' })
      expect(result).toContain('w-full')
      expect(result).toContain('border-t')
      expect(result).not.toContain('border-l')
    })

    it('should apply vertical orientation', () => {
      const result = dividerCva({ orientation: 'vertical' })
      expect(result).toContain('self-stretch')
      expect(result).toContain('w-px')
      expect(result).toContain('border-l')
      expect(result).not.toContain('border-t')
    })
  })

  describe('dividerCva - Weight Prop', () => {
    it('should apply subtle weight (50% opacity)', () => {
      const result = dividerCva({ weight: 'subtle' })
      expect(result).toContain('border-border/50')
    })

    it('should apply default weight (65% opacity)', () => {
      const result = dividerCva({ weight: 'default' })
      expect(result).toContain('border-border/65')
    })

    it('should apply strong weight (80% opacity)', () => {
      const result = dividerCva({ weight: 'strong' })
      expect(result).toContain('border-border/80')
    })
  })

  describe('dividerCva - Orientation + Weight Combinations', () => {
    it('should work with all orientation and weight combinations', () => {
      const orientations = ['horizontal', 'vertical'] as const
      const weights = ['subtle', 'default', 'strong'] as const

      orientations.forEach((orientation) => {
        weights.forEach((weight) => {
          const result = dividerCva({ orientation, weight })
          expect(result).toBeTruthy()
          expect(result).toContain('border-')
        })
      })
    })

    it('should maintain orientation-specific classes with different weights', () => {
      const horizontalSubtle = dividerCva({ orientation: 'horizontal', weight: 'subtle' })
      expect(horizontalSubtle).toContain('w-full')
      expect(horizontalSubtle).toContain('border-t')
      expect(horizontalSubtle).toContain('border-border/50')

      const verticalStrong = dividerCva({ orientation: 'vertical', weight: 'strong' })
      expect(verticalStrong).toContain('w-px')
      expect(verticalStrong).toContain('border-l')
      expect(verticalStrong).toContain('border-border/80')
    })
  })

  describe('dividerCva - Edge Cases', () => {
    it('should handle undefined orientation (use default)', () => {
      const result = dividerCva({ orientation: undefined })
      expect(result).toContain('w-full')
      expect(result).toContain('border-t') // Default horizontal
    })

    it('should handle undefined weight (use default)', () => {
      const result = dividerCva({ weight: undefined })
      expect(result).toContain('border-border/65') // Default weight
    })

    it('should handle empty object (use all defaults)', () => {
      const result = dividerCva({})
      expect(result).toContain('w-full')
      expect(result).toContain('border-t')
      expect(result).toContain('border-border/65')
    })
  })
})
