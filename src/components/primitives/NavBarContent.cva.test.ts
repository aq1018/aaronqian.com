import { describe, expect, it } from 'vitest'

import { navBarContentCva } from './NavBarContent.cva'

import {
  testAllVariants,
  testBaseClasses,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('NavBarContent.cva', () => {
  testBaseClasses(navBarContentCva, ['flex', 'flex-row', 'items-center', 'justify-between'])

  testDefaultVariants(navBarContentCva, ['h-16'])

  describe('Height Variants', () => {
    testAllVariants(navBarContentCva, 'height', ['sm', 'md', 'lg', 'xl'])

    it('should render sm height correctly', () => {
      expect(navBarContentCva({ height: 'sm' })).toContainClasses(['h-12'])
    })

    it('should render md height correctly', () => {
      expect(navBarContentCva({ height: 'md' })).toContainClasses(['h-16'])
    })

    it('should render lg height correctly', () => {
      expect(navBarContentCva({ height: 'lg' })).toContainClasses(['h-20'])
    })

    it('should render xl height correctly', () => {
      expect(navBarContentCva({ height: 'xl' })).toContainClasses(['h-24'])
    })
  })

  testEdgeCases(navBarContentCva, { height: 'md' }, ['h-16'])

  describe('Layout Consistency', () => {
    it('should maintain consistent base classes across all heights', () => {
      const sm = navBarContentCva({ height: 'sm' })
      const md = navBarContentCva({ height: 'md' })
      const lg = navBarContentCva({ height: 'lg' })
      const xl = navBarContentCva({ height: 'xl' })

      const baseClasses = ['flex', 'flex-row', 'items-center', 'justify-between']

      expect(sm).toContainClasses(baseClasses)
      expect(md).toContainClasses(baseClasses)
      expect(lg).toContainClasses(baseClasses)
      expect(xl).toContainClasses(baseClasses)
    })
  })

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for standard navigation bar', () => {
      expect(navBarContentCva({ height: 'md' })).toContainClasses([
        'h-16',
        'flex-row',
        'justify-between',
      ])
    })

    it('should provide appropriate styles for compact navigation bar', () => {
      expect(navBarContentCva({ height: 'sm' })).toContainClasses(['h-12', 'items-center'])
    })

    it('should provide appropriate styles for large hero navigation bar', () => {
      expect(navBarContentCva({ height: 'xl' })).toContainClasses(['h-24', 'justify-between'])
    })
  })
})
