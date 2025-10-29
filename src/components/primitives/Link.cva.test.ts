import { describe, expect, it } from 'vitest'

import { linkVariants } from './Link.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Link.cva', () => {
  testBaseClasses(linkVariants, ['transition-colors'])

  testDefaultVariants(linkVariants, [
    'text-link',
    'underline',
    'decoration-transparent',
    'hover:decoration-link',
  ])

  describe('Variant Prop', () => {
    testAllVariants(linkVariants, 'variant', ['content', 'nav', 'back'])

    it('should render content variant correctly', () => {
      expect(linkVariants({ variant: 'content' })).toContainClasses([
        'text-link',
        'underline',
        'decoration-transparent',
        'hover:decoration-link',
      ])
    })

    it('should render nav variant correctly (inactive)', () => {
      expect(linkVariants({ variant: 'nav', active: false })).toContainClasses([
        'hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]',
        'text-muted',
      ])
    })

    it('should render nav variant correctly (active)', () => {
      expect(linkVariants({ variant: 'nav', active: true })).toContainClasses([
        'hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]',
        'text-primary',
      ])
    })

    it('should render back variant correctly', () => {
      expect(linkVariants({ variant: 'back' })).toContainClasses([
        'group',
        'inline-flex',
        'items-center',
        'gap-2',
        'font-mono',
        'text-sm',
        'text-muted',
        'hover:text-link',
      ])
    })
  })

  describe('Active Prop', () => {
    it('should generate valid classes for active true', () => {
      const result = linkVariants({ active: true })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for active false', () => {
      const result = linkVariants({ active: false })
      expect(result).toBeTruthy()
    })

    it('should handle active state for nav variant', () => {
      const inactive = linkVariants({ variant: 'nav', active: false })
      const active = linkVariants({ variant: 'nav', active: true })

      expect(inactive).toContain('text-muted')
      expect(active).toContain('text-primary')
      expect(active).not.toContain('text-muted')
    })

    it('should not affect content variant with active prop', () => {
      const result = linkVariants({ variant: 'content', active: true })
      expect(result).toContainClasses(['text-link', 'underline'])
    })

    it('should not affect back variant with active prop', () => {
      const result = linkVariants({ variant: 'back', active: true })
      expect(result).toContainClasses(['text-muted', 'hover:text-link'])
    })
  })

  describe('Compound Variants', () => {
    it('should apply nav active compound variant correctly', () => {
      expect(linkVariants({ variant: 'nav', active: true })).toContain('text-primary')
    })

    it('should apply nav inactive compound variant correctly', () => {
      expect(linkVariants({ variant: 'nav', active: false })).toContain('text-muted')
    })

    it('should not have compound variants for content variant', () => {
      const active = linkVariants({ variant: 'content', active: true })
      const inactive = linkVariants({ variant: 'content', active: false })
      expect(active).toContain('text-link')
      expect(inactive).toContain('text-link')
    })
  })

  // Test variant combinations (excluding active boolean prop from testCompoundVariants)
  testCompoundVariants(linkVariants, {
    variant: ['content', 'nav', 'back'],
  })

  testEdgeCases(linkVariants, { variant: 'content', active: false }, ['text-link', 'underline'])

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for inline content links', () => {
      expect(linkVariants({ variant: 'content' })).toContainClasses([
        'underline',
        'text-link',
        'hover:decoration-link',
      ])
    })

    it('should provide appropriate styles for navigation links', () => {
      expect(linkVariants({ variant: 'nav' })).toContain(
        'hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]',
      )
    })

    it('should provide appropriate styles for back navigation', () => {
      expect(linkVariants({ variant: 'back' })).toContainClasses(['font-mono', 'text-sm', 'gap-2'])
    })

    it('should distinguish active navigation clearly', () => {
      const active = linkVariants({ variant: 'nav', active: true })
      const inactive = linkVariants({ variant: 'nav', active: false })

      expect(active).toContain('text-primary')
      expect(inactive).toContain('text-muted')
    })
  })

  describe('Accessibility', () => {
    it('should have appropriate hover states for all variants', () => {
      const content = linkVariants({ variant: 'content' })
      const nav = linkVariants({ variant: 'nav' })
      const back = linkVariants({ variant: 'back' })

      expect(content).toContain('hover:decoration-link')
      expect(nav).toContain('hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]')
      expect(back).toContain('hover:text-link')
    })

    it('should have focus-visible support via transition-colors', () => {
      const result = linkVariants()
      expect(result).toContain('transition-colors')
    })
  })
})
