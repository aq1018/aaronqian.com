import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { overlayCva } from './Overlay.cva'

describe('Overlay.cva', () => {
  testDefaultVariants(overlayCva, ['absolute', 'inset-0', 'pointer-events-none'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = overlayCva({ preset: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('absolute')
    })
  })
})
