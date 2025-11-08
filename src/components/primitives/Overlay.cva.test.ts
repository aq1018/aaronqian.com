import { describe, expect, it } from 'vitest'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

import { overlayCva } from './Overlay.cva'

describe('Overlay.cva', () => {
  testBaseClasses(overlayCva, ['absolute', 'inset-0', 'pointer-events-none'])

  testDefaultVariants(overlayCva, [])

  describe('Preset Variants', () => {
    testAllVariants(overlayCva, 'preset', [
      'none',
      'soft',
      'medium',
      'strong',
      'top-fade',
      'bottom-fade',
      'radial-fade',
    ])

    it('should render soft preset correctly', () => {
      expect(overlayCva({ preset: 'soft' })).toContainClasses(['bg-background/20'])
    })

    it('should render medium preset correctly', () => {
      expect(overlayCva({ preset: 'medium' })).toContainClasses(['bg-background/40'])
    })

    it('should render strong preset correctly', () => {
      expect(overlayCva({ preset: 'strong' })).toContainClasses(['bg-background/60'])
    })

    it('should render top-fade preset correctly', () => {
      expect(overlayCva({ preset: 'top-fade' })).toContainClasses([
        'bg-gradient-to-b',
        'from-background/40',
        'to-transparent',
      ])
    })

    it('should render bottom-fade preset correctly', () => {
      expect(overlayCva({ preset: 'bottom-fade' })).toContainClasses([
        'bg-gradient-to-t',
        'from-background/40',
        'to-transparent',
      ])
    })

    it('should render radial-fade preset correctly', () => {
      expect(overlayCva({ preset: 'radial-fade' })).toContainClasses([
        'bg-radial',
        'from-transparent',
        'from-40%',
        'to-background',
      ])
    })
  })

  describe('Blur Variants', () => {
    testAllVariants(overlayCva, 'blur', ['none', 'sm', 'md', 'lg'])

    it('should render sm blur correctly', () => {
      expect(overlayCva({ blur: 'sm' })).toContainClasses(['backdrop-blur-sm'])
    })

    it('should render md blur correctly', () => {
      expect(overlayCva({ blur: 'md' })).toContainClasses(['backdrop-blur'])
    })

    it('should render lg blur correctly', () => {
      expect(overlayCva({ blur: 'lg' })).toContainClasses(['backdrop-blur-lg'])
    })
  })

  testCompoundVariants(overlayCva, {
    blur: ['none', 'sm', 'md', 'lg'],
    preset: ['none', 'soft', 'medium', 'strong', 'top-fade', 'bottom-fade', 'radial-fade'],
  })

  testEdgeCases(overlayCva, { blur: 'none', preset: 'none' }, ['absolute', 'inset-0'])

  describe('Glassmorphism Effect', () => {
    it('should create glassmorphism with soft preset and blur', () => {
      expect(overlayCva({ blur: 'lg', preset: 'soft' })).toContainClasses([
        'bg-background/20',
        'backdrop-blur-lg',
      ])
    })

    it('should create glassmorphism with medium preset and blur', () => {
      expect(overlayCva({ blur: 'md', preset: 'medium' })).toContainClasses([
        'bg-background/40',
        'backdrop-blur',
      ])
    })
  })

  describe('Consistency', () => {
    it('should maintain consistent base classes across all presets', () => {
      const soft = overlayCva({ preset: 'soft' })
      const medium = overlayCva({ preset: 'medium' })
      const topFade = overlayCva({ preset: 'top-fade' })

      const baseClasses = ['absolute', 'inset-0', 'pointer-events-none']

      expect(soft).toContainClasses(baseClasses)
      expect(medium).toContainClasses(baseClasses)
      expect(topFade).toContainClasses(baseClasses)
    })
  })
})
