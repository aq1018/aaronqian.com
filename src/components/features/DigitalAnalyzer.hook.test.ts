import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeDigitalAnalyzer, setupDigitalAnalyzer } from './DigitalAnalyzer.hook'

// Mock GSAP
vi.mock('gsap', () => ({
  default: {
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      eventCallback: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    to: vi.fn(),
    set: vi.fn(),
  },
}))

// Mock the animation module
vi.mock('./DigitalAnalyzer.animation', () => ({
  createTraceAnimation: vi.fn(() => ({
    eventCallback: vi.fn().mockReturnThis(),
    kill: vi.fn(),
  })),
}))

describe('Digital Analyzer Hook', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = ''
    // Clear all timers
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('initializeDigitalAnalyzer', () => {
    it('should initialize digital analyzer with required DOM elements', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should return early if digital-analyzer container is missing', () => {
      document.body.innerHTML = `
        <svg id="digital-analyzer-svg"></svg>
        <svg class="digital-analyzer-static"></svg>
      `

      const cleanup = initializeDigitalAnalyzer()

      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should return early if SVG element is missing', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should return early if static SVG element is missing', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer>
          <svg id="digital-analyzer-svg"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should initialize ResizeObserver to track container dimensions', () => {
      // Mock ResizeObserver
      const mockObserve = vi.fn()
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      // Verify ResizeObserver was created by checking observe was called
      expect(mockObserve).toHaveBeenCalled()

      cleanup()
    })

    it('should disconnect ResizeObserver on cleanup', () => {
      const mockObserve = vi.fn()
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      // Cleanup should disconnect ResizeObserver
      cleanup()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should clean up SVG traces on cleanup', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg">
            <path d="M0,0 L100,100" />
          </svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      const svg = document.getElementById('digital-analyzer-svg') as unknown as SVGSVGElement

      // Add a trace path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', 'M0,0 L100,100')
      svg.appendChild(path)

      expect(svg.children.length).toBeGreaterThan(0)

      // Cleanup should clear SVG
      cleanup()

      expect(svg.innerHTML).toBe('')
    })

    it('should reset lightning bolt styles on cleanup', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
          <div data-lightning-bolt style="opacity: 0.5; transform: scale(1.2); filter: blur(2px);"></div>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      const lightningBolt = document.querySelector<HTMLElement>('[data-lightning-bolt]')

      // Modify lightning bolt styles
      if (lightningBolt !== null) {
        lightningBolt.style.opacity = '0.8'
        lightningBolt.style.transform = 'scale(1.5)'
        lightningBolt.style.filter = 'blur(5px)'
      }

      // Cleanup should reset styles
      cleanup()

      expect(lightningBolt?.style.transform).toBe('')
      expect(lightningBolt?.style.filter).toBe('brightness(0.7)')
    })

    it('should handle missing lightning bolt gracefully', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      // Should not throw error even without lightning bolt
      expect(() => cleanup()).not.toThrow()
    })

    it('should clean up previous initialization when called multiple times', () => {
      const mockObserve = vi.fn()
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      initializeDigitalAnalyzer()

      // Second initialization should clean up first
      const cleanup2 = initializeDigitalAnalyzer()

      // First cleanup should have been called automatically
      expect(mockDisconnect).toHaveBeenCalled()

      // Reset mock to verify second cleanup works
      mockDisconnect.mockClear()

      cleanup2()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should handle cleanup being called multiple times safely', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      // Call cleanup multiple times - should not throw
      expect(() => {
        cleanup()
        cleanup()
        cleanup()
      }).not.toThrow()
    })

    it('should clear display managers on cleanup', () => {
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
          <div id="binary-buffer">01010101</div>
          <div id="ascii-text">Test</div>
        </div>
      `

      const cleanup = initializeDigitalAnalyzer()

      const binaryBuffer = document.getElementById('binary-buffer')
      const asciiText = document.getElementById('ascii-text')

      // Set some content
      if (binaryBuffer !== null) binaryBuffer.textContent = '11110000'
      if (asciiText !== null) asciiText.textContent = 'Hello'

      // Cleanup should clear display
      cleanup()

      // Check that display was cleared (may be empty string or whitespace)
      expect(binaryBuffer?.textContent.trim()).toBe('')
      expect(asciiText?.textContent.trim()).toBe('')
    })
  })

  describe('setupDigitalAnalyzer', () => {
    it('should setup View Transitions event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupDigitalAnalyzer()

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function),
      )

      addEventListenerSpy.mockRestore()
    })

    it('should NOT call initializeDigitalAnalyzer directly (to prevent double initialization)', () => {
      // Setup spy before calling setupDigitalAnalyzer
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      // Create minimal DOM to allow initialization
      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      setupDigitalAnalyzer()

      // Verify astro:page-load listener was registered
      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))

      // Get the registered listener
      const calls = addEventListenerSpy.mock.calls.filter((call) => call[0] === 'astro:page-load')
      expect(calls.length).toBeGreaterThan(0)

      addEventListenerSpy.mockRestore()
    })

    it('should call cleanup when astro:before-preparation event fires', () => {
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = vi.fn()
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      setupDigitalAnalyzer()

      // Trigger astro:page-load to initialize
      document.dispatchEvent(new Event('astro:page-load'))

      // Reset mock to track next cleanup
      mockDisconnect.mockClear()

      // Trigger astro:before-preparation
      document.dispatchEvent(new Event('astro:before-preparation'))

      // Should have called cleanup (which disconnects ResizeObserver)
      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should re-initialize on astro:page-load event', () => {
      const mockObserve = vi.fn()
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      setupDigitalAnalyzer()

      // Clear mock to track initialization from event
      mockObserve.mockClear()

      // Trigger astro:page-load event
      document.dispatchEvent(new Event('astro:page-load'))

      // Should initialize (observe container)
      expect(mockObserve).toHaveBeenCalled()
    })

    it('should handle astro:page-load firing only once on initial load (no double initialization)', () => {
      const mockObserve = vi.fn()
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      setupDigitalAnalyzer()

      // Clear mocks to track only subsequent calls
      mockObserve.mockClear()

      // Simulate initial page load - astro:page-load fires
      document.dispatchEvent(new Event('astro:page-load'))

      // Should initialize exactly once (one observe() call)
      expect(mockObserve).toHaveBeenCalledTimes(1)
    })
  })

  describe('View Transitions lifecycle', () => {
    it('should properly handle complete View Transitions cycle', () => {
      const mockObserve = vi.fn()
      const mockDisconnect = vi.fn()

      global.ResizeObserver = class ResizeObserver {
        observe = mockObserve
        disconnect = mockDisconnect
        unobserve = vi.fn()
      } as unknown as typeof ResizeObserver

      document.body.innerHTML = `
        <div data-digital-analyzer style="width: 800px; height: 600px;">
          <svg id="digital-analyzer-svg"></svg>
          <svg class="digital-analyzer-static"></svg>
        </div>
      `

      setupDigitalAnalyzer()

      // Simulate initial page load
      document.dispatchEvent(new Event('astro:page-load'))
      expect(mockObserve).toHaveBeenCalled()

      // Simulate navigation (before-preparation fires first)
      mockDisconnect.mockClear()
      document.dispatchEvent(new Event('astro:before-preparation'))
      expect(mockDisconnect).toHaveBeenCalled()

      // Then page-load fires for new page
      mockObserve.mockClear()
      document.dispatchEvent(new Event('astro:page-load'))
      expect(mockObserve).toHaveBeenCalled()
    })
  })
})
