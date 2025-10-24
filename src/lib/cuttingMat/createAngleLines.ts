/**
 * Creates diagonal angle guide lines from bottom center origin
 */

interface AngleLinesOptions {
  width: number
  height: number
  angleLineCount: number
  opacity: number
  strokeWidth: number
}

export function createAngleLines(options: AngleLinesOptions): SVGLineElement[] {
  const { width, height, angleLineCount, opacity, strokeWidth } = options
  const lines: SVGLineElement[] = []
  const centerX = width / 2
  const bottomY = height
  const lineLength = Math.max(width, height) * 0.5

  // Evenly distribute angles from 30° to 150° (avoiding extremes near x-axis)
  const startAngle = 30
  const endAngle = 150
  const angleRange = endAngle - startAngle
  const angles = Array.from(
    { length: angleLineCount },
    (_, i) => startAngle + (i * angleRange) / (angleLineCount - 1),
  )

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
    line.setAttribute('opacity', String(opacity))
    line.setAttribute('stroke-width', String(strokeWidth))
    lines.push(line)
  })

  return lines
}
