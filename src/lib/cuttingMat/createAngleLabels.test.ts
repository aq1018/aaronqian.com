import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { createAngleLabels } from './createAngleLabels'

describe('createAngleLabels', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const angleLineCount = 5
  const majorLineInterval = 200
  const angleLabelArcIndex = 2 // third arc
  const labelOpacity = 0.175

  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('should create text elements for each angle', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    // Should have 2x angleLineCount (background + foreground for each)
    expect(labels.length).toBe(angleLineCount * 2)
    labels.forEach((label) => {
      expect(label.tagName).toBe('text')
    })
  })

  it('should create background and foreground text pairs', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount: 5,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    // Every pair should have same position and content
    for (let i = 0; i < 5; i += 1) {
      const bg = labels[i * 2]
      const fg = labels[i * 2 + 1]

      expect(bg.getAttribute('x')).toBe(fg.getAttribute('x'))
      expect(bg.getAttribute('y')).toBe(fg.getAttribute('y'))
      expect(bg.textContent).toBe(fg.textContent)
    }
  })

  it('should display correct angle values', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount: 5,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    // For 5 angles: 30°, 60°, 90°, 120°, 150°
    const expectedLabels = ['30°', '60°', '90°', '120°', '150°']

    for (let i = 0; i < 5; i += 1) {
      const fg = labels[i * 2 + 1] // Get foreground text
      expect(fg.textContent).toBe(expectedLabels[i])
    }
  })

  it('should position labels above the specified arc', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    // Arc radius = (index + 1) * arcRadiusInterval * majorLineInterval
    // arcRadiusInterval defaults to 1
    const arcRadius = (angleLabelArcIndex + 1) * 1 * majorLineInterval // = 3 * 200 = 600
    const labelOffset = 20 // pixels above arc
    const expectedDistance = arcRadius + labelOffset // = 620

    // Check first foreground label (30°)
    const firstLabel = labels[1]
    const x = Number.parseFloat(firstLabel.getAttribute('x') ?? '0')
    const y = Number.parseFloat(firstLabel.getAttribute('y') ?? '0')

    const dx = x - centerX
    const dy = bottomY - y
    const distance = Math.sqrt(dx * dx + dy * dy)

    expect(distance).toBeCloseTo(expectedDistance, 0.1)
  })

  it('should apply opacity to foreground text only', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    // Background should not have opacity (uses fill/stroke for halo effect)
    // Foreground should have opacity
    for (let i = 0; i < angleLineCount; i += 1) {
      const fg = labels[i * 2 + 1]
      expect(fg.getAttribute('opacity')).toBe(String(labelOpacity))
    }
  })

  it('should use light background color in light mode', () => {
    document.documentElement.classList.remove('dark')

    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const bg = labels[0] // First background text
    const bgColor = bg.getAttribute('fill')

    expect(bgColor).toBe('oklch(0.99 0 0)') // Light mode color
  })

  it('should use dark background color in dark mode', () => {
    document.documentElement.classList.add('dark')

    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const bg = labels[0] // First background text
    const bgColor = bg.getAttribute('fill')

    expect(bgColor).toBe('oklch(0.08 0 0)') // Dark mode color
  })

  it('should set correct text attributes', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    labels.forEach((label) => {
      expect(label.getAttribute('font-size')).toBe('14')
      expect(label.getAttribute('font-family')).toBe('monospace')
      expect(label.getAttribute('font-weight')).toBe('300')
      expect(label.getAttribute('text-anchor')).toBe('middle')
      expect(label.getAttribute('dominant-baseline')).toBe('middle')
    })
  })

  it('should create background with stroke for halo effect', () => {
    const labels = createAngleLabels({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    // Check background text
    for (let i = 0; i < angleLineCount; i += 1) {
      const bg = labels[i * 2]
      expect(bg.getAttribute('stroke-width')).toBe('6')
      expect(bg.getAttribute('paint-order')).toBe('stroke')
    }
  })
})
