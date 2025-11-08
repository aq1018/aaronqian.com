import { describe, expect, it } from 'vitest'

import Prose from './Prose.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Prose.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Prose, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Prose, {
        props: {},
        slots: { default: '<p>Markdown content here</p>' },
      })

      const div = root.querySelector('div')
      expect(div?.textContent).toContain('Markdown content here')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Prose, {
        props: { size: 'sm' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['prose', 'prose-invert', 'font-mono'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Prose, {
        props: { class: 'custom-prose' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-prose')).toBe(true)
      expect(div).toHaveClasses(['prose', 'prose-invert']) // Base classes still present
    })
  })

  describe('Prose Classes', () => {
    it('should always include prose and prose-invert classes', async () => {
      const root = await renderAstroComponent(Prose, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['prose', 'prose-invert'])
    })

    it('should include prose classes with custom size', async () => {
      const root = await renderAstroComponent(Prose, {
        props: { size: 'base' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['prose', 'prose-invert'])
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Prose, {
        props: { id: 'article-content', 'data-testid': 'prose' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('article-content')
      expect(div).toHaveDataAttribute('data-testid', 'prose')
    })
  })
})
