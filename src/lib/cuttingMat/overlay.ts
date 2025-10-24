/**
 * Main SVG overlay orchestration
 * Combines all cutting mat elements into a single SVG
 */

import { createAngleLabels } from './createAngleLabels'
import { createAngleLines } from './createAngleLines'
import { createAngleMarks } from './createAngleMarks'
import { createArcs } from './createArcs'
import { createAxes } from './createAxes'
import { createGradientMask } from './createGradientMask'
import { createGridLines } from './createGridLines'
import { createTeethMarks } from './createTeethMarks'
import type { CuttingMatOptions } from './types'

export function createCuttingMatOverlays(
  _container: HTMLElement,
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

  // Add gradient mask
  const defs = createGradientMask(width, height)
  svg.appendChild(defs)

  // Create main group with mask
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.setAttribute('stroke', 'currentColor')
  g.setAttribute('fill', 'none')
  g.setAttribute('stroke-width', '1')
  g.setAttribute('mask', 'url(#fade-mask)')

  // Calculate minor interval
  const minorInterval = majorLineInterval / majorMinorRatio

  // Add coordinate axes
  const axes = createAxes(width, height, majorOpacity, majorStrokeWidth)
  axes.forEach((axis) => {
    g.appendChild(axis)
  })

  // Add teeth marks on x-axis (optional)
  if (showTeeth) {
    const teeth = createTeethMarks({
      width,
      height,
      minorInterval,
      opacity: majorOpacity,
      strokeWidth: minorStrokeWidth,
    })
    teeth.forEach((tooth) => {
      g.appendChild(tooth)
    })
  }

  // Add vertical and horizontal grid lines
  const gridLines = createGridLines({
    width,
    height,
    majorLineInterval,
    minorInterval,
    majorOpacity,
    minorOpacity,
    majorStrokeWidth,
    minorStrokeWidth,
  })
  gridLines.forEach((line) => {
    g.appendChild(line)
  })

  // Add half circles at origin
  const arcs = createArcs({
    width,
    height,
    arcCount,
    arcRadiusInterval,
    majorLineInterval,
    opacity: majorOpacity,
    strokeWidth: majorStrokeWidth,
  })
  arcs.forEach((arc) => {
    g.appendChild(arc)
  })

  // Add diagonal angle lines
  const angleLines = createAngleLines({
    width,
    height,
    angleLineCount,
    opacity: majorOpacity,
    strokeWidth: majorStrokeWidth,
  })
  angleLines.forEach((line) => {
    g.appendChild(line)
  })

  // Add angle labels
  const angleLabels = createAngleLabels({
    width,
    height,
    angleLineCount,
    angleLabelArcIndex,
    majorLineInterval,
    labelOpacity,
  })
  angleLabels.forEach((label) => {
    g.appendChild(label)
  })

  // Add angle mark arcs
  const angleMarks = createAngleMarks({
    width,
    height,
    angleLineCount,
    minorInterval,
    angleMarkRadius,
    opacity: majorOpacity,
    strokeWidth: majorStrokeWidth,
  })
  angleMarks.forEach((mark) => {
    g.appendChild(mark)
  })

  svg.appendChild(g)
  return svg
}
