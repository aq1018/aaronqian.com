import { describe, expect, it } from 'vitest'

import {
  testAllVariants,
  testBaseClasses,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

import { bleedCva } from './Bleed.cva'

describe('Bleed.cva', () => {
  testBaseClasses(bleedCva, [])

  testDefaultVariants(bleedCva, ['-mx-6', 'md:-mx-10', 'lg:-mx-16'])

  describe('Size Variants', () => {
    testAllVariants(bleedCva, 'size', ['none', 'sm', 'md', 'lg', 'xl'])

    it('should apply none size (no negative margin)', () => {
      expect(bleedCva({ size: 'none' })).toContainClasses(['mx-0'])
    })

    it('should apply sm size (negates Container sm padX)', () => {
      expect(bleedCva({ size: 'sm' })).toContainClasses(['-mx-4', 'md:-mx-6'])
    })

    it('should apply md size (negates Container md padX)', () => {
      expect(bleedCva({ size: 'md' })).toContainClasses(['-mx-4', 'md:-mx-8', 'lg:-mx-12'])
    })

    it('should apply lg size (negates Container lg padX, default)', () => {
      expect(bleedCva({ size: 'lg' })).toContainClasses(['-mx-6', 'md:-mx-10', 'lg:-mx-16'])
    })

    it('should apply xl size (negates Container xl padX)', () => {
      expect(bleedCva({ size: 'xl' })).toContainClasses(['-mx-6', 'md:-mx-12', 'lg:-mx-20'])
    })
  })

  testEdgeCases(bleedCva, { size: 'lg' }, ['-mx-6'])

  describe('Container Integration', () => {
    it('should have size values that match Container padX values', () => {
      // sm negates Container sm (16px → 24px)
      expect(bleedCva({ size: 'sm' })).toContainClasses(['-mx-4', 'md:-mx-6'])

      // md negates Container md (16 → 32 → 48)
      expect(bleedCva({ size: 'md' })).toContainClasses(['-mx-4', 'md:-mx-8', 'lg:-mx-12'])

      // lg negates Container lg (24 → 40 → 64)
      expect(bleedCva({ size: 'lg' })).toContainClasses(['-mx-6', 'md:-mx-10', 'lg:-mx-16'])

      // xl negates Container xl (24 → 48 → 80)
      expect(bleedCva({ size: 'xl' })).toContainClasses(['-mx-6', 'md:-mx-12', 'lg:-mx-20'])
    })
  })
})
