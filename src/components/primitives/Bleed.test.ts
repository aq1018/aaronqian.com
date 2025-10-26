import { describe, expect, it } from 'vitest'

import { bleedCva } from './Bleed.cva'

describe('Bleed Component', () => {
  describe('bleedCva - Default Variants', () => {
    it('should apply default size (lg) to match Container default padX', () => {
      const result = bleedCva()
      expect(result).toContain('-mx-6')
      expect(result).toContain('md:-mx-10')
      expect(result).toContain('lg:-mx-16')
    })
  })

  describe('bleedCva - Size Prop', () => {
    it('should apply none size (no negative margin)', () => {
      const result = bleedCva({ size: 'none' })
      expect(result).toContain('mx-0')
    })

    it('should apply sm size (negates Container sm padX)', () => {
      const result = bleedCva({ size: 'sm' })
      expect(result).toContain('-mx-4')
      expect(result).toContain('md:-mx-6')
    })

    it('should apply md size (negates Container md padX)', () => {
      const result = bleedCva({ size: 'md' })
      expect(result).toContain('-mx-4')
      expect(result).toContain('md:-mx-8')
      expect(result).toContain('lg:-mx-12')
    })

    it('should apply lg size (negates Container lg padX, default)', () => {
      const result = bleedCva({ size: 'lg' })
      expect(result).toContain('-mx-6')
      expect(result).toContain('md:-mx-10')
      expect(result).toContain('lg:-mx-16')
    })

    it('should apply xl size (negates Container xl padX)', () => {
      const result = bleedCva({ size: 'xl' })
      expect(result).toContain('-mx-6')
      expect(result).toContain('md:-mx-12')
      expect(result).toContain('lg:-mx-20')
    })
  })

  describe('bleedCva - Negative Margins Match Container Padding', () => {
    it('should have sm that negates Container sm (16px → 24px)', () => {
      const result = bleedCva({ size: 'sm' })
      expect(result).toContain('-mx-4') // -16px
      expect(result).toContain('md:-mx-6') // -24px
    })

    it('should have md that negates Container md (16 → 32 → 48)', () => {
      const result = bleedCva({ size: 'md' })
      expect(result).toContain('-mx-4') // -16px
      expect(result).toContain('md:-mx-8') // -32px
      expect(result).toContain('lg:-mx-12') // -48px
    })

    it('should have lg that negates Container lg (24 → 40 → 64)', () => {
      const result = bleedCva({ size: 'lg' })
      expect(result).toContain('-mx-6') // -24px
      expect(result).toContain('md:-mx-10') // -40px
      expect(result).toContain('lg:-mx-16') // -64px
    })

    it('should have xl that negates Container xl (24 → 48 → 80)', () => {
      const result = bleedCva({ size: 'xl' })
      expect(result).toContain('-mx-6') // -24px
      expect(result).toContain('md:-mx-12') // -48px
      expect(result).toContain('lg:-mx-20') // -80px
    })
  })

  describe('bleedCva - Edge Cases', () => {
    it('should handle undefined size (use default)', () => {
      const result = bleedCva({ size: undefined })
      expect(result).toContain('-mx-6') // Default lg
    })

    it('should handle empty object (use default)', () => {
      const result = bleedCva({})
      expect(result).toContain('-mx-6')
      expect(result).toContain('md:-mx-10')
      expect(result).toContain('lg:-mx-16')
    })
  })
})
