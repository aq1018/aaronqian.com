/**
 * Kbd Component Hook
 *
 * Provides OS-aware keyboard shortcut formatting.
 * - Detects Mac vs Windows/Linux
 * - Formats modifiers appropriately (⌘ vs Ctrl, etc.)
 * - Updates all [data-kbd] elements on page
 */

/**
 * Detect if the user is on macOS
 */
function isMacOS(): boolean {
  return navigator.userAgent.toUpperCase().includes('MAC')
}

/**
 * Format modifier key based on OS
 */
function formatModifier(modifier: string, isMac: boolean): string {
  // Handle platform-specific modifiers (e.g., "cmd|ctrl")
  if (modifier.includes('|')) {
    const [macMod, winMod] = modifier.split('|')
    return formatModifier(isMac ? macMod : winMod, isMac)
  }

  // Map modifier to display string
  const modifierMap: Record<string, { mac: string; windows: string }> = {
    alt: { mac: '⌥', windows: 'Alt' },
    cmd: { mac: '⌘', windows: 'Cmd' },
    ctrl: { mac: '⌃', windows: 'Ctrl' },
    option: { mac: '⌥', windows: 'Alt' },
    shift: { mac: '⇧', windows: 'Shift' },
  }

  const modKey = modifier.toLowerCase()

  // Check if modifier exists in map
  if (!(modKey in modifierMap)) {
    // Unknown modifier, return as-is
    return modifier
  }

  const mapping = modifierMap[modKey]
  return isMac ? mapping.mac : mapping.windows
}

/**
 * Format the complete keyboard shortcut
 */
function formatShortcut(keys: string, modifier: string | undefined, isMac: boolean): string {
  // Format keys (capitalize first letter)
  const formattedKeys = keys.charAt(0).toUpperCase() + keys.slice(1)

  // If no modifier, just return keys
  if (modifier == null || modifier === '') {
    return formattedKeys
  }

  // Format modifier
  const formattedModifier = formatModifier(modifier, isMac)

  // Combine modifier + keys
  // Mac: no separator (⌘K)
  // Windows: plus separator (Ctrl+K)
  const separator = isMac ? '' : '+'

  return `${formattedModifier}${separator}${formattedKeys}`
}

/**
 * Update all keyboard shortcut displays on the page
 */
function updateKbdDisplays(): void {
  const isMac = isMacOS()
  const kbdElements = document.querySelectorAll<HTMLElement>('[data-kbd]')

  for (const kbdElement of kbdElements) {
    const keys = kbdElement.dataset.keys
    const modifier = kbdElement.dataset.modifier

    if (keys != null && keys !== '') {
      const formattedText = formatShortcut(keys, modifier, isMac)
      kbdElement.textContent = formattedText
    }
  }
}

/**
 * Initialize Kbd component behavior
 * Sets up OS-aware keyboard shortcut formatting
 */
export function setupKbd(): () => void {
  // Initial update
  updateKbdDisplays()

  // Update after View Transitions navigation
  document.addEventListener('astro:page-load', updateKbdDisplays)

  // Return cleanup function
  return () => {
    document.removeEventListener('astro:page-load', updateKbdDisplays)
  }
}
