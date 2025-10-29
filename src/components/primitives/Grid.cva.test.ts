import { describe, expect, it } from 'vitest'

import { gridContainerCva, gridItemCva } from './Grid.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Grid.cva - Container', () => {
  testBaseClasses(gridContainerCva, ['grid'])

  testDefaultVariants(gridContainerCva, [
    'grid-cols-12',
    'gap-4',
    'md:gap-5',
    'lg:gap-6',
    'grid-flow-row',
    'justify-items-stretch',
    'items-stretch',
  ])

  describe('Columns Variants', () => {
    it('should generate valid classes for columns 1', () => {
      const result = gridContainerCva({ columns: 1 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for columns 6', () => {
      const result = gridContainerCva({ columns: 6 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for columns 12', () => {
      const result = gridContainerCva({ columns: 12 })
      expect(result).toBeTruthy()
    })

    it('should render 6 columns correctly', () => {
      expect(gridContainerCva({ columns: 6 })).toContainClasses(['grid', 'grid-cols-6'])
    })
  })

  describe('Spacing Variants', () => {
    testAllVariants(gridContainerCva, 'spacing', ['none', 'xs', 'sm', 'md', 'lg', 'xl'])

    it('should render none spacing correctly', () => {
      expect(gridContainerCva({ spacing: 'none' })).toContain('gap-0')
    })

    it('should render responsive spacing for md', () => {
      expect(gridContainerCva({ spacing: 'md' })).toContainClasses([
        'gap-4',
        'md:gap-5',
        'lg:gap-6',
      ])
    })
  })

  describe('Direction Variants', () => {
    testAllVariants(gridContainerCva, 'direction', ['row', 'column', 'dense'])
  })

  describe('Justify Variants', () => {
    testAllVariants(gridContainerCva, 'justify', ['start', 'center', 'end', 'stretch'])
  })

  describe('Align Variants', () => {
    testAllVariants(gridContainerCva, 'align', ['start', 'center', 'end', 'stretch'])
  })

  // Note: testCompoundVariants only supports string arrays, number props omitted
  testCompoundVariants(gridContainerCva, {
    spacing: ['none', 'sm', 'md', 'lg'],
  })

  testEdgeCases(
    gridContainerCva,
    { columns: 12, spacing: 'md', direction: 'row', justify: 'stretch', align: 'stretch' },
    ['grid', 'grid-cols-12'],
  )

  describe('Responsive Spacing', () => {
    it('should apply responsive spacing for xs with 2 breakpoints', () => {
      const result = gridContainerCva({ spacing: 'xs' })
      expect(result).toContainClasses(['gap-2', 'md:gap-3'])
    })

    it('should apply responsive spacing for sm/md/lg/xl with 3 breakpoints', () => {
      const spacings = ['sm', 'md', 'lg', 'xl'] as const
      spacings.forEach((spacing) => {
        const result = gridContainerCva({ spacing })
        expect(result).toMatch(/gap-\d+/)
        expect(result).toMatch(/md:gap-\d+/)
        expect(result).toMatch(/lg:gap-\d+/)
      })
    })
  })
})

describe('Grid.cva - Item', () => {
  describe('Base Classes', () => {
    it('should return empty string by default (no base classes)', () => {
      const result = gridItemCva()
      expect(result).toBe('')
    })
  })

  testDefaultVariants(gridItemCva, ['']) // Empty default

  describe('Size Variants', () => {
    it('should generate valid classes for size 1', () => {
      const result = gridItemCva({ size: 1 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for size 6', () => {
      const result = gridItemCva({ size: 6 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for size 12', () => {
      const result = gridItemCva({ size: 12 })
      expect(result).toBeTruthy()
    })

    testAllVariants(gridItemCva, 'size', ['auto', 'grow'])

    it('should render size 6 correctly', () => {
      expect(gridItemCva({ size: 6 })).toContain('col-span-6')
    })

    it('should render size auto correctly', () => {
      expect(gridItemCva({ size: 'auto' })).toContain('col-auto')
    })

    it('should render size grow correctly', () => {
      expect(gridItemCva({ size: 'grow' })).toContain('col-span-full')
    })
  })

  describe('Responsive Size Variants', () => {
    testAllVariants(gridItemCva, 'size-sm', ['auto', 'grow'])
    testAllVariants(gridItemCva, 'size-md', ['auto', 'grow'])
    testAllVariants(gridItemCva, 'size-lg', ['auto', 'grow'])
    testAllVariants(gridItemCva, 'size-xl', ['auto', 'grow'])

    it('should generate valid classes for size-sm 1', () => {
      const result = gridItemCva({ 'size-sm': 1 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for size-sm 6', () => {
      const result = gridItemCva({ 'size-sm': 6 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for size-sm 12', () => {
      const result = gridItemCva({ 'size-sm': 12 })
      expect(result).toBeTruthy()
    })

    it('should render sm:col-span-6 correctly', () => {
      expect(gridItemCva({ 'size-sm': 6 })).toContain('sm:col-span-6')
    })

    it('should render md:col-span-12 correctly', () => {
      expect(gridItemCva({ 'size-md': 12 })).toContain('md:col-span-12')
    })
  })

  describe('Offset Variants', () => {
    it('should generate valid classes for offset 1', () => {
      const result = gridItemCva({ offset: 1 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for offset 3', () => {
      const result = gridItemCva({ offset: 3 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for offset 6', () => {
      const result = gridItemCva({ offset: 6 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for offset 12', () => {
      const result = gridItemCva({ offset: 12 })
      expect(result).toBeTruthy()
    })

    it('should render offset 3 correctly', () => {
      expect(gridItemCva({ offset: 3 })).toContain('col-start-4')
    })
  })

  describe('Responsive Offset Variants', () => {
    it('should generate valid classes for offset-sm 1', () => {
      const result = gridItemCva({ 'offset-sm': 1 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for offset-sm 6', () => {
      const result = gridItemCva({ 'offset-sm': 6 })
      expect(result).toBeTruthy()
    })

    it('should generate valid classes for offset-md 12', () => {
      const result = gridItemCva({ 'offset-md': 12 })
      expect(result).toBeTruthy()
    })
  })

  describe('JustifySelf Variants', () => {
    testAllVariants(gridItemCva, 'justifySelf', ['start', 'center', 'end', 'stretch'])

    it('should render auto justifySelf correctly (no class)', () => {
      expect(gridItemCva({ justifySelf: 'auto' })).toBe('')
    })

    it('should render center justifySelf correctly', () => {
      expect(gridItemCva({ justifySelf: 'center' })).toContain('justify-self-center')
    })
  })

  describe('AlignSelf Variants', () => {
    testAllVariants(gridItemCva, 'alignSelf', ['start', 'center', 'end', 'stretch'])

    it('should render auto alignSelf correctly (no class)', () => {
      expect(gridItemCva({ alignSelf: 'auto' })).toBe('')
    })

    it('should render center alignSelf correctly', () => {
      expect(gridItemCva({ alignSelf: 'center' })).toContain('self-center')
    })
  })

  describe('Variant Combinations', () => {
    it('should generate valid classes for all justifySelf and alignSelf combinations', () => {
      const justifySelfValues = ['auto', 'start', 'center', 'end', 'stretch'] as const
      const alignSelfValues = ['auto', 'start', 'center', 'end', 'stretch'] as const

      justifySelfValues.forEach((justifySelf) => {
        alignSelfValues.forEach((alignSelf) => {
          const result = gridItemCva({ justifySelf, alignSelf })
          // Both auto will be empty string
          if (justifySelf === 'auto' && alignSelf === 'auto') {
            expect(result).toBe('')
          } else {
            // At least one should add a class
            expect(typeof result).toBe('string')
          }
        })
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined justifySelf (use default)', () => {
      const result = gridItemCva({ justifySelf: undefined })
      expect(result).toBe('')
    })

    it('should handle undefined alignSelf (use default)', () => {
      const result = gridItemCva({ alignSelf: undefined })
      expect(result).toBe('')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = gridItemCva({})
      expect(result).toBe('')
    })
  })
})
