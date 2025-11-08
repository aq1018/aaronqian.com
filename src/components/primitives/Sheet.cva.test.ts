import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { sheetCva } from './Sheet.cva'

describe('Sheet.cva', () => {
  testDefaultVariants(sheetCva, ['overflow-hidden', 'border-2', 'border-neutral', 'p-6'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = sheetCva({ color: undefined, padding: undefined, variant: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('overflow-hidden')
    })
  })
})
