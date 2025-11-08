import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { stackCva } from './Stack.cva'

describe('Stack.cva', () => {
  testDefaultVariants(stackCva, [
    'flex',
    'flex-col',
    'gap-4',
    'md:gap-5',
    'lg:gap-6',
    'items-stretch',
    'justify-start',
  ])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = stackCva({ direction: undefined, space: undefined, align: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('flex')
    })
  })
})
