/**
 * Centralized power grid manager
 * Handles electricity traces and lightning bolt synchronization
 * Properly cleans up on navigation for Astro View Transitions
 */

/* eslint-disable max-lines -- Power grid manager requires more than 200 lines for complete functionality */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize power grid behavior
 * Creates SVG electricity traces that pulse across the grid
 */
export function initializePowerGrid(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  const hero = document.querySelector<HTMLElement>('[data-power-grid]')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- SVG element requires double cast for proper typing
  const svg = document.getElementById('power-svg') as unknown as SVGSVGElement | null
  const lightningBolt = document.querySelector<HTMLElement>('[data-lightning-bolt]')

  // Early return if required elements don't exist
  if (hero === null || svg === null) {
    cleanup = () => {}
    return cleanup
  }

  const width = hero.offsetWidth
  const height = hero.offsetHeight
  const gridSize = 80

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  let activePulses = 0
  const maxConcurrentPulses = 2
  const timeoutIds: number[] = []

  // Generate horizontal grid line positions
  const gridLines: number[] = []
  for (let y = gridSize; y < height - gridSize; y += gridSize) {
    gridLines.push(y)
  }

  function generateElectricPath(): string {
    const path: string[] = []
    let currentY = gridLines[Math.floor(Math.random() * gridLines.length)]
    let currentX = 0

    path.push(`M 0 ${currentY}`) // Start from left edge

    // Move across the screen, occasionally jumping to adjacent lines
    while (currentX < width) {
      // Move horizontally 80-240px
      const horizontalStep = gridSize + Math.random() * gridSize * 2
      currentX += horizontalStep

      if (currentX >= width) {
        // End at right edge
        path.push(`L ${width} ${currentY}`)
        break
      }

      // Sometimes jump to adjacent line (30% chance)
      if (Math.random() < 0.3 && gridLines.length > 1) {
        // Find current line index
        const currentIndex = gridLines.indexOf(currentY)
        const canGoUp = currentIndex > 0
        const canGoDown = currentIndex < gridLines.length - 1

        let newY = currentY

        if (canGoUp && canGoDown) {
          // Randomly go up or down
          newY = Math.random() > 0.5 ? gridLines[currentIndex - 1] : gridLines[currentIndex + 1]
        } else if (canGoUp) {
          newY = gridLines[currentIndex - 1]
        } else if (canGoDown) {
          newY = gridLines[currentIndex + 1]
        }

        // Draw horizontal to jump point, then vertical, then continue
        path.push(`L ${currentX} ${currentY}`) // horizontal
        path.push(`L ${currentX} ${newY}`) // vertical jump
        currentY = newY
      } else {
        // Just continue horizontally
        path.push(`L ${currentX} ${currentY}`)
      }
    }

    return path.join(' ')
  }

  function triggerPulse(): void {
    if (activePulses >= maxConcurrentPulses) return

    // Supercharge the lightning bolt in sync with the pulse
    if (lightningBolt !== null) {
      lightningBolt.style.opacity = '1'
      lightningBolt.style.transform = 'scale(1.1)'
      // Add dramatic glow - supercharged effect
      const isDark = document.documentElement.classList.contains('dark')
      const glowColor = isDark ? 'rgba(0, 224, 255, 1)' : 'rgba(218, 165, 32, 1)'
      lightningBolt.style.filter = `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`

      const resetId = window.setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Guard against runtime edge cases
        if (lightningBolt !== null) {
          lightningBolt.style.opacity = '0.7'
          lightningBolt.style.transform = 'scale(1)'
          lightningBolt.style.filter = 'none'
        }
      }, 400)
      timeoutIds.push(resetId)
    }

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const pathData = generateElectricPath()

    pathElement.setAttribute('d', pathData)
    pathElement.setAttribute('stroke', 'currentColor')
    pathElement.setAttribute('stroke-width', '2')
    pathElement.classList.add('text-accent')
    pathElement.setAttribute('fill', 'none')
    pathElement.setAttribute('stroke-linecap', 'round')
    pathElement.setAttribute('stroke-linejoin', 'round')

    // Calculate path length for drawing animation
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- SVG is guaranteed to exist after null check at function start
    svg!.appendChild(pathElement)
    const pathLength = pathElement.getTotalLength()

    // Start with path hidden
    pathElement.style.strokeDasharray = `${pathLength} ${pathLength}`
    pathElement.style.strokeDashoffset = String(pathLength)
    // Use CSS variable for glow color
    const isDark = document.documentElement.classList.contains('dark')
    const glowColor = isDark ? 'rgba(0, 224, 255, 0.3)' : 'rgba(87, 146, 250, 0.3)'
    pathElement.style.filter = `drop-shadow(0 0 3px ${glowColor})`
    pathElement.style.opacity = '0.3'

    activePulses += 1

    // Draw the path from left to right (reveal it) - FAST!
    requestAnimationFrame(() => {
      pathElement.style.transition = `stroke-dashoffset 0.4s linear`
      pathElement.style.strokeDashoffset = '0'
    })

    // Keep it visible briefly, then fade entire trace
    const fadeId = window.setTimeout(() => {
      pathElement.style.transition = 'opacity 0.2s ease-out'
      pathElement.style.opacity = '0'
    }, 450)
    timeoutIds.push(fadeId)

    // Remove after fade
    const removeId = window.setTimeout(() => {
      pathElement.remove()
      activePulses -= 1
    }, 700)
    timeoutIds.push(removeId)
  }

  // Trigger pulses occasionally
  function schedulePulse(): void {
    triggerPulse()
    // Wait 3-8 seconds before next pulse
    const nextPulseId = window.setTimeout(schedulePulse, 3000 + Math.random() * 5000)
    timeoutIds.push(nextPulseId)
  }

  // Start after initial delay
  const initialPulseId = window.setTimeout(schedulePulse, 2000)
  timeoutIds.push(initialPulseId)

  // Rebuild power lines on resize (debounced)
  let resizeTimeout: number | null = null
  const handleResize = (): void => {
    if (resizeTimeout !== null) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Guard against runtime edge cases
      if (svg !== null) {
        svg.innerHTML = ''
        // Re-initialize would require extracting more state
        // For now, just clear the SVG
      }
    }, 500)
  }

  window.addEventListener('resize', handleResize)

  // Return cleanup function
  cleanup = () => {
    // Clear all timeouts
    timeoutIds.forEach((id) => {
      clearTimeout(id)
    })
    timeoutIds.length = 0

    // Clear resize timeout
    if (resizeTimeout !== null) {
      clearTimeout(resizeTimeout)
    }

    // Remove resize listener
    window.removeEventListener('resize', handleResize)

    // Clear SVG
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Guard against runtime edge cases
    if (svg !== null) {
      svg.innerHTML = ''
    }

    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupPowerGrid(): void {
  initializePowerGrid()

  // Re-initialize on page load (for View Transitions)
  document.addEventListener('astro:page-load', initializePowerGrid)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
