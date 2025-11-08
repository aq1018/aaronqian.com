import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { bleedCva } from './Bleed.cva'

describe('Bleed.cva', () => {
  testDefaultVariants(bleedCva, ['-mx-6', 'md:-mx-10', 'lg:-mx-16'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = bleedCva({ size: undefined })
      expect(result).toBeTruthy()
    })
  })
})
