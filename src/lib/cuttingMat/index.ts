/**
 * Cutting mat background manager
 * Handles technical grid setup and optional measurement overlays
 * Follows same cleanup pattern as powerGrid for Astro View Transitions
 */

import { defaultOptions } from './config'
import { createCuttingMatOverlays } from './overlay'
import type { CleanupFunction, CuttingMatOptions } from './types'

export type { CleanupFunction, CuttingMatOptions } from './types'
export { defaultOptions } from './config'

let cleanup: CleanupFunction | null = null

/**
 * Initialize cutting mat behavior
 * Sets up technical grid and optional interactive elements
 */
export function initializeCuttingMat(options: CuttingMatOptions = {}): CleanupFunction {
  // Merge with defaults
  const config = { ...defaultOptions, ...options }

  // Clean up previous initialization
  if (cleanup !== null) {
    cleanup()
  }

  const cuttingMat = document.querySelector<HTMLElement>('[data-cutting-mat]')

  if (cuttingMat === null) {
    cleanup = () => {}
    return cleanup
  }

  // Use last arc if angleLabelArcIndex is -1
  const labelArcIndex =
    config.angleLabelArcIndex === -1 ? config.arcCount - 1 : config.angleLabelArcIndex
  const finalConfig = { ...config, angleLabelArcIndex: labelArcIndex }

  // Create and append SVG overlays
  const svg = createCuttingMatOverlays(cuttingMat, finalConfig)
  cuttingMat.appendChild(svg)

  cleanup = () => {
    // Remove SVG overlays on cleanup
    svg.remove()
  }

  return cleanup
}

/**
 * Main setup function for cutting mat
 * Call this from page/component script tags
 */
export function setupCuttingMat(options: CuttingMatOptions = {}): void {
  const cleanupFn = initializeCuttingMat(options)

  // Handle Astro View Transitions cleanup
  document.addEventListener('astro:before-preparation', cleanupFn, { once: true })
  document.addEventListener('astro:after-swap', () => {
    setupCuttingMat(options)
  })
}
