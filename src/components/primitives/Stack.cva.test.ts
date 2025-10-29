import { describe, expect, it } from 'vitest'

import { stackCva } from './Stack.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Stack.cva', () => {
  testBaseClasses(stackCva, ['flex'])

  testDefaultVariants(stackCva, [
    'flex-col', // direction: column
    'gap-4', // space: md
    'md:gap-5',
    'lg:gap-6',
    'items-stretch', // align: stretch
    'justify-start', // justify: start
  ])

  describe('Direction Variants', () => {
    testAllVariants(stackCva, 'direction', ['row', 'column', 'row-reverse', 'column-reverse'])

    it('should apply row direction', () => {
      expect(stackCva({ direction: 'row' })).toContainClasses(['flex-row'])
    })

    it('should apply column direction', () => {
      expect(stackCva({ direction: 'column' })).toContainClasses(['flex-col'])
    })
  })

  describe('Responsive Direction Variants', () => {
    testAllVariants(stackCva, 'direction-sm', ['row', 'column', 'row-reverse', 'column-reverse'])
    testAllVariants(stackCva, 'direction-md', ['row', 'column', 'row-reverse', 'column-reverse'])
    testAllVariants(stackCva, 'direction-lg', ['row', 'column', 'row-reverse', 'column-reverse'])
    testAllVariants(stackCva, 'direction-xl', ['row', 'column', 'row-reverse', 'column-reverse'])

    it('should apply multiple responsive directions', () => {
      expect(
        stackCva({
          direction: 'column',
          'direction-md': 'row',
          'direction-xl': 'column',
        }),
      ).toContainClasses(['flex-col', 'md:flex-row', 'xl:flex-col'])
    })
  })

  describe('Space Variants', () => {
    testAllVariants(stackCva, 'space', ['none', 'xs', 'sm', 'md', 'lg', 'xl'])

    it('should apply none space', () => {
      expect(stackCva({ space: 'none' })).toContainClasses(['gap-0'])
    })

    it('should apply xs space with responsive values', () => {
      expect(stackCva({ space: 'xs' })).toContainClasses(['gap-2', 'md:gap-3'])
    })

    it('should apply md space with responsive values', () => {
      expect(stackCva({ space: 'md' })).toContainClasses(['gap-4', 'md:gap-5', 'lg:gap-6'])
    })
  })

  describe('Align Variants', () => {
    testAllVariants(stackCva, 'align', ['start', 'center', 'end', 'stretch', 'baseline'])

    it('should apply center alignment', () => {
      expect(stackCva({ align: 'center' })).toContainClasses(['items-center'])
    })

    it('should apply stretch alignment', () => {
      expect(stackCva({ align: 'stretch' })).toContainClasses(['items-stretch'])
    })
  })

  describe('Justify Variants', () => {
    testAllVariants(stackCva, 'justify', ['start', 'center', 'end', 'between', 'around', 'evenly'])

    it('should apply between justify', () => {
      expect(stackCva({ justify: 'between' })).toContainClasses(['justify-between'])
    })

    it('should apply center justify', () => {
      expect(stackCva({ justify: 'center' })).toContainClasses(['justify-center'])
    })
  })

  testCompoundVariants(stackCva, {
    direction: ['row', 'column'],
    space: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    align: ['start', 'center', 'end', 'stretch'],
    justify: ['start', 'center', 'end', 'between'],
  })

  testEdgeCases(
    stackCva,
    { direction: 'column', space: 'md', align: 'stretch', justify: 'start' },
    ['flex', 'flex-col', 'gap-4'],
  )

  describe('Real-World Usage', () => {
    it('should support mobile-first responsive direction', () => {
      expect(
        stackCva({
          direction: 'column',
          'direction-lg': 'row',
          space: 'md',
          align: 'center',
        }),
      ).toContainClasses(['flex', 'flex-col', 'lg:flex-row', 'gap-4', 'items-center'])
    })

    it('should combine all variants correctly', () => {
      expect(
        stackCva({
          direction: 'row',
          'direction-md': 'column',
          space: 'lg',
          align: 'center',
          justify: 'between',
        }),
      ).toContainClasses([
        'flex',
        'flex-row',
        'md:flex-col',
        'gap-5',
        'items-center',
        'justify-between',
      ])
    })
  })

  describe('Consistency', () => {
    it('should maintain flex base class across all variants', () => {
      expect(stackCva({ direction: 'row' })).toContain('flex')
      expect(stackCva({ direction: 'column' })).toContain('flex')
      expect(stackCva({ space: 'none' })).toContain('flex')
      expect(stackCva({ align: 'center' })).toContain('flex')
    })
  })
})
