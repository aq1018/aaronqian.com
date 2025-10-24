import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import GradientMask from '@/components/features/CuttingMatGradientMask.astro'

describe('GradientMask', () => {
  const renderComponent = async (props: { width: number; height: number }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(GradientMask, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  it('should create a defs element', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })
    const defs = root.querySelector('defs')

    expect(defs).not.toBeNull()
  })

  it('should contain gradient and mask elements', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const gradient = root.querySelector('linearGradient')
    const mask = root.querySelector('mask')

    expect(gradient).not.toBeNull()
    expect(mask).not.toBeNull()
  })

  it('should create gradient with correct id', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const gradient = root.querySelector('linearGradient')
    expect(gradient?.getAttribute('id')).toBe('fade-gradient')
  })

  it('should create horizontal gradient', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const gradient = root.querySelector('linearGradient')
    expect(gradient?.getAttribute('x1')).toBe('0%')
    expect(gradient?.getAttribute('x2')).toBe('100%')
    expect(gradient?.getAttribute('y1')).toBe('0%')
    expect(gradient?.getAttribute('y2')).toBe('0%')
  })

  it('should create gradient with 4 stops', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const stops = root.querySelectorAll('stop')
    expect(stops.length).toBe(4)
  })

  it('should create gradient stops with correct offsets', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const stops = root.querySelectorAll('stop')
    expect(stops[0].getAttribute('offset')).toBe('0%')
    expect(stops[1].getAttribute('offset')).toBe('20%')
    expect(stops[2].getAttribute('offset')).toBe('80%')
    expect(stops[3].getAttribute('offset')).toBe('100%')
  })

  it('should create gradient stops with correct opacity', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const stops = root.querySelectorAll('stop')
    expect(stops[0].getAttribute('stop-opacity')).toBe('0')
    expect(stops[1].getAttribute('stop-opacity')).toBe('1')
    expect(stops[2].getAttribute('stop-opacity')).toBe('1')
    expect(stops[3].getAttribute('stop-opacity')).toBe('0')
  })

  it('should create mask with correct id', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const mask = root.querySelector('mask')
    expect(mask?.getAttribute('id')).toBe('fade-mask')
  })

  it('should create mask rect with correct dimensions', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const rect = root.querySelector('mask rect')
    expect(rect?.getAttribute('x')).toBe('0')
    expect(rect?.getAttribute('y')).toBe('0')
    expect(rect?.getAttribute('width')).toBe('4000')
    expect(rect?.getAttribute('height')).toBe('4000')
  })

  it('should create mask rect referencing gradient', async () => {
    const root = await renderComponent({ width: 4000, height: 4000 })

    const rect = root.querySelector('mask rect')
    expect(rect?.getAttribute('fill')).toBe('url(#fade-gradient)')
  })

  it('should handle different dimensions', async () => {
    const root = await renderComponent({ width: 2000, height: 3000 })

    const rect = root.querySelector('mask rect')
    expect(rect?.getAttribute('width')).toBe('2000')
    expect(rect?.getAttribute('height')).toBe('3000')
  })
})
