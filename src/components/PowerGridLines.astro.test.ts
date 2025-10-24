import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import PowerGridLines from '@/components/PowerGridLines.astro'

describe('PowerGridLines', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    gridSize: number
    opacity: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(PowerGridLines, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  const width = 1920
  const height = 1080
  const gridSize = 80
  const opacity = 0.2

  it('should create horizontal and vertical lines', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('should create horizontal lines at grid intervals', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')
    const horizontalLines = Array.from(lines).filter(
      (line) => line.getAttribute('y1') === line.getAttribute('y2'),
    )

    expect(horizontalLines.length).toBeGreaterThan(0)

    // Check first horizontal line is at gridSize
    const firstHorizontal = horizontalLines.find(
      (line) => line.getAttribute('y1') === String(gridSize),
    )
    expect(firstHorizontal).toBeDefined()

    // All horizontal lines should span full width
    horizontalLines.forEach((line) => {
      expect(line.getAttribute('x1')).toBe('0')
      expect(line.getAttribute('x2')).toBe(String(width))
    })
  })

  it('should create vertical lines at grid intervals', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')
    const verticalLines = Array.from(lines).filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    expect(verticalLines.length).toBeGreaterThan(0)

    // Check first vertical line is at gridSize
    const firstVertical = verticalLines.find((line) => line.getAttribute('x1') === String(gridSize))
    expect(firstVertical).toBeDefined()

    // All vertical lines should span full height
    verticalLines.forEach((line) => {
      expect(line.getAttribute('y1')).toBe('0')
      expect(line.getAttribute('y2')).toBe(String(height))
    })
  })

  it('should apply opacity to all lines', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')

    lines.forEach((line) => {
      expect(line.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should use currentColor for stroke', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')

    lines.forEach((line) => {
      expect(line.getAttribute('stroke')).toBe('currentColor')
    })
  })

  it('should calculate correct number of horizontal lines', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')
    const horizontalLines = Array.from(lines).filter(
      (line) => line.getAttribute('y1') === line.getAttribute('y2'),
    )

    // Expected: Loop goes from gridSize to < height in steps of gridSize
    // For height=3000, gridSize=80: 80, 160, ..., 2960 = 37 lines
    const expectedCount = Math.floor((height - gridSize) / gridSize) + 1
    expect(horizontalLines.length).toBe(expectedCount)
  })

  it('should calculate correct number of vertical lines', async () => {
    const root = await renderComponent({
      width,
      height,
      gridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')
    const verticalLines = Array.from(lines).filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    // Expected: width / gridSize, minus one because we start at gridSize (not 0)
    const expectedCount = Math.floor(width / gridSize) - 1
    expect(verticalLines.length).toBe(expectedCount)
  })

  it('should handle different grid sizes', async () => {
    const customGridSize = 100
    const root = await renderComponent({
      width: 1000,
      height: 800,
      gridSize: customGridSize,
      opacity,
    })

    const lines = root.querySelectorAll('line')
    const horizontalLines = Array.from(lines).filter(
      (line) => line.getAttribute('y1') === line.getAttribute('y2'),
    )
    const verticalLines = Array.from(lines).filter(
      (line) => line.getAttribute('x1') === line.getAttribute('x2'),
    )

    expect(horizontalLines.length).toBe(7) // 100, 200, 300, 400, 500, 600, 700
    expect(verticalLines.length).toBe(9) // 100, 200, 300, 400, 500, 600, 700, 800, 900
  })
})
