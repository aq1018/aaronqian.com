import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Surface from './Surface.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Surface.astro', () => {
  describe('Rendering', () => {
    it('should render as a section element', async () => {
      const root = await renderAstroComponent(Surface, {
        props: {},
      })

      const section = root.querySelector('section')
      expect(section).toBeDefined()
    })

    it('should render default slot content', async () => {
      const root = await renderAstroComponent(Surface, {
        props: {},
        slots: { default: '<p>Main Content</p>' },
      })

      const section = root.querySelector('section')
      const paragraph = section?.querySelector('p')
      expect(paragraph?.textContent).toBe('Main Content')
    })

    it('should apply variant classes', async () => {
      const root = await renderAstroComponent(Surface, {
        props: { padY: 'lg' },
      })

      const section = root.querySelector('section')
      expect(section).toHaveClasses(['relative', 'w-full'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Surface, {
        props: { class: 'custom-surface' },
      })

      const section = root.querySelector('section')
      expect(section?.classList.contains('custom-surface')).toBe(true)
      expect(section).toHaveClasses(['relative', 'w-full']) // Base classes still present
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Surface, {
        props: { id: 'test-surface', 'data-testid': 'surface' },
      })

      const section = root.querySelector('section')
      expect(section?.id).toBe('test-surface')
      expect(section).toHaveDataAttribute('data-testid', 'surface')
    })
  })

  describe('Background Slot', () => {
    it('should not render background div when background slot is empty', async () => {
      const root = await renderAstroComponent(Surface, {
        props: {},
        slots: { default: '<p>Content</p>' },
      })

      const section = root.querySelector('section')
      const backgroundDiv = section?.querySelector('.absolute.inset-0.-z-10')
      expect(backgroundDiv).toBeNull()
    })

    it('should render background slot content in positioned div', async () => {
      const root = await renderAstroComponent(Surface, {
        props: {},
        slots: {
          default: '<p>Content</p>',
          background: '<div class="bg-gradient"></div>',
        },
      })

      const section = root.querySelector('section')
      const backgroundDiv = section?.querySelector('.absolute.inset-0.-z-10')
      expect(backgroundDiv).toBeDefined()
      expect(backgroundDiv?.querySelector('.bg-gradient')).toBeDefined()
    })

    it('should position background behind content with -z-10', async () => {
      const root = await renderAstroComponent(Surface, {
        props: {},
        slots: {
          default: '<p>Content</p>',
          background: '<div>Background</div>',
        },
      })

      const section = root.querySelector('section')
      const backgroundDiv = section?.querySelector('div.absolute.inset-0')
      expect(backgroundDiv).toHaveClasses(['absolute', 'inset-0', '-z-10'])
    })
  })

  describe('Slot Combinations', () => {
    it('should render both default and background slots', async () => {
      const root = await renderAstroComponent(Surface, {
        props: {},
        slots: {
          default: '<p>Main Content</p>',
          background: '<div>Background</div>',
        },
      })

      const section = root.querySelector('section')
      const content = section?.querySelector('p')
      const background = section?.querySelector('.absolute.inset-0.-z-10')

      expect(content?.textContent).toBe('Main Content')
      expect(background).toBeDefined()
    })
  })
})
