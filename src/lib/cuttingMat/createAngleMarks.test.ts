import { describe, expect, it } from 'vitest'

import { createAngleMarks } from './createAngleMarks'

describe('createAngleMarks', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const angleLineCount = 5
  const minorInterval = 40
  const angleMarkRadius = 1.5
  const opacity = 0.175
  const strokeWidth = 1.5

  it('should create two path elements (left and right arcs)', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    expect(marks.length).toBe(2)
    marks.forEach((mark) => {
      expect(mark.tagName).toBe('path')
    })
  })

  it('should calculate angle mark arc radius correctly', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    // angleMarkArcRadius = angleMarkRadius * minorInterval = 1.5 * 40 = 60
    const expectedRadius = angleMarkRadius * minorInterval

    marks.forEach((mark) => {
      const d = mark.getAttribute('d')
      // Path should contain the radius in the arc command
      expect(d).toContain(`A ${expectedRadius} ${expectedRadius}`)
    })
  })

  it('should create right arc from x-axis to first angle line', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount: 5,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const rightArc = marks[0]
    const d = rightArc.getAttribute('d')

    // For 5 angles: 30°, 60°, 90°, 120°, 150°
    // Right arc should go from x-axis (0°) to first angle (30°)
    const arcRadius = angleMarkRadius * minorInterval

    // Should start at (centerX + arcRadius, bottomY) - on x-axis to the right
    expect(d).toContain(`M ${centerX + arcRadius} ${bottomY}`)
  })

  it('should create left arc from last angle line to x-axis', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount: 5,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const leftArc = marks[1]
    const d = leftArc.getAttribute('d')

    // For 5 angles: 30°, 60°, 90°, 120°, 150°
    // Left arc should go from last angle (150°) to x-axis (180°)
    const arcRadius = angleMarkRadius * minorInterval

    // Should end at (centerX - arcRadius, bottomY) - on x-axis to the left
    expect(d).toContain(`${centerX - arcRadius} ${bottomY}`)
  })

  it('should apply correct opacity', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    marks.forEach((mark) => {
      expect(mark.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    marks.forEach((mark) => {
      expect(mark.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should handle different angle mark radius', () => {
    const marks1 = createAngleMarks({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius: 1,
      opacity,
      strokeWidth,
    })
    const marks2 = createAngleMarks({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius: 3,
      opacity,
      strokeWidth,
    })

    const d1 = marks1[0].getAttribute('d')
    const d2 = marks2[0].getAttribute('d')

    // Different radii should produce different arc sizes
    expect(d1).toContain('A 40 40') // 1 * 40
    expect(d2).toContain('A 120 120') // 3 * 40
  })

  it('should handle single angle line', () => {
    const marks = createAngleMarks({
      width,
      height,
      angleLineCount: 1, // Only one angle line
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    // Should still create two arcs
    expect(marks.length).toBe(2)
  })
})
