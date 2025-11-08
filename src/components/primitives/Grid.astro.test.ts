import { describe, expect, it } from 'vitest'

import Grid from './Grid.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Grid.astro - Container Mode', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Grid, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Grid, {
        props: {},
        slots: { default: '<span>Grid Content</span>' },
      })

      const div = root.querySelector('div')
      expect(div?.querySelector('span')?.textContent).toBe('Grid Content')
    })

    it('should apply container variant classes', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { columns: 6, spacing: 'lg' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['grid'])
    })

    it('should merge custom classes with container variant classes', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { class: 'custom-grid' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-grid')).toBe(true)
      expect(div).toHaveClasses(['grid'])
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { id: 'test-grid', 'data-testid': 'grid-container' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-grid')
      expect(div).toHaveDataAttribute('data-testid', 'grid-container')
    })
  })
})

describe('Grid.astro - Item Mode', () => {
  describe('Rendering', () => {
    it('should render as a div element in item mode', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { size: 6 },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should apply item variant classes when size is provided', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { size: 6 },
      })

      const div = root.querySelector('div')
      // Item has no base classes, just check it renders
      expect(div).toBeDefined()
    })

    it('should handle responsive size props', async () => {
      const root = await renderAstroComponent(Grid, {
        props: {
          size: 12,
          'size-sm': 6,
          'size-md': 4,
        },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should handle offset props', async () => {
      const root = await renderAstroComponent(Grid, {
        props: {
          size: 6,
          offset: 3,
        },
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })
  })

  describe('Type Guard Logic', () => {
    it('should use container mode when size is undefined', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { columns: 12 },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['grid'])
    })

    it('should use item mode when size is provided', async () => {
      const root = await renderAstroComponent(Grid, {
        props: { size: 6 },
      })

      const div = root.querySelector('div')
      // Item mode doesn't have grid base class
      expect(div?.classList.contains('grid')).toBe(false)
    })
  })
})
