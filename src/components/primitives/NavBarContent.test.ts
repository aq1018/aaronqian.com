import { describe, expect, it } from 'vitest'

import { navBarContentCva } from './NavBarContent.cva'

describe('NavBarContent Component', () => {
  describe('navBarContentCva - Base Classes', () => {
    it('should include flex layout classes', () => {
      const result = navBarContentCva()
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-between')
    })
  })

  describe('navBarContentCva - Default Variants', () => {
    it('should apply default height (md)', () => {
      const result = navBarContentCva()
      expect(result).toContain('h-16')
    })
  })

  describe('navBarContentCva - Height Prop', () => {
    it('should apply sm height', () => {
      const result = navBarContentCva({ height: 'sm' })
      expect(result).toContain('h-12')
      expect(result).not.toContain('h-16')
      expect(result).not.toContain('h-20')
      expect(result).not.toContain('h-24')
    })

    it('should apply md height (default)', () => {
      const result = navBarContentCva({ height: 'md' })
      expect(result).toContain('h-16')
      expect(result).not.toContain('h-12')
      expect(result).not.toContain('h-20')
      expect(result).not.toContain('h-24')
    })

    it('should apply lg height', () => {
      const result = navBarContentCva({ height: 'lg' })
      expect(result).toContain('h-20')
      expect(result).not.toContain('h-12')
      expect(result).not.toContain('h-16')
      expect(result).not.toContain('h-24')
    })

    it('should apply xl height', () => {
      const result = navBarContentCva({ height: 'xl' })
      expect(result).toContain('h-24')
      expect(result).not.toContain('h-12')
      expect(result).not.toContain('h-16')
      expect(result).not.toContain('h-20')
    })
  })

  describe('navBarContentCva - All Height Variants', () => {
    const heights = ['sm', 'md', 'lg', 'xl'] as const

    it('should generate valid classes for all height variants', () => {
      heights.forEach((height) => {
        const result = navBarContentCva({ height })
        expect(result).toBeTruthy()
        expect(result).toContain('flex')
        expect(result).toContain('flex-row')
        expect(result).toContain('items-center')
        expect(result).toContain('justify-between')
        expect(result).toMatch(/h-\d+/)
      })
    })
  })

  describe('navBarContentCva - Edge Cases', () => {
    it('should handle undefined height (use default)', () => {
      const result = navBarContentCva({ height: undefined })
      expect(result).toContain('h-16') // Default md
    })

    it('should handle empty object (use all defaults)', () => {
      const result = navBarContentCva({})
      expect(result).toContain('flex')
      expect(result).toContain('flex-row')
      expect(result).toContain('items-center')
      expect(result).toContain('justify-between')
      expect(result).toContain('h-16')
    })
  })

  describe('Real-World Usage Patterns', () => {
    it('should support standard navigation bar height', () => {
      const result = navBarContentCva({ height: 'md' })
      expect(result).toContain('h-16')
      expect(result).toContain('flex-row')
      expect(result).toContain('justify-between')
    })

    it('should support compact navigation bar', () => {
      const result = navBarContentCva({ height: 'sm' })
      expect(result).toContain('h-12')
      expect(result).toContain('items-center')
    })

    it('should support large hero navigation bar', () => {
      const result = navBarContentCva({ height: 'xl' })
      expect(result).toContain('h-24')
      expect(result).toContain('justify-between')
    })
  })

  describe('Layout Consistency', () => {
    it('should always include flex layout classes regardless of height', () => {
      const heights = ['sm', 'md', 'lg', 'xl'] as const
      heights.forEach((height) => {
        const result = navBarContentCva({ height })
        expect(result).toContain('flex')
        expect(result).toContain('flex-row')
        expect(result).toContain('items-center')
        expect(result).toContain('justify-between')
      })
    })
  })
})
