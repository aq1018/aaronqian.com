/**
 * Centralized toggle button manager
 * Handles all toggle buttons on the page with a single event delegation system
 * Prevents duplicate event listeners and properly cleans up on navigation
 */

type CleanupFunction = () => void
interface ToggleState {
  toggleButtons: Set<HTMLElement>
  menuMap: WeakMap<HTMLElement, HTMLElement>
}

let cleanup: CleanupFunction | null = null

/**
 * Build map of toggle buttons and their associated menus
 */
function buildToggleMap(): ToggleState {
  const toggleButtons = new Set<HTMLElement>()
  const menuMap = new WeakMap<HTMLElement, HTMLElement>()

  document.querySelectorAll<HTMLElement>('[data-toggle-button]').forEach((button) => {
    toggleButtons.add(button)

    // Check for explicit target via data-toggle-target attribute
    const targetId = button.dataset.toggleTarget
    if (targetId !== undefined && targetId != null && targetId !== '') {
      const targetMenu = document.querySelector<HTMLElement>(`#${targetId}`)
      if (targetMenu != null) {
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

  return { toggleButtons, menuMap }
}

/**
 * Create handler for toggle button clicks
 */
function createButtonClickHandler(state: ToggleState): EventListener {
  return (e: Event): void => {
    const target = e.target
    if (!(target instanceof Element)) return

    const button = target.closest<HTMLElement>('[data-toggle-button]')
    if (button == null || !state.toggleButtons.has(button)) return

    e.stopPropagation()

    const menu = state.menuMap.get(button)
    if (menu === undefined) return

    const isHidden = menu.classList.contains('hidden')
    menu.classList.toggle('hidden')
    button.setAttribute('aria-expanded', String(isHidden))
  }
}

/**
 * Create handler for closing menus when clicking outside
 */
function createDocumentClickHandler(state: ToggleState): EventListener {
  return (e: Event): void => {
    const target = e.target
    if (!(target instanceof Element)) return

    const clickedButton = target.closest<HTMLElement>('[data-toggle-button]')
    if (clickedButton != null && state.toggleButtons.has(clickedButton)) return

    state.toggleButtons.forEach((button) => {
      const menu = state.menuMap.get(button)
      if (menu !== undefined) {
        menu.classList.add('hidden')
        button.setAttribute('aria-expanded', 'false')
      }
    })
  }
}

/**
 * Initialize toggle button behavior for all buttons on the page
 * Uses event delegation to avoid multiple listeners
 */
export function initializeToggles(): CleanupFunction {
  if (cleanup != null) {
    cleanup()
  }

  const state = buildToggleMap()
  const handleButtonClick = createButtonClickHandler(state)
  const handleDocumentClick = createDocumentClickHandler(state)

  document.addEventListener('click', handleButtonClick)
  document.addEventListener('click', handleDocumentClick)

  cleanup = () => {
    document.removeEventListener('click', handleButtonClick)
    document.removeEventListener('click', handleDocumentClick)
    state.toggleButtons.clear()
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
    if (cleanup != null) {
      cleanup()
    }
  })
}
