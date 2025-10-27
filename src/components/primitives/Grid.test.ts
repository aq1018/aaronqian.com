import { describe, expect, it } from 'vitest'

import { gridContainerCva, gridItemCva } from './Grid.cva'

describe('Grid Component', () => {
  describe('gridContainerCva - Base Classes', () => {
    it('should include grid in all variants', () => {
      const result = gridContainerCva()
      expect(result).toContain('grid')
    })
  })

  describe('gridContainerCva - Default Variants', () => {
    it('should apply default columns (12)', () => {
      const result = gridContainerCva()
      expect(result).toContain('grid-cols-12')
    })

    it('should apply default spacing (md)', () => {
      const result = gridContainerCva()
      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
      expect(result).toContain('lg:gap-6')
    })

    it('should apply default direction (row)', () => {
      const result = gridContainerCva()
      expect(result).toContain('grid-flow-row')
    })

    it('should apply default justify (stretch)', () => {
      const result = gridContainerCva()
      expect(result).toContain('justify-items-stretch')
    })

    it('should apply default align (stretch)', () => {
      const result = gridContainerCva()
      expect(result).toContain('items-stretch')
    })
  })

  describe('gridContainerCva - Columns Prop', () => {
    it('should apply 1 column correctly', () => {
      const result = gridContainerCva({ columns: 1 })
      expect(result).toContain('grid-cols-1')
    })

    it('should apply 6 columns correctly', () => {
      const result = gridContainerCva({ columns: 6 })
      expect(result).toContain('grid-cols-6')
    })

    it('should apply 12 columns correctly (default)', () => {
      const result = gridContainerCva({ columns: 12 })
      expect(result).toContain('grid-cols-12')
    })

    it('should apply all column values (1-12)', () => {
      const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
      columns.forEach((col) => {
        const result = gridContainerCva({ columns: col })
        expect(result).toContain(`grid-cols-${col}`)
      })
    })
  })

  describe('gridContainerCva - Spacing Prop', () => {
    it('should apply none spacing correctly', () => {
      const result = gridContainerCva({ spacing: 'none' })
      expect(result).toContain('gap-0')
    })

    it('should apply xs spacing with responsive values', () => {
      const result = gridContainerCva({ spacing: 'xs' })
      expect(result).toContain('gap-2')
      expect(result).toContain('md:gap-3')
    })

    it('should apply sm spacing with responsive values', () => {
      const result = gridContainerCva({ spacing: 'sm' })
      expect(result).toContain('gap-3')
      expect(result).toContain('md:gap-4')
      expect(result).toContain('lg:gap-5')
    })

    it('should apply md spacing with responsive values (default)', () => {
      const result = gridContainerCva({ spacing: 'md' })
      expect(result).toContain('gap-4')
      expect(result).toContain('md:gap-5')
      expect(result).toContain('lg:gap-6')
    })

    it('should apply lg spacing with responsive values', () => {
      const result = gridContainerCva({ spacing: 'lg' })
      expect(result).toContain('gap-5')
      expect(result).toContain('md:gap-6')
      expect(result).toContain('lg:gap-8')
    })

    it('should apply xl spacing with responsive values', () => {
      const result = gridContainerCva({ spacing: 'xl' })
      expect(result).toContain('gap-6')
      expect(result).toContain('md:gap-8')
      expect(result).toContain('lg:gap-10')
    })
  })

  describe('gridContainerCva - Direction Prop', () => {
    it('should apply row direction correctly (default)', () => {
      const result = gridContainerCva({ direction: 'row' })
      expect(result).toContain('grid-flow-row')
    })

    it('should apply column direction correctly', () => {
      const result = gridContainerCva({ direction: 'column' })
      expect(result).toContain('grid-flow-col')
    })

    it('should apply dense direction correctly', () => {
      const result = gridContainerCva({ direction: 'dense' })
      expect(result).toContain('grid-flow-dense')
    })
  })

  describe('gridContainerCva - Justify Prop', () => {
    it('should apply start justify correctly', () => {
      const result = gridContainerCva({ justify: 'start' })
      expect(result).toContain('justify-items-start')
    })

    it('should apply center justify correctly', () => {
      const result = gridContainerCva({ justify: 'center' })
      expect(result).toContain('justify-items-center')
    })

    it('should apply end justify correctly', () => {
      const result = gridContainerCva({ justify: 'end' })
      expect(result).toContain('justify-items-end')
    })

    it('should apply stretch justify correctly (default)', () => {
      const result = gridContainerCva({ justify: 'stretch' })
      expect(result).toContain('justify-items-stretch')
    })
  })

  describe('gridContainerCva - Align Prop', () => {
    it('should apply start align correctly', () => {
      const result = gridContainerCva({ align: 'start' })
      expect(result).toContain('items-start')
    })

    it('should apply center align correctly', () => {
      const result = gridContainerCva({ align: 'center' })
      expect(result).toContain('items-center')
    })

    it('should apply end align correctly', () => {
      const result = gridContainerCva({ align: 'end' })
      expect(result).toContain('items-end')
    })

    it('should apply stretch align correctly (default)', () => {
      const result = gridContainerCva({ align: 'stretch' })
      expect(result).toContain('items-stretch')
    })
  })

  describe('gridContainerCva - Combinations', () => {
    const columns = [1, 3, 6, 12] as const
    const spacings = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const
    const directions = ['row', 'column', 'dense'] as const

    it('should work with all column and spacing combinations', () => {
      columns.forEach((col) => {
        spacings.forEach((spacing) => {
          const result = gridContainerCva({ columns: col, spacing })
          expect(result).toBeTruthy()
          expect(result).toContain('grid')
          expect(result).toContain(`grid-cols-${col}`)
          expect(result).toContain('gap-')
        })
      })
    })

    it('should work with direction, justify, and align combinations', () => {
      const justifies = ['start', 'center', 'end', 'stretch'] as const
      const aligns = ['start', 'center', 'end', 'stretch'] as const

      directions.forEach((direction) => {
        justifies.forEach((justify) => {
          aligns.forEach((align) => {
            const result = gridContainerCva({ direction, justify, align })
            expect(result).toBeTruthy()
            expect(result).toContain('grid-flow-')
            expect(result).toContain('justify-items-')
            expect(result).toContain('items-')
          })
        })
      })
    })
  })

  describe('gridContainerCva - Responsive Spacing', () => {
    it('should apply responsive spacing for xs', () => {
      const result = gridContainerCva({ spacing: 'xs' })
      expect(result).toMatch(/gap-\d+/)
      expect(result).toMatch(/md:gap-\d+/)
    })

    it('should apply responsive spacing for sm/md/lg/xl', () => {
      const spacings = ['sm', 'md', 'lg', 'xl'] as const
      spacings.forEach((spacing) => {
        const result = gridContainerCva({ spacing })
        expect(result).toMatch(/gap-\d+/)
        expect(result).toMatch(/md:gap-\d+/)
        expect(result).toMatch(/lg:gap-\d+/)
      })
    })
  })

  describe('gridContainerCva - Edge Cases', () => {
    it('should handle undefined columns (use default)', () => {
      const result = gridContainerCva({ columns: undefined })
      expect(result).toContain('grid-cols-12')
    })

    it('should handle undefined spacing (use default)', () => {
      const result = gridContainerCva({ spacing: undefined })
      expect(result).toContain('gap-4')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = gridContainerCva({})
      expect(result).toContain('grid')
      expect(result).toContain('grid-cols-12')
      expect(result).toContain('gap-4')
      expect(result).toContain('grid-flow-row')
      expect(result).toContain('justify-items-stretch')
      expect(result).toContain('items-stretch')
    })
  })

  describe('gridItemCva - Base Classes', () => {
    it('should return empty string by default (no base classes)', () => {
      const result = gridItemCva()
      // Item CVA has no base classes, only alignment overrides
      expect(result).toBe('')
    })
  })

  describe('gridItemCva - Default Variants', () => {
    it('should apply default justifySelf (auto)', () => {
      const result = gridItemCva()
      // Auto doesn't add a class, so should be empty
      expect(result).toBe('')
    })

    it('should apply default alignSelf (auto)', () => {
      const result = gridItemCva()
      // Auto doesn't add a class, so should be empty
      expect(result).toBe('')
    })
  })

  describe('gridItemCva - JustifySelf Prop', () => {
    it('should apply auto justifySelf correctly (no class)', () => {
      const result = gridItemCva({ justifySelf: 'auto' })
      expect(result).toBe('')
    })

    it('should apply start justifySelf correctly', () => {
      const result = gridItemCva({ justifySelf: 'start' })
      expect(result).toContain('justify-self-start')
    })

    it('should apply center justifySelf correctly', () => {
      const result = gridItemCva({ justifySelf: 'center' })
      expect(result).toContain('justify-self-center')
    })

    it('should apply end justifySelf correctly', () => {
      const result = gridItemCva({ justifySelf: 'end' })
      expect(result).toContain('justify-self-end')
    })

    it('should apply stretch justifySelf correctly', () => {
      const result = gridItemCva({ justifySelf: 'stretch' })
      expect(result).toContain('justify-self-stretch')
    })
  })

  describe('gridItemCva - AlignSelf Prop', () => {
    it('should apply auto alignSelf correctly (no class)', () => {
      const result = gridItemCva({ alignSelf: 'auto' })
      expect(result).toBe('')
    })

    it('should apply start alignSelf correctly', () => {
      const result = gridItemCva({ alignSelf: 'start' })
      expect(result).toContain('self-start')
    })

    it('should apply center alignSelf correctly', () => {
      const result = gridItemCva({ alignSelf: 'center' })
      expect(result).toContain('self-center')
    })

    it('should apply end alignSelf correctly', () => {
      const result = gridItemCva({ alignSelf: 'end' })
      expect(result).toContain('self-end')
    })

    it('should apply stretch alignSelf correctly', () => {
      const result = gridItemCva({ alignSelf: 'stretch' })
      expect(result).toContain('self-stretch')
    })
  })

  describe('gridItemCva - JustifySelf + AlignSelf Combinations', () => {
    const justifySelfValues = ['auto', 'start', 'center', 'end', 'stretch'] as const
    const alignSelfValues = ['auto', 'start', 'center', 'end', 'stretch'] as const

    it('should work with all justifySelf and alignSelf combinations', () => {
      justifySelfValues.forEach((justifySelf) => {
        alignSelfValues.forEach((alignSelf) => {
          const result = gridItemCva({ justifySelf, alignSelf })
          // Both will be empty string for auto/auto
          if (justifySelf === 'auto' && alignSelf === 'auto') {
            expect(result).toBe('')
          } else {
            // At least one should add a class
            expect(result.length).toBeGreaterThan(0)
          }
        })
      })
    })
  })

  describe('gridItemCva - Edge Cases', () => {
    it('should handle undefined justifySelf (use default)', () => {
      const result = gridItemCva({ justifySelf: undefined })
      // Default is auto, which results in no class
      expect(result).toBe('')
    })

    it('should handle undefined alignSelf (use default)', () => {
      const result = gridItemCva({ alignSelf: undefined })
      // Default is auto, which results in no class
      expect(result).toBe('')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = gridItemCva({})
      // Both defaults are auto, resulting in empty string
      expect(result).toBe('')
    })
  })
})
