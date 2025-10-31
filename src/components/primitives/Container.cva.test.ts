import { describe, expect, it } from 'vitest'

import { containerCva } from './Container.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Container.cva', () => {
  testBaseClasses(containerCva, ['w-full'])

  testDefaultVariants(containerCva, ['max-w-6xl', 'px-6', 'md:px-10', 'lg:px-16', 'mx-auto'])

  describe('Width Variants', () => {
    testAllVariants(containerCva, 'width', ['narrow', 'default', 'wide', 'full'])

    it('should apply narrow width correctly', () => {
      expect(containerCva({ width: 'narrow' })).toContainClasses(['max-w-5xl'])
    })

    it('should apply default width correctly', () => {
      expect(containerCva({ width: 'default' })).toContainClasses(['max-w-6xl'])
    })

    it('should apply wide width correctly', () => {
      expect(containerCva({ width: 'wide' })).toContainClasses(['max-w-7xl'])
    })

    it('should apply full width correctly (no max-width)', () => {
      const result = containerCva({ width: 'full' })
      expect(result).not.toContain('max-w-')
      expect(result).toContain('w-full')
    })
  })

  describe('PadX Variants', () => {
    testAllVariants(containerCva, 'padX', ['none', 'sm', 'md', 'lg', 'xl'])

    it('should apply none padX correctly', () => {
      expect(containerCva({ padX: 'none' })).toContainClasses(['px-0'])
    })

    it('should apply sm padX with responsive values', () => {
      expect(containerCva({ padX: 'sm' })).toContainClasses(['px-4', 'md:px-6'])
    })

    it('should apply md padX with responsive values', () => {
      expect(containerCva({ padX: 'md' })).toContainClasses(['px-4', 'md:px-8', 'lg:px-12'])
    })

    it('should apply lg padX with responsive values (default)', () => {
      expect(containerCva({ padX: 'lg' })).toContainClasses(['px-6', 'md:px-10', 'lg:px-16'])
    })

    it('should apply xl padX with responsive values', () => {
      expect(containerCva({ padX: 'xl' })).toContainClasses(['px-6', 'md:px-12', 'lg:px-20'])
    })
  })

  describe('FluidUntil Variants', () => {
    testAllVariants(containerCva, 'fluidUntil', ['none', 'sm', 'md', 'lg', 'xl'])

    it('should apply none fluidUntil with immediate centering', () => {
      expect(containerCva({ fluidUntil: 'none' })).toContainClasses(['mx-auto'])
    })

    it('should apply sm fluidUntil correctly', () => {
      expect(containerCva({ fluidUntil: 'sm' })).toContainClasses(['mx-auto', 'sm:w-full'])
    })

    it('should apply md fluidUntil correctly', () => {
      expect(containerCva({ fluidUntil: 'md' })).toContainClasses(['mx-auto', 'md:w-full'])
    })

    it('should apply lg fluidUntil correctly', () => {
      expect(containerCva({ fluidUntil: 'lg' })).toContainClasses(['mx-auto', 'lg:w-full'])
    })

    it('should apply xl fluidUntil correctly', () => {
      expect(containerCva({ fluidUntil: 'xl' })).toContainClasses(['mx-auto', 'xl:w-full'])
    })
  })

  describe('Center Variant', () => {
    it('should generate valid classes for center true', () => {
      const result = containerCva({ center: true })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for center false', () => {
      const result = containerCva({ center: false })
      expect(result).toBeTruthy()
    })

    it('should center when true', () => {
      expect(containerCva({ center: true })).toContainClasses(['mx-auto'])
    })

    it('should not add mx-auto when false', () => {
      const result = containerCva({ center: false, fluidUntil: 'none' })
      // Check that we don't have redundant mx-auto
      const autoCount = (result.match(/mx-auto/g) ?? []).length
      expect(autoCount).toBeLessThanOrEqual(1)
    })
  })

  testCompoundVariants(containerCva, {
    width: ['narrow', 'default', 'wide', 'full'],
    padX: ['none', 'sm', 'md', 'lg', 'xl'],
  })

  testEdgeCases(containerCva, { width: 'default', padX: 'lg', fluidUntil: 'none', center: true }, [
    'w-full',
    'max-w-6xl',
  ])

  describe('Responsive Padding', () => {
    it('should apply responsive padding for sm/md/lg/xl', () => {
      const padXs = ['sm', 'md', 'lg', 'xl'] as const
      padXs.forEach((padX) => {
        const result = containerCva({ padX })
        expect(result).toMatch(/px-\d+/)
        expect(result).toMatch(/md:px-\d+/)
      })
    })

    it('should apply large breakpoint padding for md/lg/xl', () => {
      const padXs = ['md', 'lg', 'xl'] as const
      padXs.forEach((padX) => {
        const result = containerCva({ padX })
        expect(result).toMatch(/lg:px-\d+/)
      })
    })
  })
})
