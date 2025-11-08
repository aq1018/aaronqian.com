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
 * Check if modifier key is pressed based on configuration
 */
function isModifierPressed(
  e: KeyboardEvent,
  keyboardModifier: string | null,
  isMac: boolean,
): boolean {
  if (keyboardModifier == null || keyboardModifier === '') {
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
}

/**
 * Toggle collapsible state by target ID
 */
function toggleCollapsible(target: string): void {
  const collapsible = document.querySelector<HTMLElement>(`[data-collapsible-id="${target}"]`)
  if (collapsible != null) {
    const isOpen = collapsible.dataset.open === 'true'
    const newState = !isOpen

    collapsible.dataset.open = String(newState)
    collapsible.setAttribute('aria-expanded', String(newState))

    // Update trigger state
    const triggerElement = document.querySelector(`[data-collapsible-trigger="${target}"]`)
    if (triggerElement != null) {
      triggerElement.setAttribute('aria-expanded', String(newState))
    }
  }
}

/**
 * Create keyboard handler for a specific target
 */
function createKeyboardHandler(
  target: string,
  keyboardKey: string,
  keyboardModifier: string | null,
  isMac: boolean,
): EventListener {
  return (evt: Event) => {
    if (!(evt instanceof KeyboardEvent)) return

    if (
      isModifierPressed(evt, keyboardModifier, isMac) &&
      evt.key.toLowerCase() === keyboardKey.toLowerCase()
    ) {
      evt.preventDefault()
      toggleCollapsible(target)
    }
  }
}

/**
 * Process a single decoder wrapper element
 */
function processWrapper(
  wrapper: HTMLElement,
  keyboardHandlers: Map<string, EventListener>,
  isMac: boolean,
): void {
  const target = wrapper.dataset.decoderTarget
  const keyboardKey = wrapper.dataset.keyboardKey
  const keyboardModifier = wrapper.dataset.keyboardModifier ?? null

  if (target == null || target === '') {
    if (import.meta.env.DEV) {
      console.warn('[DecoderToggle] Missing data-decoder-target on wrapper', wrapper)
    }
    return
  }

  const trigger = wrapper.querySelector<HTMLElement>(':scope > *')
  if (trigger == null) {
    if (import.meta.env.DEV) {
      console.warn('[DecoderToggle] No child element found in wrapper', wrapper)
    }
    return
  }

  trigger.dataset.collapsibleTrigger = target
  trigger.dataset.decoderToggle = ''

  if (import.meta.env.DEV && wrapper.children.length > 1) {
    console.warn(
      '[DecoderToggle] Multiple children detected in wrapper. Only the first element will receive toggle behavior.',
      wrapper,
    )
  }

  if (keyboardKey != null && keyboardKey !== '') {
    const handleKeyboard = createKeyboardHandler(target, keyboardKey, keyboardModifier, isMac)
    document.addEventListener('keydown', handleKeyboard)
    keyboardHandlers.set(target, handleKeyboard)
  }
}

/**
 * Initialize decoder toggles
 * 1. Finds all [data-decoder-wrapper] elements
 * 2. Injects data-collapsible-trigger into first child
 * 3. Sets up keyboard shortcuts based on data attributes
 */
export function initializeDecoderToggles(): CleanupFunction {
  if (cleanup != null) {
    cleanup()
  }

  const wrappers = document.querySelectorAll<HTMLElement>('[data-decoder-wrapper]')
  const keyboardHandlers = new Map<string, EventListener>()
  const isMac = navigator.userAgent.toUpperCase().includes('MAC')

  wrappers.forEach((wrapper) => {
    processWrapper(wrapper, keyboardHandlers, isMac)
  })

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
    if (cleanup != null) {
      cleanup()
    }
  })
}
