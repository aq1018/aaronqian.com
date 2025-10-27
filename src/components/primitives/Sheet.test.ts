import { describe, expect, it } from 'vitest'

import { sheetCva } from './Sheet.cva'

describe('Sheet Component', () => {
  describe('sheetCva - Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = sheetCva()
      expect(result).toContain('overflow-hidden')
      expect(result).toContain('rounded')
    })
  })

  describe('sheetCva - Default Variants', () => {
    it('should apply default variants (variant: outline, color: neutral, padding: md, hover: false)', () => {
      const result = sheetCva()
      // Variant outline
      expect(result).toContain('border-2')
      // Color neutral
      expect(result).toContain('border-neutral')
      // Padding md
      expect(result).toContain('p-6')
      // Hover false (no transition)
      expect(result).not.toContain('transition-colors')
      expect(result).not.toContain('hover:bg')
    })
  })

  describe('sheetCva - Variant: Outline', () => {
    it('should render outline variant with hover disabled', () => {
      const result = sheetCva({ variant: 'outline', color: 'primary', hover: false })
      expect(result).toContain('border-2')
      expect(result).toContain('border-primary')
      expect(result).not.toContain('hover:bg-primary')
      expect(result).not.toContain('transition-colors')
    })

    it('should render outline variant with hover enabled', () => {
      const result = sheetCva({ variant: 'outline', color: 'primary', hover: true })
      expect(result).toContain('border-2')
      expect(result).toContain('border-primary')
      expect(result).toContain('hover:bg-primary/5')
      expect(result).toContain('transition-colors')
    })

    it('should render outline for all colors without hover', () => {
      const colors = [
        'primary',
        'accent',
        'secondary',
        'neutral',
        'danger',
        'success',
        'warning',
        'info',
      ] as const
      colors.forEach((color) => {
        const result = sheetCva({ variant: 'outline', color, hover: false })
        expect(result).toContain(`border-${color}`)
        expect(result).not.toContain('hover:bg')
      })
    })

    it('should render outline for all colors with hover', () => {
      const colors = [
        'primary',
        'accent',
        'secondary',
        'neutral',
        'danger',
        'success',
        'warning',
        'info',
      ] as const
      colors.forEach((color) => {
        const result = sheetCva({ variant: 'outline', color, hover: true })
        expect(result).toContain(`border-${color}`)
        expect(result).toContain(`hover:bg-${color}/5`)
      })
    })
  })

  describe('sheetCva - Variant: Soft', () => {
    it('should render soft variant with hover disabled', () => {
      const result = sheetCva({ variant: 'soft', color: 'primary', hover: false })
      expect(result).toContain('bg-primary/10')
      expect(result).not.toContain('hover:bg-primary/15')
      expect(result).not.toContain('transition-colors')
    })

    it('should render soft variant with hover enabled', () => {
      const result = sheetCva({ variant: 'soft', color: 'primary', hover: true })
      expect(result).toContain('bg-primary/10')
      expect(result).toContain('hover:bg-primary/15')
      expect(result).toContain('transition-colors')
    })

    it('should render soft for all colors without hover', () => {
      const colors = [
        'primary',
        'accent',
        'secondary',
        'neutral',
        'danger',
        'success',
        'warning',
        'info',
      ] as const
      colors.forEach((color) => {
        const result = sheetCva({ variant: 'soft', color, hover: false })
        expect(result).toContain(`bg-${color}/10`)
        expect(result).not.toContain(`hover:bg-${color}/15`)
      })
    })

    it('should render soft for all colors with hover', () => {
      const colors = [
        'primary',
        'accent',
        'secondary',
        'neutral',
        'danger',
        'success',
        'warning',
        'info',
      ] as const
      colors.forEach((color) => {
        const result = sheetCva({ variant: 'soft', color, hover: true })
        expect(result).toContain(`bg-${color}/10`)
        expect(result).toContain(`hover:bg-${color}/15`)
      })
    })
  })

  describe('sheetCva - Variant: Bar', () => {
    it('should render bar variant with hover disabled', () => {
      const result = sheetCva({ variant: 'bar', color: 'primary', hover: false })
      expect(result).toContain('bg-transparent')
      expect(result).toContain('border-l-2')
      expect(result).toContain('border-l-primary/30')
      expect(result).not.toContain('hover:border-l-primary')
      expect(result).not.toContain('transition-colors')
    })

    it('should render bar variant with hover enabled', () => {
      const result = sheetCva({ variant: 'bar', color: 'primary', hover: true })
      expect(result).toContain('bg-transparent')
      expect(result).toContain('border-l-2')
      expect(result).toContain('border-l-neutral/30')
      expect(result).toContain('hover:border-l-primary')
      expect(result).toContain('transition-colors')
    })

    it('should render bar for all colors without hover', () => {
      const colors = [
        'primary',
        'accent',
        'secondary',
        'neutral',
        'danger',
        'success',
        'warning',
        'info',
      ] as const
      colors.forEach((color) => {
        const result = sheetCva({ variant: 'bar', color, hover: false })
        expect(result).toContain('bg-transparent')
        expect(result).toContain(`border-l-${color}/30`)
        expect(result).not.toContain(`hover:border-l-${color}`)
      })
    })

    it('should render bar for all colors with hover', () => {
      const colors = [
        'primary',
        'accent',
        'secondary',
        'neutral',
        'danger',
        'success',
        'warning',
        'info',
      ] as const
      colors.forEach((color) => {
        const result = sheetCva({ variant: 'bar', color, hover: true })
        expect(result).toContain('bg-transparent')
        expect(result).toContain('border-l-neutral/30')
        expect(result).toContain(`hover:border-l-${color}`)
      })
    })
  })

  describe('sheetCva - Padding Variants', () => {
    it('should render none padding correctly', () => {
      const result = sheetCva({ padding: 'none' })
      expect(result).toContain('p-0')
    })

    it('should render sm padding correctly', () => {
      const result = sheetCva({ padding: 'sm' })
      expect(result).toContain('p-4')
    })

    it('should render md padding correctly', () => {
      const result = sheetCva({ padding: 'md' })
      expect(result).toContain('p-6')
    })

    it('should render lg padding correctly', () => {
      const result = sheetCva({ padding: 'lg' })
      expect(result).toContain('p-8')
    })
  })

  describe('sheetCva - Hover Modifier', () => {
    it('should not apply transition by default (hover: false)', () => {
      const result = sheetCva()
      expect(result).not.toContain('transition-colors')
    })

    it('should apply transition when hover is true', () => {
      const result = sheetCva({ hover: true })
      expect(result).toContain('transition-colors')
    })

    it('should not apply transition when hover is false', () => {
      const result = sheetCva({ hover: false })
      expect(result).not.toContain('transition-colors')
    })
  })

  describe('sheetCva - Variant Combinations', () => {
    const variants = ['outline', 'soft', 'bar'] as const
    const colors = [
      'primary',
      'accent',
      'secondary',
      'neutral',
      'danger',
      'success',
      'warning',
      'info',
    ] as const
    const paddings = ['none', 'sm', 'md', 'lg'] as const
    const hovers = [true, false] as const

    it('should generate valid classes for all variant combinations', () => {
      variants.forEach((variant) => {
        const result = sheetCva({ variant })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for all color combinations', () => {
      colors.forEach((color) => {
        const result = sheetCva({ color })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for all padding combinations', () => {
      paddings.forEach((padding) => {
        const result = sheetCva({ padding })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })

    it('should generate valid classes for variant × color × hover combinations', () => {
      variants.forEach((variant) => {
        colors.forEach((color) => {
          hovers.forEach((hover) => {
            const result = sheetCva({ variant, color, hover })
            expect(result).toBeTruthy()
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
          })
        })
      })
    })

    it('should handle all props together', () => {
      const result = sheetCva({
        variant: 'outline',
        color: 'primary',
        padding: 'lg',
        hover: true,
      })
      expect(result).toContain('border-2')
      expect(result).toContain('border-primary')
      expect(result).toContain('p-8')
      expect(result).toContain('transition-colors')
      expect(result).toContain('hover:bg-primary/5')
    })
  })

  describe('sheetCva - Edge Cases', () => {
    it('should handle undefined variant (use default)', () => {
      const result = sheetCva({ variant: undefined })
      expect(result).toContain('border-2')
      expect(result).toContain('border-neutral')
    })

    it('should handle undefined color (use default)', () => {
      const result = sheetCva({ color: undefined })
      expect(result).toContain('border-neutral')
    })

    it('should handle undefined padding (use default)', () => {
      const result = sheetCva({ padding: undefined })
      expect(result).toContain('p-6')
    })

    it('should handle undefined hover (use default)', () => {
      const result = sheetCva({ hover: undefined })
      expect(result).not.toContain('transition-colors')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = sheetCva({})
      expect(result).toContain('border-2')
      expect(result).toContain('border-neutral')
      expect(result).toContain('p-6')
      expect(result).not.toContain('transition-colors')
    })
  })

  describe('sheetCva - Semantic Usage', () => {
    it('should provide appropriate styles for empty states', () => {
      const result = sheetCva({ variant: 'soft', color: 'neutral', padding: 'lg', hover: false })
      expect(result).toContain('bg-neutral/10')
      expect(result).toContain('p-8')
      expect(result).not.toContain('transition-colors')
    })

    it('should provide appropriate styles for project list items', () => {
      const result = sheetCva({ variant: 'bar', color: 'neutral', padding: 'sm', hover: true })
      expect(result).toContain('bg-transparent')
      expect(result).toContain('border-l-2')
      expect(result).toContain('border-l-neutral/30')
      expect(result).toContain('hover:border-l-neutral')
      expect(result).toContain('p-4')
      expect(result).toContain('transition-colors')
    })

    it('should provide appropriate styles for future alerts (danger)', () => {
      const result = sheetCva({ variant: 'outline', color: 'danger', padding: 'md', hover: false })
      expect(result).toContain('border-2')
      expect(result).toContain('border-danger')
      expect(result).toContain('p-6')
      expect(result).not.toContain('transition-colors')
    })

    it('should provide appropriate styles for future alerts (success)', () => {
      const result = sheetCva({ variant: 'soft', color: 'success', padding: 'md', hover: false })
      expect(result).toContain('bg-success/10')
      expect(result).toContain('p-6')
      expect(result).not.toContain('hover:bg-success')
    })
  })

  describe('sheetCva - Consistency', () => {
    it('should maintain consistent base classes across all variants', () => {
      const outline = sheetCva({ variant: 'outline' })
      const soft = sheetCva({ variant: 'soft' })
      const bar = sheetCva({ variant: 'bar' })

      // All variants should have overflow-hidden
      ;[outline, soft, bar].forEach((result) => {
        expect(result).toContain('overflow-hidden')
      })

      // Only outline variant should have rounded
      expect(outline).toContain('rounded')
      expect(soft).not.toContain('rounded')
      expect(bar).not.toContain('rounded')
    })

    it('should maintain consistent padding classes across variant types', () => {
      const outlineLg = sheetCva({ variant: 'outline', padding: 'lg' })
      const softLg = sheetCva({ variant: 'soft', padding: 'lg' })
      const barLg = sheetCva({ variant: 'bar', padding: 'lg' })

      ;[outlineLg, softLg, barLg].forEach((result) => {
        expect(result).toContain('p-8')
      })
    })
  })

  describe('sheetCva - Visual Hierarchy', () => {
    it('should have clear visual distinction between variants', () => {
      const outline = sheetCva({ variant: 'outline', color: 'primary', hover: true })
      const soft = sheetCva({ variant: 'soft', color: 'primary', hover: true })
      const bar = sheetCva({ variant: 'bar', color: 'primary', hover: true })

      // Outline: border with hover background
      expect(outline).toContain('border-2')
      expect(outline).toContain('border-primary')
      expect(outline).toContain('hover:bg-primary/5')

      // Soft: background with hover
      expect(soft).toContain('bg-primary/10')
      expect(soft).toContain('hover:bg-primary/15')
      expect(soft).not.toContain('border-2')

      // Bar: left border with opacity shift
      expect(bar).toContain('bg-transparent')
      expect(bar).toContain('border-l-2')
      expect(bar).toContain('border-l-neutral/30')
      expect(bar).toContain('hover:border-l-primary')

      // All three should produce different class strings
      expect(outline).not.toBe(soft)
      expect(soft).not.toBe(bar)
      expect(outline).not.toBe(bar)
    })

    it('should have clear visual distinction between hover states', () => {
      const noHover = sheetCva({ variant: 'outline', color: 'primary', hover: false })
      const withHover = sheetCva({ variant: 'outline', color: 'primary', hover: true })

      // No hover: no transition or hover effects
      expect(noHover).not.toContain('transition-colors')
      expect(noHover).not.toContain('hover:bg')

      // With hover: includes transition and hover effects
      expect(withHover).toContain('transition-colors')
      expect(withHover).toContain('hover:bg-primary/5')

      // Should produce different class strings
      expect(noHover).not.toBe(withHover)
    })
  })

  describe('sheetCva - Design Token Integration', () => {
    it('should use semantic color tokens for brand colors', () => {
      const primary = sheetCva({ variant: 'outline', color: 'primary' })
      const accent = sheetCva({ variant: 'outline', color: 'accent' })
      const secondary = sheetCva({ variant: 'outline', color: 'secondary' })

      expect(primary).toContain('border-primary')
      expect(accent).toContain('border-accent')
      expect(secondary).toContain('border-secondary')
    })

    it('should use semantic color tokens for status colors', () => {
      const success = sheetCva({ variant: 'soft', color: 'success' })
      const warning = sheetCva({ variant: 'soft', color: 'warning' })
      const danger = sheetCva({ variant: 'soft', color: 'danger' })
      const info = sheetCva({ variant: 'soft', color: 'info' })

      expect(success).toContain('bg-success/10')
      expect(warning).toContain('bg-warning/10')
      expect(danger).toContain('bg-danger/10')
      expect(info).toContain('bg-info/10')
    })
  })
})
