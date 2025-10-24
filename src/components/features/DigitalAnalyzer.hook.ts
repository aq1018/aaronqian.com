/**
 * Runtime animations for digital analyzer signal visualization
 * Orchestrates waveform timing and lightning bolt sync with dynamic sizing
 */

/* eslint-disable max-lines -- Complex animation orchestration requires length for readability */
import { calculateGridSize, defaultOptions } from './DigitalAnalyzer.config'
import type { DigitalAnalyzerOptions } from './DigitalAnalyzer.types'
import {
  generateGridLines,
  generateRandomBinary,
  generateSquareWavePath,
  getGlowColor,
  getLightningGlowColor,
  stringToBinary,
} from './DigitalAnalyzer.utils'

type CleanupFunction = () => void
type DigitalAnalyzerConfig = Required<Omit<DigitalAnalyzerOptions, 'customBinaryData'>> & {
  customBinaryData: string | undefined
}

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

  const containerEl = document.querySelector('[data-digital-analyzer]')
  const svgEl = document.getElementById('digital-analyzer-svg')
  const staticSvgEl = document.querySelector('.digital-analyzer-static')
  const lightningBolt = document.querySelector<HTMLElement>('[data-lightning-bolt]')

  if (svgEl === null || containerEl === null || staticSvgEl === null) {
    cleanup = () => {}
    return cleanup
  }

  // These are guaranteed non-null after the check above
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Validated non-null by check above
  const container = containerEl as HTMLElement
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- SVGElement requires double cast
  const svg = svgEl as unknown as SVGSVGElement
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- SVGElement requires double cast
  const staticSvg = staticSvgEl as unknown as SVGSVGElement

  const config: DigitalAnalyzerConfig = defaultOptions as DigitalAnalyzerConfig
  let activeTraces = 0
  const timeoutIds: number[] = []
  let width = 0
  let height = 0
  let gridSize = 0
  let gridLines: number[] = []

  // Calculate bit count from byteCount
  const bitCount = config.byteCount * config.bitsPerByte

  // Track accumulated ASCII text and position in message
  let accumulatedText = ''
  let messagePosition = 0
  const fullMessage = config.defaultMessage
  let isFading = false

  /**
   * Update dimensions based on container size
   */
  function updateDimensions(): void {
    const rect = container.getBoundingClientRect()
    width = rect.width
    height = rect.height
    gridSize = calculateGridSize(width, config.byteCount, config.bitsPerByte)

    // Update viewBox for both SVGs
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    staticSvg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    // Recalculate grid lines
    gridLines = generateGridLines(height, gridSize)

    // Update grid mask size
    const maskRect = staticSvg.querySelector('#digital-analyzer-mask rect')
    if (maskRect !== null) {
      maskRect.setAttribute('width', String(width))
      maskRect.setAttribute('height', String(height))
    }

    // Regenerate static grid lines
    const gridGroup = staticSvg.querySelector('g')
    if (gridGroup !== null) {
      // Clear existing lines
      gridGroup.innerHTML = ''

      // Add horizontal lines
      for (const y of gridLines) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', '0')
        line.setAttribute('y1', String(y))
        line.setAttribute('x2', String(width))
        line.setAttribute('y2', String(y))
        line.setAttribute('opacity', String(config.gridOpacity))
        gridGroup.appendChild(line)
      }

      // Add vertical lines (one per bit/cell boundary, including edges)
      for (let i = 0; i <= bitCount; i += 1) {
        const x = i * gridSize
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', String(x))
        line.setAttribute('y1', '0')
        line.setAttribute('x2', String(x))
        line.setAttribute('y2', String(height))
        line.setAttribute('opacity', String(config.gridOpacity))
        gridGroup.appendChild(line)
      }
    }

    // Don't regenerate traces on resize - let scheduled traces continue with updated dimensions
    // Existing traces will fade out naturally, new ones will appear at correct scale
  }

  // Initial dimension calculation
  updateDimensions()

  // Find ASCII display elements (already in DOM from Hero.astro)
  const asciiText = document.getElementById('ascii-text')
  if (asciiText !== null) {
    asciiText.textContent = '' // Start empty, cursor is separate
  }

  // Find binary buffer element
  const binaryBuffer = document.getElementById('binary-buffer')
  if (binaryBuffer !== null) {
    binaryBuffer.textContent = '\u00A0' // Non-breaking space to maintain height
  }

  // Setup ResizeObserver to handle container size changes
  resizeObserver = new ResizeObserver(() => {
    updateDimensions()
  })
  resizeObserver.observe(container)

  /**
   * Get binary data based on data source configuration
   * Returns { binaryData, currentChunk, shouldClear } where currentChunk is the text being displayed
   */
  function getBinaryData(): { binaryData: string; currentChunk: string; shouldClear: boolean } {
    const charsPerPulse = config.byteCount // Each byte = 1 character

    switch (config.dataSource) {
      case 'config': {
        // Get chunk of message starting from current position
        const chunk = fullMessage.slice(messagePosition, messagePosition + charsPerPulse)
        const binaryData = stringToBinary(chunk).padEnd(bitCount, '0')

        // Check if we've reached the end and need to loop next time
        const shouldClear = messagePosition + charsPerPulse >= fullMessage.length

        // Advance position
        if (shouldClear) {
          messagePosition = 0 // Loop back to start
        } else {
          messagePosition += charsPerPulse
        }

        return { binaryData, currentChunk: chunk, shouldClear }
      }
      case 'prop':
        // Use custom binary data if provided (would be passed via config override)
        if (config.customBinaryData !== undefined) {
          return {
            binaryData: config.customBinaryData.slice(0, bitCount).padEnd(bitCount, '0'),
            currentChunk: '',
            shouldClear: false,
          }
        }
        // Fallback to random if no custom data
        return { binaryData: generateRandomBinary(bitCount), currentChunk: '', shouldClear: false }
      case 'random':
        return { binaryData: generateRandomBinary(bitCount), currentChunk: '', shouldClear: false }
    }
  }

  function triggerTrace(): void {
    if (activeTraces >= config.maxConcurrentTraces) return

    // Sync lightning bolt with trace
    if (lightningBolt !== null) {
      lightningBolt.style.opacity = '1'
      lightningBolt.style.transform = 'scale(1.1)'
      const isDark = document.documentElement.classList.contains('dark')
      const glowColor = getLightningGlowColor(isDark)
      lightningBolt.style.filter = `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`

      // Reset when trace finishes drawing
      const resetId = window.setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
        if (lightningBolt !== null) {
          lightningBolt.style.opacity = '0.7'
          lightningBolt.style.transform = 'scale(1)'
          lightningBolt.style.filter = 'none'
        }
      }, config.traceDrawDuration)
      timeoutIds.push(resetId)
    }

    // Select random grid line for this trace
    // Pick a baseline with room below for the signal (1 grid space tall)
    const baselineIndex =
      gridLines.length > 1 ? Math.floor(Math.random() * (gridLines.length - 1)) : 0

    // High and low positions should align with actual grid lines, 1 grid space apart
    const highY = gridLines.length > 0 ? gridLines[baselineIndex] : height / 2
    const lowY =
      gridLines.length > baselineIndex + 1 ? gridLines[baselineIndex + 1] : highY + gridSize

    // Get binary data and generate square wave path
    const { binaryData, currentChunk, shouldClear } = getBinaryData()
    const pathData = generateSquareWavePath(binaryData, highY, lowY, gridSize)

    // Update binary buffer display - reveal bits progressively as trace draws
    const binaryBuffer = document.getElementById('binary-buffer')
    if (binaryBuffer !== null) {
      binaryBuffer.textContent = '\u00A0' // Non-breaking space to maintain height

      // Reveal each bit as the trace draws it
      const msPerBit = config.traceDrawDuration / bitCount
      for (let i = 0; i < bitCount; i += 1) {
        const bit = binaryData[i]
        const revealDelay = (i + 1) * msPerBit

        const bitRevealId = window.setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
          if (binaryBuffer !== null) {
            if (i === 0) {
              binaryBuffer.textContent = bit // Replace placeholder on first bit
            } else if (i % 8 === 0) {
              // Add space after every 8 bits (byte boundary)
              binaryBuffer.textContent += ' ' + bit
            } else {
              binaryBuffer.textContent += bit
            }
          }
        }, revealDelay)
        timeoutIds.push(bitRevealId)
      }

      // Fade out binary buffer when trace fades
      const fadeBinaryId = window.setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
        if (binaryBuffer !== null) {
          binaryBuffer.style.transition = 'opacity 200ms ease-out'
          binaryBuffer.style.opacity = '0'

          // Clear to placeholder after fade completes + delay
          const clearBinaryId = window.setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
            if (binaryBuffer !== null) {
              binaryBuffer.textContent = '\u00A0' // Non-breaking space to maintain height
              binaryBuffer.style.opacity = '1'
            }
          }, 200 + config.traceClearDelay)
          timeoutIds.push(clearBinaryId)
        }
      }, config.traceDrawDuration + config.traceFadeDelay)
      timeoutIds.push(fadeBinaryId)
    }

    // Update ASCII display in collapsible - reveal one character per byte
    const asciiText = document.getElementById('ascii-text')
    if (asciiText !== null) {
      // Accumulate text for config mode, show hex for random
      if (config.dataSource === 'config' && currentChunk.length > 0) {
        // Reveal characters one at a time as each byte (8 bits) completes drawing
        const msPerByte = config.traceDrawDuration / config.byteCount

        const revealCharacter = (char: string): void => {
          accumulatedText += char
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
          if (asciiText !== null) {
            asciiText.textContent = accumulatedText
          }
        }

        for (let i = 0; i < currentChunk.length; i += 1) {
          const charToReveal = currentChunk[i]
          const revealDelay = (i + 1) * msPerByte

          const revealId = window.setTimeout(() => {
            revealCharacter(charToReveal)
          }, revealDelay)
          timeoutIds.push(revealId)
        }

        // If this was the last chunk, fade out and clear for next loop
        if (shouldClear) {
          const fadeOutDelay = config.traceDrawDuration + config.traceFadeDelay + 500
          const fadeId = window.setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
            if (asciiText !== null && !isFading) {
              isFading = true
              asciiText.style.transition = 'opacity 200ms ease-out'
              asciiText.style.opacity = '0'

              const clearId = window.setTimeout(() => {
                accumulatedText = ''
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for async callback
                if (asciiText !== null) {
                  asciiText.textContent = ''
                  asciiText.style.opacity = '1'
                }
                isFading = false
              }, 200 + config.traceClearDelay)
              timeoutIds.push(clearId)
            }
          }, fadeOutDelay)
          timeoutIds.push(fadeId)
        }
      } else if (config.dataSource === 'random') {
        // For random data, show hex representation
        let hexText = '0x'
        for (let i = 0; i < binaryData.length; i += 8) {
          const byte = binaryData.slice(i, i + 8)
          if (byte.length === 8) {
            const hexByte = parseInt(byte, 2).toString(16).padStart(2, '0').toUpperCase()
            hexText += hexByte
          }
        }
        asciiText.textContent = hexText
      }
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
    const isDark = document.documentElement.classList.contains('dark')
    const glowColor = getGlowColor(isDark, config.lineOpacity)
    pathElement.style.filter = `drop-shadow(0 0 3px ${glowColor})`
    pathElement.style.opacity = String(config.lineOpacity)

    activeTraces += 1

    // Use Web Animations API for reliable SVG stroke-dashoffset animation
    const animation = pathElement.animate(
      [{ strokeDashoffset: String(pathLength) }, { strokeDashoffset: '0' }],
      {
        duration: config.traceDrawDuration,
        easing: 'linear',
        fill: 'forwards',
      },
    )

    // Add glow when trace completes drawing
    animation.onfinish = () => {
      // Intensify glow when trace reaches the end
      const isDark = document.documentElement.classList.contains('dark')
      const glowColor = getGlowColor(isDark, 1) // Full opacity for completion glow
      pathElement.style.filter = `drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`
    }

    // Fade out after drawing (includes glow and opacity)
    const fadeId = window.setTimeout(() => {
      pathElement.style.transition = `opacity ${config.traceFadeDuration}ms ease-out, filter ${config.traceFadeDuration}ms ease-out`
      pathElement.style.opacity = '0'
      pathElement.style.filter = 'none'
    }, config.traceDrawDuration + config.traceFadeDelay)
    timeoutIds.push(fadeId)

    // Remove element and decrement counter
    const removeId = window.setTimeout(
      () => {
        pathElement.remove()
        activeTraces -= 1
      },
      config.traceDrawDuration + config.traceFadeDelay + config.traceFadeDuration + 50,
    )
    timeoutIds.push(removeId)
  }

  function scheduleTrace(): void {
    const nextDelay =
      config.traceMinInterval + Math.random() * (config.traceMaxInterval - config.traceMinInterval)
    const nextTraceId = window.setTimeout(() => {
      triggerTrace()
      scheduleTrace() // Schedule the next one
    }, nextDelay)
    timeoutIds.push(nextTraceId)
  }

  // Start first trace after initial delay, then continue scheduling
  const initialTraceId = window.setTimeout(() => {
    triggerTrace()
    scheduleTrace() // Start the scheduling loop
  }, config.traceInitialDelay)
  timeoutIds.push(initialTraceId)

  // Cleanup function
  cleanup = () => {
    // Clear all timeouts
    timeoutIds.forEach((id) => {
      clearTimeout(id)
    })
    timeoutIds.length = 0

    // Disconnect ResizeObserver
    if (resizeObserver !== null) {
      resizeObserver.disconnect()
      resizeObserver = null
    }

    // Clear SVG traces
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Runtime check needed for cleanup
    if (svg !== null) {
      svg.innerHTML = ''
    }

    // Reset lightning bolt
    if (lightningBolt !== null) {
      lightningBolt.style.opacity = ''
      lightningBolt.style.transform = ''
      lightningBolt.style.filter = ''
    }

    // Clear ASCII text content (don't remove elements, they're part of Hero)
    const asciiText = document.getElementById('ascii-text')
    if (asciiText !== null) {
      asciiText.textContent = ''
      asciiText.style.opacity = '1'
      asciiText.style.transition = ''
    }

    // Clear binary buffer
    const binaryBuffer = document.getElementById('binary-buffer')
    if (binaryBuffer !== null) {
      binaryBuffer.textContent = '\u00A0' // Non-breaking space to maintain height
      binaryBuffer.style.opacity = '1'
      binaryBuffer.style.transition = ''
    }

    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupDigitalAnalyzer(): void {
  initializeDigitalAnalyzer()

  document.addEventListener('astro:page-load', initializeDigitalAnalyzer)

  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
