import { describe, expect, it } from 'vitest'

import type { CleanupFunction, CuttingMatOptions } from './types'

describe('CuttingMat Types', () => {
  describe('CleanupFunction', () => {
    it('should accept a function that returns void', () => {
      const cleanup: CleanupFunction = () => {
        // cleanup logic
      }

      expect(typeof cleanup).toBe('function')
      expect(cleanup()).toBeUndefined()
    })
  })

  describe('CuttingMatOptions', () => {
    it('should accept empty object', () => {
      const options: CuttingMatOptions = {}
      expect(options).toEqual({})
    })

    it('should accept partial options', () => {
      const options: CuttingMatOptions = {
        majorLineInterval: 100,
        showTeeth: false,
      }

      expect(options.majorLineInterval).toBe(100)
      expect(options.showTeeth).toBe(false)
    })

    it('should accept all options', () => {
      const options: CuttingMatOptions = {
        majorLineInterval: 200,
        majorMinorRatio: 5,
        arcCount: 3,
        arcRadiusInterval: 1,
        angleLineCount: 5,
        angleLabelArcIndex: 2,
        showTeeth: true,
        angleMarkRadius: 1.5,
        majorOpacity: 0.175,
        minorOpacity: 0.12,
        labelOpacity: 0.175,
        majorStrokeWidth: 1.5,
        minorStrokeWidth: 1,
      }

      expect(options.majorLineInterval).toBe(200)
      expect(options.majorMinorRatio).toBe(5)
      expect(options.arcCount).toBe(3)
      expect(options.arcRadiusInterval).toBe(1)
      expect(options.angleLineCount).toBe(5)
      expect(options.angleLabelArcIndex).toBe(2)
      expect(options.showTeeth).toBe(true)
      expect(options.angleMarkRadius).toBe(1.5)
      expect(options.majorOpacity).toBe(0.175)
      expect(options.minorOpacity).toBe(0.12)
      expect(options.labelOpacity).toBe(0.175)
      expect(options.majorStrokeWidth).toBe(1.5)
      expect(options.minorStrokeWidth).toBe(1)
    })
  })
})
