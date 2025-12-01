/**
 * Collapsible component hook
 * Manages expand/collapse behavior with View Transitions support
 * Animation is handled by pure CSS Grid transitions
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null

/**
 * Initialize collapsible components
 * Sets up toggle behavior for click triggers
 * Returns a cleanup function to prevent memory leaks
 */
export function initializeCollapsibles(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup) {
    cleanup()
  }

  const triggers = document.querySelectorAll<HTMLElement>('[data-collapsible-trigger]')
  const handlers = new Map<HTMLElement, EventListener>()

  // Set up click handlers for triggers
  triggers.forEach((trigger) => {
    const targetId = trigger.dataset.collapsibleTrigger
    if (targetId == null || targetId === '') {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      toggleCollapsible(targetId)
    }

    trigger.addEventListener('click', handler)
    handlers.set(trigger, handler)
  })

  // Return cleanup function
  cleanup = () => {
    handlers.forEach((handler, element) => {
      element.removeEventListener('click', handler)
    })
    handlers.clear()
    cleanup = null
  }

  return cleanup
}

/**
 * Toggle a collapsible by data-collapsible-id
 * Pure CSS handles animation via data-open attribute
 */
function toggleCollapsible(id: string): void {
  const collapsible = document.querySelector<HTMLElement>(`[data-collapsible-id="${id}"]`)
  if (collapsible == null) {
    return
  }

  const isOpen = collapsible.dataset.open === 'true'
  const newState = !isOpen

  // Update state - CSS handles the animation
  collapsible.dataset.open = String(newState)

  // Update trigger state
  const trigger = document.querySelector(`[data-collapsible-trigger="${id}"]`)
  if (trigger != null) {
    trigger.setAttribute('aria-expanded', String(newState))
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
  // Use queueMicrotask to ensure DOM modifications from other hooks (like
  // DecoderToggle injecting data-collapsible-trigger) complete before querying
  document.addEventListener('astro:page-load', () => {
    queueMicrotask(initializeCollapsibles)
  })

  // Cleanup before page swap to prevent memory leaks
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup != null) {
      cleanup()
    }
  })
}
