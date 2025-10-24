import { describe, expect, it } from 'vitest'

import { createAxes } from './createAxes'

describe('createAxes', () => {
  it('should create two line elements', () => {
    const elements = createAxes(4000, 4000, 0.175, 1.5)

    expect(elements.length).toBe(2)
    expect(elements[0].tagName).toBe('line')
    expect(elements[1].tagName).toBe('line')
  })

  it('should create x-axis at bottom of canvas', () => {
    const elements = createAxes(4000, 4000, 0.175, 1.5)
    const xAxis = elements[0]

    expect(xAxis.getAttribute('x1')).toBe('0')
    expect(xAxis.getAttribute('y1')).toBe('4000')
    expect(xAxis.getAttribute('x2')).toBe('4000')
    expect(xAxis.getAttribute('y2')).toBe('4000')
  })

  it('should create y-axis at center', () => {
    const elements = createAxes(4000, 4000, 0.175, 1.5)
    const yAxis = elements[1]

    expect(yAxis.getAttribute('x1')).toBe('2000')
    expect(yAxis.getAttribute('y1')).toBe('0')
    expect(yAxis.getAttribute('x2')).toBe('2000')
    expect(yAxis.getAttribute('y2')).toBe('4000')
  })

  it('should apply opacity to both axes', () => {
    const elements = createAxes(4000, 4000, 0.5, 1.5)

    expect(elements[0].getAttribute('opacity')).toBe('0.5')
    expect(elements[1].getAttribute('opacity')).toBe('0.5')
  })

  it('should apply stroke width to both axes', () => {
    const elements = createAxes(4000, 4000, 0.175, 2.5)

    expect(elements[0].getAttribute('stroke-width')).toBe('2.5')
    expect(elements[1].getAttribute('stroke-width')).toBe('2.5')
  })

  it('should handle different dimensions', () => {
    const elements = createAxes(2000, 3000, 0.175, 1.5)
    const xAxis = elements[0]
    const yAxis = elements[1]

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
