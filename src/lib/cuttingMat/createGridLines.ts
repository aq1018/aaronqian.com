/**
 * Creates horizontal and vertical grid lines
 */

interface GridLinesOptions {
  width: number
  height: number
  majorLineInterval: number
  minorInterval: number
  majorOpacity: number
  minorOpacity: number
  majorStrokeWidth: number
  minorStrokeWidth: number
}

export function createGridLines(options: GridLinesOptions): SVGLineElement[] {
  const {
    width,
    height,
    majorLineInterval,
    minorInterval,
    majorOpacity,
    minorOpacity,
    majorStrokeWidth,
    minorStrokeWidth,
  } = options
  const lines: SVGLineElement[] = []
  const centerX = width / 2
  const bottomY = height

  // Add vertical gridlines from y-axis (center) outward
  for (let offset = minorInterval; offset < width / 2; offset += minorInterval) {
    const isMajor = offset % majorLineInterval === 0
    const strokeWidth = isMajor ? majorStrokeWidth : minorStrokeWidth
    const opacity = isMajor ? majorOpacity : minorOpacity

    // Right side
    const rightLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    rightLine.setAttribute('x1', String(centerX + offset))
    rightLine.setAttribute('y1', '0')
    rightLine.setAttribute('x2', String(centerX + offset))
    rightLine.setAttribute('y2', String(bottomY))
    rightLine.setAttribute('opacity', String(opacity))
    rightLine.setAttribute('stroke-width', String(strokeWidth))
    lines.push(rightLine)

    // Left side
    const leftLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    leftLine.setAttribute('x1', String(centerX - offset))
    leftLine.setAttribute('y1', '0')
    leftLine.setAttribute('x2', String(centerX - offset))
    leftLine.setAttribute('y2', String(bottomY))
    leftLine.setAttribute('opacity', String(opacity))
    leftLine.setAttribute('stroke-width', String(strokeWidth))
    lines.push(leftLine)
  }

  // Add horizontal gridlines from bottom upward
  for (let offset = minorInterval; offset < height; offset += minorInterval) {
    const isMajor = offset % majorLineInterval === 0
    const strokeWidth = isMajor ? majorStrokeWidth : minorStrokeWidth
    const opacity = isMajor ? majorOpacity : minorOpacity

    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    hLine.setAttribute('x1', '0')
    hLine.setAttribute('y1', String(bottomY - offset))
    hLine.setAttribute('x2', String(width))
    hLine.setAttribute('y2', String(bottomY - offset))
    hLine.setAttribute('opacity', String(opacity))
    hLine.setAttribute('stroke-width', String(strokeWidth))
    lines.push(hLine)
  }

  return lines
}
