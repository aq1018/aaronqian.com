/**
 * Pure utility functions for digital analyzer signal visualization
 * No side effects, easy to test
 */

/**
 * Generate array of grid line Y positions
 */
export function generateGridLines(height: number, gridSize: number): number[] {
  const lines: number[] = []
  for (let y = gridSize; y < height; y += gridSize) {
    lines.push(y)
  }
  return lines
}

/**
 * Convert a string to binary representation
 * Returns binary string like "01001000" for each character
 */
export function stringToBinary(input: string): string {
  return input
    .split('')
    .map((char) => char.codePointAt(0)?.toString(2).padStart(8, '0'))
    .join('')
}

/**
 * Convert hex string to binary
 * Example: "A5" -> "10100101"
 */
export function hexToBinary(hex: string): string {
  return hex
    .replaceAll(/[^0-9A-Fa-f]/g, '')
    .split('')
    .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
    .join('')
}

/**
 * Generate random binary string
 */
export function generateRandomBinary(bitCount: number): string {
  return Array.from({ length: bitCount }, () => (Math.random() > 0.5 ? '1' : '0')).join('')
}

/**
 * Generate SVG path for a digital square wave signal
 * Creates sharp transitions between high and low states based on binary data
 * Each bit occupies exactly one grid cell for perfect alignment
 *
 * @param binaryData - String of 0s and 1s representing the signal
 * @param highY - Y coordinate for high (1) state - should align with grid line
 * @param lowY - Y coordinate for low (0) state - should align with grid line
 * @param gridSize - Size of each grid cell
 * @returns SVG path string
 */
export function generateSquareWavePath(
  binaryData: string,
  highY: number,
  lowY: number,
  gridSize: number,
): string {
  const bitCount = binaryData.length
  const totalWidth = bitCount * gridSize

  if (binaryData.length === 0) {
    // No data: draw flat line at midpoint across full width
    const midY = (highY + lowY) / 2
    return `M 0 ${midY} L ${totalWidth} ${midY}`
  }

  const path: string[] = []

  // Start at appropriate height based on first bit
  const startY = binaryData.startsWith('1') ? highY : lowY
  path.push(`M 0 ${startY}`)

  for (let i = 0; i < bitCount; i += 1) {
    const bit = binaryData[i]
    const nextX = (i + 1) * gridSize
    const currentY = bit === '1' ? highY : lowY

    // Draw horizontal line for this bit
    path.push(`L ${nextX} ${currentY}`)

    // If next bit is different, draw vertical transition
    if (i < bitCount - 1) {
      const nextBit = binaryData[i + 1]
      if (nextBit !== bit) {
        const nextY = nextBit === '1' ? highY : lowY
        path.push(`L ${nextX} ${nextY}`)
      }
    }
  }

  return path.join(' ')
}

/**
 * Get glow color based on theme (uses CSS custom properties)
 */
export function getGlowColor(opacity = 0.3): string {
  // Use color-mix for theme-aware glow
  return `color-mix(in srgb, var(--color-primary) ${opacity * 100}%, transparent)`
}

/**
 * Get lightning bolt glow color (uses lighter shade of primary cyan)
 */
export function getLightningGlowColor(): string {
  // Use lighter primary shade for softer glow
  return 'var(--color-primary-400)'
}
