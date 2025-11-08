import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Text from './Text.astro'

describe('Text.astro', () => {
  describe('Rendering', () => {
    it('should render as a p element by default', async () => {
      const root = await renderAstroComponent(Text, {
        props: {},
      })

      const p = root.querySelector('p')
      expect(p).toBeDefined()
    })

    it('should render with custom element type via as prop', async () => {
      const root = await renderAstroComponent(Text, {
        props: { as: 'span' },
      })

      const span = root.querySelector('span')
      expect(span).toBeDefined()
      expect(root.querySelector('p')).toBeNull()
    })

    it('should support div as element type', async () => {
      const root = await renderAstroComponent(Text, {
        props: { as: 'div' },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Text, {
        props: {},
        slots: { default: 'This is text content' },
      })

      const p = root.querySelector('p')
      expect(p?.textContent.trim()).toBe('This is text content')
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Text, {
        props: { class: 'custom-text' },
      })

      const p = root.querySelector('p')
      expect(p?.classList.contains('custom-text')).toBeTruthy()
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Text, {
        props: { 'data-testid': 'text', id: 'test-text' },
      })

      const p = root.querySelector('p')
      expect(p?.id).toBe('test-text')
      expect(p).toHaveDataAttribute('data-testid', 'text')
    })
  })

  describe('Polymorphic Element Rendering', () => {
    const elementTypes = ['p', 'span', 'div', 'label', 'strong', 'em'] as const

    it('should render all common element types', async () => {
      for (const elementType of elementTypes) {
        const root = await renderAstroComponent(Text, {
          props: { as: elementType },
        })

        const element = root.querySelector(elementType)
        expect(element).toBeDefined()
      }
    })

    it('should preserve slot content across element types', async () => {
      const content = 'Test content'

      for (const elementType of elementTypes) {
        const root = await renderAstroComponent(Text, {
          props: { as: elementType },
          slots: { default: content },
        })

        const element = root.querySelector(elementType)
        expect(element?.textContent.trim()).toBe(content)
      }
    })
  })

  describe('Variant Props', () => {
    it('should handle size variant prop', async () => {
      const root = await renderAstroComponent(Text, {
        props: { size: 'small' },
      })

      const p = root.querySelector('p')
      expect(p).toBeDefined()
    })

    it('should handle color variant prop', async () => {
      const root = await renderAstroComponent(Text, {
        props: { color: 'muted' },
      })

      const p = root.querySelector('p')
      expect(p).toBeDefined()
    })

    it('should handle boolean variant props', async () => {
      const root = await renderAstroComponent(Text, {
        props: { italic: true, strong: true },
      })

      const p = root.querySelector('p')
      expect(p).toBeDefined()
    })

    it('should handle all variant props together', async () => {
      const root = await renderAstroComponent(Text, {
        props: {
          align: 'center',
          color: 'muted',
          family: 'mono',
          size: 'small',
          strong: true,
          uppercase: true,
        },
      })

      const p = root.querySelector('p')
      expect(p).toBeDefined()
    })
  })

  describe('Break Prop Handling', () => {
    it('should handle break prop (reserved keyword workaround)', async () => {
      const root = await renderAstroComponent(Text, {
        props: { break: 'words' },
      })

      const p = root.querySelector('p')
      expect(p).toBeDefined()
    })

    it('should handle break prop with element type', async () => {
      const root = await renderAstroComponent(Text, {
        props: { as: 'div', break: 'all' },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })
  })

  describe('Combined Features', () => {
    it('should combine polymorphic as prop with variants and custom class', async () => {
      const root = await renderAstroComponent(Text, {
        props: {
          as: 'span',
          class: 'custom-class',
          color: 'primary',
          size: 'small',
        },
        slots: { default: 'Content' },
      })

      const span = root.querySelector('span')
      expect(span?.textContent.trim()).toBe('Content')
      expect(span?.classList.contains('custom-class')).toBeTruthy()
    })

    it('should combine all features: element type, variants, attributes, slots', async () => {
      const root = await renderAstroComponent(Text, {
        props: {
          as: 'label',
          'data-field': 'username',
          id: 'field-label',
          size: 'label',
          strong: true,
        },
        slots: { default: 'Username' },
      })

      const label = root.querySelector('label')
      expect(label?.textContent.trim()).toBe('Username')
      expect(label?.id).toBe('field-label')
      expect(label).toHaveDataAttribute('data-field', 'username')
    })
  })
})
