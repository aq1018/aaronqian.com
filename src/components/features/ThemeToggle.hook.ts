export type Theme = 'light' | 'dark' | 'system'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
}

export function isDark(theme: Theme): boolean {
  if (typeof window === 'undefined') return false

  if (theme === 'dark') return true
  if (theme === 'light') return false

  // System theme - check OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return

  const updateDOM = () => {
    const dark = isDark(theme)

    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Use View Transitions API if supported for smooth theme changes
  // Falls back to immediate update if not supported
  if ('startViewTransition' in document) {
    document.startViewTransition(updateDOM)
  } else {
    updateDOM()
  }
}

export function getNextTheme(currentTheme: Theme): Theme {
  if (currentTheme === 'light') return 'dark'
  if (currentTheme === 'dark') return 'system'
  return 'light'
}

/**
 * Centralized theme toggle manager
 * Handles theme switching, button selection state, and slider animation
 */

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

  // Re-apply theme after View Transitions navigation (swap)
  document.addEventListener('astro:after-swap', () => {
    const theme = getTheme()
    applyTheme(theme)
  })

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
