import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { insetCva } from './Inset.cva'

describe('Inset.cva', () => {
  testDefaultVariants(insetCva, ['p-4', 'md:p-5', 'lg:p-6'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = insetCva({ space: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('p-4')
    })
  })
})
