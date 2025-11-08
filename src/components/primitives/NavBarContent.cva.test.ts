import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { navBarContentCva } from './NavBarContent.cva'

describe('NavBarContent.cva', () => {
  testDefaultVariants(navBarContentCva, [
    'flex',
    'flex-row',
    'items-center',
    'justify-between',
    'h-16',
  ])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = navBarContentCva({ height: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('flex')
    })
  })
})
