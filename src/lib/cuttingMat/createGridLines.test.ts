import { describe, expect, it } from 'vitest'

import { createGridLines } from './createGridLines'

describe('createGridLines', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const majorLineInterval = 200
  const minorInterval = 40 // majorLineInterval / majorMinorRatio (200 / 5)
  const majorOpacity = 0.175
  const minorOpacity = 0.12
  const majorStrokeWidth = 1.5
  const minorStrokeWidth = 1

  it('should create vertical and horizontal lines', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    expect(lines.length).toBeGreaterThan(0)
    lines.forEach((line) => {
      expect(line.tagName).toBe('line')
    })
  })

  it('should create vertical lines from center outward', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    // Find vertical lines (x1 === x2)
    const verticalLines = lines.filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    expect(verticalLines.length).toBeGreaterThan(0)

    // Check some vertical lines span full height
    verticalLines.forEach((line) => {
      expect(line.getAttribute('y1')).toBe('0')
      expect(line.getAttribute('y2')).toBe(String(bottomY))
    })
  })

  it('should create horizontal lines from bottom upward', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    // Find horizontal lines (y1 === y2)
    const horizontalLines = lines.filter(
      (line) => line.getAttribute('y1') === line.getAttribute('y2'),
    )

    expect(horizontalLines.length).toBeGreaterThan(0)

    // Check horizontal lines span full width
    horizontalLines.forEach((line) => {
      expect(line.getAttribute('x1')).toBe('0')
      expect(line.getAttribute('x2')).toBe(String(width))
    })
  })

  it('should apply major opacity to major lines', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    // Find a line at major interval (e.g., 200px from center)
    const majorLine = lines.find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + majorLineInterval)
    })

    expect(majorLine?.getAttribute('opacity')).toBe(String(majorOpacity))
  })

  it('should apply minor opacity to minor lines', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    // Find a line at minor interval (e.g., 40px from center)
    const minorLine = lines.find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + minorInterval)
    })

    expect(minorLine?.getAttribute('opacity')).toBe(String(minorOpacity))
  })

  it('should apply major stroke width to major lines', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    const majorLine = lines.find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + majorLineInterval)
    })

    expect(majorLine?.getAttribute('stroke-width')).toBe(String(majorStrokeWidth))
  })

  it('should apply minor stroke width to minor lines', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    const minorLine = lines.find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + minorInterval)
    })

    expect(minorLine?.getAttribute('stroke-width')).toBe(String(minorStrokeWidth))
  })

  it('should create symmetric vertical lines on both sides of center', () => {
    const lines = createGridLines({
      width,
      height,
      majorLineInterval,
      minorInterval,
      majorOpacity,
      minorOpacity,
      majorStrokeWidth,
      minorStrokeWidth,
    })

    const verticalLines = lines.filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    // Check for line at +200 from center
    const rightLine = verticalLines.find(
      (line) => line.getAttribute('x1') === String(centerX + 200),
    )
    // Check for line at -200 from center
    const leftLine = verticalLines.find((line) => line.getAttribute('x1') === String(centerX - 200))

    expect(rightLine).toBeDefined()
    expect(leftLine).toBeDefined()
  })
})
