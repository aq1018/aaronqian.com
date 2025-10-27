import { describe, expect, it } from 'vitest'

import { navBarCva } from './NavBar.cva'

describe('NavBar Component', () => {
  describe('navBarCva - Base Classes', () => {
    it('should include w-full for full width', () => {
      const result = navBarCva()
      expect(result).toContain('w-full')
    })
  })

  describe('navBarCva - Default Variants', () => {
    it('should apply default position (static)', () => {
      const result = navBarCva()
      expect(result).not.toContain('sticky')
      expect(result).not.toContain('fixed')
    })

    it('should apply default border (none)', () => {
      const result = navBarCva()
      expect(result).not.toContain('border-')
    })

    it('should apply default backdrop (false)', () => {
      const result = navBarCva()
      expect(result).toContain('bg-background')
      expect(result).not.toContain('backdrop-blur')
    })
  })

  describe('navBarCva - Position Prop', () => {
    it('should apply static position (no positioning classes)', () => {
      const result = navBarCva({ position: 'static' })
      expect(result).not.toContain('sticky')
      expect(result).not.toContain('fixed')
    })

    it('should apply sticky position with top placement', () => {
      const result = navBarCva({ position: 'sticky', placement: 'top' })
      expect(result).toContain('sticky')
      expect(result).toContain('top-0')
      expect(result).toContain('z-50')
    })

    it('should apply sticky position with bottom placement', () => {
      const result = navBarCva({ position: 'sticky', placement: 'bottom' })
      expect(result).toContain('sticky')
      expect(result).toContain('bottom-0')
      expect(result).toContain('z-50')
    })

    it('should apply fixed position with top placement', () => {
      const result = navBarCva({ position: 'fixed', placement: 'top' })
      expect(result).toContain('fixed')
      expect(result).toContain('top-0')
      expect(result).toContain('z-50')
    })

    it('should apply fixed position with bottom placement', () => {
      const result = navBarCva({ position: 'fixed', placement: 'bottom' })
      expect(result).toContain('fixed')
      expect(result).toContain('bottom-0')
      expect(result).toContain('z-50')
    })
  })

  describe('navBarCva - Border Prop', () => {
    it('should apply no border (none)', () => {
      const result = navBarCva({ border: 'none' })
      expect(result).not.toContain('border-')
    })

    it('should apply top border', () => {
      const result = navBarCva({ border: 'top' })
      expect(result).toContain('border-t')
      expect(result).toContain('border-border')
    })

    it('should apply bottom border', () => {
      const result = navBarCva({ border: 'bottom' })
      expect(result).toContain('border-b')
      expect(result).toContain('border-border')
    })

    it('should apply both borders', () => {
      const result = navBarCva({ border: 'both' })
      expect(result).toContain('border-y')
      expect(result).toContain('border-border')
    })
  })

  describe('navBarCva - Backdrop Prop', () => {
    it('should apply solid background when backdrop is false', () => {
      const result = navBarCva({ backdrop: false })
      expect(result).toContain('bg-background')
      expect(result).not.toContain('backdrop-blur')
      expect(result).not.toContain('/95')
    })

    it('should apply translucent background with blur when backdrop is true', () => {
      const result = navBarCva({ backdrop: true })
      expect(result).toContain('bg-background/95')
      expect(result).toContain('backdrop-blur-sm')
    })
  })

  describe('navBarCva - Compound Variants', () => {
    it('should combine sticky top with all other variants', () => {
      const result = navBarCva({
        position: 'sticky',
        placement: 'top',
        border: 'bottom',
        backdrop: true,
      })
      expect(result).toContain('sticky')
      expect(result).toContain('top-0')
      expect(result).toContain('z-50')
      expect(result).toContain('border-b')
      expect(result).toContain('bg-background/95')
      expect(result).toContain('backdrop-blur-sm')
    })

    it('should combine fixed bottom with all other variants', () => {
      const result = navBarCva({
        position: 'fixed',
        placement: 'bottom',
        border: 'top',
        backdrop: false,
      })
      expect(result).toContain('fixed')
      expect(result).toContain('bottom-0')
      expect(result).toContain('z-50')
      expect(result).toContain('border-t')
      expect(result).toContain('bg-background')
    })
  })

  describe('navBarCva - All Position + Placement Combinations', () => {
    const positions = ['static', 'sticky', 'fixed'] as const
    const placements = ['top', 'bottom'] as const

    it('should generate valid classes for all position + placement combinations', () => {
      positions.forEach((position) => {
        placements.forEach((placement) => {
          const result = navBarCva({ position, placement })
          expect(result).toBeTruthy()
          expect(result).toContain('w-full')

          // Check position-specific classes
          if (position === 'sticky') {
            expect(result).toContain('sticky')
            expect(result).toContain('z-50')
            if (placement === 'top') {
              expect(result).toContain('top-0')
            } else {
              expect(result).toContain('bottom-0')
            }
          } else if (position === 'fixed') {
            expect(result).toContain('fixed')
            expect(result).toContain('z-50')
            if (placement === 'top') {
              expect(result).toContain('top-0')
            } else {
              expect(result).toContain('bottom-0')
            }
          }
        })
      })
    })
  })

  describe('navBarCva - Edge Cases', () => {
    it('should handle undefined position (use default)', () => {
      const result = navBarCva({ position: undefined })
      expect(result).not.toContain('sticky')
      expect(result).not.toContain('fixed')
    })

    it('should handle undefined border (use default)', () => {
      const result = navBarCva({ border: undefined })
      expect(result).not.toContain('border-')
    })

    it('should handle undefined backdrop (use default)', () => {
      const result = navBarCva({ backdrop: undefined })
      expect(result).toContain('bg-background')
    })

    it('should handle empty object (use all defaults)', () => {
      const result = navBarCva({})
      expect(result).toContain('w-full')
      expect(result).toContain('bg-background')
      expect(result).not.toContain('border-')
    })
  })

  describe('Real-World Usage Patterns', () => {
    it('should support typical sticky header navigation', () => {
      const result = navBarCva({
        position: 'sticky',
        placement: 'top',
        border: 'bottom',
        backdrop: true,
      })
      expect(result).toContain('sticky')
      expect(result).toContain('top-0')
      expect(result).toContain('z-50')
      expect(result).toContain('border-b')
      expect(result).toContain('bg-background/95')
      expect(result).toContain('backdrop-blur-sm')
    })

    it('should support static navigation without border or backdrop', () => {
      const result = navBarCva({
        position: 'static',
        border: 'none',
        backdrop: false,
      })
      expect(result).toContain('w-full')
      expect(result).toContain('bg-background')
      expect(result).not.toContain('sticky')
      expect(result).not.toContain('border-')
      expect(result).not.toContain('backdrop-blur')
    })

    it('should support fixed footer navigation', () => {
      const result = navBarCva({
        position: 'fixed',
        placement: 'bottom',
        border: 'top',
        backdrop: false,
      })
      expect(result).toContain('fixed')
      expect(result).toContain('bottom-0')
      expect(result).toContain('z-50')
      expect(result).toContain('border-t')
    })
  })
})
