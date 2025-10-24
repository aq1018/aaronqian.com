/**
 * Component lifecycle hooks orchestrator
 * Central initialization point for all component hooks
 */

import { initFeatureHooks } from './features/hooks'
import { initUiHooks } from './ui/hooks'

export function initComponentHooks(): void {
  initUiHooks()
  initFeatureHooks()
}
