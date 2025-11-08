import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { containerCva } from './Container.cva'

describe('Container.cva', () => {
  testDefaultVariants(containerCva, ['w-full', 'max-w-6xl', 'px-6', 'mx-auto'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = containerCva({ width: undefined, padX: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('w-full')
    })
  })
})
