import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeCuttingMat, setupCuttingMat } from './index'

describe('Cutting Mat Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('initializeCuttingMat', () => {
    it('should return a cleanup function', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const cleanup = initializeCuttingMat()

      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should create SVG overlays in cutting mat container', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const cleanup = initializeCuttingMat()

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      const svg = cuttingMat?.querySelector('svg.cutting-mat-overlays')

      expect(svg).not.toBeNull()

      cleanup()
    })

    it('should handle missing cutting mat container gracefully', () => {
      document.body.innerHTML = '<div>No cutting mat</div>'

      const cleanup = initializeCuttingMat()

      expect(typeof cleanup).toBe('function')
      expect(() => {
        cleanup()
      }).not.toThrow()
    })

    it('should merge custom options with defaults', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const cleanup = initializeCuttingMat({
        angleLineCount: 7,
      })

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      const texts = cuttingMat?.querySelectorAll('text')

      // Should have 7 * 2 texts (background + foreground)
      expect(texts?.length).toBe(14)

      cleanup()
    })

    it('should use last arc for labels when angleLabelArcIndex is -1', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const cleanup = initializeCuttingMat({
        arcCount: 5,
        angleLabelArcIndex: -1,
      })

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      const svg = cuttingMat?.querySelector('svg')

      // Should have created the overlay (testing internal logic is hard, but we can verify it doesn't crash)
      expect(svg).not.toBeNull()

      cleanup()
    })

    it('should remove SVG when cleanup is called', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const cleanup = initializeCuttingMat()

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      let svg = cuttingMat?.querySelector('svg.cutting-mat-overlays')
      expect(svg).not.toBeNull()

      cleanup()

      svg = cuttingMat?.querySelector('svg.cutting-mat-overlays')
      expect(svg).toBeNull()
    })

    it('should clean up previous initialization before creating new one', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const _cleanup1 = initializeCuttingMat()
      const cleanup2 = initializeCuttingMat()

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      const svgs = cuttingMat?.querySelectorAll('svg.cutting-mat-overlays')

      // Should only have one SVG (previous one was cleaned up)
      expect(svgs?.length).toBe(1)

      cleanup2()
    })
  })

  describe('setupCuttingMat', () => {
    it('should initialize cutting mat immediately', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      setupCuttingMat()

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      const svg = cuttingMat?.querySelector('svg.cutting-mat-overlays')

      expect(svg).not.toBeNull()
    })

    it('should handle custom options', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      setupCuttingMat({
        angleLineCount: 3,
      })

      const cuttingMat = document.querySelector('[data-cutting-mat]')
      const texts = cuttingMat?.querySelectorAll('text')

      // Should have 3 * 2 texts (background + foreground)
      expect(texts?.length).toBe(6)
    })

    it('should setup Astro View Transitions event listeners', () => {
      document.body.innerHTML = '<div data-cutting-mat></div>'

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupCuttingMat()

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function),
        { once: true },
      )

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:after-swap', expect.any(Function))

      addEventListenerSpy.mockRestore()
    })
  })
})
