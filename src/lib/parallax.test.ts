import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeParallax, setupParallax } from './parallax'

describe('Parallax System', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = ''
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      // eslint-disable-next-line n/no-callback-literal -- Mock RAF needs to pass timestamp 0 to callback
      cb(0)
      return 0
    })
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('initializeParallax', () => {
    it('should initialize parallax effect on hero element', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      const cleanup = initializeParallax()

      const hero = document.getElementById('hero')
      const parallaxBg = document.getElementById('parallax-bg')

      expect(hero).toBeTruthy()
      expect(parallaxBg).toBeTruthy()

      cleanup()
    })

    it('should update transform on mousemove', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      // Mock window dimensions
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

      const cleanup = initializeParallax()

      const hero = document.getElementById('hero') as HTMLElement
      const parallaxBg = document.getElementById('parallax-bg') as HTMLElement

      // Simulate mousemove at center (should result in 0, 0)
      const centerEvent = new MouseEvent('mousemove', {
        clientX: 600,
        clientY: 400,
      })
      hero.dispatchEvent(centerEvent)

      expect(parallaxBg.style.transform).toBe('translate(0px, 0px)')

      // Simulate mousemove at top-left (should result in negative offset)
      const topLeftEvent = new MouseEvent('mousemove', {
        clientX: 0,
        clientY: 0,
      })
      hero.dispatchEvent(topLeftEvent)

      // At (0, 0): offset = ((0 - 600) / 1200) * 15 = -7.5
      expect(parallaxBg.style.transform).toBe('translate(-7.5px, -7.5px)')

      cleanup()
    })

    it('should reset transform on mouseleave', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

      const cleanup = initializeParallax()

      const hero = document.getElementById('hero') as HTMLElement
      const parallaxBg = document.getElementById('parallax-bg') as HTMLElement

      // Move mouse
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 0,
        clientY: 0,
      })
      hero.dispatchEvent(moveEvent)

      expect(parallaxBg.style.transform).not.toBe('translate(0, 0)')

      // Leave hero
      const leaveEvent = new MouseEvent('mouseleave')
      hero.dispatchEvent(leaveEvent)

      expect(parallaxBg.style.transform).toBe('translate(0, 0)')

      cleanup()
    })

    it('should throttle mousemove with requestAnimationFrame', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

      // Create a real RAF mock that we can control
      let rafCallback: FrameRequestCallback | null = null
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        rafCallback = cb
        return 1
      })

      const cleanup = initializeParallax()

      const hero = document.getElementById('hero') as HTMLElement

      // Trigger first mousemove
      const event1 = new MouseEvent('mousemove', { clientX: 100, clientY: 100 })
      hero.dispatchEvent(event1)

      // RAF should be called once
      expect(rafSpy).toHaveBeenCalledTimes(1)

      // Trigger second mousemove before RAF callback executes
      const event2 = new MouseEvent('mousemove', { clientX: 200, clientY: 200 })
      hero.dispatchEvent(event2)

      // RAF should still be called only once (throttled)
      expect(rafSpy).toHaveBeenCalledTimes(1)

      // Execute the RAF callback
      ;(rafCallback as unknown as FrameRequestCallback)(0)

      // Now trigger another mousemove
      const event3 = new MouseEvent('mousemove', { clientX: 300, clientY: 300 })
      hero.dispatchEvent(event3)

      // RAF should be called again now
      expect(rafSpy).toHaveBeenCalledTimes(2)

      cleanup()
      rafSpy.mockRestore()
    })

    it('should handle missing hero element gracefully', () => {
      document.body.innerHTML = '<div>No hero element</div>'

      const cleanup = initializeParallax()

      // Should not throw error
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should handle missing parallax target gracefully', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
        </section>
      `

      const cleanup = initializeParallax()

      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should clean up event listeners when cleanup is called', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

      const hero = document.getElementById('hero') as HTMLElement
      const removeEventListenerSpy = vi.spyOn(hero, 'removeEventListener')

      const cleanup = initializeParallax()

      // Call cleanup
      cleanup()

      // Should remove event listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })

    it('should calculate parallax offset correctly', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
      Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true })

      const cleanup = initializeParallax()

      const hero = document.getElementById('hero') as HTMLElement
      const parallaxBg = document.getElementById('parallax-bg') as HTMLElement

      // Test bottom-right corner (should result in positive offset)
      const bottomRightEvent = new MouseEvent('mousemove', {
        clientX: 1000,
        clientY: 1000,
      })
      hero.dispatchEvent(bottomRightEvent)

      // At (1000, 1000): offset = ((1000 - 500) / 1000) * 15 = 7.5
      expect(parallaxBg.style.transform).toBe('translate(7.5px, 7.5px)')

      cleanup()
    })
  })

  describe('setupParallax', () => {
    it('should initialize parallax immediately', () => {
      document.body.innerHTML = `
        <section id="hero" data-parallax>
          <div id="parallax-bg" data-parallax-target></div>
        </section>
      `

      setupParallax()

      const hero = document.getElementById('hero')
      const parallaxBg = document.getElementById('parallax-bg')

      // Should work immediately
      expect(hero).toBeTruthy()
      expect(parallaxBg).toBeTruthy()
    })

    it('should setup View Transitions event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupParallax()

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function),
      )

      addEventListenerSpy.mockRestore()
    })
  })
})
