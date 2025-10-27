import { describe, expect, it } from 'vitest'

import { proseCva } from './Prose.cva'

describe('Prose Component', () => {
  describe('proseCva - Base Classes', () => {
    it('should include terminal aesthetic base classes', () => {
      const result = proseCva()
      expect(result).toContain('max-w-none')
      expect(result).toContain('font-mono')
      expect(result).toContain('leading-relaxed')
      expect(result).toContain('text-muted')
    })

    it('should include prose heading styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-headings:font-mono')
      expect(result).toContain('prose-headings:text-content')
      expect(result).toContain('prose-headings:font-semibold')
    })

    it('should include prose paragraph styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-p:text-muted')
      expect(result).toContain('prose-p:leading-relaxed')
    })

    it('should include prose link styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-a:text-link')
      expect(result).toContain('prose-a:underline')
      expect(result).toContain('prose-a:decoration-transparent')
      expect(result).toContain('prose-a:transition-colors')
      expect(result).toContain('hover:prose-a:decoration-link')
    })

    it('should include prose code styles', () => {
      const result = proseCva()
      // Inline code
      expect(result).toContain('prose-code:rounded')
      expect(result).toContain('prose-code:bg-muted/10')
      expect(result).toContain('prose-code:px-1')
      expect(result).toContain('prose-code:py-0.5')
      expect(result).toContain('prose-code:text-primary')
      expect(result).toContain('prose-code:font-mono')

      // Code blocks
      expect(result).toContain('prose-pre:bg-muted/10')
      expect(result).toContain('prose-pre:text-content')
      expect(result).toContain('prose-pre:p-4')
      expect(result).toContain('prose-pre:rounded')
    })

    it('should include prose list styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-ul:text-muted')
      expect(result).toContain('prose-ol:text-muted')
      expect(result).toContain('prose-li:text-muted')
    })

    it('should include prose table styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-table:text-muted')
      expect(result).toContain('prose-th:text-content')
      expect(result).toContain('prose-th:font-semibold')
    })

    it('should include prose blockquote styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-blockquote:text-muted')
      expect(result).toContain('prose-blockquote:border-l-border')
    })

    it('should include prose hr styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-hr:border-border')
    })

    it('should include strong/em styles', () => {
      const result = proseCva()
      expect(result).toContain('prose-strong:text-content')
      expect(result).toContain('prose-strong:font-semibold')
    })
  })

  describe('proseCva - Default Variants', () => {
    it('should apply default size (sm)', () => {
      const result = proseCva()
      expect(result).toContain('text-sm')
    })
  })

  describe('proseCva - Size Variants', () => {
    it('should render sm size correctly', () => {
      const result = proseCva({ size: 'sm' })
      expect(result).toContain('text-sm')
      // Base classes should still be present
      expect(result).toContain('font-mono')
      expect(result).toContain('text-muted')
    })

    it('should render base size correctly', () => {
      const result = proseCva({ size: 'base' })
      expect(result).toContain('text-base')
      // Base classes should still be present
      expect(result).toContain('font-mono')
      expect(result).toContain('text-muted')
    })
  })

  describe('proseCva - Edge Cases', () => {
    it('should handle undefined size (use default)', () => {
      const result = proseCva({ size: undefined })
      expect(result).toContain('text-sm')
    })

    it('should handle empty object (use defaults)', () => {
      const result = proseCva({})
      expect(result).toContain('text-sm')
      expect(result).toContain('font-mono')
    })
  })

  describe('proseCva - Semantic Usage', () => {
    it('should provide appropriate styles for project log entries', () => {
      const result = proseCva({ size: 'sm' })
      expect(result).toContain('text-sm')
      expect(result).toContain('font-mono')
      expect(result).toContain('prose-code:text-primary')
    })

    it('should provide appropriate styles for blog posts', () => {
      const result = proseCva({ size: 'base' })
      expect(result).toContain('text-base')
      expect(result).toContain('font-mono')
      expect(result).toContain('prose-headings:text-content')
    })
  })

  describe('proseCva - Terminal Aesthetic Consistency', () => {
    it('should use monospace font throughout', () => {
      const result = proseCva()
      expect(result).toContain('font-mono')
      expect(result).toContain('prose-headings:font-mono')
      expect(result).toContain('prose-code:font-mono')
    })

    it('should use muted color for body text', () => {
      const result = proseCva()
      expect(result).toContain('text-muted')
      expect(result).toContain('prose-p:text-muted')
      expect(result).toContain('prose-ul:text-muted')
      expect(result).toContain('prose-ol:text-muted')
      expect(result).toContain('prose-table:text-muted')
    })

    it('should use content color for emphasis elements', () => {
      const result = proseCva()
      expect(result).toContain('prose-headings:text-content')
      expect(result).toContain('prose-strong:text-content')
      expect(result).toContain('prose-th:text-content')
    })

    it('should use primary color for code', () => {
      const result = proseCva()
      expect(result).toContain('prose-code:text-primary')
    })
  })

  describe('proseCva - Link Behavior', () => {
    it('should match Link primitive behavior', () => {
      const result = proseCva()
      // Should use same link styling as Link primitive
      expect(result).toContain('prose-a:text-link')
      expect(result).toContain('prose-a:underline')
      expect(result).toContain('prose-a:decoration-transparent')
      expect(result).toContain('hover:prose-a:decoration-link')
      expect(result).toContain('prose-a:transition-colors')
    })
  })

  describe('proseCva - Code Styling', () => {
    it('should have distinct inline code and code block styles', () => {
      const result = proseCva()

      // Inline code: primary text, rounded, padded, subtle bg
      expect(result).toContain('prose-code:text-primary')
      expect(result).toContain('prose-code:rounded')
      expect(result).toContain('prose-code:bg-muted/10')
      expect(result).toContain('prose-code:px-1')

      // Code blocks: content text, padded, subtle bg
      expect(result).toContain('prose-pre:text-content')
      expect(result).toContain('prose-pre:bg-muted/10')
      expect(result).toContain('prose-pre:p-4')
      expect(result).toContain('prose-pre:rounded')
    })
  })

  describe('proseCva - Consistency Across Sizes', () => {
    it('should maintain all prose styles across size variants', () => {
      const sm = proseCva({ size: 'sm' })
      const base = proseCva({ size: 'base' })

      // Both should have same prose-* classes (except text-* size)
      const proseClasses = [
        'prose-headings:font-mono',
        'prose-a:text-link',
        'prose-code:text-primary',
        'prose-strong:text-content',
      ]

      proseClasses.forEach((className) => {
        expect(sm).toContain(className)
        expect(base).toContain(className)
      })
    })

    it('should only differ in base text size', () => {
      const sm = proseCva({ size: 'sm' })
      const base = proseCva({ size: 'base' })

      expect(sm).toContain('text-sm')
      expect(base).toContain('text-base')
      expect(sm).not.toContain('text-base')
      expect(base).not.toContain('text-sm')
    })
  })

  describe('proseCva - Comprehensive Element Coverage', () => {
    it('should style all standard markdown elements', () => {
      const result = proseCva()

      const elementStyles = [
        'prose-headings',
        'prose-p',
        'prose-a',
        'prose-strong',
        'prose-code',
        'prose-pre',
        'prose-ul',
        'prose-ol',
        'prose-li',
        'prose-table',
        'prose-th',
        'prose-blockquote',
        'prose-hr',
      ]

      elementStyles.forEach((prefix) => {
        // Check that at least one style exists for each element
        const hasStyle = result.split(' ').some((className) => className.startsWith(prefix))
        expect(hasStyle).toBe(true)
      })
    })
  })
})
