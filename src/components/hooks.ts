/**
 * Component lifecycle hooks orchestrator
 * Central initialization point for all component hooks
 */
import { initFeatureHooks } from './features/hooks'
import { initPatternHooks } from './patterns/hooks'
import { initPrimitiveHooks } from './primitives/hooks'

export function initComponentHooks(): void {
  initPrimitiveHooks()
  initPatternHooks()
  initFeatureHooks()
}
