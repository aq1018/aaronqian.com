import '@testing-library/jest-dom/vitest'
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
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('should create vertical lines from center outward', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const verticalLines = Array.from(lines).filter(
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
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const horizontalLines = Array.from(lines).filter(
      (line) => line.getAttribute('y1') === line.getAttribute('y2'),
    )

    expect(horizontalLines.length).toBeGreaterThan(0)

    horizontalLines.forEach((line) => {
      expect(line.getAttribute('x1')).toBe('0')
      expect(line.getAttribute('x2')).toBe(String(width))
    })
  })

  it('should apply major opacity to major lines', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const majorLine = Array.from(lines).find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + majorLineInterval)
    })

    expect(majorLine?.getAttribute('opacity')).toBe(String(majorOpacity))
  })

  it('should apply minor opacity to minor lines', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const minorLine = Array.from(lines).find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + minorInterval)
    })

    expect(minorLine?.getAttribute('opacity')).toBe(String(minorOpacity))
  })

  it('should apply major stroke width to major lines', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const majorLine = Array.from(lines).find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + majorLineInterval)
    })

    expect(majorLine?.getAttribute('stroke-width')).toBe(String(majorStrokeWidth))
  })

  it('should apply minor stroke width to minor lines', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const minorLine = Array.from(lines).find((line) => {
      const x = line.getAttribute('x1')
      return x === String(centerX + minorInterval)
    })

    expect(minorLine?.getAttribute('stroke-width')).toBe(String(minorStrokeWidth))
  })

  it('should create symmetric vertical lines on both sides of center', async () => {
    const root = await renderAstroComponent(GridLines, {
      props: {
        width,
        height,
        majorLineInterval,
        minorInterval,
        majorOpacity,
        minorOpacity,
        majorStrokeWidth,
        minorStrokeWidth,
      },
    })

    const lines = root.querySelectorAll('line')
    const verticalLines = Array.from(lines).filter(
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
