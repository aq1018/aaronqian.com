import { describe, expect, it } from 'vitest'

import { proseCva } from './Prose.cva'

import {
  testAllVariants,
  testBaseClasses,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Prose.cva', () => {
  testBaseClasses(proseCva, [
    'max-w-none',
    'font-mono',
    'leading-relaxed',
    'text-muted',
    'prose-headings:font-mono',
    'prose-headings:text-content',
    'prose-a:text-link',
    'prose-code:text-primary',
  ])

  testDefaultVariants(proseCva, ['text-sm'])

  describe('Size Variants', () => {
    testAllVariants(proseCva, 'size', ['sm', 'base'])

    it('should render sm size correctly', () => {
      expect(proseCva({ size: 'sm' })).toContainClasses(['text-sm', 'font-mono', 'text-muted'])
    })

    it('should render base size correctly', () => {
      expect(proseCva({ size: 'base' })).toContainClasses(['text-base', 'font-mono', 'text-muted'])
    })
  })

  testEdgeCases(proseCva, { size: 'sm' }, ['text-sm', 'font-mono'])

  describe('Terminal Aesthetic Consistency', () => {
    it('should use monospace font throughout', () => {
      expect(proseCva()).toContainClasses([
        'font-mono',
        'prose-headings:font-mono',
        'prose-code:font-mono',
      ])
    })

    it('should use muted color for body text', () => {
      expect(proseCva()).toContainClasses([
        'text-muted',
        'prose-p:text-muted',
        'prose-ul:text-muted',
        'prose-ol:text-muted',
        'prose-table:text-muted',
      ])
    })

    it('should use content color for emphasis elements', () => {
      expect(proseCva()).toContainClasses([
        'prose-headings:text-content',
        'prose-strong:text-content',
        'prose-th:text-content',
      ])
    })

    it('should use primary color for code', () => {
      expect(proseCva()).toContainClasses(['prose-code:text-primary'])
    })
  })

  describe('Link Behavior', () => {
    it('should match Link primitive behavior', () => {
      expect(proseCva()).toContainClasses([
        'prose-a:text-link',
        'prose-a:underline',
        'prose-a:decoration-transparent',
        'hover:prose-a:decoration-link',
        'prose-a:transition-colors',
      ])
    })
  })

  describe('Code Styling', () => {
    it('should have distinct inline code and code block styles', () => {
      const result = proseCva()

      // Inline code: primary text, rounded, padded, subtle bg
      expect(result).toContainClasses([
        'prose-code:text-primary',
        'prose-code:rounded',
        'prose-code:bg-muted/10',
        'prose-code:px-1',
      ])

      // Code blocks: content text, padded, subtle bg
      expect(result).toContainClasses([
        'prose-pre:text-content',
        'prose-pre:bg-muted/10',
        'prose-pre:p-4',
        'prose-pre:rounded',
      ])
    })
  })

  describe('Consistency Across Sizes', () => {
    it('should maintain all prose styles across size variants', () => {
      const sm = proseCva({ size: 'sm' })
      const base = proseCva({ size: 'base' })

      const proseClasses = [
        'prose-headings:font-mono',
        'prose-a:text-link',
        'prose-code:text-primary',
        'prose-strong:text-content',
      ]

      expect(sm).toContainClasses(proseClasses)
      expect(base).toContainClasses(proseClasses)
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

  describe('Element Coverage', () => {
    it('should style all standard markdown elements', () => {
      const result = proseCva()

      const elementPrefixes = [
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

      elementPrefixes.forEach((prefix) => {
        const hasStyle = result.split(' ').some((className) => className.startsWith(prefix))
        expect(hasStyle).toBe(true)
      })
    })
  })

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for project log entries', () => {
      expect(proseCva({ size: 'sm' })).toContainClasses([
        'text-sm',
        'font-mono',
        'prose-code:text-primary',
      ])
    })

    it('should provide appropriate styles for blog posts', () => {
      expect(proseCva({ size: 'base' })).toContainClasses([
        'text-base',
        'font-mono',
        'prose-headings:text-content',
      ])
    })
  })
})
