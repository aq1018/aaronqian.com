import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { dividerCva } from './Divider.cva'

describe('Divider.cva', () => {
  testDefaultVariants(dividerCva, ['w-full', 'border-t', 'border-border/65'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = dividerCva({ orientation: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('w-full')
    })
  })
})
