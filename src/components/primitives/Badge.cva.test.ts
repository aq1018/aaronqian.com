import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { badgeVariants } from './Badge.cva'

describe('Badge.cva', () => {
  testDefaultVariants(badgeVariants, [
    'inline-flex',
    'items-center',
    'rounded',
    'text-xs',
    'px-2',
    'py-1',
    'bg-neutral',
    'text-neutral-content',
  ])

  describe('Edge Cases', () => {
    it('should handle custom class merging', () => {
      const result = badgeVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('inline-flex')
    })

    it('should handle undefined props gracefully', () => {
      const result = badgeVariants({ size: undefined, color: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('inline-flex')
    })
  })
})
