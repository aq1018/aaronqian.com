import { describe, expect, it } from 'vitest'

import { createTeethMarks } from './createTeethMarks'

describe('createTeethMarks', () => {
  const width = 4000
  const height = 4000
  const minorInterval = 40
  const toothInterval = minorInterval / 2 // 20
  const opacity = 0.175
  const strokeWidth = 1

  it('should create array of line elements', () => {
    const teeth = createTeethMarks({ width, height, minorInterval, opacity, strokeWidth })

    expect(Array.isArray(teeth)).toBe(true)
    expect(teeth.length).toBeGreaterThan(0)
    teeth.forEach((tooth) => {
      expect(tooth.tagName).toBe('line')
    })
  })

  it('should create vertical tick marks on x-axis', () => {
    const teeth = createTeethMarks({ width, height, minorInterval, opacity, strokeWidth })

    teeth.forEach((tooth) => {
      // X coordinates should be the same (vertical line)
      expect(tooth.getAttribute('x1')).toBe(tooth.getAttribute('x2'))

      // Y coordinates: bottom of canvas and 8px up
      expect(tooth.getAttribute('y1')).toBe(String(height))
      expect(tooth.getAttribute('y2')).toBe(String(height - 8))
    })
  })

  it('should apply correct opacity', () => {
    const teeth = createTeethMarks({ width, height, minorInterval, opacity, strokeWidth })

    teeth.forEach((tooth) => {
      expect(tooth.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', () => {
    const teeth = createTeethMarks({ width, height, minorInterval, opacity, strokeWidth })

    teeth.forEach((tooth) => {
      expect(tooth.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should space teeth at half the minor interval', () => {
    const teeth = createTeethMarks({ width, height, minorInterval, opacity, strokeWidth })

    // Get x positions
    const xPositions = teeth.map((tooth) => Number.parseFloat(tooth.getAttribute('x1') ?? '0'))

    // Check spacing between consecutive teeth
    for (let i = 1; i < xPositions.length; i += 1) {
      const spacing = xPositions[i] - xPositions[i - 1]
      expect(spacing).toBeCloseTo(toothInterval, 0.1)
    }
  })

  it('should span the full width of canvas', () => {
    const teeth = createTeethMarks({ width, height, minorInterval, opacity, strokeWidth })

    const xPositions = teeth.map((tooth) => Number.parseFloat(tooth.getAttribute('x1') ?? '0'))

    // First tooth should be near 0
    expect(xPositions[0]).toBeLessThan(toothInterval)

    // Last tooth should be near width
    expect(xPositions[xPositions.length - 1]).toBeGreaterThanOrEqual(width - toothInterval)
  })

  it('should handle different minor intervals', () => {
    const teeth1 = createTeethMarks({ width, height, minorInterval: 40, opacity, strokeWidth })
    const teeth2 = createTeethMarks({ width, height, minorInterval: 80, opacity, strokeWidth })

    // Larger minor interval should result in fewer teeth
    expect(teeth2.length).toBeLessThan(teeth1.length)
  })
})
