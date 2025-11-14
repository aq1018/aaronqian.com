import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Footer from './Footer.astro'

describe('Footer', () => {
  describe('Rendering', () => {
    it('should render footer element', async () => {
      const root = await renderAstroComponent(Footer, { props: {} })
      const footer = root.querySelector('footer')

      expect(footer).toBeTruthy()
    })

    it('should contain copyright text', async () => {
      const root = await renderAstroComponent(Footer, { props: {} })

      expect(root.textContent).toContain('© Aaron Qian')
      expect(root.textContent).toContain('Built with care')
      expect(root.textContent).toContain('Last updated Nov 2025')
    })

    it('should have centered text', async () => {
      const root = await renderAstroComponent(Footer, { props: {} })
      const footer = root.querySelector('footer')

      expect(footer?.innerHTML).toContain('text-center')
    })
  })

  describe('Styling', () => {
    it('should have top border', async () => {
      const root = await renderAstroComponent(Footer, { props: {} })
      const footer = root.querySelector('footer')

      expect(footer?.className).toContain('border-t')
    })

    it('should use mt-auto for sticky footer behavior', async () => {
      const root = await renderAstroComponent(Footer, { props: {} })
      const footer = root.querySelector('footer')

      expect(footer?.className).toContain('mt-auto')
    })
  })
})
