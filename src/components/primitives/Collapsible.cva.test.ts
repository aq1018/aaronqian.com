import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { collapsibleContentVariants, collapsibleVariants } from './Collapsible.cva'

describe('Collapsible.cva', () => {
  describe('collapsibleVariants', () => {
    testDefaultVariants(collapsibleVariants, [
      'grid',
      'collapsible-wrapper',
      'transition-[grid-template-rows]',
    ])

    it('should handle undefined props gracefully', () => {
      const result = collapsibleVariants({ speed: undefined, bordered: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('grid')
    })
  })

  describe('collapsibleContentVariants', () => {
    testDefaultVariants(collapsibleContentVariants, ['overflow-hidden'])

    it('should handle undefined props gracefully', () => {
      const result = collapsibleContentVariants()
      expect(result).toBeTruthy()
      expect(result).toContain('overflow-hidden')
    })
  })
})
