import { describe, expect, it } from 'vitest'

import { insetCva } from './Inset.cva'

import {
  testAllVariants,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Inset.cva', () => {
  testDefaultVariants(insetCva, [
    'p-4', // Space md
    'md:p-5',
    'lg:p-6',
  ])

  describe('Space Variants', () => {
    testAllVariants(insetCva, 'space', ['none', 'xs', 'sm', 'md', 'lg', 'xl'])

    it('should render none space correctly', () => {
      expect(insetCva({ space: 'none' })).toContain('p-0')
    })

    it('should render xs space with responsive values', () => {
      expect(insetCva({ space: 'xs' })).toContainClasses(['p-2', 'md:p-3'])
    })

    it('should render md space with responsive values', () => {
      expect(insetCva({ space: 'md' })).toContainClasses(['p-4', 'md:p-5', 'lg:p-6'])
    })

    it('should render xl space with responsive values', () => {
      expect(insetCva({ space: 'xl' })).toContainClasses(['p-6', 'md:p-8', 'lg:p-10'])
    })
  })

  describe('Squish Variants', () => {
    testAllVariants(insetCva, 'squish', ['none', 'sm', 'md', 'lg'])

    it('should not apply squish when none', () => {
      const result = insetCva({ squish: 'none' })
      expect(result).not.toContain('py-2')
      expect(result).not.toContain('py-3')
      expect(result).not.toContain('py-4')
    })

    it('should render sm squish correctly', () => {
      expect(insetCva({ squish: 'sm' })).toContain('py-2')
    })

    it('should render md squish correctly', () => {
      expect(insetCva({ squish: 'md' })).toContain('py-3')
    })

    it('should render lg squish correctly', () => {
      expect(insetCva({ squish: 'lg' })).toContain('py-4')
    })
  })

  describe('Space + Squish Combinations', () => {
    it('should combine space and squish correctly', () => {
      expect(insetCva({ space: 'lg', squish: 'sm' })).toContainClasses(['p-5', 'py-2'])
    })

    testCompoundVariants(insetCva, {
      space: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      squish: ['none', 'sm', 'md', 'lg'],
    })
  })

  describe('Responsive Padding', () => {
    it('should apply responsive padding for xs with 2 breakpoints', () => {
      const result = insetCva({ space: 'xs' })
      expect(result).toMatch(/p-\d+/)
      expect(result).toMatch(/md:p-\d+/)
    })

    it('should apply responsive padding for sm/md/lg/xl with 3 breakpoints', () => {
      const spaces = ['sm', 'md', 'lg', 'xl'] as const
      spaces.forEach((space) => {
        const result = insetCva({ space })
        expect(result).toMatch(/p-\d+/)
        expect(result).toMatch(/md:p-\d+/)
        expect(result).toMatch(/lg:p-\d+/)
      })
    })
  })

  testEdgeCases(insetCva, { space: 'md', squish: 'none' }, ['p-4'])

  describe('Semantic Usage', () => {
    it('should provide appropriate padding for card content', () => {
      expect(insetCva({ space: 'md' })).toContainClasses(['p-4', 'md:p-5', 'lg:p-6'])
    })

    it('should provide squished padding for button-like layouts', () => {
      expect(insetCva({ space: 'md', squish: 'sm' })).toContainClasses(['p-4', 'py-2'])
    })
  })

  describe('Consistency', () => {
    it('should maintain consistent padding scale across breakpoints', () => {
      const sm = insetCva({ space: 'sm' })
      const md = insetCva({ space: 'md' })
      const lg = insetCva({ space: 'lg' })

      expect(sm).toMatch(/p-\d+/)
      expect(md).toMatch(/p-\d+/)
      expect(lg).toMatch(/p-\d+/)
    })
  })
})
