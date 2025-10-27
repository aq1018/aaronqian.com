/**
 * Primitive component lifecycle hooks
 * Initialize all primitive component hooks
 */

import { setupCollapsibles } from './Collapsible.hook'
import { setupKbd } from './Kbd.hook'
import { setupToggles } from './PillToggle.hook'

export function initPrimitiveHooks(): void {
  setupToggles()
  setupCollapsibles()
  setupKbd()
}
