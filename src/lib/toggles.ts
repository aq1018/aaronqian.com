/**
 * Centralized toggle button manager
 * Handles all toggle buttons on the page with a single event delegation system
 * Prevents duplicate event listeners and properly cleans up on navigation
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize toggle button behavior for all buttons on the page
 * Uses event delegation to avoid multiple listeners
 */
export function initializeToggles(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  const toggleButtons = new Set<HTMLElement>()
  const menuMap = new WeakMap<HTMLElement, HTMLElement>()

  // Find all toggle buttons and their associated menus
  document.querySelectorAll<HTMLElement>('[data-toggle-button]').forEach((button) => {
    toggleButtons.add(button)

    // Check for explicit target via data-toggle-target attribute
    const targetId = button.getAttribute('data-toggle-target')
    if (targetId !== null && targetId !== '') {
      const targetMenu = document.getElementById(targetId)
      if (targetMenu !== null) {
        menuMap.set(button, targetMenu)
      }
    } else {
      // Fallback to nextElementSibling for backwards compatibility
      const nextElement = button.nextElementSibling
      if (nextElement instanceof HTMLElement) {
        menuMap.set(button, nextElement)
      }
    }
  })

  // Event handler for button clicks
  const handleButtonClick = (e: Event): void => {
    const target = e.target
    if (!(target instanceof HTMLElement)) return

    const button = target.closest<HTMLElement>('[data-toggle-button]')

    if (button === null || !toggleButtons.has(button)) return

    e.stopPropagation()

    const menu = menuMap.get(button)
    if (menu === undefined) return

    // Toggle menu visibility
    const isHidden = menu.classList.contains('hidden')
    menu.classList.toggle('hidden')
    button.setAttribute('aria-expanded', String(isHidden))
  }

  // Event handler for closing menus when clicking outside
  const handleDocumentClick = (e: Event): void => {
    const target = e.target
    if (!(target instanceof HTMLElement)) return

    // Don't close if clicking on a toggle button (handled by handleButtonClick)
    const clickedButton = target.closest<HTMLElement>('[data-toggle-button]')
    if (clickedButton !== null && toggleButtons.has(clickedButton)) return

    // Close all menus
    toggleButtons.forEach((button) => {
      const menu = menuMap.get(button)
      if (menu !== undefined) {
        menu.classList.add('hidden')
        button.setAttribute('aria-expanded', 'false')
      }
    })
  }

  // Attach event listeners
  document.addEventListener('click', handleButtonClick)
  document.addEventListener('click', handleDocumentClick)

  // Return cleanup function
  cleanup = () => {
    document.removeEventListener('click', handleButtonClick)
    document.removeEventListener('click', handleDocumentClick)
    toggleButtons.clear()
    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupToggles(): void {
  initializeToggles()

  // Re-initialize on page load (for View Transitions)
  document.addEventListener('astro:page-load', initializeToggles)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
