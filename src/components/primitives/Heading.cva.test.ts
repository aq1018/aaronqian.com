import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { headingVariants } from './typography.cva'

describe('Heading.cva', () => {
  testDefaultVariants(headingVariants, [
    'typography-heading-h2',
    'text-inherit',
    'font-mono',
    'whitespace-normal',
  ])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = headingVariants({ size: undefined, color: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('typography-heading-h2')
    })
  })
})
