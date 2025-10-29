import { describe, expect, it } from 'vitest'

import { headingVariants } from './typography.cva'

import {
  testAllVariants,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Heading.cva', () => {
  testDefaultVariants(headingVariants, [
    'text-3xl', // Size h2
    'md:text-4xl',
    'font-semibold',
    'text-inherit', // Color inherit
    'font-mono', // Family mono
    'tracking-wider', // Compound: mono family
    'whitespace-normal',
    'break-normal',
  ])

  describe('Size Variants', () => {
    testAllVariants(headingVariants, 'size', [
      'display-2',
      'display-1',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ])

    it('should render display-2 size correctly', () => {
      expect(headingVariants({ size: 'display-2' })).toContainClasses([
        'text-6xl',
        'md:text-7xl',
        'font-bold',
        'leading-[0.95]',
      ])
    })

    it('should render h1 size correctly', () => {
      expect(headingVariants({ size: 'h1' })).toContainClasses([
        'text-4xl',
        'md:text-5xl',
        'font-semibold',
        'leading-tight',
      ])
    })

    it('should render h6 size correctly', () => {
      expect(headingVariants({ size: 'h6' })).toContainClasses([
        'text-base',
        'font-medium',
        'leading-normal',
      ])
    })
  })

  describe('Align Variants', () => {
    testAllVariants(headingVariants, 'align', ['start', 'center', 'end'])
  })

  describe('Color Variants', () => {
    testAllVariants(headingVariants, 'color', [
      'inherit',
      'default',
      'muted',
      'primary',
      'secondary',
      'accent',
      'success',
      'warning',
      'danger',
      'info',
    ])
  })

  describe('Family Variants', () => {
    testAllVariants(headingVariants, 'family', ['inherit', 'sans', 'mono'])

    it('should render mono family with tracking-wider', () => {
      expect(headingVariants({ family: 'mono' })).toContainClasses(['font-mono', 'tracking-wider'])
    })

    it('should render sans family with tracking-tight', () => {
      expect(headingVariants({ family: 'sans' })).toContainClasses(['font-sans', 'tracking-tight'])
    })

    it('should render inherit family without font class', () => {
      const result = headingVariants({ family: 'inherit' })
      expect(result).not.toContain('font-sans')
      expect(result).not.toContain('font-mono')
    })
  })

  describe('Whitespace Variants', () => {
    testAllVariants(headingVariants, 'whitespace', ['normal', 'nowrap'])
  })

  describe('Truncate Variants', () => {
    it('should generate valid classes for truncate true', () => {
      const result = headingVariants({ truncate: true })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for truncate false', () => {
      const result = headingVariants({ truncate: false })
      expect(result).toBeTruthy()
    })

    it('should apply truncate when true', () => {
      expect(headingVariants({ truncate: true })).toContain('truncate')
    })

    it('should not apply truncate when false', () => {
      expect(headingVariants({ truncate: false })).not.toContain('truncate')
    })
  })

  describe('Break Variants', () => {
    testAllVariants(headingVariants, 'break', ['normal', 'words', 'all'])
  })

  describe('Transform Variants', () => {
    testAllVariants(headingVariants, 'transform', ['none', 'capitalize', 'uppercase', 'lowercase'])
  })

  describe('Compound Variants', () => {
    it('should apply tracking-wider for mono family', () => {
      expect(headingVariants({ family: 'mono' })).toContain('tracking-wider')
    })

    it('should apply tracking-tight for sans family', () => {
      expect(headingVariants({ family: 'sans' })).toContain('tracking-tight')
    })

    it('should not apply tracking for inherit family', () => {
      const result = headingVariants({ family: 'inherit' })
      expect(result).not.toContain('tracking-wider')
      expect(result).not.toContain('tracking-tight')
    })
  })

  testCompoundVariants(headingVariants, {
    size: ['h1', 'h2', 'h3', 'h6'],
    color: ['inherit', 'primary', 'muted'],
    family: ['inherit', 'sans', 'mono'],
  })

  testEdgeCases(headingVariants, { size: 'h2', color: 'inherit', family: 'mono' }, [
    'text-3xl',
    'font-mono',
  ])

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for page headings', () => {
      expect(headingVariants({ size: 'h1', color: 'primary' })).toContainClasses([
        'text-4xl',
        'md:text-5xl',
        'text-primary',
      ])
    })

    it('should provide appropriate styles for truncated headings', () => {
      expect(headingVariants({ truncate: true, whitespace: 'nowrap' })).toContainClasses([
        'truncate',
        'whitespace-nowrap',
      ])
    })
  })

  describe('Consistency', () => {
    it('should maintain consistent tracking across same family', () => {
      const h1Mono = headingVariants({ size: 'h1', family: 'mono' })
      const h3Mono = headingVariants({ size: 'h3', family: 'mono' })

      expect(h1Mono).toContain('tracking-wider')
      expect(h3Mono).toContain('tracking-wider')
    })
  })
})
