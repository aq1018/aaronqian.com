import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import AngleLabels from '@/components/features/CuttingMatAngleLabels.astro'

describe('AngleLabels', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    angleLineCount: number
    angleLabelArcIndex: number
    majorLineInterval: number
    labelOpacity: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(AngleLabels, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const angleLineCount = 5
  const majorLineInterval = 200
  const angleLabelArcIndex = 2
  const labelOpacity = 0.175

  it('should create text elements for each angle', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    // Should have 2x angleLineCount (background + foreground for each)
    expect(labels.length).toBe(angleLineCount * 2)
  })

  it('should create background and foreground text pairs', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount: 5,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    for (let i = 0; i < 5; i += 1) {
      const bg = labels[i * 2]
      const fg = labels[i * 2 + 1]

      expect(bg.getAttribute('x')).toBe(fg.getAttribute('x'))
      expect(bg.getAttribute('y')).toBe(fg.getAttribute('y'))
      expect(bg.textContent).toBe(fg.textContent)
    }
  })

  it('should display correct angle values', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount: 5,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    const expectedLabels = ['30°', '60°', '90°', '120°', '150°']

    for (let i = 0; i < 5; i += 1) {
      const fg = labels[i * 2 + 1]
      expect(fg.textContent).toBe(expectedLabels[i])
    }
  })

  it('should position labels above the specified arc', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    const arcRadius = (angleLabelArcIndex + 1) * 1 * majorLineInterval
    const labelOffset = 20
    const expectedDistance = arcRadius + labelOffset

    const firstLabel = labels[1]
    const x = Number.parseFloat(firstLabel.getAttribute('x') ?? '0')
    const y = Number.parseFloat(firstLabel.getAttribute('y') ?? '0')

    const dx = x - centerX
    const dy = bottomY - y
    const distance = Math.sqrt(dx * dx + dy * dy)

    expect(distance).toBeCloseTo(expectedDistance, 0.1)
  })

  it('should apply opacity to foreground text only', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    for (let i = 0; i < angleLineCount; i += 1) {
      const fg = labels[i * 2 + 1]
      expect(fg.getAttribute('opacity')).toBe(String(labelOpacity))
    }
  })

  it('should use CSS variable for background color', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    const bg = labels[0]
    const bgFill = bg.getAttribute('fill')
    const bgStroke = bg.getAttribute('stroke')

    expect(bgFill).toBe('var(--color-background)')
    expect(bgStroke).toBe('var(--color-background)')
  })

  it('should set correct text attributes', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    labels.forEach((label) => {
      expect(label.getAttribute('font-size')).toBe('14')
      expect(label.getAttribute('font-family')).toBe('monospace')
      expect(label.getAttribute('font-weight')).toBe('300')
      expect(label.getAttribute('text-anchor')).toBe('middle')
      expect(label.getAttribute('dominant-baseline')).toBe('middle')
    })
  })

  it('should create background with stroke for halo effect', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      angleLabelArcIndex,
      majorLineInterval,
      labelOpacity,
    })

    const labels = root.querySelectorAll('text')
    for (let i = 0; i < angleLineCount; i += 1) {
      const bg = labels[i * 2]
      expect(bg.getAttribute('stroke-width')).toBe('6')
      expect(bg.getAttribute('paint-order')).toBe('stroke')
    }
  })
})
