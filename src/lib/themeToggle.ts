/**
 * Centralized theme toggle manager
 * Handles theme switching, icon visibility, and menu selection state
 */

import { applyTheme, getTheme, setTheme } from './theme'
import type { Theme } from './theme'

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize theme toggle behavior
 * Manages icon visibility, menu selection, and theme switching
 */
export function initializeThemeToggle(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  // Get DOM elements
  const lightIcon = document.getElementById('theme-icon-light')
  const darkIcon = document.getElementById('theme-icon-dark')
  const systemIcon = document.getElementById('theme-icon-system')
  const menuItems = document.querySelectorAll<HTMLElement>('#theme-menu .menu-item')
  const themeMenu = document.getElementById('theme-menu')
  const themeButton = document.getElementById('theme-toggle')

  // Return early if required elements don't exist
  if (
    lightIcon === null ||
    darkIcon === null ||
    systemIcon === null ||
    menuItems.length === 0 ||
    themeMenu === null ||
    themeButton === null
  ) {
    return () => {}
  }

  // Store non-null references for use in closures
  const icons = { light: lightIcon, dark: darkIcon, system: systemIcon }
  const menu = themeMenu
  const button = themeButton

  /**
   * Update which icon is visible based on current theme
   */
  function updateThemeIcon(theme: Theme): void {
    icons.light.classList.add('hidden')
    icons.dark.classList.add('hidden')
    icons.system.classList.add('hidden')

    if (theme === 'light') {
      icons.light.classList.remove('hidden')
    } else if (theme === 'dark') {
      icons.dark.classList.remove('hidden')
    } else {
      icons.system.classList.remove('hidden')
    }
  }

  /**
   * Update which menu item is selected
   */
  function updateMenuSelection(theme: Theme): void {
    menuItems.forEach((item) => {
      const itemValue = item.getAttribute('data-value')
      if (itemValue === theme) {
        item.classList.add('selected')
      } else {
        item.classList.remove('selected')
      }
    })
  }

  // Initialize theme on page load
  const theme = getTheme()
  applyTheme(theme)
  updateThemeIcon(theme)
  updateMenuSelection(theme)

  // Handle menu item clicks
  const clickHandlers = new Map<HTMLElement, EventListener>()
  menuItems.forEach((item) => {
    const handler = (e: Event): void => {
      e.stopPropagation()
      const selectedTheme = item.getAttribute('data-value')

      if (selectedTheme === 'light' || selectedTheme === 'dark' || selectedTheme === 'system') {
        setTheme(selectedTheme)
        applyTheme(selectedTheme)
        updateThemeIcon(selectedTheme)
        updateMenuSelection(selectedTheme)

        // Close menu
        menu.classList.add('hidden')
        button.setAttribute('aria-expanded', 'false')
      }
    }
    item.addEventListener('click', handler)
    clickHandlers.set(item, handler)
  })

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const mediaQueryHandler = (): void => {
    const currentTheme = getTheme()
    if (currentTheme === 'system') {
      applyTheme(currentTheme)
      updateThemeIcon(currentTheme)
    }
  }
  mediaQuery.addEventListener('change', mediaQueryHandler)

  // Return cleanup function
  cleanup = () => {
    // Remove click handlers
    clickHandlers.forEach((handler, item) => {
      item.removeEventListener('click', handler)
    })
    clickHandlers.clear()

    // Remove media query listener
    mediaQuery.removeEventListener('change', mediaQueryHandler)

    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupThemeToggle(): void {
  initializeThemeToggle()

  // Re-initialize on page load (for View Transitions)
  document.addEventListener('astro:page-load', initializeThemeToggle)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
