/**
 * Creates X and Y coordinate axes
 */

export function createAxes(
  width: number,
  height: number,
  opacity: number,
  strokeWidth: number,
): SVGLineElement[] {
  const centerX = width / 2
  const bottomY = height

  // X-axis: horizontal line at bottom
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  xAxis.setAttribute('x1', '0')
  xAxis.setAttribute('y1', String(bottomY))
  xAxis.setAttribute('x2', String(width))
  xAxis.setAttribute('y2', String(bottomY))
  xAxis.setAttribute('opacity', String(opacity))
  xAxis.setAttribute('stroke-width', String(strokeWidth))

  // Y-axis: vertical line at center
  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  yAxis.setAttribute('x1', String(centerX))
  yAxis.setAttribute('y1', '0')
  yAxis.setAttribute('x2', String(centerX))
  yAxis.setAttribute('y2', String(bottomY))
  yAxis.setAttribute('opacity', String(opacity))
  yAxis.setAttribute('stroke-width', String(strokeWidth))

  return [xAxis, yAxis]
}
