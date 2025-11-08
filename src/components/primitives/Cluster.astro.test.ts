import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Cluster from './Cluster.astro'

describe('Cluster.astro', () => {
  describe('Rendering', () => {
    it('should render as a span element', async () => {
      const root = await renderAstroComponent(Cluster, { props: {} })

      const span = root.querySelector('span')
      expect(span).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Cluster, {
        props: {},
        slots: { default: '<span>Item 1</span><span>Item 2</span>' },
      })

      const span = root.querySelector('span')
      expect(span?.textContent).toContain('Item 1')
      expect(span?.textContent).toContain('Item 2')
    })

    it('should apply variant classes', async () => {
      const root = await renderAstroComponent(Cluster, { props: {} })

      const span = root.querySelector('span')
      expect(span).toHaveClasses(['inline-flex'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Cluster, {
        props: { class: 'custom-class' },
      })

      const span = root.querySelector('span')
      expect(span?.classList.contains('custom-class')).toBeTruthy()
      expect(span).toHaveClasses(['inline-flex'])
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Cluster, {
        props: { 'data-testid': 'cluster', id: 'test-cluster' },
      })

      const span = root.querySelector('span')
      expect(span?.id).toBe('test-cluster')
      expect(span).toHaveDataAttribute('data-testid', 'cluster')
    })
  })
})
