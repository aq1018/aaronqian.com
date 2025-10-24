import { describe, expect, it } from 'vitest'

import { defaultOptions } from './CuttingMat.config'

describe('CuttingMat Config', () => {
  describe('defaultOptions', () => {
    it('should have all required properties', () => {
      expect(defaultOptions).toHaveProperty('majorLineInterval')
      expect(defaultOptions).toHaveProperty('majorMinorRatio')
      expect(defaultOptions).toHaveProperty('arcCount')
      expect(defaultOptions).toHaveProperty('arcRadiusInterval')
      expect(defaultOptions).toHaveProperty('angleLineCount')
      expect(defaultOptions).toHaveProperty('angleLabelArcIndex')
      expect(defaultOptions).toHaveProperty('showTeeth')
      expect(defaultOptions).toHaveProperty('angleMarkRadius')
      expect(defaultOptions).toHaveProperty('majorOpacity')
      expect(defaultOptions).toHaveProperty('minorOpacity')
      expect(defaultOptions).toHaveProperty('labelOpacity')
      expect(defaultOptions).toHaveProperty('majorStrokeWidth')
      expect(defaultOptions).toHaveProperty('minorStrokeWidth')
    })

    it('should have expected default values', () => {
      expect(defaultOptions.majorLineInterval).toBe(200)
      expect(defaultOptions.majorMinorRatio).toBe(5)
      expect(defaultOptions.arcCount).toBe(3)
      expect(defaultOptions.arcRadiusInterval).toBe(1)
      expect(defaultOptions.angleLineCount).toBe(5)
      expect(defaultOptions.angleLabelArcIndex).toBe(-1)
      expect(defaultOptions.showTeeth).toBe(true)
      expect(defaultOptions.angleMarkRadius).toBe(1.5)
      expect(defaultOptions.majorOpacity).toBe(0.175)
      expect(defaultOptions.minorOpacity).toBe(0.12)
      expect(defaultOptions.labelOpacity).toBe(0.175)
      expect(defaultOptions.majorStrokeWidth).toBe(1.5)
      expect(defaultOptions.minorStrokeWidth).toBe(1)
    })

    it('should allow merging with custom options', () => {
      const customOptions = {
        majorLineInterval: 100,
        showTeeth: false,
      }

      const merged = { ...defaultOptions, ...customOptions }

      expect(merged.majorLineInterval).toBe(100)
      expect(merged.showTeeth).toBe(false)
      expect(merged.majorMinorRatio).toBe(5) // default preserved
      expect(merged.arcCount).toBe(3) // default preserved
    })

    it('should calculate minorInterval correctly from defaults', () => {
      const minorInterval = defaultOptions.majorLineInterval / defaultOptions.majorMinorRatio
      expect(minorInterval).toBe(40)
    })
  })
})
