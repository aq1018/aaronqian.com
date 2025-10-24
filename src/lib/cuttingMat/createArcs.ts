/**
 * Creates half circles (semicircles) at bottom center origin
 */

interface ArcsOptions {
  width: number
  height: number
  arcCount: number
  arcRadiusInterval: number
  majorLineInterval: number
  opacity: number
  strokeWidth: number
}

export function createArcs(options: ArcsOptions): SVGPathElement[] {
  const { width, height, arcCount, arcRadiusInterval, majorLineInterval, opacity, strokeWidth } =
    options
  const arcs: SVGPathElement[] = []
  const centerX = width / 2
  const bottomY = height

  // Calculate radii for all arcs
  const circleRadii = Array.from(
    { length: arcCount },
    (_, i) => (i + 1) * arcRadiusInterval * majorLineInterval,
  )

  circleRadii.forEach((radius) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    // SVG path for semicircle (top half): start at left, arc to right
    const d = `M ${centerX - radius} ${bottomY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${bottomY}`
    path.setAttribute('d', d)
    path.setAttribute('opacity', String(opacity))
    path.setAttribute('stroke-width', String(strokeWidth))
    arcs.push(path)
  })

  return arcs
}
