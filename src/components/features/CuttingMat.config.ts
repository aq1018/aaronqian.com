/**
 * Default configuration for cutting mat
 */
import type { CuttingMatOptions } from './CuttingMat.types'

export const defaultOptions: Required<CuttingMatOptions> = {
  angleLabelArcIndex: -1,
  angleLineCount: 5,
  angleMarkRadius: 1.5,
  arcCount: 3,
  arcRadiusInterval: 1,
  labelOpacity: 0.3,
  majorLineInterval: 200,
  majorMinorRatio: 5,
  majorOpacity: 0.3,
  majorStrokeWidth: 1.5,
  minorOpacity: 0.2,
  minorStrokeWidth: 1,
  showTeeth: true,
}
