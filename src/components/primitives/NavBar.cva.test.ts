import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { navBarCva } from './NavBar.cva'

describe('NavBar.cva', () => {
  testDefaultVariants(navBarCva, ['w-full', 'bg-background'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = navBarCva({ position: undefined, border: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('w-full')
    })
  })
})
