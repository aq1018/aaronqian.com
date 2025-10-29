import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import NavBar from './NavBar.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('NavBar.astro', () => {
  describe('Rendering', () => {
    it('should render as a nav element by default', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: {},
      })

      const nav = root.querySelector('nav')
      expect(nav).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: {},
        slots: { default: '<span>Nav Content</span>' },
      })

      const nav = root.querySelector('nav')
      expect(nav?.querySelector('span')?.textContent).toBe('Nav Content')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: { position: 'sticky', placement: 'top', backdrop: true },
      })

      const nav = root.querySelector('nav')
      expect(nav).toHaveClasses(['w-full'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: { class: 'custom-navbar' },
      })

      const nav = root.querySelector('nav')
      expect(nav?.classList.contains('custom-navbar')).toBe(true)
      expect(nav).toHaveClasses(['w-full'])
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: { id: 'test-navbar', 'data-testid': 'navbar' },
      })

      const nav = root.querySelector('nav')
      expect(nav?.id).toBe('test-navbar')
      expect(nav).toHaveDataAttribute('data-testid', 'navbar')
    })
  })

  describe('Polymorphic Element', () => {
    it('should render as nav by default', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: {},
      })

      expect(root.querySelector('nav')).toBeDefined()
    })

    it('should render as custom element when as prop is provided', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: { as: 'header' },
      })

      const header = root.querySelector('header')
      expect(header).toBeDefined()
      expect(header).toHaveClasses(['w-full'])
    })

    it('should render as div when specified', async () => {
      const root = await renderAstroComponent(NavBar, {
        props: { as: 'div' },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
      expect(div).toHaveClasses(['w-full'])
    })
  })
})
