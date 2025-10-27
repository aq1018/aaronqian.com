/**
 * Tests for GridManager grid rendering and resize optimization
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { type GridConfig, GridManager } from './DigitalAnalyzer.grid'

describe('GridManager', () => {
  let staticSvg!: SVGSVGElement
  let dynamicSvg!: SVGSVGElement
  let gridGroup!: SVGGElement
  let config!: GridConfig

  beforeEach(() => {
    // Create SVG elements with proper structure
    staticSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    dynamicSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

    // Create grid group for static SVG
    gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    staticSvg.appendChild(gridGroup)

    // Standard config
    config = {
      byteCount: 2,
      bitsPerByte: 8,
      gridOpacity: 0.2,
    }
  })

  afterEach(() => {
    staticSvg.remove()
    dynamicSvg.remove()
  })

  describe('constructor', () => {
    it('should initialize with correct bitCount', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      expect(gridManager).toBeDefined()
      // Access through getters to verify state
      expect(gridManager.getWidth()).toBe(0)
      expect(gridManager.getHeight()).toBe(0)
      expect(gridManager.getGridSize()).toBe(0)
    })

    it('should calculate bitCount correctly', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, {
        byteCount: 4,
        bitsPerByte: 8,
        gridOpacity: 0.2,
      })

      // Update dimensions to trigger grid generation
      const rect = new DOMRect(0, 0, 800, 400)
      gridManager.updateDimensions(rect)

      // With 4 bytes * 8 bits = 32 bits, should have 33 vertical lines (32 + 1 for edge)
      const verticalLines = gridGroup.querySelectorAll('line[x1][y1="0"]')
      expect(verticalLines.length).toBe(33)
    })
  })

  describe('updateDimensions', () => {
    it('should update width and height', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      expect(gridManager.getWidth()).toBe(1600)
      expect(gridManager.getHeight()).toBe(800)
    })

    it('should calculate gridSize correctly', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      // gridSize = width / (byteCount * bitsPerByte) = 1600 / (2 * 8) = 100
      expect(gridManager.getGridSize()).toBe(100)
    })

    it('should update viewBox on both SVGs', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      expect(staticSvg.getAttribute('viewBox')).toBe('0 0 1600 800')
      expect(dynamicSvg.getAttribute('viewBox')).toBe('0 0 1600 800')
    })

    it('should regenerate grid on first update', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      // Should have generated grid lines
      const lines = gridGroup.querySelectorAll('line')
      expect(lines.length).toBeGreaterThan(0)
    })

    it('should generate correct number of horizontal lines', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      // Height 800, gridSize 100 -> lines at y: 100, 200, 300, 400, 500, 600, 700 (7 lines)
      const horizontalLines = gridGroup.querySelectorAll('line[x1="0"][x2="1600"]')
      expect(horizontalLines.length).toBe(7)
    })

    it('should generate correct number of vertical lines', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      // 2 bytes * 8 bits = 16 bits -> 17 vertical lines (16 + 1 for right edge)
      const verticalLines = gridGroup.querySelectorAll('line[y1="0"][y2="800"]')
      expect(verticalLines.length).toBe(17)
    })

    it('should set correct opacity on grid lines', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, {
        byteCount: 2,
        bitsPerByte: 8,
        gridOpacity: 0.5,
      })
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      const lines = gridGroup.querySelectorAll('line')
      lines.forEach((line) => {
        expect(line.getAttribute('opacity')).toBe('0.5')
      })
    })

    it('should position horizontal lines at correct Y coordinates', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      // Select only horizontal lines (x1="0" AND x2="1600")
      const horizontalLines = gridGroup.querySelectorAll('line[x1="0"][x2="1600"]')
      const yPositions = Array.from(horizontalLines).map((line) => Number(line.getAttribute('y1')))

      // Should be at gridSize intervals: 100, 200, 300, etc.
      expect(yPositions).toEqual([100, 200, 300, 400, 500, 600, 700])
    })

    it('should position vertical lines at correct X coordinates', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      const rect = new DOMRect(0, 0, 1600, 800)

      gridManager.updateDimensions(rect)

      const verticalLines = gridGroup.querySelectorAll('line[y1="0"]')
      const xPositions = Array.from(verticalLines).map((line) => Number(line.getAttribute('x1')))

      // Should be at gridSize intervals: 0, 100, 200, ..., 1600
      expect(xPositions).toEqual([
        0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600,
      ])
    })
  })

  describe('shouldRegenerateGrid', () => {
    it('should return true when width change exceeds threshold', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Initial update at width 1600
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Should regenerate for width change > 10px
      expect(gridManager.shouldRegenerateGrid(1620)).toBe(true)
    })

    it('should return true when width decreases beyond threshold', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Should regenerate for width change > 10px (decrease)
      expect(gridManager.shouldRegenerateGrid(1580)).toBe(true)
    })

    it('should return false when width change is below threshold', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Should NOT regenerate for small width change (5px)
      expect(gridManager.shouldRegenerateGrid(1605)).toBe(false)
    })

    it('should return false when width is exactly at threshold', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Should NOT regenerate at exactly threshold (10px)
      expect(gridManager.shouldRegenerateGrid(1610)).toBe(false)
    })

    it('should return true when width change is just over threshold', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Should regenerate just over threshold (11px)
      expect(gridManager.shouldRegenerateGrid(1611)).toBe(true)
    })
  })

  describe('resize optimization', () => {
    it('should NOT regenerate grid on small width change', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Initial update
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Clear grid to verify it doesn't get regenerated
      gridGroup.innerHTML = ''

      // Small width change (5px) - should not regenerate
      gridManager.updateDimensions(new DOMRect(0, 0, 1605, 800))

      // Grid should still be empty (not regenerated)
      expect(gridGroup.querySelectorAll('line').length).toBe(0)
    })

    it('should regenerate grid on large width change', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Initial update
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Clear grid
      gridGroup.innerHTML = ''

      // Large width change (50px) - should regenerate
      gridManager.updateDimensions(new DOMRect(0, 0, 1650, 800))

      // Grid should have lines again
      expect(gridGroup.querySelectorAll('line').length).toBeGreaterThan(0)
    })

    it('should update gridLines array even without regenerating DOM', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Initial update at height 800
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))
      const initialGridLines = gridManager.getGridLines()

      // Change height only (width stays same) - should update gridLines but optimize DOM
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 900))
      const newGridLines = gridManager.getGridLines()

      // Grid lines should have changed (different height)
      expect(newGridLines).not.toEqual(initialGridLines)
    })

    it('should update viewBox even when not regenerating grid', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // Small width change - should update viewBox but not regenerate
      gridManager.updateDimensions(new DOMRect(0, 0, 1605, 805))

      expect(staticSvg.getAttribute('viewBox')).toBe('0 0 1605 805')
      expect(dynamicSvg.getAttribute('viewBox')).toBe('0 0 1605 805')
    })
  })

  describe('getGridLines', () => {
    it('should return array of Y positions', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      const gridLines = gridManager.getGridLines()

      expect(Array.isArray(gridLines)).toBe(true)
      expect(gridLines.length).toBe(7)
      expect(gridLines).toEqual([100, 200, 300, 400, 500, 600, 700])
    })

    it('should return empty array before initialization', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      const gridLines = gridManager.getGridLines()

      expect(gridLines).toEqual([])
    })
  })

  describe('getGridSize', () => {
    it('should return calculated grid size', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      expect(gridManager.getGridSize()).toBe(100)
    })

    it('should return 0 before initialization', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      expect(gridManager.getGridSize()).toBe(0)
    })

    it('should update when dimensions change', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))
      expect(gridManager.getGridSize()).toBe(100)

      gridManager.updateDimensions(new DOMRect(0, 0, 3200, 800))
      expect(gridManager.getGridSize()).toBe(200)
    })
  })

  describe('getWidth', () => {
    it('should return current width', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      expect(gridManager.getWidth()).toBe(1600)
    })

    it('should return 0 before initialization', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      expect(gridManager.getWidth()).toBe(0)
    })
  })

  describe('getHeight', () => {
    it('should return current height', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      expect(gridManager.getHeight()).toBe(800)
    })

    it('should return 0 before initialization', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      expect(gridManager.getHeight()).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle missing grid group gracefully', () => {
      // Remove grid group
      gridGroup.remove()

      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Should not throw
      expect(() => {
        gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))
      }).not.toThrow()
    })

    it('should handle zero width', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Zero width creates Infinity in grid calculations, which can throw
      // This is an edge case that shouldn't happen in production
      gridManager.updateDimensions(new DOMRect(0, 0, 0, 800))

      expect(gridManager.getWidth()).toBe(0)
      // Grid size will be 0/16 = 0
      expect(gridManager.getGridSize()).toBe(0)
    })

    it('should handle zero height', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      expect(() => {
        gridManager.updateDimensions(new DOMRect(0, 0, 1600, 0))
      }).not.toThrow()

      expect(gridManager.getHeight()).toBe(0)
      expect(gridManager.getGridLines()).toEqual([])
    })

    it('should handle rapid consecutive updates', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, config)

      // Simulate rapid resize events
      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))
      gridManager.updateDimensions(new DOMRect(0, 0, 1605, 805))
      gridManager.updateDimensions(new DOMRect(0, 0, 1610, 810))
      gridManager.updateDimensions(new DOMRect(0, 0, 1620, 820))

      // Should end up with correct final dimensions
      expect(gridManager.getWidth()).toBe(1620)
      expect(gridManager.getHeight()).toBe(820)
    })

    it('should handle different byteCount configurations', () => {
      const gridManager = new GridManager(staticSvg, dynamicSvg, {
        byteCount: 4,
        bitsPerByte: 8,
        gridOpacity: 0.2,
      })

      gridManager.updateDimensions(new DOMRect(0, 0, 1600, 800))

      // 4 bytes * 8 bits = 32 bits -> gridSize = 1600/32 = 50
      expect(gridManager.getGridSize()).toBe(50)
    })
  })
})
