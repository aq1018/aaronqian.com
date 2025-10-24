/* eslint-disable max-lines -- SVG generation requires extensive drawing logic */
/**
 * Cutting mat background manager
 * Handles technical grid setup and optional measurement overlays
 * Follows same cleanup pattern as powerGrid for Astro View Transitions
 */

type CleanupFunction = () => void

interface CuttingMatOptions {
  majorLineInterval?: number
  majorMinorRatio?: number
  arcCount?: number
  arcRadiusInterval?: number
  angleLineCount?: number
  angleLabelArcIndex?: number
  showTeeth?: boolean
  angleMarkRadius?: number
  majorOpacity?: number
  minorOpacity?: number
  labelOpacity?: number
  majorStrokeWidth?: number
  minorStrokeWidth?: number
}

const defaultOptions: Required<CuttingMatOptions> = {
  majorLineInterval: 200,
  majorMinorRatio: 5,
  arcCount: 3,
  arcRadiusInterval: 1,
  angleLineCount: 5,
  angleLabelArcIndex: -1,
  showTeeth: true,
  angleMarkRadius: 1.5,
  majorOpacity: 0.175,
  minorOpacity: 0.12,
  labelOpacity: 0.175,
  majorStrokeWidth: 1.5,
  minorStrokeWidth: 1,
}

let cleanup: CleanupFunction | null = null

/**
 * Create SVG overlays for cutting mat (diagonal angle guides)
 */
function createCuttingMatOverlays(
  container: HTMLElement,
  options: Required<CuttingMatOptions>,
): SVGSVGElement {
  const {
    majorLineInterval,
    majorMinorRatio,
    arcCount,
    arcRadiusInterval,
    angleLineCount,
    angleLabelArcIndex,
    showTeeth,
    angleMarkRadius,
    majorOpacity,
    minorOpacity,
    labelOpacity,
    majorStrokeWidth,
    minorStrokeWidth,
  } = options

  // Use fixed large dimensions for CSS scaling
  const width = 4000
  const height = 4000

  // Create SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute(
    'style',
    'position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);',
  )
  svg.classList.add('cutting-mat-overlays')

  // Detect dark mode for label background color
  const isDark = document.documentElement.classList.contains('dark')

  // Create gradient mask for side fade effect
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
  mask.setAttribute('id', 'fade-mask')

  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
  gradient.setAttribute('id', 'fade-gradient')
  gradient.setAttribute('x1', '0%')
  gradient.setAttribute('x2', '100%')
  gradient.setAttribute('y1', '0%')
  gradient.setAttribute('y2', '0%')

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop1.setAttribute('offset', '0%')
  stop1.setAttribute('stop-color', 'white')
  stop1.setAttribute('stop-opacity', '0')

  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop2.setAttribute('offset', '20%')
  stop2.setAttribute('stop-color', 'white')
  stop2.setAttribute('stop-opacity', '1')

  const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop3.setAttribute('offset', '80%')
  stop3.setAttribute('stop-color', 'white')
  stop3.setAttribute('stop-opacity', '1')

  const stop4 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop4.setAttribute('offset', '100%')
  stop4.setAttribute('stop-color', 'white')
  stop4.setAttribute('stop-opacity', '0')

  gradient.appendChild(stop1)
  gradient.appendChild(stop2)
  gradient.appendChild(stop3)
  gradient.appendChild(stop4)

  const maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  maskRect.setAttribute('x', '0')
  maskRect.setAttribute('y', '0')
  maskRect.setAttribute('width', String(width))
  maskRect.setAttribute('height', String(height))
  maskRect.setAttribute('fill', 'url(#fade-gradient)')

  mask.appendChild(maskRect)
  defs.appendChild(gradient)
  defs.appendChild(mask)
  svg.appendChild(defs)

  // Create group for all elements
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('stroke', 'currentColor')
  g.setAttribute('fill', 'none')
  g.setAttribute('stroke-width', '1')
  g.setAttribute('mask', 'url(#fade-mask)')

  // Add coordinate axes
  const centerX = width / 2
  const bottomY = height
  const lineLength = Math.max(width, height) * 0.5

  // X-axis: horizontal line at bottom
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  xAxis.setAttribute('x1', String(0))
  xAxis.setAttribute('y1', String(bottomY))
  xAxis.setAttribute('x2', String(width))
  xAxis.setAttribute('y2', String(bottomY))
  xAxis.setAttribute('opacity', String(majorOpacity))
  xAxis.setAttribute('stroke-width', String(majorStrokeWidth))
  g.appendChild(xAxis)

  // Calculate minor interval for vertical gridlines
  const minorInterval = majorLineInterval / majorMinorRatio

  // Add "teeth" marks on x-axis for ruler alignment (optional)
  if (showTeeth) {
    // Spacing at half the minor line interval
    const toothInterval = minorInterval / 2
    const toothHeight = 8 // pixels upward from x-axis

    for (let x = centerX % toothInterval; x < width; x += toothInterval) {
      const tooth = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      tooth.setAttribute('x1', String(x))
      tooth.setAttribute('y1', String(bottomY))
      tooth.setAttribute('x2', String(x))
      tooth.setAttribute('y2', String(bottomY - toothHeight))
      tooth.setAttribute('opacity', String(majorOpacity))
      tooth.setAttribute('stroke-width', String(minorStrokeWidth))
      g.appendChild(tooth)
    }
  }

  // Y-axis: vertical line at center
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  yAxis.setAttribute('x1', String(centerX))
  yAxis.setAttribute('y1', String(0))
  yAxis.setAttribute('x2', String(centerX))
  yAxis.setAttribute('y2', String(bottomY))
  yAxis.setAttribute('opacity', String(majorOpacity))
  yAxis.setAttribute('stroke-width', String(majorStrokeWidth))
  g.appendChild(yAxis)

  // Add vertical gridlines from y-axis
  // minorInterval already calculated above for teeth marks

  // Draw all vertical lines (minor + major) from y-axis
  for (let offset = minorInterval; offset < width / 2; offset += minorInterval) {
    const isMajor = offset % majorLineInterval === 0
    const strokeWidth = isMajor ? majorStrokeWidth : minorStrokeWidth
    const opacity = isMajor ? majorOpacity : minorOpacity

    // Right side
    const rightLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    rightLine.setAttribute('x1', String(centerX + offset))
    rightLine.setAttribute('y1', String(0))
    rightLine.setAttribute('x2', String(centerX + offset))
    rightLine.setAttribute('y2', String(bottomY))
    rightLine.setAttribute('opacity', String(opacity))
    rightLine.setAttribute('stroke-width', String(strokeWidth))
    g.appendChild(rightLine)

    // Left side
    const leftLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    leftLine.setAttribute('x1', String(centerX - offset))
    leftLine.setAttribute('y1', String(0))
    leftLine.setAttribute('x2', String(centerX - offset))
    leftLine.setAttribute('y2', String(bottomY))
    leftLine.setAttribute('opacity', String(opacity))
    leftLine.setAttribute('stroke-width', String(strokeWidth))
    g.appendChild(leftLine)
  }

  // Add horizontal gridlines from bottom
  // Draw all horizontal lines (minor + major) aligned to bottom
  for (let offset = minorInterval; offset < height; offset += minorInterval) {
    const isMajor = offset % majorLineInterval === 0
    const strokeWidth = isMajor ? majorStrokeWidth : minorStrokeWidth
    const opacity = isMajor ? majorOpacity : minorOpacity

    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    hLine.setAttribute('x1', String(0))
    hLine.setAttribute('y1', String(bottomY - offset))
    hLine.setAttribute('x2', String(width))
    hLine.setAttribute('y2', String(bottomY - offset))
    hLine.setAttribute('opacity', String(opacity))
    hLine.setAttribute('stroke-width', String(strokeWidth))
    g.appendChild(hLine)
  }

  // Add half circles with origin at xy-axis origin (bottom center)
  const circleRadii = Array.from(
    { length: arcCount },
    (_, i) => (i + 1) * arcRadiusInterval * majorLineInterval,
  )
  circleRadii.forEach((radius) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // SVG path for semicircle (top half): start at left, arc to right
    const d = `M ${centerX - radius} ${bottomY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${bottomY}`
    path.setAttribute('d', d)
    path.setAttribute('opacity', String(majorOpacity))
    path.setAttribute('stroke-width', String(majorStrokeWidth))
    g.appendChild(path)
  })

  // Add diagonal angle lines from origin (bottom center)
  // 0° = pointing right along x-axis (not drawn, just reference)
  // Angles measured counter-clockwise from positive x-axis
  // Evenly distribute angles from 30° to 150° (avoiding extremes near x-axis)
  const startAngle = 30
  const endAngle = 150
  const angleRange = endAngle - startAngle
  const angles = Array.from(
    { length: angleLineCount },
    (_, i) => startAngle + (i * angleRange) / (angleLineCount - 1),
  )

  // Calculate label distance based on specified arc index
  // Add offset to place labels above/outside the arc to avoid overlap
  const arcRadius = (angleLabelArcIndex + 1) * arcRadiusInterval * majorLineInterval
  const labelOffset = 20 // pixels above the arc
  const labelDistance = arcRadius + labelOffset

  angles.forEach((angle) => {
    // Convert to radians (0° = right, 90° = up, etc.)
    const radians = (angle * Math.PI) / 180
    const endX = centerX + lineLength * Math.cos(radians)
    const endY = bottomY - lineLength * Math.sin(radians)

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', String(centerX))
    line.setAttribute('y1', String(bottomY))
    line.setAttribute('x2', String(endX))
    line.setAttribute('y2', String(endY))
    line.setAttribute('opacity', String(majorOpacity))
    line.setAttribute('stroke-width', String(majorStrokeWidth))
    g.appendChild(line)

    // Add angle label above the specified arc to avoid overlap
    const labelX = centerX + labelDistance * Math.cos(radians)
    const labelY = bottomY - labelDistance * Math.sin(radians)

    // Background color for label halo (matches surface color)
    const bgColor = isDark ? 'oklch(0.08 0 0)' : 'oklch(0.99 0 0)'

    // Add text background/halo to hide line behind label
    const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textBg.setAttribute('x', String(labelX))
    textBg.setAttribute('y', String(labelY))
    textBg.setAttribute('fill', bgColor)
    textBg.setAttribute('stroke', bgColor)
    textBg.setAttribute('stroke-width', '6')
    textBg.setAttribute('font-size', '14')
    textBg.setAttribute('font-family', 'monospace')
    textBg.setAttribute('font-weight', '300')
    textBg.setAttribute('text-anchor', 'middle')
    textBg.setAttribute('dominant-baseline', 'middle')
    textBg.setAttribute('paint-order', 'stroke')
    textBg.textContent = `${Math.round(angle)}°`
    g.appendChild(textBg)

    // Add text foreground (using currentColor)
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', String(labelX))
    text.setAttribute('y', String(labelY))
    text.setAttribute('fill', 'currentColor')
    text.setAttribute('font-size', '14')
    text.setAttribute('font-family', 'monospace')
    text.setAttribute('font-weight', '300')
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('dominant-baseline', 'middle')
    text.setAttribute('opacity', String(labelOpacity))
    text.textContent = `${Math.round(angle)}°`
    g.appendChild(text)
  })

  // Add small angle mark arcs at origin (geometric angle notation)
  const angleMarkArcRadius = angleMarkRadius * minorInterval

  if (angles.length > 0) {
    const firstAngle = angles[0]
    const lastAngle = angles[angles.length - 1]

    // Right arc: from x-axis (0°) to first angle line
    const rightArc = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const rightStartX = centerX + angleMarkArcRadius
    const rightStartY = bottomY
    const rightEndX = centerX + angleMarkArcRadius * Math.cos((firstAngle * Math.PI) / 180)
    const rightEndY = bottomY - angleMarkArcRadius * Math.sin((firstAngle * Math.PI) / 180)
    const rightD = `M ${rightStartX} ${rightStartY} A ${angleMarkArcRadius} ${angleMarkArcRadius} 0 0 0 ${rightEndX} ${rightEndY}`
    rightArc.setAttribute('d', rightD)
    rightArc.setAttribute('opacity', String(majorOpacity))
    rightArc.setAttribute('stroke-width', String(majorStrokeWidth))
    g.appendChild(rightArc)

    // Left arc: from last angle line to x-axis (180°)
    const leftArc = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const leftStartX = centerX + angleMarkArcRadius * Math.cos((lastAngle * Math.PI) / 180)
    const leftStartY = bottomY - angleMarkArcRadius * Math.sin((lastAngle * Math.PI) / 180)
    const leftEndX = centerX - angleMarkArcRadius
    const leftEndY = bottomY
    const leftD = `M ${leftStartX} ${leftStartY} A ${angleMarkArcRadius} ${angleMarkArcRadius} 0 0 0 ${leftEndX} ${leftEndY}`
    leftArc.setAttribute('d', leftD)
    leftArc.setAttribute('opacity', String(majorOpacity))
    leftArc.setAttribute('stroke-width', String(majorStrokeWidth))
    g.appendChild(leftArc)
  }

  svg.appendChild(g)
  return svg
}

/**
 * Initialize cutting mat behavior
 * Sets up technical grid and optional interactive elements
 * @param options - Configuration options for the cutting mat
 * @param options.majorLineInterval - Distance between major gridlines in pixels (default: 200)
 * @param options.majorMinorRatio - Ratio of major to minor line intervals (default: 5)
 * @param options.arcCount - Number of half circles to draw (default: 3)
 * @param options.arcRadiusInterval - Spacing between arcs in major line intervals (default: 1)
 * @param options.angleLineCount - Number of diagonal angle lines to draw (default: 5)
 * @param options.angleLabelArcIndex - Which arc to place angle labels on, 0-indexed (default: -1 for last arc)
 * @param options.showTeeth - Whether to show ruler teeth marks on x-axis (default: true)
 * @param options.angleMarkRadius - Radius of angle mark arcs in minor intervals (default: 1.5)
 * @param options.majorOpacity - Opacity of major lines (default: 0.175)
 * @param options.minorOpacity - Opacity of minor lines (default: 0.12)
 * @param options.labelOpacity - Opacity of angle labels (default: 0.175)
 * @param options.majorStrokeWidth - Stroke width of major lines in pixels (default: 1.5)
 * @param options.minorStrokeWidth - Stroke width of minor lines in pixels (default: 1)
 */
export function initializeCuttingMat(options: CuttingMatOptions = {}): CleanupFunction {
  // Merge with defaults
  const config = { ...defaultOptions, ...options }

  // Clean up previous initialization
  if (cleanup !== null) {
    cleanup()
  }

  const cuttingMat = document.querySelector<HTMLElement>('[data-cutting-mat]')

  if (cuttingMat === null) {
    cleanup = () => {}
    return cleanup
  }

  // Use last arc if angleLabelArcIndex is -1
  const labelArcIndex =
    config.angleLabelArcIndex === -1 ? config.arcCount - 1 : config.angleLabelArcIndex
  const finalConfig = { ...config, angleLabelArcIndex: labelArcIndex }

  // Create and append SVG overlays
  const svg = createCuttingMatOverlays(cuttingMat, finalConfig)
  cuttingMat.appendChild(svg)

  cleanup = () => {
    // Remove SVG overlays on cleanup
    svg.remove()
  }

  return cleanup
}

/**
 * Main setup function for cutting mat
 * Call this from page/component script tags
 * @param options - Configuration options for the cutting mat
 * @param options.majorLineInterval - Distance between major gridlines in pixels (default: 200)
 * @param options.majorMinorRatio - Ratio of major to minor line intervals (default: 5)
 * @param options.arcCount - Number of half circles to draw (default: 3)
 * @param options.arcRadiusInterval - Spacing between arcs in major line intervals (default: 1)
 * @param options.angleLineCount - Number of diagonal angle lines to draw (default: 5)
 * @param options.angleLabelArcIndex - Which arc to place angle labels on, 0-indexed (default: -1 for last arc)
 * @param options.showTeeth - Whether to show ruler teeth marks on x-axis (default: true)
 * @param options.angleMarkRadius - Radius of angle mark arcs in minor intervals (default: 1.5)
 * @param options.majorOpacity - Opacity of major lines (default: 0.175)
 * @param options.minorOpacity - Opacity of minor lines (default: 0.12)
 * @param options.labelOpacity - Opacity of angle labels (default: 0.175)
 * @param options.majorStrokeWidth - Stroke width of major lines in pixels (default: 1.5)
 * @param options.minorStrokeWidth - Stroke width of minor lines in pixels (default: 1)
 */
export function setupCuttingMat(options: CuttingMatOptions = {}): void {
  const cleanupFn = initializeCuttingMat(options)

  // Handle Astro View Transitions cleanup
  document.addEventListener('astro:before-preparation', cleanupFn, { once: true })
  document.addEventListener('astro:after-swap', () => {
    setupCuttingMat(options)
  })
}
