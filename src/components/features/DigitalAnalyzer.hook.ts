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
 * Initialize digital analyzer animations with dynamic sizing
 */
export function initializeDigitalAnalyzer(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  const container = queryElement<HTMLElement>('[data-digital-analyzer]')
  const svgResult = querySVGElement('#digital-analyzer-svg')
  const staticSvgResult = querySVGElement('.digital-analyzer-static')
  const decoderToggle = queryElement<HTMLElement>('[data-decoder-toggle]')

  if (svgResult === null || container === null || staticSvgResult === null) {
    cleanup = () => {}
    return cleanup
  }

  // Type narrowing: guaranteed non-null after check above
  const svg: SVGSVGElement = svgResult
  const staticSvg: SVGSVGElement = staticSvgResult

  // Get analyzer name from data attribute
  const analyzerName = container.getAttribute('data-digital-analyzer') ?? 'default'

  const config: DigitalAnalyzerConfig = defaultOptions
  const bitCount = config.byteCount * config.bitsPerByte
  let currentTimeline: gsap.core.Timeline | null = null
  let decoderToggleListeners: {
    handleMouseEnter: EventListener
    handleMouseLeave: EventListener
  } | null = null

  // Initialize managers
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

  // Initial dimension calculation
  gridManager.updateDimensions(container.getBoundingClientRect())
  let height = gridManager.getHeight()
  let gridSize = gridManager.getGridSize()
  let gridLines = gridManager.getGridLines()

  // Setup ResizeObserver to handle container size changes
  resizeObserver = new ResizeObserver(() => {
    gridManager.updateDimensions(container.getBoundingClientRect())
    height = gridManager.getHeight()
    gridSize = gridManager.getGridSize()
    gridLines = gridManager.getGridLines()
  })
  resizeObserver.observe(container)

  // Setup hover effect for decoder toggle (only applies when not being animated by GSAP)
  if (decoderToggle !== null) {
    const handleMouseEnter = () => {
      // Only apply hover effect if timeline is not actively animating
      const isAnimating = currentTimeline?.isActive() === true
      if (!isAnimating) {
        decoderToggle.style.filter = 'brightness(0.85)'
      }
    }

    const handleMouseLeave = () => {
      // Restore to dimmed state when not actively animating
      const isAnimating = currentTimeline?.isActive() === true
      if (!isAnimating) {
        decoderToggle.style.filter = 'brightness(0.7)'
      }
    }

    decoderToggle.addEventListener('mouseenter', handleMouseEnter)
    decoderToggle.addEventListener('mouseleave', handleMouseLeave)

    decoderToggleListeners = { handleMouseEnter, handleMouseLeave }
  }

  function triggerTrace(): void {
    // Select random grid line for this trace
    // Pick a baseline with room below for the signal (1 grid space tall)
    const baselineIndex =
      gridLines.length > 1 ? Math.floor(Math.random() * (gridLines.length - 1)) : 0

    // High and low positions should align with actual grid lines, 1 grid space apart
    const highY = gridLines.length > 0 ? gridLines[baselineIndex] : height / 2
    const lowY =
      gridLines.length > baselineIndex + 1 ? gridLines[baselineIndex + 1] : highY + gridSize

    // Get binary data and generate square wave path
    const { binaryData, currentChunk, shouldClear } = dataSourceManager.getNextBinaryData()
    const pathData = generateSquareWavePath(binaryData, highY, lowY, gridSize)

    // For random mode, show hex representation immediately
    if (config.dataSource === 'random') {
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

    // Create trace path element
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathElement.setAttribute('d', pathData)
    pathElement.setAttribute('stroke', 'currentColor')
    pathElement.setAttribute('stroke-width', String(config.lineStrokeWidth))
    pathElement.classList.add('text-primary')
    pathElement.setAttribute('fill', 'none')
    pathElement.setAttribute('stroke-linecap', 'square') // Square for digital signals
    pathElement.setAttribute('stroke-linejoin', 'miter') // Sharp corners for digital signals

    svg.appendChild(pathElement)
    const pathLength = pathElement.getTotalLength()

    // Setup draw animation - start with path hidden
    pathElement.style.strokeDasharray = `${pathLength} ${pathLength}`
    pathElement.style.strokeDashoffset = String(pathLength)
    const glowColor = getGlowColor(config.lineOpacity)
    pathElement.style.filter = `drop-shadow(0 0 3px ${glowColor})`
    pathElement.style.opacity = String(config.lineOpacity)

    // Clear binary buffer immediately to prevent race condition with multiple traces
    displayManager.clearBinaryBuffer()

    // Create GSAP timeline for all animations
    const timeline = createTraceAnimation({
      pathElement,
      binaryData,
      currentChunk,
      shouldClear,
      displayManager,
      decoderToggle,
      config: {
        traceDrawDuration: config.traceDrawDuration,
        traceFadeDelay: config.traceFadeDelay,
        traceClearDelay: config.traceClearDelay,
        byteCount: config.byteCount,
        dataSource: config.dataSource,
      },
    })

    // Track current timeline
    currentTimeline = timeline

    // Cleanup on timeline complete, then schedule next trace
    timeline.eventCallback('onComplete', () => {
      pathElement.remove()
      currentTimeline = null

      // Schedule next trace after a delay (interval = time between trace end and next trace start)
      const nextDelay =
        config.traceMinInterval +
        Math.random() * (config.traceMaxInterval - config.traceMinInterval)
      window.setTimeout(() => {
        triggerTrace()
      }, nextDelay)
    })
  }

  // Start first trace after initial delay
  // Each trace will schedule the next one when it completes
  window.setTimeout(() => {
    triggerTrace()
  }, config.traceInitialDelay)

  // Cleanup function
  cleanup = () => {
    // Kill current GSAP timeline
    if (currentTimeline !== null) {
      currentTimeline.kill()
      currentTimeline = null
    }

    // Disconnect ResizeObserver
    if (resizeObserver !== null) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    // Clear SVG traces
    svg.innerHTML = ''

    // Remove decoder toggle hover listeners
    if (decoderToggle !== null && decoderToggleListeners !== null) {
      decoderToggle.removeEventListener('mouseenter', decoderToggleListeners.handleMouseEnter)
      decoderToggle.removeEventListener('mouseleave', decoderToggleListeners.handleMouseLeave)
      decoderToggleListeners = null
    }

    // Reset decoder toggle to initial state
    if (decoderToggle !== null) {
      decoderToggle.style.transform = ''
      decoderToggle.style.filter = 'brightness(0.7)'
    }

    // Clear display managers
    displayManager.clearAsciiDisplay()
    displayManager.clearBinaryBuffer()

    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupDigitalAnalyzer(): void {
  document.addEventListener('astro:page-load', initializeDigitalAnalyzer)

  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
