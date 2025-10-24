/**
 * UI component lifecycle hooks
 * Initialize all UI component hooks
 */

import { setupCollapsibles } from './Collapsible.hook'
import { setupToggles } from './PillToggle.hook'

export function initUiHooks(): void {
  setupToggles()
  setupCollapsibles()
}
