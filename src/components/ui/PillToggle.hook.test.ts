import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { initializeToggles, setupToggles } from './PillToggle.hook'

describe('Toggle Button System', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
  })

  describe('initializeToggles', () => {
    it('should initialize toggle buttons and menus', () => {
      // Setup DOM
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle')
      const menu = document.getElementById('test-menu')

      expect(button).toBeTruthy()
      expect(menu).toBeTruthy()
      expect(menu?.classList.contains('hidden')).toBe(true)

      cleanup()
    })

    it('should toggle menu visibility when button is clicked', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Initially hidden
      expect(menu.classList.contains('hidden')).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('false')

      // Click to open
      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)
      expect(button.getAttribute('aria-expanded')).toBe('true')

      // Click to close
      button.click()
      expect(menu.classList.contains('hidden')).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('false')

      cleanup()
    })

    it('should close menu when clicking outside', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
        <div id="outside">Outside</div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const menu = document.getElementById('test-menu') as HTMLElement
      const outside = document.getElementById('outside') as HTMLElement

      // Open menu
      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)

      // Click outside
      outside.click()
      expect(menu.classList.contains('hidden')).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('false')

      cleanup()
    })

    it('should handle multiple toggle buttons independently', () => {
      document.body.innerHTML = `
        <div>
          <button id="toggle-1" data-toggle-button aria-expanded="false">
            Toggle 1
          </button>
          <div id="menu-1" class="hidden">Menu 1</div>
        </div>
        <div>
          <button id="toggle-2" data-toggle-button aria-expanded="false">
            Toggle 2
          </button>
          <div id="menu-2" class="hidden">Menu 2</div>
        </div>
      `

      const cleanup = initializeToggles()

      const button1 = document.getElementById('toggle-1') as HTMLButtonElement
      const menu1 = document.getElementById('menu-1') as HTMLElement
      const button2 = document.getElementById('toggle-2') as HTMLButtonElement
      const menu2 = document.getElementById('menu-2') as HTMLElement

      // Open first menu
      button1.click()
      expect(menu1.classList.contains('hidden')).toBe(false)
      expect(menu2.classList.contains('hidden')).toBe(true)

      // Open second menu
      button2.click()
      expect(menu2.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should clean up event listeners when cleanup is called', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Open menu
      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)

      // Call cleanup
      cleanup()

      // Reset menu state manually
      menu.classList.add('hidden')
      button.setAttribute('aria-expanded', 'false')

      // Click should not toggle anymore (listeners removed)
      button.click()
      // Menu should still be hidden since listeners are removed
      expect(menu.classList.contains('hidden')).toBe(true)
    })

    it('should handle clicks on nested elements within button', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <span id="icon">Icon</span>
            <span id="text">Text</span>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const icon = document.getElementById('icon') as HTMLElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Click on nested element
      icon.click()
      expect(menu.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should handle clicks on SVG icons within button', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <svg id="icon" width="20" height="20">
              <path id="icon-path" d="M10 10"></path>
            </svg>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const icon = document.getElementById('icon') as unknown as SVGElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Initially hidden
      expect(menu.classList.contains('hidden')).toBe(true)

      // Click on SVG icon using dispatchEvent
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
      icon.dispatchEvent(clickEvent)
      expect(menu.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should handle clicks on nested SVG path elements', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <svg id="icon" width="20" height="20">
              <path id="icon-path" d="M10 10"></path>
            </svg>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const iconPath = document.getElementById('icon-path') as unknown as SVGPathElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Initially hidden
      expect(menu.classList.contains('hidden')).toBe(true)

      // Click on deeply nested SVG path element using dispatchEvent
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
      iconPath.dispatchEvent(clickEvent)
      expect(menu.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should handle clicks on multiple nested SVG elements like theme toggle', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <svg id="theme-icon" width="20" height="20">
              <path d="M10 10"></path>
            </svg>
            <svg id="chevron" width="16" height="16">
              <path id="chevron-path" d="M5 8"></path>
            </svg>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const themeIcon = document.getElementById('theme-icon') as unknown as SVGElement
      const chevronPath = document.getElementById('chevron-path') as unknown as SVGPathElement
      const menu = document.getElementById('test-menu') as HTMLElement
      const button = document.getElementById('test-toggle') as HTMLButtonElement

      // Initially hidden
      expect(menu.classList.contains('hidden')).toBe(true)

      // Click on first SVG icon using dispatchEvent
      const clickEvent1 = new MouseEvent('click', { bubbles: true, cancelable: true })
      themeIcon.dispatchEvent(clickEvent1)
      expect(menu.classList.contains('hidden')).toBe(false)
      expect(button.getAttribute('aria-expanded')).toBe('true')

      // Click on nested path in second SVG to close
      const clickEvent2 = new MouseEvent('click', { bubbles: true, cancelable: true })
      chevronPath.dispatchEvent(clickEvent2)
      expect(menu.classList.contains('hidden')).toBe(true)
      expect(button.getAttribute('aria-expanded')).toBe('false')

      cleanup()
    })

    it('should return early if no toggle buttons exist', () => {
      document.body.innerHTML = `<div>No toggle buttons here</div>`

      const cleanup = initializeToggles()

      // Should not throw error
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
    })

    it('should handle button without menu gracefully', () => {
      document.body.innerHTML = `
        <button id="test-toggle" data-toggle-button aria-expanded="false">
          Toggle
        </button>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement

      // Should not throw error when clicked
      expect(() => button.click()).not.toThrow()

      cleanup()
    })
  })

  describe('explicit toggle targeting with data-toggle-target', () => {
    it('should find menu using data-toggle-target attribute', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button data-toggle-target="test-menu" aria-expanded="false">
            Toggle
          </button>
        </div>
        <div id="test-menu" class="hidden">Menu Content</div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Initially hidden
      expect(menu.classList.contains('hidden')).toBe(true)

      // Click to open (menu is not adjacent sibling, but found via target)
      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)
      expect(button.getAttribute('aria-expanded')).toBe('true')

      cleanup()
    })

    it('should work with non-adjacent menu elements', () => {
      document.body.innerHTML = `
        <nav>
          <button id="nav-toggle" data-toggle-button data-toggle-target="nav-menu" aria-expanded="false">
            Menu
          </button>
        </nav>
        <aside>
          <div id="nav-menu" class="hidden">Navigation Menu</div>
        </aside>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('nav-toggle') as HTMLButtonElement
      const menu = document.getElementById('nav-menu') as HTMLElement

      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should handle invalid target gracefully', () => {
      document.body.innerHTML = `
        <button id="test-toggle" data-toggle-button data-toggle-target="nonexistent" aria-expanded="false">
          Toggle
        </button>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement

      // Should not throw error when clicked
      expect(() => button.click()).not.toThrow()

      cleanup()
    })

    it('should fallback to nextElementSibling when no target specified', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Should still work with nextElementSibling (backwards compatibility)
      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)

      cleanup()
    })

    it('should prefer data-toggle-target over nextElementSibling', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button data-toggle-target="correct-menu" aria-expanded="false">
            Toggle
          </button>
          <div id="wrong-menu" class="hidden">Wrong Menu</div>
        </div>
        <div id="correct-menu" class="hidden">Correct Menu</div>
      `

      const cleanup = initializeToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const correctMenu = document.getElementById('correct-menu') as HTMLElement
      const wrongMenu = document.getElementById('wrong-menu') as HTMLElement

      button.click()
      expect(correctMenu.classList.contains('hidden')).toBe(false)
      expect(wrongMenu.classList.contains('hidden')).toBe(true)

      cleanup()
    })
  })

  describe('setupToggles', () => {
    it('should initialize toggles immediately', () => {
      document.body.innerHTML = `
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `

      setupToggles()

      const button = document.getElementById('test-toggle') as HTMLButtonElement
      const menu = document.getElementById('test-menu') as HTMLElement

      // Should work immediately
      button.click()
      expect(menu.classList.contains('hidden')).toBe(false)
    })

    it('should setup View Transitions event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupToggles()

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function),
      )

      addEventListenerSpy.mockRestore()
    })
  })
})
