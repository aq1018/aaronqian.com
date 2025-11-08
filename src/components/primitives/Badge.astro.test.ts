import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Badge from './Badge.astro'

describe('Badge.astro', () => {
  describe('Rendering', () => {
    it('should render as a span element', async () => {
      const root = await renderAstroComponent(Badge, {
        props: {},
      })

      const span = root.querySelector('span')
      expect(span).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Badge, {
        props: {},
        slots: { default: 'Badge Text' },
      })

      const span = root.querySelector('span')
      expect(span?.textContent.trim()).toBe('Badge Text')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Badge, {
        props: { color: 'primary', variant: 'solid' },
      })

      const span = root.querySelector('span')
      expect(span).toHaveClasses(['inline-flex', 'items-center'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Badge, {
        props: { class: 'custom-class' },
      })

      const span = root.querySelector('span')
      expect(span?.classList.contains('custom-class')).toBeTruthy()
      expect(span).toHaveClasses(['inline-flex']) // Base class still present
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Badge, {
        props: { 'data-testid': 'badge', id: 'test-badge' },
      })

      const span = root.querySelector('span')
      expect(span?.id).toBe('test-badge')
      expect(span).toHaveDataAttribute('data-testid', 'badge')
    })
  })
})
