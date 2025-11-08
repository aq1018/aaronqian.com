import { describe, expect, it } from 'vitest'

import NavBarContent from './NavBarContent.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('NavBarContent.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element by default', async () => {
      const root = await renderAstroComponent(NavBarContent, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(NavBarContent, {
        props: {},
        slots: { default: '<span>Start</span><span>End</span>' },
      })

      const div = root.querySelector('div')
      expect(div?.textContent).toContain('Start')
      expect(div?.textContent).toContain('End')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(NavBarContent, {
        props: { height: 'md' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['flex', 'flex-row', 'items-center'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(NavBarContent, {
        props: { class: 'custom-nav' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-nav')).toBe(true)
      expect(div).toHaveClasses(['flex']) // Base class still present
    })
  })

  describe('Polymorphic Component', () => {
    it('should render as custom element when as prop is provided', async () => {
      const root = await renderAstroComponent(NavBarContent, {
        props: { as: 'nav' },
      })

      const nav = root.querySelector('nav')
      expect(nav).toBeDefined()
      expect(nav).toHaveClasses(['flex', 'flex-row'])
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(NavBarContent, {
        props: { id: 'main-nav', 'data-testid': 'navbar' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('main-nav')
      expect(div).toHaveDataAttribute('data-testid', 'navbar')
    })
  })
})
