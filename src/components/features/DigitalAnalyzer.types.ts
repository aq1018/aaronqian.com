/**
 * Type definitions for digital analyzer signal visualization
 */

export type DataSource = 'config' | 'random'

export interface DigitalAnalyzerOptions {
  // Grid appearance
  gridOpacity?: number

  // Digital signal waveform configuration
  byteCount?: number
  bitsPerByte?: number
  dataSource?: DataSource
  defaultMessage?: string

  // Trace behavior
  traceInitialDelay?: number
  traceMinInterval?: number
  traceMaxInterval?: number

  // Trace animation timing
  traceDrawDuration?: number
  traceFadeDelay?: number
  traceFadeDuration?: number
  traceClearDelay?: number

  // Trace visual appearance
  lineOpacity?: number
  lineStrokeWidth?: number
}
