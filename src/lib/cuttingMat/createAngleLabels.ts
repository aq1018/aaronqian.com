/**
 * Creates angle degree labels with background halos
 */

interface AngleLabelsOptions {
  width: number
  height: number
  angleLineCount: number
  angleLabelArcIndex: number
  majorLineInterval: number
  labelOpacity: number
}

export function createAngleLabels(options: AngleLabelsOptions): SVGTextElement[] {
  const { width, height, angleLineCount, angleLabelArcIndex, majorLineInterval, labelOpacity } =
    options
  const labels: SVGTextElement[] = []
  const centerX = width / 2
  const bottomY = height

  // Detect dark mode for label background color
  const isDark = document.documentElement.classList.contains('dark')
  const bgColor = isDark ? 'oklch(0.08 0 0)' : 'oklch(0.99 0 0)'

  // Calculate angles (30° to 150°, evenly distributed)
  const startAngle = 30
  const endAngle = 150
  const angleRange = endAngle - startAngle
  const angles = Array.from(
    { length: angleLineCount },
    (_, i) => startAngle + (i * angleRange) / (angleLineCount - 1),
  )

  // Calculate label distance (above the specified arc)
  const arcRadiusInterval = 1 // default from original code
  const arcRadius = (angleLabelArcIndex + 1) * arcRadiusInterval * majorLineInterval
  const labelOffset = 20 // pixels above the arc
  const labelDistance = arcRadius + labelOffset

  angles.forEach((angle) => {
    const radians = (angle * Math.PI) / 180
    const labelX = centerX + labelDistance * Math.cos(radians)
    const labelY = bottomY - labelDistance * Math.sin(radians)

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
    labels.push(textBg)

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
    labels.push(text)
  })

  return labels
}
