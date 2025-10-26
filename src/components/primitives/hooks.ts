/**
 * Primitive component lifecycle hooks
 * Initialize all primitive component hooks
 */

import { setupCollapsibles } from './Collapsible.hook'
import { setupToggles } from './PillToggle.hook'

export function initPrimitiveHooks(): void {
  setupToggles()
  setupCollapsibles()
}
