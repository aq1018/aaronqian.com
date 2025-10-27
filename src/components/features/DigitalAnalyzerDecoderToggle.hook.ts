/**
 * DigitalAnalyzerDecoderToggle hook
 * Manages keyboard shortcuts and runtime injection of toggle behavior
 * - Injects data-collapsible-trigger into first slotted element
 * - Wires up keyboard shortcuts to toggle collapsibles
 * - Auto-detects OS for cmd/ctrl modifiers
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize decoder toggles
 * 1. Finds all [data-decoder-wrapper] elements
 * 2. Injects data-collapsible-trigger into first child
 * 3. Sets up keyboard shortcuts based on data attributes
 */
export function initializeDecoderToggles(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  const wrappers = document.querySelectorAll<HTMLElement>('[data-decoder-wrapper]')
  const keyboardHandlers = new Map<string, EventListener>()

  // Detect OS for correct modifier key
  const isMac = navigator.userAgent.toUpperCase().includes('MAC')

  wrappers.forEach((wrapper) => {
    const target = wrapper.getAttribute('data-decoder-target')
    const keyboardKey = wrapper.getAttribute('data-keyboard-key')
    const keyboardModifier = wrapper.getAttribute('data-keyboard-modifier')

    if (target === null || target === '') {
      if (import.meta.env.DEV) {
        console.warn('[DecoderToggle] Missing data-decoder-target on wrapper', wrapper)
      }
      return
    }

    // Inject data-collapsible-trigger into first child element
    const trigger = wrapper.querySelector<HTMLElement>(':scope > *')
    if (trigger === null) {
      if (import.meta.env.DEV) {
        console.warn('[DecoderToggle] No child element found in wrapper', wrapper)
      }
      return
    }

    trigger.setAttribute('data-collapsible-trigger', target)
    trigger.setAttribute('data-decoder-toggle', '')

    // Dev warning if multiple children detected
    if (import.meta.env.DEV && wrapper.children.length > 1) {
      console.warn(
        '[DecoderToggle] Multiple children detected in wrapper. Only the first element will receive toggle behavior.',
        wrapper,
      )
    }

    // Setup keyboard shortcut if configured
    if (keyboardKey !== null && keyboardKey !== '') {
      const handleKeyboard: EventListener = (evt: Event) => {
        // Type guard: keydown events are always KeyboardEvents
        if (!(evt instanceof KeyboardEvent)) {
          return
        }
        const e = evt
        // Determine if modifier key is pressed based on configuration
        const modifierPressed = (() => {
          if (keyboardModifier === null || keyboardModifier === '') {
            return true // No modifier required
          }

          // Handle cmd|ctrl pattern (auto-detect based on OS)
          if (keyboardModifier === 'cmd|ctrl') {
            return isMac ? e.metaKey : e.ctrlKey
          }

          // Handle specific modifiers
          if (keyboardModifier.includes('cmd') || keyboardModifier.includes('meta')) {
            return e.metaKey
          }
          if (keyboardModifier.includes('ctrl')) {
            return e.ctrlKey
          }
          if (keyboardModifier.includes('alt')) {
            return e.altKey
          }
          if (keyboardModifier.includes('shift')) {
            return e.shiftKey
          }

          return false
        })()

        if (modifierPressed && e.key.toLowerCase() === keyboardKey.toLowerCase()) {
          e.preventDefault()

          // Find the collapsible and toggle it
          const collapsible = document.querySelector(`[data-collapsible-id="${target}"]`)
          if (collapsible !== null) {
            const isOpen = collapsible.getAttribute('data-open') === 'true'
            const newState = !isOpen

            collapsible.setAttribute('data-open', String(newState))
            collapsible.setAttribute('aria-expanded', String(newState))

            // Update trigger state
            const triggerElement = document.querySelector(`[data-collapsible-trigger="${target}"]`)
            if (triggerElement !== null) {
              triggerElement.setAttribute('aria-expanded', String(newState))
            }
          }
        }
      }

      document.addEventListener('keydown', handleKeyboard)
      keyboardHandlers.set(target, handleKeyboard)
    }
  })

  // Return cleanup function
  cleanup = () => {
    keyboardHandlers.forEach((handler) => {
      document.removeEventListener('keydown', handler)
    })
    keyboardHandlers.clear()
    cleanup = null
  }

  return cleanup
}

/**
 * Setup function with automatic cleanup for Astro View Transitions
 */
export function setupDecoderToggle(): void {
  // Initial setup on first page load
  initializeDecoderToggles()

  // Re-initialize after View Transitions navigation
  document.addEventListener('astro:page-load', initializeDecoderToggles)

  // Cleanup before page swap to prevent memory leaks
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
