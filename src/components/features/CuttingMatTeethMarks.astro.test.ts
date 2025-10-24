import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import TeethMarks from '@/components/features/CuttingMatTeethMarks.astro'

describe('TeethMarks', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    minorInterval: number
    opacity: number
    strokeWidth: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(TeethMarks, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  const width = 4000
  const height = 4000
  const minorInterval = 40
  const toothInterval = minorInterval / 2 // 20
  const opacity = 0.175
  const strokeWidth = 1

  it('should create array of line elements', async () => {
    const root = await renderComponent({ width, height, minorInterval, opacity, strokeWidth })
    const teeth = root.querySelectorAll('line')

    expect(teeth.length).toBeGreaterThan(0)
  })

  it('should create vertical tick marks on x-axis', async () => {
    const root = await renderComponent({ width, height, minorInterval, opacity, strokeWidth })
    const teeth = root.querySelectorAll('line')

    teeth.forEach((tooth) => {
      // X coordinates should be the same (vertical line)
      expect(tooth.getAttribute('x1')).toBe(tooth.getAttribute('x2'))

      // Y coordinates: bottom of canvas and 8px up
      expect(tooth.getAttribute('y1')).toBe(String(height))
      expect(tooth.getAttribute('y2')).toBe(String(height - 8))
    })
  })

  it('should apply correct opacity', async () => {
    const root = await renderComponent({ width, height, minorInterval, opacity, strokeWidth })
    const teeth = root.querySelectorAll('line')

    teeth.forEach((tooth) => {
      expect(tooth.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', async () => {
    const root = await renderComponent({ width, height, minorInterval, opacity, strokeWidth })
    const teeth = root.querySelectorAll('line')

    teeth.forEach((tooth) => {
      expect(tooth.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should space teeth at half the minor interval', async () => {
    const root = await renderComponent({ width, height, minorInterval, opacity, strokeWidth })
    const teeth = root.querySelectorAll('line')

    // Get x positions
    const xPositions = Array.from(teeth).map((tooth) =>
      Number.parseFloat(tooth.getAttribute('x1') ?? '0'),
    )

    // Check spacing between consecutive teeth
    for (let i = 1; i < xPositions.length; i += 1) {
      const spacing = xPositions[i] - xPositions[i - 1]
      expect(spacing).toBeCloseTo(toothInterval, 0.1)
    }
  })

  it('should span the full width of canvas', async () => {
    const root = await renderComponent({ width, height, minorInterval, opacity, strokeWidth })
    const teeth = root.querySelectorAll('line')

    const xPositions = Array.from(teeth).map((tooth) =>
      Number.parseFloat(tooth.getAttribute('x1') ?? '0'),
    )

    // First tooth should be near 0
    expect(xPositions[0]).toBeLessThan(toothInterval)

    // Last tooth should be near width
    expect(xPositions[xPositions.length - 1]).toBeGreaterThanOrEqual(width - toothInterval)
  })

  it('should handle different minor intervals', async () => {
    const root1 = await renderComponent({ width, height, minorInterval: 40, opacity, strokeWidth })
    const root2 = await renderComponent({ width, height, minorInterval: 80, opacity, strokeWidth })

    const teeth1 = root1.querySelectorAll('line')
    const teeth2 = root2.querySelectorAll('line')

    // Larger minor interval should result in fewer teeth
    expect(teeth2.length).toBeLessThan(teeth1.length)
  })
})
