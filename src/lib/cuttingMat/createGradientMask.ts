/**
 * Creates gradient mask for side fade effect
 */

export function createGradientMask(width: number, height: number): SVGDefsElement {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

  // Create linear gradient (horizontal fade from sides)
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
  gradient.setAttribute('id', 'fade-gradient')
  gradient.setAttribute('x1', '0%')
  gradient.setAttribute('x2', '100%')
  gradient.setAttribute('y1', '0%')
  gradient.setAttribute('y2', '0%')

  // Gradient stops: fade from edges (0% opacity) to center (100% opacity)
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

  // Create mask that uses the gradient
  const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask')
  mask.setAttribute('id', 'fade-mask')

  const maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  maskRect.setAttribute('x', '0')
  maskRect.setAttribute('y', '0')
  maskRect.setAttribute('width', String(width))
  maskRect.setAttribute('height', String(height))
  maskRect.setAttribute('fill', 'url(#fade-gradient)')

  mask.appendChild(maskRect)

  defs.appendChild(gradient)
  defs.appendChild(mask)

  return defs
}
