import { describe, expect, it } from 'vitest'

import GridLines from '@/components/features/CuttingMatGridLines.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('GridLines', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const majorLineInterval = 200
  const minorInterval = 40
  const majorOpacity = 0.175
  const minorOpacity = 0.12
  const majorStrokeWidth = 1.5
  const minorStrokeWidth = 1

  it('should create vertical and horizontal lines', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        height,
        majorLineInterval,
        majorOpacity,
        majorStrokeWidth,
        minorInterval,
        minorOpacity,
        minorStrokeWidth,
        width,
      },
    })

    const lines = root.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('should create vertical lines from center outward', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        height,
        majorLineInterval,
        majorOpacity,
        majorStrokeWidth,
        minorInterval,
        minorOpacity,
        minorStrokeWidth,
        width,
      },
    })

    const lines = root.querySelectorAll('line')
    const verticalLines = [...lines].filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    expect(verticalLines.length).toBeGreaterThan(0)

    verticalLines.forEach((line) => {
      expect(line.getAttribute('y1')).toBe('0')
      expect(line.getAttribute('y2')).toBe(String(bottomY))
    })
  })

  it('should create horizontal lines from bottom upward', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        height,
        majorLineInterval,
        majorOpacity,
        majorStrokeWidth,
        minorInterval,
        minorOpacity,
        minorStrokeWidth,
        width,
      },
    })

    const lines = root.querySelectorAll('line')
    const horizontalLines = [...lines].filter(
      (line) => line.getAttribute('y1') === line.getAttribute('y2'),
    )

    expect(horizontalLines.length).toBeGreaterThan(0)

    horizontalLines.forEach((line) => {
      expect(line.getAttribute('x1')).toBe('0')
      expect(line.getAttribute('x2')).toBe(String(width))
    })
  })

  it('should create symmetric vertical lines on both sides of center', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        height,
        majorLineInterval,
        majorOpacity,
        majorStrokeWidth,
        minorInterval,
        minorOpacity,
        minorStrokeWidth,
        width,
      },
    })

    const lines = root.querySelectorAll('line')
    const verticalLines = [...lines].filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    const rightLine = verticalLines.find(
      (line) => line.getAttribute('x1') === String(centerX + 200),
    )
    const leftLine = verticalLines.find((line) => line.getAttribute('x1') === String(centerX - 200))

    expect(rightLine).toBeDefined()
    expect(leftLine).toBeDefined()
  })
})
