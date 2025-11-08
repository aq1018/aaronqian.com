import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { textVariants } from './typography.cva'

describe('Text.cva (textVariants)', () => {
  testDefaultVariants(textVariants, ['typography-text-body', 'text-inherit'])

  describe('Edge Cases', () => {
    it('should handle custom class merging', () => {
      const result = textVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('typography-text-body')
    })

    it('should handle undefined props gracefully', () => {
      const result = textVariants({ size: undefined, color: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('typography-text-body')
    })
  })
})
