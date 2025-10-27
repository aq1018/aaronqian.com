import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { setupKbd } from './Kbd.hook'

describe('Kbd Hook', () => {
  let originalUserAgent: string

  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = ''
    // Store original userAgent
    originalUserAgent = navigator.userAgent
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
    // Restore original userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    })
  })

  /**
   * Helper to mock userAgent
   */
  function mockUserAgent(userAgent: string): void {
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true,
    })
  }

  describe('OS Detection', () => {
    it('should detect macOS', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd">⌘K</span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌘K')

      cleanup()
    })

    it('should detect Windows', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="ctrl">Ctrl+K</span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Ctrl+K')

      cleanup()
    })

    it('should detect Linux', () => {
      mockUserAgent('Mozilla/5.0 (X11; Linux x86_64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="ctrl">Ctrl+K</span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Ctrl+K')

      cleanup()
    })
  })

  describe('Platform-Specific Modifiers (cmd|ctrl)', () => {
    it('should use cmd on macOS', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌘K')

      cleanup()
    })

    it('should use ctrl on Windows', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Ctrl+K')

      cleanup()
    })

    it('should use ctrl on Linux', () => {
      mockUserAgent('Mozilla/5.0 (X11; Linux x86_64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Ctrl+K')

      cleanup()
    })
  })

  describe('Single Modifiers', () => {
    it('should format cmd on macOS', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="s" data-modifier="cmd"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌘S')

      cleanup()
    })

    it('should format ctrl on macOS', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="c" data-modifier="ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌃C')

      cleanup()
    })

    it('should format alt on macOS', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="f" data-modifier="alt"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌥F')

      cleanup()
    })

    it('should format shift on macOS', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="tab" data-modifier="shift"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⇧Tab')

      cleanup()
    })

    it('should format ctrl on Windows', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="c" data-modifier="ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Ctrl+C')

      cleanup()
    })

    it('should format alt on Windows', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="f4" data-modifier="alt"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Alt+F4')

      cleanup()
    })

    it('should format shift on Windows', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="delete" data-modifier="shift"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Shift+Delete')

      cleanup()
    })
  })

  describe('Keys Only (No Modifier)', () => {
    it('should format single key', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="escape"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Escape')

      cleanup()
    })

    it('should capitalize first letter of key', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="enter"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Enter')

      cleanup()
    })
  })

  describe('Multiple Kbd Elements', () => {
    it('should update all Kbd elements independently', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
        <span data-kbd data-keys="s" data-modifier="cmd|ctrl"></span>
        <span data-kbd data-keys="enter"></span>
      `

      const cleanup = setupKbd()

      const kbdElements = document.querySelectorAll('[data-kbd]')
      expect(kbdElements[0].textContent).toBe('⌘K')
      expect(kbdElements[1].textContent).toBe('⌘S')
      expect(kbdElements[2].textContent).toBe('Enter')

      cleanup()
    })

    it('should handle mixed OS-specific shortcuts', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
        <span data-kbd data-keys="f" data-modifier="alt"></span>
        <span data-kbd data-keys="tab" data-modifier="shift"></span>
      `

      const cleanup = setupKbd()

      const kbdElements = document.querySelectorAll('[data-kbd]')
      expect(kbdElements[0].textContent).toBe('Ctrl+K')
      expect(kbdElements[1].textContent).toBe('Alt+F')
      expect(kbdElements[2].textContent).toBe('Shift+Tab')

      cleanup()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing keys attribute', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-modifier="cmd"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      // Should not update if keys is missing
      expect(kbd.textContent).toBe('')

      cleanup()
    })

    it('should handle empty modifier attribute', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier=""></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('K')

      cleanup()
    })

    it('should handle unknown modifier gracefully', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="unknown"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      // Unknown modifier should be returned as-is
      expect(kbd.textContent).toBe('unknownK')

      cleanup()
    })

    it('should handle no Kbd elements on page', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `<div>No Kbd elements</div>`

      const cleanup = setupKbd()

      // Should not throw error
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })
  })

  describe('View Transitions', () => {
    it('should setup astro:page-load event listener', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupKbd()

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))

      addEventListenerSpy.mockRestore()
    })

    it('should update Kbd elements after page navigation', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌘K')

      // Simulate navigation - change DOM
      kbd.textContent = 'OUTDATED'

      // Trigger astro:page-load event
      const event = new Event('astro:page-load')
      document.dispatchEvent(event)

      // Should re-update
      expect(kbd.textContent).toBe('⌘K')

      cleanup()
    })

    it('should remove event listener on cleanup', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

      const cleanup = setupKbd()
      cleanup()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('Real-World Usage', () => {
    it('should match HomeHero keyboard shortcut behavior (Mac)', () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('⌘K')

      cleanup()
    })

    it('should match HomeHero keyboard shortcut behavior (Windows)', () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
      document.body.innerHTML = `
        <span data-kbd data-keys="k" data-modifier="cmd|ctrl"></span>
      `

      const cleanup = setupKbd()

      const kbd = document.querySelector('[data-kbd]') as HTMLElement
      expect(kbd.textContent).toBe('Ctrl+K')

      cleanup()
    })
  })
})
