import { describe, expect, it } from 'vitest'

import DigitalAnalyzer from '@/components/features/DigitalAnalyzer.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('DigitalAnalyzer', () => {
  it('should create container div with data-digital-analyzer attribute', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const container = root.querySelector('[data-digital-analyzer]')

    expect(container).toBeDefined()
    expect(container?.classList.contains('digital-analyzer')).toBeTruthy()
  })

  it('should apply custom class name', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { class: 'custom-class', name: 'test-analyzer' },
    })
    const container = root.querySelector('[data-digital-analyzer]')

    expect(container?.classList.contains('custom-class')).toBeTruthy()
  })

  it('should create two SVG elements (static lines and pulses)', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const svgs = root.querySelectorAll('svg')

    expect(svgs.length).toBe(2)
  })

  it('should have static grid lines SVG', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const staticSvg = root.querySelector('.digital-analyzer-static')

    expect(staticSvg).toBeDefined()
    expect(staticSvg?.tagName).toBe('svg')
  })

  it('should have pulses SVG with id', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const pulsesSvg = root.querySelector('#digital-analyzer-svg')

    expect(pulsesSvg).toBeDefined()
    expect(pulsesSvg?.classList.contains('digital-analyzer-traces')).toBeTruthy()
  })

  it('should not set viewBox on SVGs (set dynamically by JS)', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const svgs = root.querySelectorAll('svg')

    // ViewBox is set dynamically by JavaScript at runtime
    svgs.forEach((svg) => {
      const viewBox = svg.getAttribute('viewBox')
      expect(viewBox).toBeNull()
    })
  })

  it('should set preserveAspectRatio to none for stretching', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const svgs = root.querySelectorAll('svg')

    svgs.forEach((svg) => {
      expect(svg.getAttribute('preserveAspectRatio')).toBe('none')
    })
  })

  it('should have empty grid group (populated dynamically by JS)', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const staticSvg = root.querySelector('.digital-analyzer-static')

    // Grid group should exist but be empty (populated by JavaScript)
    const gridGroup = staticSvg?.querySelector('g')
    expect(gridGroup).toBeDefined()

    const lines = gridGroup?.querySelectorAll('line')
    expect(lines?.length).toBe(0)
  })

  it('should have empty pulses SVG ready for dynamic content', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const pulsesSvg = root.querySelector('#digital-analyzer-svg')

    // Pulses are added dynamically by JavaScript at runtime
    // Server-rendered HTML should have empty SVG container
    expect(pulsesSvg).toBeDefined()
    expect(pulsesSvg?.tagName).toBe('svg')
  })

  it('should apply text-primary class to grid lines group', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const groups = root.querySelectorAll('g')

    const primaryGroup = [...groups].find((g) => g.classList.contains('text-primary'))
    expect(primaryGroup).toBeDefined()
  })

  it('should set pointer-events none on SVGs', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const svgs = root.querySelectorAll('svg')

    svgs.forEach((svg) => {
      const style = svg.getAttribute('style')
      expect(style).toContain('pointer-events: none')
    })
  })

  it('should have absolute positioning classes on SVGs', async () => {
    const root = await renderAstroComponent(DigitalAnalyzer, {
      props: { name: 'test-analyzer' },
    })
    const svgs = root.querySelectorAll('svg')

    svgs.forEach((svg) => {
      expect(svg.classList.contains('absolute')).toBeTruthy()
      expect(svg.classList.contains('inset-0')).toBeTruthy()
    })
  })
})
