import { describe, expect, it } from 'vitest'

import { clusterCva } from './Cluster.cva'

describe('Cluster Component', () => {
  describe('clusterCva - Base Classes', () => {
    it('should include inline-flex in all variants', () => {
      const result = clusterCva()
      expect(result).toContain('inline-flex')
    })
  })

  describe('clusterCva - Default Variants', () => {
    it('should apply default space (md/8px)', () => {
      const result = clusterCva()
      expect(result).toContain('gap-2')
    })

    it('should apply default align (center)', () => {
      const result = clusterCva()
      expect(result).toContain('items-center')
    })
  })

  describe('clusterCva - Space Prop', () => {
    it('should apply none space (0px)', () => {
      const result = clusterCva({ space: 'none' })
      expect(result).toContain('gap-0')
    })

    it('should apply xs space (4px)', () => {
      const result = clusterCva({ space: 'xs' })
      expect(result).toContain('gap-1')
    })

    it('should apply sm space (6px)', () => {
      const result = clusterCva({ space: 'sm' })
      expect(result).toContain('gap-1.5')
    })

    it('should apply md space (8px, default)', () => {
      const result = clusterCva({ space: 'md' })
      expect(result).toContain('gap-2')
    })

    it('should apply lg space (10px)', () => {
      const result = clusterCva({ space: 'lg' })
      expect(result).toContain('gap-2.5')
    })

    it('should apply xl space (12px)', () => {
      const result = clusterCva({ space: 'xl' })
      expect(result).toContain('gap-3')
    })
  })

  describe('clusterCva - Align Prop', () => {
    it('should apply center alignment (default)', () => {
      const result = clusterCva({ align: 'center' })
      expect(result).toContain('items-center')
    })

    it('should apply start alignment', () => {
      const result = clusterCva({ align: 'start' })
      expect(result).toContain('items-start')
    })

    it('should apply end alignment', () => {
      const result = clusterCva({ align: 'end' })
      expect(result).toContain('items-end')
    })

    it('should apply baseline alignment', () => {
      const result = clusterCva({ align: 'baseline' })
      expect(result).toContain('items-baseline')
    })
  })

  describe('clusterCva - Space + Align Combinations', () => {
    const spaces = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
    const aligns = ['center', 'start', 'end', 'baseline'] as const

    it('should work with all space and align combinations', () => {
      spaces.forEach((space) => {
        aligns.forEach((align) => {
          const result = clusterCva({ space, align })
          expect(result).toBeTruthy()
          expect(result).toContain('inline-flex')
          expect(result).toContain('gap-')
          expect(result).toContain('items-')
        })
      })
    })
  })

  describe('clusterCva - Edge Cases', () => {
    it('should handle undefined space (use default)', () => {
      const result = clusterCva({ space: undefined })
      expect(result).toContain('gap-2')
    })

    it('should handle undefined align (use default)', () => {
      const result = clusterCva({ align: undefined })
      expect(result).toContain('items-center')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = clusterCva({})
      expect(result).toContain('inline-flex')
      expect(result).toContain('gap-2')
      expect(result).toContain('items-center')
    })
  })

  describe('clusterCva - Fixed Spacing (Non-Responsive)', () => {
    it('should use fixed spacing values without breakpoints', () => {
      const spaces = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
      spaces.forEach((space) => {
        const result = clusterCva({ space })
        // Should NOT have responsive breakpoints
        expect(result).not.toMatch(/md:gap-/)
        expect(result).not.toMatch(/lg:gap-/)
      })
    })
  })
})
