import { describe, expect, it } from 'vitest'

import { createGradientMask } from './createGradientMask'

describe('createGradientMask', () => {
  it('should create a defs element', () => {
    const defs = createGradientMask(4000, 4000)

    expect(defs.tagName).toBe('defs')
  })

  it('should contain gradient and mask elements', () => {
    const defs = createGradientMask(4000, 4000)

    const gradient = defs.querySelector('linearGradient')
    const mask = defs.querySelector('mask')

    expect(gradient).not.toBeNull()
    expect(mask).not.toBeNull()
  })

  it('should create gradient with correct id', () => {
    const defs = createGradientMask(4000, 4000)

    const gradient = defs.querySelector('linearGradient')
    expect(gradient?.getAttribute('id')).toBe('fade-gradient')
  })

  it('should create horizontal gradient', () => {
    const defs = createGradientMask(4000, 4000)

    const gradient = defs.querySelector('linearGradient')
    expect(gradient?.getAttribute('x1')).toBe('0%')
    expect(gradient?.getAttribute('x2')).toBe('100%')
    expect(gradient?.getAttribute('y1')).toBe('0%')
    expect(gradient?.getAttribute('y2')).toBe('0%')
  })

  it('should create gradient with 4 stops', () => {
    const defs = createGradientMask(4000, 4000)

    const stops = defs.querySelectorAll('stop')
    expect(stops.length).toBe(4)
  })

  it('should create gradient stops with correct offsets', () => {
    const defs = createGradientMask(4000, 4000)

    const stops = defs.querySelectorAll('stop')
    expect(stops[0].getAttribute('offset')).toBe('0%')
    expect(stops[1].getAttribute('offset')).toBe('20%')
    expect(stops[2].getAttribute('offset')).toBe('80%')
    expect(stops[3].getAttribute('offset')).toBe('100%')
  })

  it('should create gradient stops with correct opacity', () => {
    const defs = createGradientMask(4000, 4000)

    const stops = defs.querySelectorAll('stop')
    expect(stops[0].getAttribute('stop-opacity')).toBe('0')
    expect(stops[1].getAttribute('stop-opacity')).toBe('1')
    expect(stops[2].getAttribute('stop-opacity')).toBe('1')
    expect(stops[3].getAttribute('stop-opacity')).toBe('0')
  })

  it('should create mask with correct id', () => {
    const defs = createGradientMask(4000, 4000)

    const mask = defs.querySelector('mask')
    expect(mask?.getAttribute('id')).toBe('fade-mask')
  })

  it('should create mask rect with correct dimensions', () => {
    const defs = createGradientMask(4000, 4000)

    const rect = defs.querySelector('mask rect')
    expect(rect?.getAttribute('x')).toBe('0')
    expect(rect?.getAttribute('y')).toBe('0')
    expect(rect?.getAttribute('width')).toBe('4000')
    expect(rect?.getAttribute('height')).toBe('4000')
  })

  it('should create mask rect referencing gradient', () => {
    const defs = createGradientMask(4000, 4000)

    const rect = defs.querySelector('mask rect')
    expect(rect?.getAttribute('fill')).toBe('url(#fade-gradient)')
  })

  it('should handle different dimensions', () => {
    const defs = createGradientMask(2000, 3000)

    const rect = defs.querySelector('mask rect')
    expect(rect?.getAttribute('width')).toBe('2000')
    expect(rect?.getAttribute('height')).toBe('3000')
  })
})
