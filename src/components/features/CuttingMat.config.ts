/**
 * Default configuration for cutting mat
 */

import type { CuttingMatOptions } from './CuttingMat.types'

export const defaultOptions: Required<CuttingMatOptions> = {
  majorLineInterval: 200,
  majorMinorRatio: 5,
  arcCount: 3,
  arcRadiusInterval: 1,
  angleLineCount: 5,
  angleLabelArcIndex: -1,
  showTeeth: true,
  angleMarkRadius: 1.5,
  majorOpacity: 0.175,
  minorOpacity: 0.12,
  labelOpacity: 0.175,
  majorStrokeWidth: 1.5,
  minorStrokeWidth: 1,
}
