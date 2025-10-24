import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeThemeToggle, setupThemeToggle } from './ThemeToggle.hook'

describe('Theme Toggle System', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = ''
    // Clear localStorage
    localStorage.clear()
    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
    localStorage.clear()
  })

  describe('initializeThemeToggle', () => {
    it('should initialize theme toggle buttons', () => {
      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll('#theme-toggle button[data-value]')

      // Should initialize successfully
      expect(buttons.length).toBe(3)

      cleanup()
    })

    it('should mark correct button as selected for light theme', () => {
      localStorage.setItem('theme', 'light')

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')

      expect(buttons[0].classList.contains('selected')).toBe(true)
      expect(buttons[1].classList.contains('selected')).toBe(false)
      expect(buttons[2].classList.contains('selected')).toBe(false)

      cleanup()
    })

    it('should mark correct button as selected for dark theme', () => {
      localStorage.setItem('theme', 'dark')

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')

      expect(buttons[0].classList.contains('selected')).toBe(false)
      expect(buttons[1].classList.contains('selected')).toBe(true)
      expect(buttons[2].classList.contains('selected')).toBe(false)

      cleanup()
    })

    it('should mark correct button as selected for system theme', () => {
      localStorage.setItem('theme', 'system')

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')

      expect(buttons[0].classList.contains('selected')).toBe(false)
      expect(buttons[1].classList.contains('selected')).toBe(false)
      expect(buttons[2].classList.contains('selected')).toBe(true)

      cleanup()
    })

    it('should change theme when button is clicked', () => {
      localStorage.setItem('theme', 'light')

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')
      const darkButton = buttons[1]

      // Click dark theme
      darkButton.click()

      // Should update localStorage
      expect(localStorage.getItem('theme')).toBe('dark')

      // Should update selection
      expect(darkButton.classList.contains('selected')).toBe(true)
      expect(buttons[0].classList.contains('selected')).toBe(false)

      cleanup()
    })

    it('should apply theme to document when changed', () => {
      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')

      // Click dark theme
      buttons[1].click()

      // Should add dark class to html element
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      // Click light theme
      buttons[0].click()

      // Should remove dark class
      expect(document.documentElement.classList.contains('dark')).toBe(false)

      cleanup()
    })

    it('should update theme when system preference changes', () => {
      localStorage.setItem('theme', 'system')

      // Mock matchMedia to support addEventListener and dynamic matches value
      const listeners: Array<(e: MediaQueryListEvent) => void> = []
      let matchesDark = false

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          get matches() {
            return matchesDark
          },
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              listeners.push(listener)
            }
          }),
          removeEventListener: vi.fn(
            (event: string, listener: (e: MediaQueryListEvent) => void) => {
              if (event === 'change') {
                const index = listeners.indexOf(listener)
                if (index > -1) {
                  listeners.splice(index, 1)
                }
              }
            },
          ),
          dispatchEvent: vi.fn(),
        })),
      })

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      // Initially light (system is light)
      expect(document.documentElement.classList.contains('dark')).toBe(false)

      // Simulate system theme change to dark
      matchesDark = true
      const event: Partial<MediaQueryListEvent> = { matches: true }
      listeners.forEach((listener) => {
        listener(event as MediaQueryListEvent)
      })

      // Should apply dark theme when system theme is dark
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      cleanup()
    })

    it('should not update when system preference changes if theme is not system', () => {
      localStorage.setItem('theme', 'light')

      const listeners: Array<(e: MediaQueryListEvent) => void> = []
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn((event: string, listener: (e: MediaQueryListEvent) => void) => {
            if (event === 'change') {
              listeners.push(listener)
            }
          }),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      })

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      // Initially light (no dark class)
      expect(document.documentElement.classList.contains('dark')).toBe(false)

      // Simulate system theme change to dark
      const event: Partial<MediaQueryListEvent> = { matches: true }
      listeners.forEach((listener) => {
        listener(event as MediaQueryListEvent)
      })

      // Should still be light because theme is set to "light", not "system"
      expect(document.documentElement.classList.contains('dark')).toBe(false)

      cleanup()
    })

    it('should clean up event listeners when cleanup is called', () => {
      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')

      // Spy on one of the buttons to verify cleanup
      const removeEventListenerSpy = vi.spyOn(buttons[0], 'removeEventListener')

      // Call cleanup
      cleanup()

      // Should remove event listeners from buttons
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })

    it('should return early if required DOM elements are missing', () => {
      document.body.innerHTML = `<div>No theme toggle here</div>`

      const cleanup = initializeThemeToggle()

      // Should not throw error
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })
  })

  describe('setupThemeToggle', () => {
    it('should initialize theme toggle immediately', () => {
      localStorage.setItem('theme', 'dark')

      document.body.innerHTML = `
        <div id="theme-toggle">
          <button data-value="light">Light</button>
          <button data-value="dark">Dark</button>
          <button data-value="system">System</button>
        </div>
      `

      setupThemeToggle()

      const buttons = document.querySelectorAll<HTMLElement>('#theme-toggle button[data-value]')

      // Should work immediately - dark button should be selected
      expect(buttons[1].classList.contains('selected')).toBe(true)
    })

    it('should setup View Transitions event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupThemeToggle()

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function),
      )

      addEventListenerSpy.mockRestore()
    })
  })
})
