import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Container from './Container.astro'

describe('Container.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Container, { props: {} })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Container, {
        props: {},
        slots: { default: '<p>Container Content</p>' },
      })

      const div = root.querySelector('div')
      expect(div?.textContent).toContain('Container Content')
    })

    it('should apply variant classes', async () => {
      const root = await renderAstroComponent(Container, { props: {} })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['relative', 'w-full'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Container, {
        props: { class: 'custom-class' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-class')).toBeTruthy()
      expect(div).toHaveClasses(['relative', 'w-full'])
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Container, {
        props: { 'data-testid': 'container', id: 'test-container' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-container')
      expect(div).toHaveDataAttribute('data-testid', 'container')
    })
  })
})
