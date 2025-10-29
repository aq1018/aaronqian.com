import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Sheet from './Sheet.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Sheet.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element by default', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: {},
        slots: { default: '<p>Sheet content</p>' },
      })

      const div = root.querySelector('div')
      expect(div?.textContent).toContain('Sheet content')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: { variant: 'outline', color: 'primary' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['overflow-hidden'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: { class: 'custom-sheet' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-sheet')).toBe(true)
      expect(div).toHaveClasses(['overflow-hidden']) // Base class still present
    })
  })

  describe('Polymorphic Component', () => {
    it('should render as custom element when as prop is provided', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: { as: 'section' },
      })

      const section = root.querySelector('section')
      expect(section).toBeDefined()
      expect(section).toHaveClasses(['overflow-hidden'])
    })

    it('should render as article element', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: { as: 'article' },
      })

      const article = root.querySelector('article')
      expect(article).toBeDefined()
      expect(article).toHaveClasses(['overflow-hidden'])
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Sheet, {
        props: { id: 'project-card', 'data-testid': 'sheet' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('project-card')
      expect(div).toHaveDataAttribute('data-testid', 'sheet')
    })
  })
})
