import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { gridContainerCva, gridItemCva } from './Grid.cva'

describe('Grid.cva - Container', () => {
  testDefaultVariants(gridContainerCva, ['grid', 'grid-cols-12', 'gap-4'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = gridContainerCva({ columns: undefined, spacing: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('grid')
    })
  })
})

describe('Grid.cva - Item', () => {
  testDefaultVariants(gridItemCva, [])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = gridItemCva({ size: undefined, alignSelf: undefined })
      expect(result).toBe('')
    })
  })
})
