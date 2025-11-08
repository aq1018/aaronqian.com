import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { linkVariants } from './Link.cva'

describe('Link.cva', () => {
  testDefaultVariants(linkVariants, [
    'transition-colors',
    'text-link',
    'underline',
    'decoration-transparent',
  ])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = linkVariants({ variant: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('transition-colors')
    })
  })
})
