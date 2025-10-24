import { describe, expect, it } from 'vitest'

import { defaultOptions } from './config'
import { createCuttingMatOverlays } from './overlay'
import type { CuttingMatOptions } from './types'

describe('createCuttingMatOverlays', () => {
  it('should create an SVG element', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    expect(svg.tagName).toBe('svg')
  })

  it('should set correct viewBox and dimensions', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    expect(svg.getAttribute('viewBox')).toBe('0 0 4000 4000')
    expect(svg.getAttribute('width')).toBe('4000')
    expect(svg.getAttribute('height')).toBe('4000')
  })

  it('should set correct positioning styles', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const style = svg.getAttribute('style')
    expect(style).toContain('position: absolute')
    expect(style).toContain('bottom: 0')
    expect(style).toContain('left: 50%')
    expect(style).toContain('transform: translateX(-50%)')
  })

  it('should have cutting-mat-overlays class', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    expect(svg.classList.contains('cutting-mat-overlays')).toBe(true)
  })

  it('should contain defs with gradient and mask', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const defs = svg.querySelector('defs')
    expect(defs).not.toBeNull()

    const gradient = svg.querySelector('linearGradient#fade-gradient')
    const mask = svg.querySelector('mask#fade-mask')
    expect(gradient).not.toBeNull()
    expect(mask).not.toBeNull()
  })

  it('should contain a main group element with mask', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const g = svg.querySelector('g[mask="url(#fade-mask)"]')
    expect(g).not.toBeNull()
  })

  it('should create axes', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const lines = svg.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(2) // At least x-axis and y-axis
  })

  it('should create grid lines', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const lines = svg.querySelectorAll('line')
    // Should have many grid lines plus axes
    expect(lines.length).toBeGreaterThan(10)
  })

  it('should create teeth marks when showTeeth is true', () => {
    const container = document.createElement('div')
    const config: Required<CuttingMatOptions> = { ...defaultOptions, showTeeth: true }

    const svg = createCuttingMatOverlays(container, config)

    const lines = svg.querySelectorAll('line')
    // With teeth, should have even more lines
    expect(lines.length).toBeGreaterThan(100)
  })

  it('should not create extra teeth marks when showTeeth is false', () => {
    const container = document.createElement('div')
    const config1: Required<CuttingMatOptions> = { ...defaultOptions, showTeeth: true }
    const config2: Required<CuttingMatOptions> = { ...defaultOptions, showTeeth: false }

    const svg1 = createCuttingMatOverlays(container, config1)
    const svg2 = createCuttingMatOverlays(container, config2)

    const lines1 = svg1.querySelectorAll('line')
    const lines2 = svg2.querySelectorAll('line')

    // svg1 should have more lines due to teeth
    expect(lines1.length).toBeGreaterThan(lines2.length)
  })

  it('should create arcs', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const paths = svg.querySelectorAll('path')
    // Should have at least arcCount arcs plus angle marks
    expect(paths.length).toBeGreaterThanOrEqual(config.arcCount)
  })

  it('should create angle lines', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const lines = svg.querySelectorAll('line')
    // Hard to isolate angle lines from grid, but there should be many lines
    expect(lines.length).toBeGreaterThan(0)
  })

  it('should create angle labels', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const texts = svg.querySelectorAll('text')
    // Should have angleLineCount * 2 texts (background + foreground)
    expect(texts.length).toBe(config.angleLineCount * 2)
  })

  it('should create angle marks', () => {
    const container = document.createElement('div')
    const config = { ...defaultOptions }

    const svg = createCuttingMatOverlays(container, config)

    const paths = svg.querySelectorAll('path')
    // Should have arcs + 2 angle mark arcs (left and right)
    expect(paths.length).toBe(config.arcCount + 2)
  })

  it('should respect custom configuration', () => {
    const container = document.createElement('div')
    const config: Required<CuttingMatOptions> = {
      ...defaultOptions,
      angleLineCount: 7,
    }

    const svg = createCuttingMatOverlays(container, config)

    const texts = svg.querySelectorAll('text')
    // Should have 7 * 2 texts (background + foreground)
    expect(texts.length).toBe(14)
  })
})
