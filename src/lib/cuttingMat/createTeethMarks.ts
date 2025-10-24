/**
 * Creates ruler teeth marks on the x-axis
 */

interface TeethMarksOptions {
  width: number
  height: number
  minorInterval: number
  opacity: number
  strokeWidth: number
}

export function createTeethMarks(options: TeethMarksOptions): SVGLineElement[] {
  const { width, height, minorInterval, opacity, strokeWidth } = options
  const teeth: SVGLineElement[] = []
  const centerX = width / 2
  const bottomY = height
  const toothInterval = minorInterval / 2
  const toothHeight = 8 // pixels upward from x-axis

  for (let x = centerX % toothInterval; x < width; x += toothInterval) {
    const tooth = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    tooth.setAttribute('x1', String(x))
    tooth.setAttribute('y1', String(bottomY))
    tooth.setAttribute('x2', String(x))
    tooth.setAttribute('y2', String(bottomY - toothHeight))
    tooth.setAttribute('opacity', String(opacity))
    tooth.setAttribute('stroke-width', String(strokeWidth))
    teeth.push(tooth)
  }

  return teeth
}
