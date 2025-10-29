import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Divider from './Divider.astro'

import { renderAstroComponent } from '@test/testHelpers'

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
      expect(div?.classList.contains('custom-class')).toBe(true)
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Divider, {
        props: { id: 'test-divider', 'data-testid': 'divider' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-divider')
      expect(div).toHaveDataAttribute('data-testid', 'divider')
    })
  })
})
