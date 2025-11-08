import { describe, expect, it } from 'vitest'

import {
  testAllVariants,
  testBaseClasses,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

import { surfaceCva } from './Surface.cva'

describe('Surface.cva', () => {
  testBaseClasses(surfaceCva, ['relative', 'w-full'])

  testDefaultVariants(surfaceCva, [
    'py-16', // padY: md
    'sm:py-20',
    'lg:py-24',
  ])

  describe('PadY Variants', () => {
    testAllVariants(surfaceCva, 'padY', ['none', 'sm', 'md', 'lg', 'xl'])

    it('should apply none padding', () => {
      expect(surfaceCva({ padY: 'none' })).toContainClasses(['py-0'])
    })

    it('should apply sm padding with responsive values', () => {
      expect(surfaceCva({ padY: 'sm' })).toContainClasses(['py-12', 'sm:py-14', 'lg:py-16'])
    })

    it('should apply md padding with responsive values', () => {
      expect(surfaceCva({ padY: 'md' })).toContainClasses(['py-16', 'sm:py-20', 'lg:py-24'])
    })

    it('should apply lg padding with responsive values', () => {
      expect(surfaceCva({ padY: 'lg' })).toContainClasses(['py-20', 'sm:py-24', 'lg:py-28'])
    })

    it('should apply xl padding with responsive values', () => {
      expect(surfaceCva({ padY: 'xl' })).toContainClasses(['py-24', 'sm:py-28', 'lg:py-32'])
    })
  })

  testEdgeCases(surfaceCva, { padY: 'md' }, ['relative', 'w-full', 'py-16'])

  describe('Consistency', () => {
    it('should maintain base classes across all padY variants', () => {
      const none = surfaceCva({ padY: 'none' })
      const sm = surfaceCva({ padY: 'sm' })
      const md = surfaceCva({ padY: 'md' })
      const lg = surfaceCva({ padY: 'lg' })
      const xl = surfaceCva({ padY: 'xl' })

      const baseClasses = ['relative', 'w-full']

      expect(none).toContainClasses(baseClasses)
      expect(sm).toContainClasses(baseClasses)
      expect(md).toContainClasses(baseClasses)
      expect(lg).toContainClasses(baseClasses)
      expect(xl).toContainClasses(baseClasses)
    })
  })

  describe('Responsive Padding', () => {
    it('should apply responsive padding for all non-none variants', () => {
      const padYs = ['sm', 'md', 'lg', 'xl'] as const
      padYs.forEach((padY) => {
        const result = surfaceCva({ padY })
        expect(result).toMatch(/py-\d+/)
        expect(result).toMatch(/sm:py-\d+/)
        expect(result).toMatch(/lg:py-\d+/)
      })
    })
  })
})
