import { describe, expect, it } from 'vitest'

import { createAngleLines } from './createAngleLines'

describe('createAngleLines', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const angleLineCount = 5
  const opacity = 0.175
  const strokeWidth = 1.5

  it('should create correct number of line elements', () => {
    const lines = createAngleLines({ width, height, angleLineCount, opacity, strokeWidth })

    expect(lines.length).toBe(angleLineCount)
    lines.forEach((line) => {
      expect(line.tagName).toBe('line')
    })
  })

  it('should create lines starting at bottom center', () => {
    const lines = createAngleLines({ width, height, angleLineCount, opacity, strokeWidth })

    lines.forEach((line) => {
      expect(line.getAttribute('x1')).toBe(String(centerX))
      expect(line.getAttribute('y1')).toBe(String(bottomY))
    })
  })

  it('should distribute angles evenly from 30° to 150°', () => {
    const lines = createAngleLines({ width, height, angleLineCount: 5, opacity, strokeWidth })

    // For 5 lines: 30°, 60°, 90°, 120°, 150°
    const expectedAngles = [30, 60, 90, 120, 150]

    lines.forEach((line, i) => {
      const x2 = Number.parseFloat(line.getAttribute('x2') ?? '0')
      const y2 = Number.parseFloat(line.getAttribute('y2') ?? '0')

      // Calculate angle from end point
      const dx = x2 - centerX
      const dy = bottomY - y2
      const calculatedAngle = (Math.atan2(dy, dx) * 180) / Math.PI

      expect(calculatedAngle).toBeCloseTo(expectedAngles[i], 0.1)
    })
  })

  it('should apply correct opacity', () => {
    const lines = createAngleLines({ width, height, angleLineCount, opacity, strokeWidth })

    lines.forEach((line) => {
      expect(line.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', () => {
    const lines = createAngleLines({ width, height, angleLineCount, opacity, strokeWidth })

    lines.forEach((line) => {
      expect(line.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should handle different angle line counts', () => {
    const lines3 = createAngleLines({ width, height, angleLineCount: 3, opacity, strokeWidth })
    const lines7 = createAngleLines({ width, height, angleLineCount: 7, opacity, strokeWidth })

    expect(lines3.length).toBe(3)
    expect(lines7.length).toBe(7)

    // With 3 lines: 30°, 90°, 150°
    // With 7 lines: 30°, 50°, 70°, 90°, 110°, 130°, 150°
  })

  it('should create lines long enough to reach edge of canvas', () => {
    const lines = createAngleLines({ width, height, angleLineCount, opacity, strokeWidth })

    lines.forEach((line) => {
      const x2 = Number.parseFloat(line.getAttribute('x2') ?? '0')
      const y2 = Number.parseFloat(line.getAttribute('y2') ?? '0')

      // Calculate distance from origin
      const dx = x2 - centerX
      const dy = bottomY - y2
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Should be at least half the canvas diagonal
      const minDistance = Math.max(width, height) * 0.5
      expect(distance).toBeGreaterThanOrEqual(minDistance - 1)
    })
  })
})
