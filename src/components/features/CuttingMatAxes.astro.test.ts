import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import Axes from '@/components/features/CuttingMatAxes.astro'

describe('Axes', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    opacity: number
    strokeWidth: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(Axes, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  it('should create two line elements', async () => {
    const root = await renderComponent({
      width: 4000,
      height: 4000,
      opacity: 0.175,
      strokeWidth: 1.5,
    })
    const lines = root.querySelectorAll('line')

    expect(lines.length).toBe(2)
  })

  it('should create x-axis at bottom of canvas', async () => {
    const root = await renderComponent({
      width: 4000,
      height: 4000,
      opacity: 0.175,
      strokeWidth: 1.5,
    })
    const lines = root.querySelectorAll('line')
    const xAxis = lines[0]

    expect(xAxis.getAttribute('x1')).toBe('0')
    expect(xAxis.getAttribute('y1')).toBe('4000')
    expect(xAxis.getAttribute('x2')).toBe('4000')
    expect(xAxis.getAttribute('y2')).toBe('4000')
  })

  it('should create y-axis at center', async () => {
    const root = await renderComponent({
      width: 4000,
      height: 4000,
      opacity: 0.175,
      strokeWidth: 1.5,
    })
    const lines = root.querySelectorAll('line')
    const yAxis = lines[1]

    expect(yAxis.getAttribute('x1')).toBe('2000')
    expect(yAxis.getAttribute('y1')).toBe('0')
    expect(yAxis.getAttribute('x2')).toBe('2000')
    expect(yAxis.getAttribute('y2')).toBe('4000')
  })

  it('should apply opacity to both axes', async () => {
    const root = await renderComponent({
      width: 4000,
      height: 4000,
      opacity: 0.5,
      strokeWidth: 1.5,
    })
    const lines = root.querySelectorAll('line')

    expect(lines[0].getAttribute('opacity')).toBe('0.5')
    expect(lines[1].getAttribute('opacity')).toBe('0.5')
  })

  it('should apply stroke width to both axes', async () => {
    const root = await renderComponent({
      width: 4000,
      height: 4000,
      opacity: 0.175,
      strokeWidth: 2.5,
    })
    const lines = root.querySelectorAll('line')

    expect(lines[0].getAttribute('stroke-width')).toBe('2.5')
    expect(lines[1].getAttribute('stroke-width')).toBe('2.5')
  })

  it('should handle different dimensions', async () => {
    const root = await renderComponent({
      width: 2000,
      height: 3000,
      opacity: 0.175,
      strokeWidth: 1.5,
    })
    const lines = root.querySelectorAll('line')
    const xAxis = lines[0]
    const yAxis = lines[1]

    // X-axis should span full width at bottom
    expect(xAxis.getAttribute('x1')).toBe('0')
    expect(xAxis.getAttribute('x2')).toBe('2000')
    expect(xAxis.getAttribute('y1')).toBe('3000')

    // Y-axis should be at center
    expect(yAxis.getAttribute('x1')).toBe('1000')
    expect(yAxis.getAttribute('x2')).toBe('1000')
    expect(yAxis.getAttribute('y2')).toBe('3000')
  })
})
