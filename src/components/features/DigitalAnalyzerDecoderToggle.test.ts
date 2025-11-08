import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeDecoderToggles } from './DigitalAnalyzerDecoderToggle.hook'

describe('DigitalAnalyzerDecoderToggle Hook', () => {
  let cleanup: (() => void) | null

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    cleanup = null
  })

  afterEach(() => {
    // Clean up after each test
    if (cleanup) {
      cleanup()
    }
    document.body.innerHTML = ''
  })

  describe('Target Injection', () => {
    it('should inject data-collapsible-trigger into first child element', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target">
          <button>Toggle</button>
        </div>
      `

      cleanup = initializeDecoderToggles()

      const button = document.querySelector<HTMLElement>('button')
      expect(button?.dataset.collapsibleTrigger).toBe('test-target')
    })

    it('should only inject into first child when multiple children exist', () => {
      // Mock console.warn to suppress expected warning
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target">
          <button id="first">First</button>
          <button id="second">Second</button>
        </div>
      `

      cleanup = initializeDecoderToggles()

      const firstButton = document.querySelector<HTMLElement>('#first')
      const secondButton = document.querySelector<HTMLElement>('#second')

      expect(firstButton?.dataset.collapsibleTrigger).toBe('test-target')
      expect(secondButton?.dataset.collapsibleTrigger).toBeUndefined()

      // Verify the warning was called as expected
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[DecoderToggle] Multiple children detected in wrapper. Only the first element will receive toggle behavior.',
        expect.any(HTMLDivElement),
      )
    })

    it('should handle multiple decoder wrappers', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="target-1">
          <button id="btn-1">Toggle 1</button>
        </div>
        <div data-decoder-wrapper data-decoder-target="target-2">
          <button id="btn-2">Toggle 2</button>
        </div>
      `

      cleanup = initializeDecoderToggles()

      const btn1 = document.querySelector<HTMLElement>('#btn-1')
      const btn2 = document.querySelector<HTMLElement>('#btn-2')

      expect(btn1?.dataset.collapsibleTrigger).toBe('target-1')
      expect(btn2?.dataset.collapsibleTrigger).toBe('target-2')
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('should setup keyboard listener when data-keyboard-key is present', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target" data-keyboard-key="k">
          <button>Toggle</button>
        </div>
        <div data-collapsible-id="test-target" data-open="false"></div>
      `

      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      cleanup = initializeDecoderToggles()

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should toggle collapsible when keyboard shortcut is pressed', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target" data-keyboard-key="k" data-keyboard-modifier="">
          <button>Toggle</button>
        </div>
        <div data-collapsible-id="test-target" data-open="false"></div>
      `

      cleanup = initializeDecoderToggles()

      const collapsible = document.querySelector<HTMLElement>('[data-collapsible-id="test-target"]')
      expect(collapsible?.dataset.open).toBe('false')

      // Simulate keyboard event
      const event = new KeyboardEvent('keydown', { key: 'k' })
      document.dispatchEvent(event)

      expect(collapsible?.dataset.open).toBe('true')
    })

    it('should handle Cmd/Ctrl modifier based on OS', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target" data-keyboard-key="k" data-keyboard-modifier="cmd|ctrl">
          <button>Toggle</button>
        </div>
        <div data-collapsible-id="test-target" data-open="false"></div>
      `

      cleanup = initializeDecoderToggles()

      const collapsible = document.querySelector<HTMLElement>('[data-collapsible-id="test-target"]')
      const isMac = navigator.userAgent.toUpperCase().includes('MAC')

      // Simulate keyboard event with appropriate modifier
      const event = new KeyboardEvent('keydown', {
        ctrlKey: !isMac,
        key: 'k',
        metaKey: isMac,
      })
      document.dispatchEvent(event)

      expect(collapsible?.dataset.open).toBe('true')
    })

    it('should not toggle without required modifier key', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target" data-keyboard-key="k" data-keyboard-modifier="cmd|ctrl">
          <button>Toggle</button>
        </div>
        <div data-collapsible-id="test-target" data-open="false"></div>
      `

      cleanup = initializeDecoderToggles()

      const collapsible = document.querySelector<HTMLElement>('[data-collapsible-id="test-target"]')

      // Simulate keyboard event WITHOUT modifier
      const event = new KeyboardEvent('keydown', { key: 'k' })
      document.dispatchEvent(event)
      expect(collapsible?.dataset.open).toBe('false')
    })
  })

  describe('Cleanup', () => {
    it('should return a cleanup function', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target">
          <button>Toggle</button>
        </div>
      `

      const cleanupFn = initializeDecoderToggles()
      expect(typeof cleanupFn).toBe('function')
    })

    it('should remove keyboard event listeners on cleanup', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target" data-keyboard-key="k">
          <button>Toggle</button>
        </div>
        <div data-collapsible-id="test-target" data-open="false"></div>
      `

      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
      cleanup = initializeDecoderToggles()

      cleanup()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })

  describe('Edge Cases', () => {
    it('should handle wrapper with no target gracefully', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper>
          <button>Toggle</button>
        </div>
      `

      expect(() => {
        cleanup = initializeDecoderToggles()
      }).not.toThrow()
    })

    it('should handle wrapper with no children gracefully', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="test-target"></div>
      `

      expect(() => {
        cleanup = initializeDecoderToggles()
      }).not.toThrow()
    })

    it('should handle missing collapsible target gracefully', () => {
      document.body.innerHTML = `
        <div data-decoder-wrapper data-decoder-target="missing-target" data-keyboard-key="k">
          <button>Toggle</button>
        </div>
      `

      cleanup = initializeDecoderToggles()

      expect(() => {
        const event = new KeyboardEvent('keydown', { key: 'k' })
        document.dispatchEvent(event)
      }).not.toThrow()
    })
  })
})
