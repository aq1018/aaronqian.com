export type Theme = 'light' | 'dark' | 'system'

export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system'
  }
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem('theme', theme)
}

export function isDark(theme: Theme): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  if (theme === 'dark') {
    return true
  }
  if (theme === 'light') {
    return false
  }

  // System theme - check OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return
  }

  const updateDOM = () => {
    const dark = isDark(theme)

    document.documentElement.classList.toggle('dark', dark)
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
  if (currentTheme === 'light') {
    return 'dark'
  }
  if (currentTheme === 'dark') {
    return 'system'
  }
  return 'light'
}

/**
 * Centralized theme toggle manager
 * Handles theme switching, button selection state, and slider animation
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null

/**
 * Calculate slider offset for a theme
 */
function calculateSliderOffset(theme: Theme, themeButtons: NodeListOf<HTMLButtonElement>): number {
  let offset = 0
  themeButtons.forEach((button, index) => {
    const buttonValue = button.dataset.value
    if (buttonValue === theme) {
      offset = index * 32
    }
  })
  return offset
}

/**
 * Apply slider position
 */
function applySliderPosition(
  sliderElement: HTMLElement,
  offset: number,
  skipTransition: boolean,
): void {
  if (skipTransition) {
    const currentTransition = sliderElement.style.transition
    sliderElement.style.transition = 'none'
    sliderElement.style.transform = `translateX(${offset}px)`
    void sliderElement.offsetHeight
    sliderElement.style.transition = currentTransition
  } else {
    sliderElement.style.transform = `translateX(${offset}px)`
  }
}

/**
 * Update slider position to match selected button
 */
function updateSliderPosition(
  sliderElement: HTMLElement | null,
  theme: Theme,
  themeButtons: NodeListOf<HTMLButtonElement>,
  skipTransition = false,
): void {
  if (sliderElement == null) {
    return
  }
  const offset = calculateSliderOffset(theme, themeButtons)
  applySliderPosition(sliderElement, offset, skipTransition)
}

/**
 * Update which button is selected
 */
function updateButtonSelection(
  themeButtons: NodeListOf<HTMLButtonElement>,
  slider: HTMLElement | null,
  theme: Theme,
  skipTransition = false,
): void {
  themeButtons.forEach((button) => {
    const buttonValue = button.dataset.value
    button.classList.toggle('selected', buttonValue === theme)
  })
  updateSliderPosition(slider, theme, themeButtons, skipTransition)
}

/**
 * Setup button click handlers
 */
function setupButtonClickHandlers(
  themeButtons: NodeListOf<HTMLButtonElement>,
  slider: HTMLElement | null,
): Map<HTMLButtonElement, EventListener> {
  const clickHandlers = new Map<HTMLButtonElement, EventListener>()
  themeButtons.forEach((button) => {
    const handler = (e: Event): void => {
      e.stopPropagation()
      const selectedTheme = button.dataset.value

      if (selectedTheme === 'light' || selectedTheme === 'dark' || selectedTheme === 'system') {
        setTheme(selectedTheme)
        applyTheme(selectedTheme)
        updateButtonSelection(themeButtons, slider, selectedTheme)
      }
    }
    button.addEventListener('click', handler)
    clickHandlers.set(button, handler)
  })
  return clickHandlers
}

/**
 * Initialize theme toggle behavior
 * Manages button selection and theme switching
 */
export function initializeThemeToggle(): CleanupFunction {
  if (cleanup) {
    cleanup()
  }

  const themeButtons = document.querySelectorAll<HTMLButtonElement>(
    '#theme-toggle button[data-value]',
  )
  const slider = document.querySelector<HTMLElement>('#theme-toggle [data-slider]')

  if (themeButtons.length === 0) {
    return () => {}
  }

  const theme = getTheme()
  applyTheme(theme)
  updateButtonSelection(themeButtons, slider, theme, true)

  if (slider != null) {
    requestAnimationFrame(() => {
      slider.style.opacity = '1'
    })
  }

  const clickHandlers = setupButtonClickHandlers(themeButtons, slider)
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const mediaQueryHandler = (): void => {
    const currentTheme = getTheme()
    if (currentTheme === 'system') {
      applyTheme(currentTheme)
    }
  }
  mediaQuery.addEventListener('change', mediaQueryHandler)

  cleanup = () => {
    clickHandlers.forEach((handler, button) => {
      button.removeEventListener('click', handler)
    })
    clickHandlers.clear()
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
    if (cleanup) {
      cleanup()
    }
  })
}
