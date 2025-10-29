import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Inset from './Inset.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Inset.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Inset, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Inset, {
        props: {},
        slots: { default: 'Inset Content' },
      })

      const div = root.querySelector('div')
      expect(div?.textContent.trim()).toBe('Inset Content')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Inset, {
        props: { space: 'lg', squish: 'sm' },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Inset, {
        props: { class: 'custom-inset' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-inset')).toBe(true)
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Inset, {
        props: { id: 'test-inset', 'data-testid': 'inset' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-inset')
      expect(div).toHaveDataAttribute('data-testid', 'inset')
    })
  })
})
