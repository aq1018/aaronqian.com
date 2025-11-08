/**
 * Runtime animations for digital analyzer signal visualization
 * Orchestrates waveform timing and lightning bolt sync with dynamic sizing
 */

import { createTraceAnimation } from './DigitalAnalyzer.animation'
import { defaultOptions } from './DigitalAnalyzer.config'
import { DataSourceManager } from './DigitalAnalyzer.data'
import { DisplayManager } from './DigitalAnalyzer.display'
import { GridManager } from './DigitalAnalyzer.grid'
import type { DigitalAnalyzerOptions } from './DigitalAnalyzer.types'
import { generateSquareWavePath, getGlowColor } from './DigitalAnalyzer.utils'

import { queryElement, querySVGElement } from '@/utils/typeGuards'

type CleanupFunction = () => void
type DigitalAnalyzerConfig = Required<DigitalAnalyzerOptions>

let cleanup: CleanupFunction | null = null
let resizeObserver: ResizeObserver | null = null

/**
 * Calculate Y positions for trace based on grid
 */
function calculateTracePositions(
  gridLines: number[],
  height: number,
  gridSize: number,
): { highY: number; lowY: number } {
  const baselineIndex =
    gridLines.length > 1 ? Math.floor(Math.random() * (gridLines.length - 1)) : 0
  const highY = gridLines.length > 0 ? gridLines[baselineIndex] : height / 2
  const lowY =
    gridLines.length > baselineIndex + 1 ? gridLines[baselineIndex + 1] : highY + gridSize
  return { highY, lowY }
}

/**
 * Generate hex display for random mode
 */
function generateHexDisplay(binaryData: string, displayManager: DisplayManager): void {
  let hexText = '0x'
  for (let i = 0; i < binaryData.length; i += 8) {
    const byte = binaryData.slice(i, i + 8)
    if (byte.length === 8) {
      const hexByte = parseInt(byte, 2).toString(16).padStart(2, '0').toUpperCase()
      hexText += hexByte
    }
  }
  displayManager.setAsciiText(hexText)
}

/**
 * Create and style SVG path element
 */
function createStyledPathElement(
  svg: SVGSVGElement,
  pathData: string,
  config: DigitalAnalyzerConfig,
): SVGPathElement {
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pathElement.setAttribute('d', pathData)
  pathElement.setAttribute('stroke', 'currentColor')
  pathElement.setAttribute('stroke-width', String(config.lineStrokeWidth))
  pathElement.classList.add('text-primary')
  pathElement.setAttribute('fill', 'none')
  pathElement.setAttribute('stroke-linecap', 'square')
  pathElement.setAttribute('stroke-linejoin', 'miter')

  svg.append(pathElement)

  const pathLength = pathElement.getTotalLength()
  pathElement.style.strokeDasharray = `${pathLength} ${pathLength}`
  pathElement.style.strokeDashoffset = String(pathLength)
  const glowColor = getGlowColor(config.lineOpacity)
  pathElement.style.filter = `drop-shadow(0 0 3px ${glowColor})`
  pathElement.style.opacity = String(config.lineOpacity)

  return pathElement
}

/**
 * Setup decoder toggle hover effect
 */
function setupDecoderToggleHover(
  decoderToggle: HTMLElement,
  getCurrentTimeline: () => gsap.core.Timeline | null,
): { handleMouseEnter: EventListener; handleMouseLeave: EventListener } {
  const handleMouseEnter = () => {
    const isAnimating = getCurrentTimeline()?.isActive() === true
    if (!isAnimating) {
      decoderToggle.style.filter = 'brightness(0.85)'
    }
  }

  const handleMouseLeave = () => {
    const isAnimating = getCurrentTimeline()?.isActive() === true
    if (!isAnimating) {
      decoderToggle.style.filter = 'brightness(0.7)'
    }
  }

  decoderToggle.addEventListener('mouseenter', handleMouseEnter)
  decoderToggle.addEventListener('mouseleave', handleMouseLeave)

  return { handleMouseEnter, handleMouseLeave }
}

/**
 * Create triggerTrace function with closure over dependencies
 */
function createTriggerTraceFunction(deps: {
  getGridData: () => { gridLines: number[]; height: number; gridSize: number }
  dataSourceManager: DataSourceManager
  displayManager: DisplayManager
  svg: SVGSVGElement
  config: DigitalAnalyzerConfig
  decoderToggle: HTMLElement | null
  setCurrentTimeline: (timeline: gsap.core.Timeline | null) => void
}): () => void {
  return function triggerTrace(): void {
    const { gridLines, height, gridSize } = deps.getGridData()
    const { highY, lowY } = calculateTracePositions(gridLines, height, gridSize)
    const { binaryData, currentChunk, shouldClear } = deps.dataSourceManager.getNextBinaryData()
    const pathData = generateSquareWavePath(binaryData, highY, lowY, gridSize)

    if (deps.config.dataSource === 'random') {
      generateHexDisplay(binaryData, deps.displayManager)
    }

    const pathElement = createStyledPathElement(deps.svg, pathData, deps.config)
    deps.displayManager.clearBinaryBuffer()

    const timeline = createTraceAnimation({
      pathElement,
      binaryData,
      currentChunk,
      shouldClear,
      displayManager: deps.displayManager,
      decoderToggle: deps.decoderToggle,
      config: {
        traceDrawDuration: deps.config.traceDrawDuration,
        traceFadeDelay: deps.config.traceFadeDelay,
        traceClearDelay: deps.config.traceClearDelay,
        byteCount: deps.config.byteCount,
        dataSource: deps.config.dataSource,
      },
    })

    deps.setCurrentTimeline(timeline)

    timeline.eventCallback('onComplete', () => {
      pathElement.remove()
      deps.setCurrentTimeline(null)
      const nextDelay =
        deps.config.traceMinInterval +
        Math.random() * (deps.config.traceMaxInterval - deps.config.traceMinInterval)
      window.setTimeout(triggerTrace, nextDelay)
    })
  }
}

/**
 * Create cleanup function
 */
function createCleanupFunction(refs: {
  getCurrentTimeline: () => gsap.core.Timeline | null
  setCurrentTimeline: (timeline: gsap.core.Timeline | null) => void
  svg: SVGSVGElement
  decoderToggle: HTMLElement | null
  decoderToggleListeners: {
    handleMouseEnter: EventListener
    handleMouseLeave: EventListener
  } | null
  displayManager: DisplayManager
}): CleanupFunction {
  return () => {
    const currentTimeline = refs.getCurrentTimeline()
    if (currentTimeline != null) {
      currentTimeline.kill()
      refs.setCurrentTimeline(null)
    }
    if (resizeObserver != null) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    refs.svg.innerHTML = ''
    if (refs.decoderToggle != null && refs.decoderToggleListeners != null) {
      refs.decoderToggle.removeEventListener(
        'mouseenter',
        refs.decoderToggleListeners.handleMouseEnter,
      )
      refs.decoderToggle.removeEventListener(
        'mouseleave',
        refs.decoderToggleListeners.handleMouseLeave,
      )
    }
    if (refs.decoderToggle != null) {
      refs.decoderToggle.style.transform = ''
      refs.decoderToggle.style.filter = 'brightness(0.7)'
    }
    refs.displayManager.clearAsciiDisplay()
    refs.displayManager.clearBinaryBuffer()
    cleanup = null
  }
}

/**
 * Query required DOM elements
 */
function queryRequiredElements(): {
  container: HTMLElement
  svg: SVGSVGElement
  staticSvg: SVGSVGElement
  decoderToggle: HTMLElement | null
} | null {
  const container = queryElement<HTMLElement>('[data-digital-analyzer]')
  const svgResult = querySVGElement('#digital-analyzer-svg')
  const staticSvgResult = querySVGElement('.digital-analyzer-static')
  const decoderToggle = queryElement<HTMLElement>('[data-decoder-toggle]')

  if (svgResult == null || container == null || staticSvgResult == null) {
    return null
  }

  return {
    container,
    svg: svgResult,
    staticSvg: staticSvgResult,
    decoderToggle,
  }
}

/**
 * Initialize managers
 */
function initializeManagers(
  analyzerName: string,
  staticSvg: SVGSVGElement,
  svg: SVGSVGElement,
  config: DigitalAnalyzerConfig,
): {
  dataSourceManager: DataSourceManager
  displayManager: DisplayManager
  gridManager: GridManager
} {
  const bitCount = config.byteCount * config.bitsPerByte
  const dataSourceManager = new DataSourceManager({
    fullMessage: config.defaultMessage,
    byteCount: config.byteCount,
    bitCount,
    dataSource: config.dataSource,
  })
  const displayManager = new DisplayManager(analyzerName)
  const gridManager = new GridManager(staticSvg, svg, {
    byteCount: config.byteCount,
    bitsPerByte: config.bitsPerByte,
    gridOpacity: config.gridOpacity,
  })
  return { dataSourceManager, displayManager, gridManager }
}

/**
 * Initialize and setup grid dimensions with ResizeObserver
 */
function setupGridDimensions(
  container: HTMLElement,
  gridManager: GridManager,
): () => { gridLines: number[]; height: number; gridSize: number } {
  gridManager.updateDimensions(container.getBoundingClientRect())
  let gridLines = gridManager.getGridLines()
  let gridSize = gridManager.getGridSize()
  let height = gridManager.getHeight()

  resizeObserver = new ResizeObserver(() => {
    gridManager.updateDimensions(container.getBoundingClientRect())
    height = gridManager.getHeight()
    gridSize = gridManager.getGridSize()
    gridLines = gridManager.getGridLines()
  })
  resizeObserver.observe(container)

  return () => ({ gridLines, height, gridSize })
}

/**
 * Initialize digital analyzer animations with dynamic sizing
 */
export function initializeDigitalAnalyzer(): CleanupFunction {
  if (cleanup != null) cleanup()

  const elements = queryRequiredElements()
  if (elements == null) {
    cleanup = () => {}
    return cleanup
  }

  const { container, svg, staticSvg, decoderToggle } = elements
  const analyzerName = container.dataset['digital-analyzer'] ?? 'default'
  const config: DigitalAnalyzerConfig = defaultOptions

  let currentTimeline: gsap.core.Timeline | null = null
  let decoderToggleListeners: {
    handleMouseEnter: EventListener
    handleMouseLeave: EventListener
  } | null = null

  const { dataSourceManager, displayManager, gridManager } = initializeManagers(
    analyzerName,
    staticSvg,
    svg,
    config,
  )

  const getGridData = setupGridDimensions(container, gridManager)

  if (decoderToggle != null) {
    decoderToggleListeners = setupDecoderToggleHover(decoderToggle, () => currentTimeline)
  }

  const triggerTrace = createTriggerTraceFunction({
    getGridData,
    dataSourceManager,
    displayManager,
    svg,
    config,
    decoderToggle,
    setCurrentTimeline: (timeline) => {
      currentTimeline = timeline
    },
  })

  window.setTimeout(triggerTrace, config.traceInitialDelay)

  cleanup = createCleanupFunction({
    getCurrentTimeline: () => currentTimeline,
    setCurrentTimeline: (timeline) => {
      currentTimeline = timeline
    },
    svg,
    decoderToggle,
    decoderToggleListeners,
    displayManager,
  })

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupDigitalAnalyzer(): void {
  document.addEventListener('astro:page-load', initializeDigitalAnalyzer)

  document.addEventListener('astro:before-preparation', () => {
    if (cleanup != null) {
      cleanup()
    }
  })
}
