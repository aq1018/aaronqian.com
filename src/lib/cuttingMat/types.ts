/**
 * Type definitions for cutting mat module
 */

export type CleanupFunction = () => void

export interface CuttingMatOptions {
  majorLineInterval?: number
  majorMinorRatio?: number
  arcCount?: number
  arcRadiusInterval?: number
  angleLineCount?: number
  angleLabelArcIndex?: number
  showTeeth?: boolean
  angleMarkRadius?: number
  majorOpacity?: number
  minorOpacity?: number
  labelOpacity?: number
  majorStrokeWidth?: number
  minorStrokeWidth?: number
}
