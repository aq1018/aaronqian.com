/**
 * Creates small angle mark arcs at origin (geometric angle notation)
 */

interface AngleMarksOptions {
  width: number
  height: number
  angleLineCount: number
  minorInterval: number
  angleMarkRadius: number
  opacity: number
  strokeWidth: number
}

export function createAngleMarks(options: AngleMarksOptions): SVGPathElement[] {
  const { width, height, angleLineCount, minorInterval, angleMarkRadius, opacity, strokeWidth } =
    options
  const marks: SVGPathElement[] = []
  const centerX = width / 2
  const bottomY = height
  const angleMarkArcRadius = angleMarkRadius * minorInterval

  // Calculate angles (30° to 150°, evenly distributed)
  const startAngle = 30
  const endAngle = 150
  const angleRange = endAngle - startAngle
  const angles = Array.from(
    { length: angleLineCount },
    (_, i) => startAngle + (i * angleRange) / (angleLineCount - 1),
  )

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
    rightArc.setAttribute('opacity', String(opacity))
    rightArc.setAttribute('stroke-width', String(strokeWidth))
    marks.push(rightArc)

    // Left arc: from last angle line to x-axis (180°)
    const leftArc = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const leftStartX = centerX + angleMarkArcRadius * Math.cos((lastAngle * Math.PI) / 180)
    const leftStartY = bottomY - angleMarkArcRadius * Math.sin((lastAngle * Math.PI) / 180)
    const leftEndX = centerX - angleMarkArcRadius
    const leftEndY = bottomY
    const leftD = `M ${leftStartX} ${leftStartY} A ${angleMarkArcRadius} ${angleMarkArcRadius} 0 0 0 ${leftEndX} ${leftEndY}`
    leftArc.setAttribute('d', leftD)
    leftArc.setAttribute('opacity', String(opacity))
    leftArc.setAttribute('stroke-width', String(strokeWidth))
    marks.push(leftArc)
  }

  return marks
}
