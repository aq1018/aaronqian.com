/**
 * Grid management for digital analyzer signal visualization
 * Handles grid line generation and resize optimization
 */

import { calculateGridSize } from './DigitalAnalyzer.config'
import { generateGridLines } from './DigitalAnalyzer.utils'

/**
 * Configuration options for grid rendering
 */
export interface GridConfig {
  /** Number of bytes per trace (determines horizontal grid cells) */
  byteCount: number
  /** Bits per byte (typically 8) */
  bitsPerByte: number
  /** Opacity of grid lines (0-1) */
  gridOpacity: number
}

/**
 * Manages grid rendering and dynamic sizing for the digital analyzer
 * Optimizes DOM updates by only regenerating grid lines when necessary
 *
 * @example
 * ```typescript
 * const gridManager = new GridManager(staticSvg, dynamicSvg, {
 *   byteCount: 2,
 *   bitsPerByte: 8,
 *   gridOpacity: 0.2,
 * })
 *
 * // Update on resize
 * const rect = container.getBoundingClientRect()
 * gridManager.updateDimensions(rect)
 * ```
 */
export class GridManager {
  private readonly staticSvg: SVGSVGElement
  private readonly dynamicSvg: SVGSVGElement
  private readonly config: GridConfig
  private readonly bitCount: number

  private width = 0
  private height = 0
  private gridSize = 0
  private gridLines: number[] = []
  private lastRegeneratedWidth = 0

  /**
   * Threshold in pixels - only regenerate grid if width changes by more than this
   * Prevents unnecessary DOM manipulation on minor resize events
   */
  private readonly REGENERATION_THRESHOLD = 10

  /**
   * Create a new GridManager instance
   *
   * @param staticSvg - SVG element containing the static grid overlay
   * @param dynamicSvg - SVG element containing animated traces
   * @param config - Grid configuration options
   */
  constructor(staticSvg: SVGSVGElement, dynamicSvg: SVGSVGElement, config: GridConfig) {
    this.staticSvg = staticSvg
    this.dynamicSvg = dynamicSvg
    this.config = config
    this.bitCount = config.byteCount * config.bitsPerByte
  }

  /**
   * Update grid dimensions based on container size
   * Only regenerates DOM elements if width changed significantly
   *
   * @param containerRect - Bounding rectangle of the container element
   */
  updateDimensions(containerRect: DOMRect): void {
    this.width = containerRect.width
    this.height = containerRect.height
    this.gridSize = calculateGridSize(this.width, this.config.byteCount, this.config.bitsPerByte)

    // Update viewBox for both SVGs (cheap operation)
    this.staticSvg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
    this.dynamicSvg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)

    // Update mask size (cheap operation)
    this.updateMaskSize()

    // Only regenerate if width changed significantly
    if (this.shouldRegenerateGrid(this.width)) {
      this.regenerateGridLines()
      this.lastRegeneratedWidth = this.width
    } else if (Number.isFinite(this.gridSize) && this.gridSize > 0) {
      // Still recalculate grid line positions for other components (cheap operation)
      // Guard against invalid gridSize (width=0 creates Infinity)
      this.gridLines = generateGridLines(this.height, this.gridSize)
    } else {
      this.gridLines = []
    }
  }

  /**
   * Check if grid should be regenerated based on width change
   * @param newWidth - New width to compare against last regeneration
   * @returns True if grid should be regenerated
   */
  shouldRegenerateGrid(newWidth: number): boolean {
    return Math.abs(newWidth - this.lastRegeneratedWidth) > this.REGENERATION_THRESHOLD
  }

  /** Regenerate all grid line elements (expensive operation) */
  private regenerateGridLines(): void {
    // Guard against invalid dimensions (width=0 creates Infinity gridSize)
    if (!Number.isFinite(this.gridSize) || this.gridSize === 0) {
      this.gridLines = []
      return
    }

    this.gridLines = generateGridLines(this.height, this.gridSize)
    const gridGroup = this.staticSvg.querySelector('g')
    if (gridGroup === null) return

    gridGroup.innerHTML = ''

    // Horizontal lines
    for (const y of this.gridLines) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('y1', String(y))
      line.setAttribute('x2', String(this.width))
      line.setAttribute('y2', String(y))
      line.setAttribute('opacity', String(this.config.gridOpacity))
      gridGroup.appendChild(line)
    }

    // Vertical lines (one per bit/cell boundary, including edges)
    for (let i = 0; i <= this.bitCount; i += 1) {
      const x = i * this.gridSize
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', String(x))
      line.setAttribute('y1', '0')
      line.setAttribute('x2', String(x))
      line.setAttribute('y2', String(this.height))
      line.setAttribute('opacity', String(this.config.gridOpacity))
      gridGroup.appendChild(line)
    }
  }

  /** Update mask rectangle size for clipping */
  private updateMaskSize(): void {
    const maskRect = this.staticSvg.querySelector('#digital-analyzer-mask rect')
    if (maskRect !== null) {
      maskRect.setAttribute('width', String(this.width))
      maskRect.setAttribute('height', String(this.height))
    }
  }

  /** Get grid line Y positions for trace alignment */
  getGridLines(): number[] {
    return this.gridLines
  }

  /** Get grid cell size for trace calculations */
  getGridSize(): number {
    return this.gridSize
  }

  /** Get current container width */
  getWidth(): number {
    return this.width
  }

  /** Get current container height */
  getHeight(): number {
    return this.height
  }
}
