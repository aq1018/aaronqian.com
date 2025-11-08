import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { buttonVariants } from './Button.cva'

describe('Button.cva', () => {
  testDefaultVariants(buttonVariants, [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-lg',
    'px-4',
    'py-2',
    'bg-primary',
    'text-primary-content',
  ])

  describe('Edge Cases', () => {
    it('should handle custom class merging', () => {
      const result = buttonVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('inline-flex')
    })

    it('should handle undefined props gracefully', () => {
      const result = buttonVariants({ size: undefined, variant: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('inline-flex')
    })
  })
})
