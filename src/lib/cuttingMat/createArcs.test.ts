import { describe, expect, it } from 'vitest'

import { createArcs } from './createArcs'

describe('createArcs', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const majorLineInterval = 200
  const arcCount = 3
  const arcRadiusInterval = 1
  const opacity = 0.175
  const strokeWidth = 1.5

  it('should create correct number of path elements', () => {
    const arcs = createArcs({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    expect(arcs.length).toBe(arcCount)
    arcs.forEach((arc) => {
      expect(arc.tagName).toBe('path')
    })
  })

  it('should create arcs with correct radii', () => {
    const arcs = createArcs({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    // First arc: radius = 1 * 1 * 200 = 200
    // Second arc: radius = 2 * 1 * 200 = 400
    // Third arc: radius = 3 * 1 * 200 = 600
    const expectedRadii = [200, 400, 600]

    arcs.forEach((arc, i) => {
      const d = arc.getAttribute('d')
      const expectedRadius = expectedRadii[i]
      // Path should contain the radius in the arc command
      expect(d).toContain(`A ${expectedRadius} ${expectedRadius}`)
    })
  })

  it('should create semicircles at bottom center', () => {
    const arcs = createArcs({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    arcs.forEach((arc, i) => {
      const d = arc.getAttribute('d')
      const radius = (i + 1) * arcRadiusInterval * majorLineInterval

      // Arc should start at left point and end at right point
      const expectedStart = `M ${centerX - radius} ${bottomY}`
      const expectedEnd = `${centerX + radius} ${bottomY}`

      expect(d).toContain(expectedStart)
      expect(d).toContain(expectedEnd)
    })
  })

  it('should apply correct opacity', () => {
    const arcs = createArcs({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    arcs.forEach((arc) => {
      expect(arc.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', () => {
    const arcs = createArcs({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    arcs.forEach((arc) => {
      expect(arc.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should handle different arc counts', () => {
    const arcs1 = createArcs({
      width,
      height,
      arcCount: 1,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })
    const arcs5 = createArcs({
      width,
      height,
      arcCount: 5,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    expect(arcs1.length).toBe(1)
    expect(arcs5.length).toBe(5)
  })

  it('should handle different arc radius intervals', () => {
    const arcs = createArcs({
      width,
      height,
      arcCount,
      arcRadiusInterval: 2,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    // With arcRadiusInterval = 2:
    // First arc: radius = 1 * 2 * 200 = 400
    const firstArc = arcs[0]
    const d = firstArc.getAttribute('d')
    expect(d).toContain('A 400 400')
  })
})
