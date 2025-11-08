import { describe, expect, it } from 'vitest'

import Collapsible from './Collapsible.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Collapsible.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element with nested content div', async () => {
      const root = await renderAstroComponent(Collapsible, { props: {} })

      const wrapper = root.querySelector('div')
      const content = wrapper?.querySelector('div')

      expect(wrapper).toBeDefined()
      expect(content).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Collapsible, {
        props: {},
        slots: { default: '<p>Collapsible Content</p>' },
      })

      const wrapper = root.querySelector('div')
      expect(wrapper?.textContent).toContain('Collapsible Content')
    })

    it('should apply wrapper variant classes', async () => {
      const root = await renderAstroComponent(Collapsible, { props: {} })

      const wrapper = root.querySelector('div')
      expect(wrapper).toHaveClasses(['grid', 'collapsible-wrapper'])
    })

    it('should apply content variant classes to inner div', async () => {
      const root = await renderAstroComponent(Collapsible, { props: {} })

      const wrapper = root.querySelector('div')
      const content = wrapper?.querySelector('div')

      expect(content).toHaveClasses(['overflow-hidden', 'collapsible-content'])
    })

    it('should merge custom classes with wrapper variant classes', async () => {
      const root = await renderAstroComponent(Collapsible, {
        props: { class: 'custom-class' },
      })

      const wrapper = root.querySelector('div')
      expect(wrapper?.classList.contains('custom-class')).toBe(true)
      expect(wrapper).toHaveClasses(['grid'])
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Collapsible, {
        props: { id: 'test-collapsible', 'data-testid': 'collapsible' },
      })

      const wrapper = root.querySelector('div')
      expect(wrapper?.id).toBe('test-collapsible')
      expect(wrapper).toHaveDataAttribute('data-testid', 'collapsible')
    })
  })

  describe('State Attributes', () => {
    it('should apply data-collapsible attribute', async () => {
      const root = await renderAstroComponent(Collapsible, { props: {} })

      const wrapper = root.querySelector('div')
      expect(wrapper).toHaveDataAttribute('data-collapsible')
    })

    it('should set data-open to "false" by default', async () => {
      const root = await renderAstroComponent(Collapsible, { props: {} })

      const wrapper = root.querySelector('div')
      expect(wrapper).toHaveDataAttribute('data-open', 'false')
    })

    it('should set data-open to "true" when open prop is true', async () => {
      const root = await renderAstroComponent(Collapsible, { props: { open: true } })

      const wrapper = root.querySelector('div')
      expect(wrapper).toHaveDataAttribute('data-open', 'true')
    })

    it('should set aria-expanded based on open prop', async () => {
      const closed = await renderAstroComponent(Collapsible, { props: { open: false } })
      const open = await renderAstroComponent(Collapsible, { props: { open: true } })

      expect(closed.querySelector('div')?.getAttribute('aria-expanded')).toBe('false')
      expect(open.querySelector('div')?.getAttribute('aria-expanded')).toBe('true')
    })
  })
})
