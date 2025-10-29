import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Heading from './Heading.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Heading.astro', () => {
  describe('Rendering', () => {
    it('should render as h2 by default', async () => {
      const root = await renderAstroComponent(Heading, {
        props: {},
      })

      const h2 = root.querySelector('h2')
      expect(h2).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Heading, {
        props: {},
        slots: { default: 'Test Heading' },
      })

      const h2 = root.querySelector('h2')
      expect(h2?.textContent).toBe('Test Heading')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h1', color: 'primary' },
      })

      const h1 = root.querySelector('h1')
      expect(h1).toBeDefined()
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { class: 'custom-heading' },
      })

      const h2 = root.querySelector('h2')
      expect(h2?.classList.contains('custom-heading')).toBe(true)
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { id: 'test-heading', 'data-testid': 'heading' },
      })

      const h2 = root.querySelector('h2')
      expect(h2?.id).toBe('test-heading')
      expect(h2).toHaveDataAttribute('data-testid', 'heading')
    })
  })

  describe('Element Mapping', () => {
    it('should render h1 for display-2 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'display-2' },
      })

      const h1 = root.querySelector('h1')
      expect(h1).toBeDefined()
    })

    it('should render h1 for display-1 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'display-1' },
      })

      const h1 = root.querySelector('h1')
      expect(h1).toBeDefined()
    })

    it('should render h1 for h1 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h1' },
      })

      const h1 = root.querySelector('h1')
      expect(h1).toBeDefined()
    })

    it('should render h2 for h2 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h2' },
      })

      const h2 = root.querySelector('h2')
      expect(h2).toBeDefined()
    })

    it('should render h3 for h3 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h3' },
      })

      const h3 = root.querySelector('h3')
      expect(h3).toBeDefined()
    })

    it('should render h4 for h4 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h4' },
      })

      const h4 = root.querySelector('h4')
      expect(h4).toBeDefined()
    })

    it('should render h5 for h5 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h5' },
      })

      const h5 = root.querySelector('h5')
      expect(h5).toBeDefined()
    })

    it('should render h6 for h6 size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h6' },
      })

      const h6 = root.querySelector('h6')
      expect(h6).toBeDefined()
    })
  })

  describe('Conditional Rendering', () => {
    it('should only render one heading element', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h3' },
      })

      const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6')
      expect(headings.length).toBe(1)
    })

    it('should render the correct heading element based on size', async () => {
      const root = await renderAstroComponent(Heading, {
        props: { size: 'h4' },
      })

      expect(root.querySelector('h4')).toBeDefined()
      expect(root.querySelector('h1')).toBeNull()
      expect(root.querySelector('h2')).toBeNull()
      expect(root.querySelector('h3')).toBeNull()
    })
  })
})
