/**
 * Centralized theme toggle manager
 * Handles theme switching, button selection state, and slider animation
 */

import { applyTheme, getTheme, setTheme } from './theme'
import type { Theme } from './theme'

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize theme toggle behavior
 * Manages button selection and theme switching
 */
export function initializeThemeToggle(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  // Get DOM elements
  const themeButtons = document.querySelectorAll<HTMLButtonElement>(
    '#theme-toggle button[data-value]',
  )
  const slider = document.querySelector<HTMLElement>('#theme-toggle [data-slider]')

  // Return early if required elements don't exist
  if (themeButtons.length === 0) {
    return () => {}
  }

  /**
   * Update slider position to match selected button
   */
  function updateSliderPosition(theme: Theme, skipTransition = false): void {
    if (slider === null) return

    themeButtons.forEach((button, index) => {
      const buttonValue = button.getAttribute('data-value')
      if (buttonValue === theme) {
        // Calculate position: each button is 32px (w-8)
        const offset = index * 32

        if (skipTransition) {
          // Disable transition for instant positioning
          const currentTransition = slider.style.transition
          slider.style.transition = 'none'
          slider.style.transform = `translateX(${offset}px)`
          // Force reflow to apply the change
          void slider.offsetHeight
          slider.style.transition = currentTransition
        } else {
          slider.style.transform = `translateX(${offset}px)`
        }
      }
    })
  }

  /**
   * Update which button is selected
   */
  function updateButtonSelection(theme: Theme, skipTransition = false): void {
    themeButtons.forEach((button) => {
      const buttonValue = button.getAttribute('data-value')
      if (buttonValue === theme) {
        button.classList.add('selected')
      } else {
        button.classList.remove('selected')
      }
    })
    updateSliderPosition(theme, skipTransition)
  }

  // Initialize theme on page load
  const theme = getTheme()
  applyTheme(theme)

  // Position slider instantly (no transition) and then show it
  updateButtonSelection(theme, true)

  // Show the slider after positioning it
  if (slider !== null) {
    // Use requestAnimationFrame to ensure position is applied first
    requestAnimationFrame(() => {
      slider.style.opacity = '1'
    })
  }

  // Handle button clicks
  const clickHandlers = new Map<HTMLButtonElement, EventListener>()
  themeButtons.forEach((button) => {
    const handler = (e: Event): void => {
      e.stopPropagation()
      const selectedTheme = button.getAttribute('data-value')

      if (selectedTheme === 'light' || selectedTheme === 'dark' || selectedTheme === 'system') {
        setTheme(selectedTheme)
        applyTheme(selectedTheme)
        updateButtonSelection(selectedTheme)
      }
    }
    button.addEventListener('click', handler)
    clickHandlers.set(button, handler)
  })

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const mediaQueryHandler = (): void => {
    const currentTheme = getTheme()
    if (currentTheme === 'system') {
      applyTheme(currentTheme)
    }
  }
  mediaQuery.addEventListener('change', mediaQueryHandler)

  // Return cleanup function
  cleanup = () => {
    // Remove click handlers
    clickHandlers.forEach((handler, button) => {
      button.removeEventListener('click', handler)
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
