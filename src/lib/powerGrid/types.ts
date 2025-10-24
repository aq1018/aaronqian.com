/**
 * Type definitions for power grid digital signal analyzer
 */

export type DataSource = 'config' | 'random' | 'prop'
export type WaveformStyle = 'square' // Future: 'rounded'

export interface PowerGridOptions {
  // Grid appearance
  gridOpacity?: number

  // Digital signal waveform configuration
  byteCount?: number
  bitsPerByte?: number
  dataSource?: DataSource
  defaultMessage?: string
  waveformStyle?: WaveformStyle
  customBinaryData?: string | undefined // For prop-based data source

  // Trace behavior
  maxConcurrentTraces?: number
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
