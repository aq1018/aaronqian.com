import { describe, expect, it } from 'vitest'

import { collapsibleContentVariants, collapsibleVariants } from './Collapsible.cva'

describe('Collapsible Component', () => {
  describe('collapsibleVariants - Base Classes', () => {
    it('should use CSS Grid for smooth height transitions', () => {
      const result = collapsibleVariants()
      expect(result).toContain('grid')
      expect(result).toContain('collapsible-wrapper')
    })

    it('should include collapsible-wrapper class for CSS selectors', () => {
      const result = collapsibleVariants()
      expect(result).toContain('collapsible-wrapper')
    })

    it('should apply default variants (normal speed, not bordered)', () => {
      const result = collapsibleVariants()
      expect(result).toContain('transition-[grid-template-rows]')
      expect(result).toContain('ease-out')
      expect(result).toContain('duration-300')
      expect(result).not.toContain('border')
    })
  })

  describe('collapsibleVariants - Speed Variant', () => {
    it('should apply fast speed (150ms)', () => {
      const result = collapsibleVariants({ speed: 'fast' })
      expect(result).toContain('transition-[grid-template-rows]')
      expect(result).toContain('ease-out')
      expect(result).toContain('duration-150')
      expect(result).not.toContain('duration-300')
    })

    it('should apply normal speed (300ms)', () => {
      const result = collapsibleVariants({ speed: 'normal' })
      expect(result).toContain('transition-[grid-template-rows]')
      expect(result).toContain('ease-out')
      expect(result).toContain('duration-300')
    })

    it('should apply slow speed (500ms)', () => {
      const result = collapsibleVariants({ speed: 'slow' })
      expect(result).toContain('transition-[grid-template-rows]')
      expect(result).toContain('ease-out')
      expect(result).toContain('duration-500')
      expect(result).not.toContain('duration-300')
    })
  })

  describe('collapsibleVariants - Bordered Variant', () => {
    it('should apply border styles when bordered is true', () => {
      const result = collapsibleVariants({ bordered: true })
      expect(result).toContain('rounded-lg')
      expect(result).toContain('border')
      expect(result).toContain('border-border')
    })

    it('should not apply border styles when bordered is false', () => {
      const result = collapsibleVariants({ bordered: false })
      expect(result).not.toContain('border')
      expect(result).not.toContain('rounded-lg')
    })

    it('should not apply border styles by default', () => {
      const result = collapsibleVariants()
      expect(result).not.toContain('border')
    })
  })

  describe('collapsibleVariants - Variant Combinations', () => {
    it('should combine speed and bordered variants', () => {
      const result = collapsibleVariants({ speed: 'fast', bordered: true })
      expect(result).toContain('duration-150')
      expect(result).toContain('border')
      expect(result).toContain('rounded-lg')
    })

    it('should handle all speed options with bordered', () => {
      const speeds = ['fast', 'normal', 'slow'] as const
      const durations = ['duration-150', 'duration-300', 'duration-500']

      speeds.forEach((speed, index) => {
        const result = collapsibleVariants({ speed, bordered: true })
        expect(result).toContain(durations[index])
        expect(result).toContain('border')
      })
    })
  })

  describe('collapsibleVariants - Custom Class Merging', () => {
    it('should merge custom classes with variant classes', () => {
      const result = collapsibleVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('grid')
      expect(result).toContain('collapsible-wrapper')
    })

    it('should support multiple custom classes', () => {
      const result = collapsibleVariants({ class: 'custom-1 custom-2 custom-3' })
      expect(result).toContain('custom-1')
      expect(result).toContain('custom-2')
      expect(result).toContain('custom-3')
    })
  })

  describe('collapsibleVariants - Edge Cases', () => {
    it('should handle null class gracefully', () => {
      const result = collapsibleVariants({ class: undefined })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = collapsibleVariants({ class: '' })
      expect(result).toBeTruthy()
    })
  })

  describe('collapsibleContentVariants - Base Classes', () => {
    it('should include overflow hidden for grid technique', () => {
      const result = collapsibleContentVariants()
      expect(result).toContain('overflow-hidden')
      expect(result).toContain('collapsible-content')
    })

    it('should include collapsible-content class for CSS selectors', () => {
      const result = collapsibleContentVariants()
      expect(result).toContain('collapsible-content')
    })
  })

  describe('collapsibleContentVariants - Custom Class Merging', () => {
    it('should merge custom classes with base classes', () => {
      const result = collapsibleContentVariants({ class: 'custom-class' })
      expect(result).toContain('custom-class')
      expect(result).toContain('overflow-hidden')
      expect(result).toContain('collapsible-content')
    })
  })

  describe('CSS Grid Architecture', () => {
    it('should use grid-template-rows transition', () => {
      const result = collapsibleVariants()
      expect(result).toContain('transition-[grid-template-rows]')
    })

    it('should use ease-out timing function for natural motion', () => {
      const wrapper = collapsibleVariants()
      expect(wrapper).toContain('ease-out')
    })

    it('should use grid display mode', () => {
      const result = collapsibleVariants()
      expect(result).toContain('grid')
    })

    it('should support configurable animation duration via speed variant', () => {
      const fast = collapsibleVariants({ speed: 'fast' })
      const normal = collapsibleVariants({ speed: 'normal' })
      const slow = collapsibleVariants({ speed: 'slow' })

      expect(fast).toContain('duration-150')
      expect(normal).toContain('duration-300')
      expect(slow).toContain('duration-500')
    })
  })

  describe('CSS Integration', () => {
    it('should provide class names for CSS selectors (wrapper)', () => {
      const result = collapsibleVariants()
      // The .collapsible-wrapper class is used in global CSS with data-open attribute selectors
      expect(result).toContain('collapsible-wrapper')
    })

    it('should provide class names for CSS selectors (content)', () => {
      const result = collapsibleContentVariants()
      // The .collapsible-content class wraps content with overflow-hidden
      expect(result).toContain('collapsible-content')
    })

    it('should use overflow-hidden on content for grid technique', () => {
      const result = collapsibleContentVariants()
      expect(result).toContain('overflow-hidden')
    })
  })

  describe('Class Composition', () => {
    it('should generate valid classes for wrapper', () => {
      const result = collapsibleVariants()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should generate valid classes for content', () => {
      const result = collapsibleContentVariants()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should use modern CSS Grid technique', () => {
      const wrapper = collapsibleVariants()
      // Modern approach: grid + grid-template-rows transition
      expect(wrapper).toContain('grid')
      expect(wrapper).toContain('transition-[grid-template-rows]')
    })
  })
})
