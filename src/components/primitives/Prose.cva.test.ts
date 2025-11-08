import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { proseCva } from './Prose.cva'

describe('Prose.cva', () => {
  testDefaultVariants(proseCva, ['max-w-none', 'font-mono', 'leading-relaxed', 'text-muted'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = proseCva()
      expect(result).toBeTruthy()
      expect(result).toContain('max-w-none')
    })
  })
})
