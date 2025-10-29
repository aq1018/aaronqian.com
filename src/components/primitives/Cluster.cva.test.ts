import { describe, expect, it } from 'vitest'

import { clusterCva } from './Cluster.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Cluster.cva', () => {
  testBaseClasses(clusterCva, ['inline-flex'])

  testDefaultVariants(clusterCva, ['gap-2', 'items-center'])

  describe('Space Variants', () => {
    testAllVariants(clusterCva, 'space', ['none', 'xs', 'sm', 'md', 'lg', 'xl'])

    it('should apply none space (0px)', () => {
      expect(clusterCva({ space: 'none' })).toContainClasses(['gap-0'])
    })

    it('should apply xs space (4px)', () => {
      expect(clusterCva({ space: 'xs' })).toContainClasses(['gap-1'])
    })

    it('should apply sm space (6px)', () => {
      expect(clusterCva({ space: 'sm' })).toContainClasses(['gap-1.5'])
    })

    it('should apply md space (8px, default)', () => {
      expect(clusterCva({ space: 'md' })).toContainClasses(['gap-2'])
    })

    it('should apply lg space (10px)', () => {
      expect(clusterCva({ space: 'lg' })).toContainClasses(['gap-2.5'])
    })

    it('should apply xl space (12px)', () => {
      expect(clusterCva({ space: 'xl' })).toContainClasses(['gap-3'])
    })
  })

  describe('Align Variants', () => {
    testAllVariants(clusterCva, 'align', ['center', 'start', 'end', 'baseline'])

    it('should apply center alignment (default)', () => {
      expect(clusterCva({ align: 'center' })).toContainClasses(['items-center'])
    })

    it('should apply start alignment', () => {
      expect(clusterCva({ align: 'start' })).toContainClasses(['items-start'])
    })

    it('should apply end alignment', () => {
      expect(clusterCva({ align: 'end' })).toContainClasses(['items-end'])
    })

    it('should apply baseline alignment', () => {
      expect(clusterCva({ align: 'baseline' })).toContainClasses(['items-baseline'])
    })
  })

  testCompoundVariants(clusterCva, {
    space: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    align: ['center', 'start', 'end', 'baseline'],
  })

  testEdgeCases(clusterCva, { space: 'md', align: 'center' }, ['inline-flex', 'gap-2'])

  describe('Fixed Spacing', () => {
    it('should use fixed spacing values without responsive breakpoints', () => {
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
