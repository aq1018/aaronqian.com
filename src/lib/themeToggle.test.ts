import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeThemeToggle, setupThemeToggle } from './themeToggle'

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
    it('should initialize theme icons and menu items', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const lightIcon = document.getElementById('theme-icon-light')
      const darkIcon = document.getElementById('theme-icon-dark')
      const systemIcon = document.getElementById('theme-icon-system')

      // Should initialize successfully
      expect(lightIcon).toBeTruthy()
      expect(darkIcon).toBeTruthy()
      expect(systemIcon).toBeTruthy()

      cleanup()
    })

    it('should show correct icon for light theme', () => {
      localStorage.setItem('theme', 'light')

      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const lightIcon = document.getElementById('theme-icon-light') as HTMLElement
      const darkIcon = document.getElementById('theme-icon-dark') as HTMLElement
      const systemIcon = document.getElementById('theme-icon-system') as HTMLElement

      expect(lightIcon.classList.contains('hidden')).toBe(false)
      expect(darkIcon.classList.contains('hidden')).toBe(true)
      expect(systemIcon.classList.contains('hidden')).toBe(true)

      cleanup()
    })

    it('should show correct icon for dark theme', () => {
      localStorage.setItem('theme', 'dark')

      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const lightIcon = document.getElementById('theme-icon-light') as HTMLElement
      const darkIcon = document.getElementById('theme-icon-dark') as HTMLElement
      const systemIcon = document.getElementById('theme-icon-system') as HTMLElement

      expect(lightIcon.classList.contains('hidden')).toBe(true)
      expect(darkIcon.classList.contains('hidden')).toBe(false)
      expect(systemIcon.classList.contains('hidden')).toBe(true)

      cleanup()
    })

    it('should show correct icon for system theme', () => {
      localStorage.setItem('theme', 'system')

      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const lightIcon = document.getElementById('theme-icon-light') as HTMLElement
      const darkIcon = document.getElementById('theme-icon-dark') as HTMLElement
      const systemIcon = document.getElementById('theme-icon-system') as HTMLElement

      expect(lightIcon.classList.contains('hidden')).toBe(true)
      expect(darkIcon.classList.contains('hidden')).toBe(true)
      expect(systemIcon.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should mark correct menu item as selected', () => {
      localStorage.setItem('theme', 'dark')

      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const menuItems = document.querySelectorAll<HTMLElement>('.menu-item')

      expect(menuItems[0].classList.contains('selected')).toBe(false)
      expect(menuItems[1].classList.contains('selected')).toBe(true)
      expect(menuItems[2].classList.contains('selected')).toBe(false)

      cleanup()
    })

    it('should change theme when menu item is clicked', () => {
      localStorage.setItem('theme', 'light')

      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const darkMenuItem = document.querySelectorAll<HTMLElement>('.menu-item')[1]
      const darkIcon = document.getElementById('theme-icon-dark') as HTMLElement

      // Click dark theme
      darkMenuItem.click()

      // Should update localStorage
      expect(localStorage.getItem('theme')).toBe('dark')

      // Should update icon
      expect(darkIcon.classList.contains('hidden')).toBe(false)

      // Should update selection
      expect(darkMenuItem.classList.contains('selected')).toBe(true)

      cleanup()
    })

    it('should close menu after selecting theme', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu" aria-expanded="false">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const menu = document.getElementById('theme-menu') as HTMLElement
      const button = document.getElementById('theme-toggle') as HTMLElement
      const lightMenuItem = document.querySelectorAll<HTMLElement>('.menu-item')[0]

      // Open menu manually
      menu.classList.remove('hidden')
      button.setAttribute('aria-expanded', 'true')

      // Click theme
      lightMenuItem.click()

      // Should close menu
      expect(menu.classList.contains('hidden')).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('false')

      cleanup()
    })

    it('should apply theme to document when changed', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const darkMenuItem = document.querySelectorAll<HTMLElement>('.menu-item')[1]

      // Click dark theme
      darkMenuItem.click()

      // Should add dark class to html element
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      // Click light theme
      const lightMenuItem = document.querySelectorAll<HTMLElement>('.menu-item')[0]
      lightMenuItem.click()

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
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
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
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
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
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      const menuItems = document.querySelectorAll<HTMLElement>('.menu-item')

      // Spy on one of the menu items to verify cleanup
      const removeEventListenerSpy = vi.spyOn(menuItems[0], 'removeEventListener')

      // Call cleanup
      cleanup()

      // Should remove event listeners from menu items
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

    it('should handle missing icons gracefully', () => {
      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      const cleanup = initializeThemeToggle()

      // Should return early without errors
      expect(cleanup).toBeDefined()

      cleanup()
    })
  })

  describe('setupThemeToggle', () => {
    it('should initialize theme toggle immediately', () => {
      localStorage.setItem('theme', 'dark')

      document.body.innerHTML = `
        <button id="theme-toggle" data-toggle-button data-toggle-target="theme-menu">
          <svg id="theme-icon-light" class="hidden"></svg>
          <svg id="theme-icon-dark" class="hidden"></svg>
          <svg id="theme-icon-system" class="hidden"></svg>
        </button>
        <div id="theme-menu" class="hidden">
          <div class="menu-item" data-value="light">Light</div>
          <div class="menu-item" data-value="dark">Dark</div>
          <div class="menu-item" data-value="system">System</div>
        </div>
      `

      setupThemeToggle()

      const darkIcon = document.getElementById('theme-icon-dark') as HTMLElement

      // Should work immediately
      expect(darkIcon.classList.contains('hidden')).toBe(false)
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
