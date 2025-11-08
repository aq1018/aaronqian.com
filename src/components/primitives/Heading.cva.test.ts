import { describe, expect, it } from 'vitest'

import {
  testAllVariants,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

import { headingVariants } from './typography.cva'

describe('Heading.cva', () => {
  testDefaultVariants(headingVariants, [
    'typography-heading-h2', // Size h2 (includes font-size, weight, leading, tracking)
    'text-inherit', // Color inherit
    'font-mono', // Family mono
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
        'typography-heading-display-2',
      ])
    })

    it('should render h1 size correctly', () => {
      expect(headingVariants({ size: 'h1' })).toContainClasses(['typography-heading-h1'])
    })

    it('should render h6 size correctly', () => {
      expect(headingVariants({ size: 'h6' })).toContainClasses(['typography-heading-h6'])
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

    it('should render mono family with font-mono', () => {
      expect(headingVariants({ family: 'mono' })).toContainClasses(['font-mono'])
    })

    it('should render sans family with font-sans', () => {
      expect(headingVariants({ family: 'sans' })).toContainClasses(['font-sans'])
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
    it('should apply special tracking for display-2 with mono family', () => {
      expect(headingVariants({ family: 'mono', size: 'display-2' })).toContain(
        'tracking-heading-display-mono',
      )
    })

    it('should apply special tracking for display-1 with mono family', () => {
      expect(headingVariants({ family: 'mono', size: 'display-1' })).toContain(
        'tracking-heading-display-mono',
      )
    })

    it('should not apply special tracking for regular headings with mono family', () => {
      const result = headingVariants({ family: 'mono', size: 'h2' })
      expect(result).not.toContain('tracking-heading-display-mono')
    })
  })

  testCompoundVariants(headingVariants, {
    color: ['inherit', 'primary', 'muted'],
    family: ['inherit', 'sans', 'mono'],
    size: ['h1', 'h2', 'h3', 'h6'],
  })

  testEdgeCases(headingVariants, { color: 'inherit', family: 'mono', size: 'h2' }, [
    'typography-heading-h2',
    'font-mono',
  ])

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for page headings', () => {
      expect(headingVariants({ color: 'primary', size: 'h1' })).toContainClasses([
        'typography-heading-h1',
        'text-primary',
      ])
    })

    it('should provide appropriate styles for truncated headings', () => {
      expect(headingVariants({ truncate: true, whitespace: 'nowrap' })).toContainClasses([
        'typography-truncate',
        'whitespace-nowrap',
      ])
    })
  })

  describe('Consistency', () => {
    it('should maintain consistent font family across different sizes', () => {
      const h1Mono = headingVariants({ family: 'mono', size: 'h1' })
      const h3Mono = headingVariants({ family: 'mono', size: 'h3' })

      expect(h1Mono).toContain('font-mono')
      expect(h3Mono).toContain('font-mono')
    })
  })
})
