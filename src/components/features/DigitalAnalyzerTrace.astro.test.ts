import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import DigitalAnalyzerTrace from '@/components/features/DigitalAnalyzerTrace.astro'

describe('DigitalAnalyzerTrace', () => {
  const renderComponent = async (props: {
    width: number
    height: number
    gridSize: number
    pulseIndex: number
    opacity: number
    strokeWidth: number
    drawDuration: number
    fadeDelay: number
    fadeDuration: number
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(DigitalAnalyzerTrace, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  const defaultProps = {
    width: 1920,
    height: 1080,
    gridSize: 80,
    pulseIndex: 0,
    opacity: 0.3,
    strokeWidth: 2,
    drawDuration: 400,
    fadeDelay: 450,
    fadeDuration: 200,
  }

  it('should create a path element', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')

    expect(path).toBeDefined()
  })

  it('should have required SVG path attributes', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')

    expect(path?.getAttribute('d')).toBeTruthy()
    expect(path?.getAttribute('stroke')).toBe('currentColor')
    expect(path?.getAttribute('fill')).toBe('none')
    expect(path?.getAttribute('stroke-linecap')).toBe('round')
    expect(path?.getAttribute('stroke-linejoin')).toBe('round')
  })

  it('should apply stroke width', async () => {
    const root = await renderComponent({
      ...defaultProps,
      strokeWidth: 3,
    })
    const path = root.querySelector('path')

    expect(path?.getAttribute('stroke-width')).toBe('3')
  })

  it('should have pathLength attribute for animation', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')

    expect(path?.getAttribute('pathLength')).toBe('100')
  })

  it('should have stroke-dasharray and stroke-dashoffset for animation', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')

    expect(path?.getAttribute('stroke-dasharray')).toBe('100 100')
    expect(path?.getAttribute('stroke-dashoffset')).toBe('100')
  })

  it('should start with opacity 0', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')

    expect(path?.getAttribute('opacity')).toBe('0')
  })

  it('should have text-primary class', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')

    expect(path?.classList.contains('text-primary')).toBe(true)
  })

  it('should contain SMIL animate elements', async () => {
    const root = await renderComponent(defaultProps)
    const animateElements = root.querySelectorAll('animate')

    // Should have at least 3 animate elements (stroke-dashoffset, opacity fade in, opacity fade out)
    expect(animateElements.length).toBeGreaterThanOrEqual(3)
  })

  it('should have stroke-dashoffset animation', async () => {
    const root = await renderComponent(defaultProps)
    const animateElements = root.querySelectorAll('animate')
    const dashoffsetAnimate = Array.from(animateElements).find(
      (el) => el.getAttribute('attributeName') === 'stroke-dashoffset',
    )

    expect(dashoffsetAnimate).toBeDefined()
    expect(dashoffsetAnimate?.getAttribute('from')).toBe('100')
    expect(dashoffsetAnimate?.getAttribute('to')).toBe('0')
    expect(dashoffsetAnimate?.getAttribute('dur')).toBe('400ms')
  })

  it('should have opacity fade in animation', async () => {
    const root = await renderComponent({
      ...defaultProps,
      opacity: 0.5,
    })
    const animateElements = root.querySelectorAll('animate')
    const opacityAnimates = Array.from(animateElements).filter(
      (el) => el.getAttribute('attributeName') === 'opacity',
    )

    // Find the fade-in animation (no begin attribute)
    const fadeIn = opacityAnimates.find((el) => el.getAttribute('begin') === null)

    expect(fadeIn).toBeDefined()
    expect(fadeIn?.getAttribute('from')).toBe('0')
    expect(fadeIn?.getAttribute('to')).toBe('0.5')
  })

  it('should have opacity fade out animation with delay', async () => {
    const root = await renderComponent({
      ...defaultProps,
      fadeDelay: 500,
      fadeDuration: 300,
    })
    const animateElements = root.querySelectorAll('animate')
    const opacityAnimates = Array.from(animateElements).filter(
      (el) => el.getAttribute('attributeName') === 'opacity',
    )

    // Find the fade-out animation (has begin attribute)
    const fadeOut = opacityAnimates.find((el) => el.getAttribute('begin') !== null)

    expect(fadeOut).toBeDefined()
    expect(fadeOut?.getAttribute('begin')).toBe('500ms')
    expect(fadeOut?.getAttribute('dur')).toBe('300ms')
    expect(fadeOut?.getAttribute('to')).toBe('0')
  })

  it('should have set element to hide after animation', async () => {
    const root = await renderComponent(defaultProps)
    const setElement = root.querySelector('set')

    expect(setElement).toBeDefined()
    expect(setElement?.getAttribute('attributeName')).toBe('display')
    expect(setElement?.getAttribute('to')).toBe('none')
  })

  it('should generate different paths for different pulse indices', async () => {
    const root1 = await renderComponent({ ...defaultProps, pulseIndex: 0 })
    const root2 = await renderComponent({ ...defaultProps, pulseIndex: 1 })

    const path1 = root1.querySelector('path')
    const path2 = root2.querySelector('path')

    const d1 = path1?.getAttribute('d')
    const d2 = path2?.getAttribute('d')

    // Different indices should produce different paths
    expect(d1).not.toBe(d2)
  })

  it('should generate path starting from left edge', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')
    const d = path?.getAttribute('d')

    // Path should start with M 0 (move to x=0)
    expect(d).toMatch(/^M 0 \d+/)
  })

  it('should generate path ending at right edge', async () => {
    const root = await renderComponent(defaultProps)
    const path = root.querySelector('path')
    const d = path?.getAttribute('d')

    // Path should end with L width y
    expect(d).toMatch(/L 1920 \d+$/)
  })
})
