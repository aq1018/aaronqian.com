import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Badge from './Badge.astro'

import { renderAstroComponent } from '@test/testHelpers'

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
      expect(span?.classList.contains('custom-class')).toBe(true)
      expect(span).toHaveClasses(['inline-flex']) // Base class still present
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Badge, {
        props: { id: 'test-badge', 'data-testid': 'badge' },
      })

      const span = root.querySelector('span')
      expect(span?.id).toBe('test-badge')
      expect(span).toHaveDataAttribute('data-testid', 'badge')
    })
  })
})
