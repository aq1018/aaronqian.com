import { describe, expect, it } from 'vitest'

import { calculateGridSize } from './DigitalAnalyzer.config'
import {
  generateGridLines,
  generateRandomBinary,
  generateSquareWavePath,
  getGlowColor,
  getLightningGlowColor,
  hexToBinary,
  stringToBinary,
} from './DigitalAnalyzer.utils'

describe('calculateGridSize', () => {
  it('should calculate grid size based on container width and byte count', () => {
    const containerWidth = 1600
    const byteCount = 2 // 16 bits
    const gridSize = calculateGridSize(containerWidth, byteCount)

    // 1600 / (2 * 8) = 100
    expect(gridSize).toBe(100)
  })

  it('should handle different byte counts', () => {
    const containerWidth = 1920
    const byteCount = 4 // 32 bits

    const gridSize = calculateGridSize(containerWidth, byteCount)

    // 1920 / (4 * 8) = 60
    expect(gridSize).toBe(60)
  })

  it('should divide evenly across all bits', () => {
    const containerWidth = 800
    const byteCount = 1 // 8 bits

    const gridSize = calculateGridSize(containerWidth, byteCount)

    // 800 / 8 = 100
    expect(gridSize).toBe(100)
  })
})

describe('generateGridLines', () => {
  it('should generate grid lines at regular intervals', () => {
    const lines = generateGridLines(1000, 100)

    // Starts at gridSize (100), continues up to but not including height
    expect(lines).toEqual([100, 200, 300, 400, 500, 600, 700, 800, 900])
  })

  it('should extend close to bottom edge', () => {
    const lines = generateGridLines(500, 100)

    // Starts at 100, extends to 400 (close to height=500)
    expect(lines[0]).toBe(100)
    expect(lines[lines.length - 1]).toBe(400)
  })

  it('should handle small heights', () => {
    const lines = generateGridLines(150, 100)

    // Room for one line at y=100 (100 < 150)
    expect(lines).toEqual([100])
  })

  it('should return empty array if height too small', () => {
    const lines = generateGridLines(100, 100)

    expect(lines).toEqual([])
  })
})

describe('stringToBinary', () => {
  it('should convert ASCII characters to binary', () => {
    expect(stringToBinary('A')).toBe('01000001')
  })

  it('should handle multiple characters', () => {
    const result = stringToBinary('Hi')
    expect(result).toBe('0100100001101001') // 'H' = 01001000, 'i' = 01101001
  })

  it('should handle empty string', () => {
    expect(stringToBinary('')).toBe('')
  })

  it('should pad each character to 8 bits', () => {
    const result = stringToBinary('!')
    expect(result.length).toBe(8)
    expect(result).toBe('00100001')
  })
})

describe('hexToBinary', () => {
  it('should convert hex to binary', () => {
    expect(hexToBinary('A5')).toBe('10100101')
  })

  it('should handle lowercase hex', () => {
    expect(hexToBinary('ff')).toBe('11111111')
  })

  it('should strip non-hex characters', () => {
    // '0x2F' -> strips to '02F' -> '0000 0010 1111'
    expect(hexToBinary('0x2F')).toBe('000000101111')
  })

  it('should pad each hex digit to 4 bits', () => {
    expect(hexToBinary('0')).toBe('0000')
  })
})

describe('generateRandomBinary', () => {
  it('should generate binary string of correct length', () => {
    const result = generateRandomBinary(16)
    expect(result.length).toBe(16)
  })

  it('should only contain 0s and 1s', () => {
    const result = generateRandomBinary(100)
    expect(result).toMatch(/^[01]+$/)
  })

  it('should handle zero length', () => {
    const result = generateRandomBinary(0)
    expect(result).toBe('')
  })
})

describe('generateSquareWavePath', () => {
  const testGridSize = 100 // Test with 100px grid cells
  const testHighY = 50 // High state Y position
  const testLowY = 150 // Low state Y position

  it('should generate path for simple binary data', () => {
    const path = generateSquareWavePath('10', testHighY, testLowY, testGridSize)

    // Should start with M command
    expect(path).toMatch(/^M 0 /)
    // Should contain L commands for transitions
    expect(path).toContain('L')
  })

  it('should create high state for 1 bits', () => {
    const path = generateSquareWavePath('1', testHighY, testLowY, testGridSize)

    expect(path).toContain(String(testHighY))
  })

  it('should create low state for 0 bits', () => {
    const path = generateSquareWavePath('0', testHighY, testLowY, testGridSize)

    expect(path).toContain(String(testLowY))
  })

  it('should handle empty binary data', () => {
    const path = generateSquareWavePath('', testHighY, testLowY, testGridSize)
    const midY = (testHighY + testLowY) / 2

    // Should draw flat line at midpoint (0 bits * gridSize = 0 width)
    expect(path).toBe(`M 0 ${midY} L 0 ${midY}`)
  })

  it('should create square wave transitions', () => {
    const path = generateSquareWavePath('101', testHighY, testLowY, testGridSize)

    // Should have multiple L commands for transitions
    const lCommands = path.match(/L/g)
    expect(lCommands).not.toBeNull()
    if (lCommands !== null) {
      expect(lCommands.length).toBeGreaterThan(2)
    }
  })

  it('should align each bit to one grid cell', () => {
    const path = generateSquareWavePath('1010', testHighY, testLowY, testGridSize)

    // Each bit should occupy exactly one grid cell
    // First bit ends at gridSize, second at gridSize*2, etc.
    expect(path).toContain(`L ${testGridSize}`)
    expect(path).toContain(`L ${testGridSize * 2}`)
    expect(path).toContain(`L ${testGridSize * 3}`)
    expect(path).toContain(`L ${testGridSize * 4}`)
  })

  it('should span width equal to bitCount * gridSize', () => {
    const bitCount = 8
    const expectedWidth = bitCount * testGridSize

    const binaryData = '1'.repeat(bitCount)
    const path = generateSquareWavePath(binaryData, testHighY, testLowY, testGridSize)

    // Last coordinate should be at expectedWidth
    expect(path).toContain(`L ${expectedWidth}`)
  })

  it('should use provided high and low Y values', () => {
    const highY = 25
    const lowY = 75
    const gridSize = 50
    const path = generateSquareWavePath('10', highY, lowY, gridSize)

    // Path should use the exact Y values provided (aligned with grid lines)
    expect(path).toContain(String(highY))
    expect(path).toContain(String(lowY))
  })
})

describe('getGlowColor', () => {
  it('should return cyan glow for dark mode', () => {
    const color = getGlowColor(true, 0.5)

    expect(color).toBe('rgba(0, 224, 255, 0.5)')
  })

  it('should return cyan glow for light mode', () => {
    const color = getGlowColor(false, 0.3)

    expect(color).toBe('rgba(0, 180, 216, 0.3)')
  })

  it('should use default opacity', () => {
    const color = getGlowColor(true)

    expect(color).toBe('rgba(0, 224, 255, 0.3)')
  })
})

describe('getLightningGlowColor', () => {
  it('should return bright cyan for dark mode', () => {
    const color = getLightningGlowColor(true)

    expect(color).toBe('rgba(0, 224, 255, 1)')
  })

  it('should return cyan for light mode', () => {
    const color = getLightningGlowColor(false)

    expect(color).toBe('rgba(0, 180, 216, 1)')
  })
})
