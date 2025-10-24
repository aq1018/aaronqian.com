/**
 * Collapsible component hook
 * Manages expand/collapse behavior with View Transitions support
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize collapsible components
 * Sets up toggle behavior and keyboard shortcuts
 * Returns a cleanup function to prevent memory leaks
 */
export function initializeCollapsibles(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  const triggers = document.querySelectorAll('[data-collapsible-trigger]')
  const handlers = new Map<Element, EventListener>()

  // Set up click handlers for triggers
  triggers.forEach((trigger) => {
    const targetId = trigger.getAttribute('data-collapsible-trigger')
    if (targetId === null || targetId === '') return

    const handler = (e: Event) => {
      e.preventDefault()
      toggleCollapsible(targetId)
    }

    trigger.addEventListener('click', handler)
    handlers.set(trigger, handler)
  })

  // Set up keyboard shortcut (Cmd/Ctrl+K)
  const isMac = navigator.userAgent.toUpperCase().includes('MAC')
  const keyboardHandler = (e: KeyboardEvent) => {
    const modifierKey = isMac ? e.metaKey : e.ctrlKey
    if (modifierKey && e.key === 'k') {
      e.preventDefault()
      // Find the first collapsible with a trigger
      const firstTrigger = document.querySelector('[data-collapsible-trigger]')
      if (firstTrigger !== null) {
        const targetId = firstTrigger.getAttribute('data-collapsible-trigger')
        if (targetId !== null && targetId !== '') {
          toggleCollapsible(targetId)
        }
      }
    }
  }

  document.addEventListener('keydown', keyboardHandler)

  // Update keyboard shortcut display
  updateKeyboardShortcutDisplay(isMac)

  // Return cleanup function
  cleanup = () => {
    handlers.forEach((handler, element) => {
      element.removeEventListener('click', handler)
    })
    handlers.clear()
    document.removeEventListener('keydown', keyboardHandler)
    cleanup = null
  }

  return cleanup
}

/**
 * Toggle a collapsible by ID
 * Uses Web Animations API for universal browser support
 */
function toggleCollapsible(id: string): void {
  const collapsible = document.getElementById(id)
  if (collapsible === null) return

  const content = collapsible.querySelector('.collapsible-content')
  if (!(content instanceof HTMLElement)) return

  const isOpen = collapsible.getAttribute('data-open') === 'true'
  const newState = !isOpen

  if (newState) {
    // Opening: set state first, then animate
    collapsible.setAttribute('data-open', 'true')

    // Animate from 0 to full height
    collapsible.animate([{ gridTemplateRows: '0fr' }, { gridTemplateRows: '1fr' }], {
      duration: 300,
      easing: 'ease-out',
    })
  } else {
    // Closing: animate from 1fr to 0fr
    collapsible.animate([{ gridTemplateRows: '1fr' }, { gridTemplateRows: '0fr' }], {
      duration: 300,
      easing: 'ease-out',
    })

    // Delay setting the attribute until after animation
    setTimeout(() => {
      collapsible.setAttribute('data-open', 'false')
    }, 300)

    collapsible.setAttribute('aria-expanded', 'false')

    // Update trigger immediately
    const trigger = document.querySelector(`[data-collapsible-trigger="${id}"]`)
    if (trigger !== null) {
      trigger.setAttribute('aria-expanded', 'false')
    }
    return
  }

  collapsible.setAttribute('aria-expanded', 'true')

  // Update trigger state
  const trigger = document.querySelector(`[data-collapsible-trigger="${id}"]`)
  if (trigger !== null) {
    trigger.setAttribute('aria-expanded', 'true')
  }
}

/**
 * Update keyboard shortcut display based on OS
 */
function updateKeyboardShortcutDisplay(isMac: boolean): void {
  const shortcutDisplay = document.getElementById('keyboard-shortcut')
  if (shortcutDisplay !== null) {
    shortcutDisplay.textContent = isMac ? '⌘K' : 'Ctrl+K'
  }
}

/**
 * Setup function called by hooks orchestrator
 * Registers its own astro:page-load listener
 */
export function setupCollapsibles(): void {
  // Initial setup on first page load
  initializeCollapsibles()

  // Re-initialize after View Transitions navigation
  document.addEventListener('astro:page-load', initializeCollapsibles)

  // Cleanup before page swap to prevent memory leaks
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
