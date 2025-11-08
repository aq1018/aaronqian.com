import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { surfaceCva } from './Surface.cva'

describe('Surface.cva', () => {
  testDefaultVariants(surfaceCva, ['relative', 'w-full', 'py-16', 'sm:py-20', 'lg:py-24'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = surfaceCva({ padY: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('relative')
    })
  })
})
