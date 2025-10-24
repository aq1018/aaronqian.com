import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import AngleMarks from '@/components/features/CuttingMatAngleMarks.astro'

describe('AngleMarks', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    angleLineCount: number
    minorInterval: number
    angleMarkRadius: number
    opacity: number
    strokeWidth: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(AngleMarks, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const angleLineCount = 5
  const minorInterval = 40
  const angleMarkRadius = 1.5
  const opacity = 0.175
  const strokeWidth = 1.5

  it('should create two path elements (left and right arcs)', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    expect(marks.length).toBe(2)
  })

  it('should calculate angle mark arc radius correctly', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    const expectedRadius = angleMarkRadius * minorInterval

    marks.forEach((mark) => {
      const d = mark.getAttribute('d')
      expect(d).toContain(`A ${expectedRadius} ${expectedRadius}`)
    })
  })

  it('should create right arc from x-axis to first angle line', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount: 5,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    const rightArc = marks[0]
    const d = rightArc.getAttribute('d')

    const arcRadius = angleMarkRadius * minorInterval

    expect(d).toContain(`M ${centerX + arcRadius} ${bottomY}`)
  })

  it('should create left arc from last angle line to x-axis', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount: 5,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    const leftArc = marks[1]
    const d = leftArc.getAttribute('d')

    const arcRadius = angleMarkRadius * minorInterval

    expect(d).toContain(`${centerX - arcRadius} ${bottomY}`)
  })

  it('should apply correct opacity', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    marks.forEach((mark) => {
      expect(mark.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    marks.forEach((mark) => {
      expect(mark.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should handle different angle mark radius', async () => {
    const root1 = await renderComponent({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius: 1,
      opacity,
      strokeWidth,
    })
    const root2 = await renderComponent({
      width,
      height,
      angleLineCount,
      minorInterval,
      angleMarkRadius: 3,
      opacity,
      strokeWidth,
    })

    const marks1 = root1.querySelectorAll('path')
    const marks2 = root2.querySelectorAll('path')

    const d1 = marks1[0].getAttribute('d')
    const d2 = marks2[0].getAttribute('d')

    expect(d1).toContain('A 40 40')
    expect(d2).toContain('A 120 120')
  })

  it('should handle single angle line', async () => {
    const root = await renderComponent({
      width,
      height,
      angleLineCount: 1,
      minorInterval,
      angleMarkRadius,
      opacity,
      strokeWidth,
    })

    const marks = root.querySelectorAll('path')
    expect(marks.length).toBe(2)
  })
})
