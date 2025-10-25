/**
 * Default configuration for digital analyzer signal visualization
 * Dimensions are calculated dynamically at runtime based on container size
 */

import type { DigitalAnalyzerOptions } from './DigitalAnalyzer.types'

export const defaultOptions: Required<DigitalAnalyzerOptions> = {
  // Grid appearance
  gridOpacity: 0.2, // Static grid line opacity

  // Digital signal waveform configuration
  byteCount: 2, // Number of bytes per trace (determines how many grid cells horizontally)
  bitsPerByte: 8, // Bits per byte constant
  dataSource: 'config', // 'random' | 'config'
  defaultMessage: 'HTTP/1.1 404 CoffeeNotFound', // Message used when dataSource is 'config'

  // Trace behavior
  traceInitialDelay: 800, // Delay before first trace (ms)
  traceMinInterval: 1000, // Minimum time between traces (ms)
  traceMaxInterval: 1500, // Maximum time between traces (ms)

  // Trace animation timing
  traceDrawDuration: 1800, // How long trace takes to draw (ms)
  traceFadeDelay: 300, // Delay before fade starts after draw completes (ms)
  traceFadeDuration: 400, // How long fade out takes (ms)
  traceClearDelay: 150, // Delay between fade completion and clearing content (ms)

  // Trace visual appearance
  lineOpacity: 0.3, // Trace line opacity
  lineStrokeWidth: 2, // Trace line thickness
}

/**
 * Calculate grid size based on container width and byte count
 * gridSize = containerWidth / (byteCount * bitsPerByte)
 */
export function calculateGridSize(
  containerWidth: number,
  byteCount: number,
  bitsPerByte = 8,
): number {
  return containerWidth / (byteCount * bitsPerByte)
}
