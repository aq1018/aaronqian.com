import { describe, expect, it } from 'vitest'

import Overlay from './Overlay.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Overlay.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Overlay, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Overlay, {
        props: { preset: 'soft', blur: 'md' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['absolute', 'inset-0', 'pointer-events-none'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Overlay, {
        props: { class: 'custom-overlay' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-overlay')).toBe(true)
      expect(div).toHaveClasses(['absolute']) // Base class still present
    })
  })

  describe('Accessibility', () => {
    it('should have aria-hidden attribute', async () => {
      const root = await renderAstroComponent(Overlay, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div?.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Overlay, {
        props: { id: 'hero-overlay', 'data-testid': 'overlay' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('hero-overlay')
      expect(div).toHaveDataAttribute('data-testid', 'overlay')
    })
  })
})
