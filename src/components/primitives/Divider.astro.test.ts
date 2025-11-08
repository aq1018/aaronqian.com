import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Divider from './Divider.astro'

describe('Divider.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Divider, { props: {} })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render with no content (self-closing)', async () => {
      const root = await renderAstroComponent(Divider, { props: {} })

      const div = root.querySelector('div')
      expect(div?.textContent).toBe('')
    })

    it('should apply variant classes', async () => {
      const root = await renderAstroComponent(Divider, { props: {} })

      const div = root.querySelector('div')
      // Check that default orientation classes are applied
      expect(div?.className).toBeTruthy()
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Divider, {
        props: { class: 'custom-class' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-class')).toBeTruthy()
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Divider, {
        props: { 'data-testid': 'divider', id: 'test-divider' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-divider')
      expect(div).toHaveDataAttribute('data-testid', 'divider')
    })
  })
})
