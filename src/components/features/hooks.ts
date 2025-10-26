/**
 * Feature component lifecycle hooks
 * Initialize all feature component hooks
 */

import { setupComments } from './Comments.hook'
import { setupDigitalAnalyzer } from './DigitalAnalyzer.hook'
import { setupThemeToggle } from './ThemeToggle.hook'

export function initFeatureHooks(): void {
  setupThemeToggle()
  setupDigitalAnalyzer()
  setupComments()
}
