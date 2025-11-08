import { describe, expect, it } from 'vitest'

import GradientMask from '@/components/features/CuttingMatGradientMask.astro'
import { renderAstroComponent } from '@test/testHelpers'

describe('GradientMask', () => {
  it('should create a defs element', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })
    const defs = root.querySelector('defs')

    expect(defs).not.toBeNull()
  })

  it('should contain gradient and mask elements', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const gradient = root.querySelector('radialGradient')
    const mask = root.querySelector('mask')

    expect(gradient).not.toBeNull()
    expect(mask).not.toBeNull()
  })

  it('should create gradient with correct id', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const gradient = root.querySelector('radialGradient')
    expect(gradient?.getAttribute('id')).toBe('fade-gradient')
  })

  it('should create radial gradient', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const gradient = root.querySelector('radialGradient')
    expect(gradient).not.toBeNull()
  })

  it('should create gradient with 4 stops', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const stops = root.querySelectorAll('stop')
    expect(stops.length).toBe(4)
  })

  it('should create gradient stops with correct offsets', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const stops = root.querySelectorAll('stop')
    expect(stops[0].getAttribute('offset')).toBe('0%')
    expect(stops[1].getAttribute('offset')).toBe('50%')
    expect(stops[2].getAttribute('offset')).toBe('70%')
    expect(stops[3].getAttribute('offset')).toBe('100%')
  })

  it('should create gradient stops with correct opacity', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const stops = root.querySelectorAll('stop')
    expect(stops[0].getAttribute('stop-opacity')).toBe('0.8')
    expect(stops[1].getAttribute('stop-opacity')).toBe('0.6')
    expect(stops[2].getAttribute('stop-opacity')).toBe('0.4')
    expect(stops[3].getAttribute('stop-opacity')).toBe('0.1')
  })

  it('should create mask with correct id', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const mask = root.querySelector('mask')
    expect(mask?.getAttribute('id')).toBe('fade-mask')
  })

  it('should create mask ellipse with correct dimensions', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const ellipse = root.querySelector('mask ellipse')
    expect(ellipse?.getAttribute('cx')).toBe('2000')
    expect(ellipse?.getAttribute('cy')).toBe('2000')
    expect(ellipse?.getAttribute('rx')).toBe('2000')
    expect(ellipse?.getAttribute('ry')).toBe('2800')
  })

  it('should create mask ellipse referencing gradient', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 4000, height: 4000 },
    })

    const ellipse = root.querySelector('mask ellipse')
    expect(ellipse?.getAttribute('fill')).toBe('url(#fade-gradient)')
  })

  it('should handle different dimensions', async () => {
    const root = await renderAstroComponent(GradientMask, {
      props: { width: 2000, height: 3000 },
    })

    const ellipse = root.querySelector('mask ellipse')
    expect(ellipse?.getAttribute('cx')).toBe('1000')
    expect(ellipse?.getAttribute('cy')).toBe('1500')
    expect(ellipse?.getAttribute('rx')).toBe('1000')
    expect(ellipse?.getAttribute('ry')).toBe('2100')
  })
})
