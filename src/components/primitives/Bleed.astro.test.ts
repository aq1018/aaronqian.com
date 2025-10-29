import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Bleed from './Bleed.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Bleed.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Bleed, { props: {} })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Bleed, {
        props: {},
        slots: { default: '<p>Bleed Content</p>' },
      })

      const div = root.querySelector('div')
      expect(div?.textContent).toContain('Bleed Content')
    })

    it('should apply default variant classes', async () => {
      const root = await renderAstroComponent(Bleed, { props: {} })

      const div = root.querySelector('div')
      // Just check that classes are applied, don't re-test CVA
      expect(div?.className).toBeTruthy()
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Bleed, {
        props: { class: 'custom-class' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-class')).toBe(true)
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Bleed, {
        props: { id: 'test-bleed', 'data-testid': 'bleed' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-bleed')
      expect(div).toHaveDataAttribute('data-testid', 'bleed')
    })
  })
})
