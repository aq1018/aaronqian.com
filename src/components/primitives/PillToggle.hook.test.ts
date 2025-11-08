import { fireEvent, screen } from '@testing-library/dom'
import { describe, expect, it, vi } from 'vitest'

import { setupTestDOM } from '@test/testHelpers'

import { initializeToggles, setupToggles } from './PillToggle.hook'

describe('Toggle Button System', () => {
  describe('initializeToggles', () => {
    it('should initialize toggle buttons and menus', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')

      expect(button).toBeInTheDocument()
      expect(menu).toBeInTheDocument()
      expect(menu).toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should toggle menu visibility when button is clicked', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')

      // Initially hidden
      expect(menu).toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      // Click to open
      button.click()
      expect(menu).not.toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Click to close
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      expect(menu).toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      cleanup()
      domCleanup()
    })

    it('should close menu when clicking outside', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
        <div id="outside">Outside</div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')
      const outside = screen.getByText('Outside')

      // Open menu
      button.click()
      expect(menu).not.toHaveClass('hidden')

      // Click outside
      outside.click()
      expect(menu).toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      cleanup()
      domCleanup()
    })

    it('should handle multiple toggle buttons independently', () => {
      const domCleanup = setupTestDOM(`
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
      `)

      const cleanup = initializeToggles()

      const button1 = screen.getByRole('button', { name: /toggle 1/i })
      const menu1 = screen.getByText('Menu 1')
      const button2 = screen.getByRole('button', { name: /toggle 2/i })
      const menu2 = screen.getByText('Menu 2')

      // Open first menu
      button1.click()
      expect(menu1).not.toHaveClass('hidden')
      expect(menu2).toHaveClass('hidden')

      // Open second menu
      button2.click()
      expect(menu2).not.toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should clean up event listeners when cleanup is called', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')

      // Open menu
      button.click()
      expect(menu).not.toHaveClass('hidden')

      // Call cleanup
      cleanup()

      // Reset menu state manually
      menu.classList.add('hidden')
      button.setAttribute('aria-expanded', 'false')

      // Click should not toggle anymore (listeners removed)
      button.click()
      // Menu should still be hidden since listeners are removed
      expect(menu).toHaveClass('hidden')

      domCleanup()
    })

    it('should handle clicks on nested elements within button', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <span id="icon">Icon</span>
            <span id="text">Text</span>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const icon = screen.getByText('Icon')
      const menu = screen.getByText('Menu Content')

      // Click on nested element
      icon.click()
      expect(menu).not.toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should handle clicks on SVG icons within button', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <svg id="icon" width="20" height="20" data-testid="icon">
              <path id="icon-path" d="M10 10"></path>
            </svg>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const icon = screen.getByTestId('icon')
      const menu = screen.getByText('Menu Content')

      // Initially hidden
      expect(menu).toHaveClass('hidden')

      // Click on SVG icon
      // SVG elements do not respond to .click()
      // we simulate the click using fireEvent
      fireEvent.click(icon)
      expect(menu).not.toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should handle clicks on nested SVG path elements', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <svg id="icon" width="20" height="20">
              <path id="icon-path" d="M10 10" data-testid="icon-path"></path>
            </svg>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const iconPath = screen.getByTestId('icon-path')
      const menu = screen.getByText('Menu Content')

      // Initially hidden
      expect(menu).toHaveClass('hidden')

      // Click on deeply nested SVG path element
      fireEvent.click(iconPath)
      expect(menu).not.toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should handle clicks on multiple nested SVG elements like theme toggle', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            <svg id="theme-icon" width="20" height="20" data-testid="theme-icon">
              <path d="M10 10"></path>
            </svg>
            <svg id="chevron" width="16" height="16">
              <path id="chevron-path" d="M5 8" data-testid="chevron-path"></path>
            </svg>
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const themeIcon = screen.getByTestId('theme-icon')
      const chevronPath = screen.getByTestId('chevron-path')
      const menu = screen.getByText('Menu Content')
      const button = screen.getByRole('button')

      // Initially hidden
      expect(menu).toHaveClass('hidden')

      // Click on first SVG icon
      fireEvent.click(themeIcon)
      expect(menu).not.toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Click on nested path in second SVG to close
      fireEvent.click(chevronPath)
      expect(menu).toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      cleanup()
      domCleanup()
    })

    it('should return early if no toggle buttons exist', () => {
      const domCleanup = setupTestDOM(`<div>No toggle buttons here</div>`)

      const cleanup = initializeToggles()

      // Should not throw error
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
      domCleanup()
    })

    it('should handle button without menu gracefully', () => {
      const domCleanup = setupTestDOM(`
        <button id="test-toggle" data-toggle-button aria-expanded="false">
          Toggle
        </button>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })

      // Should not throw error when clicked
      expect(() => {
        button.click()
      }).not.toThrow()

      cleanup()
      domCleanup()
    })
  })

  describe('explicit toggle targeting with data-toggle-target', () => {
    it('should find menu using data-toggle-target attribute', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button data-toggle-target="test-menu" aria-expanded="false">
            Toggle
          </button>
        </div>
        <div id="test-menu" class="hidden">Menu Content</div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')

      // Initially hidden
      expect(menu).toHaveClass('hidden')

      // Click to open (menu is not adjacent sibling, but found via target)
      button.click()
      expect(menu).not.toHaveClass('hidden')
      expect(button).toHaveAttribute('aria-expanded', 'true')

      cleanup()
      domCleanup()
    })

    it('should work with non-adjacent menu elements', () => {
      const domCleanup = setupTestDOM(`
        <nav>
          <button id="nav-toggle" data-toggle-button data-toggle-target="nav-menu" aria-expanded="false">
            Menu
          </button>
        </nav>
        <aside>
          <div id="nav-menu" class="hidden">Navigation Menu</div>
        </aside>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /menu/i })
      const menu = screen.getByText('Navigation Menu')

      button.click()
      expect(menu).not.toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should handle invalid target gracefully', () => {
      const domCleanup = setupTestDOM(`
        <button id="test-toggle" data-toggle-button data-toggle-target="nonexistent" aria-expanded="false">
          Toggle
        </button>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })

      // Should not throw error when clicked
      expect(() => {
        button.click()
      }).not.toThrow()

      cleanup()
      domCleanup()
    })

    it('should fallback to nextElementSibling when no target specified', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')

      // Should still work with nextElementSibling (backwards compatibility)
      button.click()
      expect(menu).not.toHaveClass('hidden')

      cleanup()
      domCleanup()
    })

    it('should prefer data-toggle-target over nextElementSibling', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button data-toggle-target="correct-menu" aria-expanded="false">
            Toggle
          </button>
          <div id="wrong-menu" class="hidden">Wrong Menu</div>
        </div>
        <div id="correct-menu" class="hidden">Correct Menu</div>
      `)

      const cleanup = initializeToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const correctMenu = screen.getByText('Correct Menu')
      const wrongMenu = screen.getByText('Wrong Menu')

      button.click()
      expect(correctMenu).not.toHaveClass('hidden')
      expect(wrongMenu).toHaveClass('hidden')

      cleanup()
      domCleanup()
    })
  })

  describe('setupToggles', () => {
    it('should initialize toggles immediately', () => {
      const domCleanup = setupTestDOM(`
        <div>
          <button id="test-toggle" data-toggle-button aria-expanded="false">
            Toggle
          </button>
          <div id="test-menu" class="hidden">Menu Content</div>
        </div>
      `)

      setupToggles()

      const button = screen.getByRole('button', { name: /toggle/i })
      const menu = screen.getByText('Menu Content')

      // Should work immediately
      button.click()
      expect(menu).not.toHaveClass('hidden')

      domCleanup()
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
