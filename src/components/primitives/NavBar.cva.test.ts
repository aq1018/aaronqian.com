import { describe, expect, it } from 'vitest'

import { navBarCva } from './NavBar.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('NavBar.cva', () => {
  testBaseClasses(navBarCva, ['w-full'])

  testDefaultVariants(navBarCva, ['w-full', 'bg-background'])

  describe('Position Variants', () => {
    testAllVariants(navBarCva, 'position', ['static', 'sticky', 'fixed'])

    it('should render static position without positioning classes', () => {
      const result = navBarCva({ position: 'static' })
      expect(result).not.toContain('sticky')
      expect(result).not.toContain('fixed')
    })

    it('should render sticky position with placement', () => {
      const top = navBarCva({ position: 'sticky', placement: 'top' })
      const bottom = navBarCva({ position: 'sticky', placement: 'bottom' })

      expect(top).toContainClasses(['sticky', 'top-0', 'z-50'])
      expect(bottom).toContainClasses(['sticky', 'bottom-0', 'z-50'])
    })

    it('should render fixed position with placement', () => {
      const top = navBarCva({ position: 'fixed', placement: 'top' })
      const bottom = navBarCva({ position: 'fixed', placement: 'bottom' })

      expect(top).toContainClasses(['fixed', 'top-0', 'z-50'])
      expect(bottom).toContainClasses(['fixed', 'bottom-0', 'z-50'])
    })
  })

  describe('Placement Variants', () => {
    testAllVariants(navBarCva, 'placement', ['top', 'bottom'])
  })

  describe('Border Variants', () => {
    testAllVariants(navBarCva, 'border', ['none', 'top', 'bottom', 'both'])

    it('should render no border', () => {
      const result = navBarCva({ border: 'none' })
      expect(result).not.toContain('border-')
    })

    it('should render top border', () => {
      expect(navBarCva({ border: 'top' })).toContainClasses(['border-t', 'border-border'])
    })

    it('should render bottom border', () => {
      expect(navBarCva({ border: 'bottom' })).toContainClasses(['border-b', 'border-border'])
    })

    it('should render both borders', () => {
      expect(navBarCva({ border: 'both' })).toContainClasses(['border-y', 'border-border'])
    })
  })

  describe('Backdrop Variants', () => {
    it('should generate valid classes for backdrop true', () => {
      const result = navBarCva({ backdrop: true })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for backdrop false', () => {
      const result = navBarCva({ backdrop: false })
      expect(result).toBeTruthy()
    })

    it('should render solid background when backdrop is false', () => {
      const result = navBarCva({ backdrop: false })
      expect(result).toContain('bg-background')
      expect(result).not.toContain('backdrop-blur')
      expect(result).not.toContain('/95')
    })

    it('should render translucent background with blur when backdrop is true', () => {
      expect(navBarCva({ backdrop: true })).toContainClasses([
        'bg-background/95',
        'backdrop-blur-sm',
      ])
    })
  })

  describe('Compound Variants', () => {
    it('should combine sticky top with border and backdrop', () => {
      expect(
        navBarCva({
          position: 'sticky',
          placement: 'top',
          border: 'bottom',
          backdrop: true,
        }),
      ).toContainClasses([
        'sticky',
        'top-0',
        'z-50',
        'border-b',
        'bg-background/95',
        'backdrop-blur-sm',
      ])
    })

    it('should combine fixed bottom with border', () => {
      expect(
        navBarCva({
          position: 'fixed',
          placement: 'bottom',
          border: 'top',
          backdrop: false,
        }),
      ).toContainClasses(['fixed', 'bottom-0', 'z-50', 'border-t', 'bg-background'])
    })

    // Test variant combinations (excluding backdrop boolean prop from testCompoundVariants)
    testCompoundVariants(navBarCva, {
      position: ['static', 'sticky', 'fixed'],
      placement: ['top', 'bottom'],
      border: ['none', 'top', 'bottom', 'both'],
    })
  })

  testEdgeCases(
    navBarCva,
    { position: 'static', placement: 'top', border: 'none', backdrop: false },
    ['w-full', 'bg-background'],
  )

  describe('Real-World Usage Patterns', () => {
    it('should support typical sticky header navigation', () => {
      expect(
        navBarCva({
          position: 'sticky',
          placement: 'top',
          border: 'bottom',
          backdrop: true,
        }),
      ).toContainClasses([
        'sticky',
        'top-0',
        'z-50',
        'border-b',
        'bg-background/95',
        'backdrop-blur-sm',
      ])
    })

    it('should support static navigation without border or backdrop', () => {
      const result = navBarCva({
        position: 'static',
        border: 'none',
        backdrop: false,
      })
      expect(result).toContainClasses(['w-full', 'bg-background'])
      expect(result).not.toContain('sticky')
      expect(result).not.toContain('border-')
      expect(result).not.toContain('backdrop-blur')
    })

    it('should support fixed footer navigation', () => {
      expect(
        navBarCva({
          position: 'fixed',
          placement: 'bottom',
          border: 'top',
          backdrop: false,
        }),
      ).toContainClasses(['fixed', 'bottom-0', 'z-50', 'border-t'])
    })
  })

  describe('Consistency', () => {
    it('should maintain w-full across all variants', () => {
      const static_ = navBarCva({ position: 'static' })
      const sticky = navBarCva({ position: 'sticky' })
      const fixed = navBarCva({ position: 'fixed' })

      expect(static_).toContain('w-full')
      expect(sticky).toContain('w-full')
      expect(fixed).toContain('w-full')
    })

    it('should maintain z-index for positioned variants', () => {
      const stickyTop = navBarCva({ position: 'sticky', placement: 'top' })
      const stickyBottom = navBarCva({ position: 'sticky', placement: 'bottom' })
      const fixedTop = navBarCva({ position: 'fixed', placement: 'top' })
      const fixedBottom = navBarCva({ position: 'fixed', placement: 'bottom' })

      expect(stickyTop).toContain('z-50')
      expect(stickyBottom).toContain('z-50')
      expect(fixedTop).toContain('z-50')
      expect(fixedBottom).toContain('z-50')
    })
  })
})
