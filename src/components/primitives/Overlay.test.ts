import { describe, expect, it } from 'vitest'

import { overlayCva } from './Overlay.cva'

describe('Overlay Component', () => {
  describe('overlayCva - Base Classes', () => {
    it('should include absolute inset-0 pointer-events-none in all variants', () => {
      const result = overlayCva()
      expect(result).toContain('absolute')
      expect(result).toContain('inset-0')
      expect(result).toContain('pointer-events-none')
    })
  })

  describe('overlayCva - Default Variants', () => {
    it('should apply default preset (none)', () => {
      const result = overlayCva()
      // preset:none adds no additional classes
      expect(result).not.toContain('bg-')
    })

    it('should apply default blur (none)', () => {
      const result = overlayCva()
      // blur:none adds no backdrop-blur
      expect(result).not.toContain('backdrop-blur')
    })
  })

  describe('overlayCva - Preset Prop', () => {
    it('should apply none preset (no overlay)', () => {
      const result = overlayCva({ preset: 'none' })
      expect(result).not.toContain('bg-')
    })

    it('should apply soft preset (20% background)', () => {
      const result = overlayCva({ preset: 'soft' })
      expect(result).toContain('bg-background/20')
    })

    it('should apply medium preset (40% background)', () => {
      const result = overlayCva({ preset: 'medium' })
      expect(result).toContain('bg-background/40')
    })

    it('should apply strong preset (60% background)', () => {
      const result = overlayCva({ preset: 'strong' })
      expect(result).toContain('bg-background/60')
    })

    it('should apply top-fade preset (gradient from top)', () => {
      const result = overlayCva({ preset: 'top-fade' })
      expect(result).toContain('bg-gradient-to-b')
      expect(result).toContain('from-background/40')
      expect(result).toContain('to-transparent')
    })

    it('should apply bottom-fade preset (gradient from bottom)', () => {
      const result = overlayCva({ preset: 'bottom-fade' })
      expect(result).toContain('bg-gradient-to-t')
      expect(result).toContain('from-background/40')
      expect(result).toContain('to-transparent')
    })
  })

  describe('overlayCva - Blur Prop', () => {
    it('should apply none blur (no backdrop-blur)', () => {
      const result = overlayCva({ blur: 'none' })
      expect(result).not.toContain('backdrop-blur')
    })

    it('should apply sm blur', () => {
      const result = overlayCva({ blur: 'sm' })
      expect(result).toContain('backdrop-blur-sm')
    })

    it('should apply md blur', () => {
      const result = overlayCva({ blur: 'md' })
      expect(result).toContain('backdrop-blur')
      expect(result).not.toContain('backdrop-blur-sm')
      expect(result).not.toContain('backdrop-blur-lg')
    })

    it('should apply lg blur', () => {
      const result = overlayCva({ blur: 'lg' })
      expect(result).toContain('backdrop-blur-lg')
    })
  })

  describe('overlayCva - Preset + Blur Combinations', () => {
    it('should work with preset and blur combined', () => {
      const result = overlayCva({ preset: 'medium', blur: 'md' })
      expect(result).toContain('bg-background/40')
      expect(result).toContain('backdrop-blur')
    })

    it('should work with all preset and blur combinations', () => {
      const presets = ['none', 'soft', 'medium', 'strong', 'top-fade', 'bottom-fade'] as const
      const blurs = ['none', 'sm', 'md', 'lg'] as const

      presets.forEach((preset) => {
        blurs.forEach((blur) => {
          const result = overlayCva({ preset, blur })
          expect(result).toBeTruthy()
          expect(result).toContain('absolute')
          expect(result).toContain('inset-0')
          expect(result).toContain('pointer-events-none')
        })
      })
    })
  })

  describe('overlayCva - Glassmorphism Effect', () => {
    it('should create glassmorphism with soft preset and blur', () => {
      const result = overlayCva({ preset: 'soft', blur: 'lg' })
      expect(result).toContain('bg-background/20')
      expect(result).toContain('backdrop-blur-lg')
    })
  })

  describe('overlayCva - Edge Cases', () => {
    it('should handle undefined preset (use default)', () => {
      const result = overlayCva({ preset: undefined })
      // Default is none
      expect(result).not.toContain('bg-')
    })

    it('should handle undefined blur (use default)', () => {
      const result = overlayCva({ blur: undefined })
      // Default is none
      expect(result).not.toContain('backdrop-blur')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = overlayCva({})
      expect(result).toContain('absolute')
      expect(result).toContain('inset-0')
      expect(result).toContain('pointer-events-none')
    })
  })
})
