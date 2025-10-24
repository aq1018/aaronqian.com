import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import Arcs from '@/components/CuttingMatArcs.astro'

describe('Arcs', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    arcCount: number
    arcRadiusInterval: number
    majorLineInterval: number
    opacity: number
    strokeWidth: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(Arcs, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const majorLineInterval = 200
  const arcCount = 3
  const arcRadiusInterval = 1
  const opacity = 0.175
  const strokeWidth = 1.5

  it('should create correct number of path elements', async () => {
    const root = await renderComponent({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs = root.querySelectorAll('path')
    expect(arcs.length).toBe(arcCount)
  })

  it('should create arcs with correct radii', async () => {
    const root = await renderComponent({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs = root.querySelectorAll('path')
    const expectedRadii = [200, 400, 600]

    arcs.forEach((arc, i) => {
      const d = arc.getAttribute('d')
      const expectedRadius = expectedRadii[i]
      expect(d).toContain(`A ${expectedRadius} ${expectedRadius}`)
    })
  })

  it('should create semicircles at bottom center', async () => {
    const root = await renderComponent({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs = root.querySelectorAll('path')
    arcs.forEach((arc, i) => {
      const d = arc.getAttribute('d')
      const radius = (i + 1) * arcRadiusInterval * majorLineInterval

      const expectedStart = `M ${centerX - radius} ${bottomY}`
      const expectedEnd = `${centerX + radius} ${bottomY}`

      expect(d).toContain(expectedStart)
      expect(d).toContain(expectedEnd)
    })
  })

  it('should apply correct opacity', async () => {
    const root = await renderComponent({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs = root.querySelectorAll('path')
    arcs.forEach((arc) => {
      expect(arc.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', async () => {
    const root = await renderComponent({
      width,
      height,
      arcCount,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs = root.querySelectorAll('path')
    arcs.forEach((arc) => {
      expect(arc.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should handle different arc counts', async () => {
    const root1 = await renderComponent({
      width,
      height,
      arcCount: 1,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })
    const root5 = await renderComponent({
      width,
      height,
      arcCount: 5,
      arcRadiusInterval,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs1 = root1.querySelectorAll('path')
    const arcs5 = root5.querySelectorAll('path')

    expect(arcs1.length).toBe(1)
    expect(arcs5.length).toBe(5)
  })

  it('should handle different arc radius intervals', async () => {
    const root = await renderComponent({
      width,
      height,
      arcCount,
      arcRadiusInterval: 2,
      majorLineInterval,
      opacity,
      strokeWidth,
    })

    const arcs = root.querySelectorAll('path')
    const firstArc = arcs[0]
    const d = firstArc.getAttribute('d')
    expect(d).toContain('A 400 400')
  })
})
