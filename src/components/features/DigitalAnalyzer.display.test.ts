/**
 * Tests for DigitalAnalyzer display manager
 * Validates binary buffer and ASCII text display updates
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { DisplayManager } from './DigitalAnalyzer.display'

describe('DisplayManager', () => {
  let binaryBuffer!: HTMLElement
  let asciiDisplay!: HTMLElement
  let displayManager!: DisplayManager

  beforeEach(() => {
    // Create test DOM with data-buffer-target and data-buffer-type attributes
    document.body.innerHTML = `
      <span data-buffer-target="test-analyzer" data-buffer-type="binary"></span>
      <span data-buffer-target="test-analyzer" data-buffer-type="ascii"></span>
    `

    // Get element references
    binaryBuffer = document.querySelector<HTMLElement>(
      '[data-buffer-target="test-analyzer"][data-buffer-type="binary"]',
    )!
    asciiDisplay = document.querySelector<HTMLElement>(
      '[data-buffer-target="test-analyzer"][data-buffer-type="ascii"]',
    )!

    // Create display manager instance
    displayManager = new DisplayManager('test-analyzer')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('constructor', () => {
    it('should find and store binary buffer element', () => {
      expect(binaryBuffer).toBeTruthy()
      expect(binaryBuffer.dataset['buffer-type']).toBe('binary')
    })

    it('should find and store ASCII display element', () => {
      expect(asciiDisplay).toBeTruthy()
      expect(asciiDisplay.dataset['buffer-type']).toBe('ascii')
    })

    it('should handle missing binary buffer element', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      // Should not throw when no elements match
      expect(() => {
        manager.clearBinaryBuffer()
      }).not.toThrow()
    })

    it('should handle missing ASCII display element', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      // Should not throw when no elements match
      expect(() => {
        manager.setAsciiText('test')
      }).not.toThrow()
    })

    it('should handle both elements missing', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.clearBinaryBuffer()
        manager.setAsciiText('test')
      }).not.toThrow()
    })
  })

  describe('clearBinaryBuffer', () => {
    it('should set binary buffer to non-breaking space placeholder', () => {
      binaryBuffer.textContent = '10101010'
      displayManager.clearBinaryBuffer()
      expect(binaryBuffer.textContent).toBe('\u00A0')
    })

    it('should reset opacity to 1', () => {
      binaryBuffer.style.opacity = '0.5'
      displayManager.clearBinaryBuffer()
      expect(binaryBuffer.style.opacity).toBe('1')
    })

    it('should clear transition styles', () => {
      binaryBuffer.style.transition = 'opacity 200ms ease-out'
      displayManager.clearBinaryBuffer()
      expect(binaryBuffer.style.transition).toBe('')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.clearBinaryBuffer()
      }).not.toThrow()
    })
  })

  describe('revealBit', () => {
    beforeEach(() => {
      displayManager.clearBinaryBuffer()
    })

    it('should replace placeholder with first bit', () => {
      displayManager.revealBit('1', 0)
      expect(binaryBuffer.textContent).toBe('1')
    })

    it('should append subsequent bits without spacing (within byte)', () => {
      displayManager.revealBit('1', 0)
      displayManager.revealBit('0', 1)
      displayManager.revealBit('1', 2)
      expect(binaryBuffer.textContent).toBe('101')
    })

    it('should add space at byte boundary (index 8)', () => {
      // First byte
      for (let i = 0; i < 8; i += 1) {
        displayManager.revealBit('1', i)
      }
      expect(binaryBuffer.textContent).toBe('11111111')

      // First bit of second byte should add space
      displayManager.revealBit('0', 8)
      expect(binaryBuffer.textContent).toBe('11111111 0')
    })

    it('should add space at multiple byte boundaries', () => {
      // 3 bytes worth of bits
      for (let i = 0; i < 24; i += 1) {
        const bit = i % 2 === 0 ? '1' : '0'
        displayManager.revealBit(bit, i)
      }
      // Should have spaces at indices 8 and 16
      expect(binaryBuffer.textContent).toBe('10101010 10101010 10101010')
    })

    it('should handle revealing full byte sequence', () => {
      const bits = '10110010'
      for (let i = 0; i < bits.length; i += 1) {
        displayManager.revealBit(bits[i], i)
      }
      expect(binaryBuffer.textContent).toBe('10110010')
    })

    it('should handle revealing multiple bytes with correct spacing', () => {
      const bits = '1011001001010110'
      for (let i = 0; i < bits.length; i += 1) {
        displayManager.revealBit(bits[i], i)
      }
      expect(binaryBuffer.textContent).toBe('10110010 01010110')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.revealBit('1', 0)
      }).not.toThrow()
    })
  })

  describe('fadeBinaryBuffer', () => {
    it('should set opacity to 0', () => {
      binaryBuffer.style.opacity = '1'
      displayManager.fadeBinaryBuffer()
      expect(binaryBuffer.style.opacity).toBe('0')
    })

    it('should apply transition style', () => {
      displayManager.fadeBinaryBuffer()
      expect(binaryBuffer.style.transition).toBe('opacity 200ms ease-out')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.fadeBinaryBuffer()
      }).not.toThrow()
    })
  })

  describe('resetBinaryBuffer', () => {
    it('should set content to placeholder', () => {
      binaryBuffer.textContent = '10101010'
      displayManager.resetBinaryBuffer()
      expect(binaryBuffer.textContent).toBe('\u00A0')
    })

    it('should reset opacity to 1', () => {
      binaryBuffer.style.opacity = '0'
      displayManager.resetBinaryBuffer()
      expect(binaryBuffer.style.opacity).toBe('1')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.resetBinaryBuffer()
      }).not.toThrow()
    })
  })

  describe('appendCharacter', () => {
    it('should append single character to display', () => {
      displayManager.appendCharacter('H')
      expect(asciiDisplay.textContent).toBe('H')
    })

    it('should accumulate multiple characters', () => {
      displayManager.appendCharacter('H')
      displayManager.appendCharacter('e')
      displayManager.appendCharacter('l')
      displayManager.appendCharacter('l')
      displayManager.appendCharacter('o')
      expect(asciiDisplay.textContent).toBe('Hello')
    })

    it('should update accumulated text state', () => {
      displayManager.appendCharacter('A')
      displayManager.appendCharacter('B')
      expect(displayManager.getAccumulatedText()).toBe('AB')
    })

    it('should handle special characters', () => {
      displayManager.appendCharacter('!')
      displayManager.appendCharacter('@')
      displayManager.appendCharacter('#')
      expect(asciiDisplay.textContent).toBe('!@#')
    })

    it('should handle whitespace characters', () => {
      displayManager.appendCharacter('A')
      displayManager.appendCharacter(' ')
      displayManager.appendCharacter('B')
      expect(asciiDisplay.textContent).toBe('A B')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.appendCharacter('A')
      }).not.toThrow()
    })
  })

  describe('setAsciiText', () => {
    it('should set text directly without accumulation', () => {
      displayManager.setAsciiText('0xDEADBEEF')
      expect(asciiDisplay.textContent).toBe('0xDEADBEEF')
    })

    it('should replace previous text', () => {
      displayManager.setAsciiText('First')
      displayManager.setAsciiText('Second')
      expect(asciiDisplay.textContent).toBe('Second')
    })

    it('should not affect accumulated text', () => {
      displayManager.appendCharacter('A')
      displayManager.setAsciiText('0xFF')
      expect(displayManager.getAccumulatedText()).toBe('A')
      expect(asciiDisplay.textContent).toBe('0xFF')
    })

    it('should handle empty string', () => {
      displayManager.setAsciiText('Something')
      displayManager.setAsciiText('')
      expect(asciiDisplay.textContent).toBe('')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.setAsciiText('test')
      }).not.toThrow()
    })
  })

  describe('fadeAsciiDisplay', () => {
    it('should set opacity to 0', () => {
      asciiDisplay.style.opacity = '1'
      displayManager.fadeAsciiDisplay()
      expect(asciiDisplay.style.opacity).toBe('0')
    })

    it('should apply transition style', () => {
      displayManager.fadeAsciiDisplay()
      expect(asciiDisplay.style.transition).toBe('opacity 200ms ease-out')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.fadeAsciiDisplay()
      }).not.toThrow()
    })
  })

  describe('clearAsciiDisplay', () => {
    it('should clear display text', () => {
      asciiDisplay.textContent = 'Hello World'
      displayManager.clearAsciiDisplay()
      expect(asciiDisplay.textContent).toBe('')
    })

    it('should reset accumulated text', () => {
      displayManager.appendCharacter('A')
      displayManager.appendCharacter('B')
      displayManager.clearAsciiDisplay()
      expect(displayManager.getAccumulatedText()).toBe('')
    })

    it('should reset opacity to 1', () => {
      asciiDisplay.style.opacity = '0'
      displayManager.clearAsciiDisplay()
      expect(asciiDisplay.style.opacity).toBe('1')
    })

    it('should handle missing element gracefully', () => {
      const manager = new DisplayManager('nonexistent-analyzer')
      expect(() => {
        manager.clearAsciiDisplay()
      }).not.toThrow()
    })
  })

  describe('getAccumulatedText', () => {
    it('should return empty string initially', () => {
      expect(displayManager.getAccumulatedText()).toBe('')
    })

    it('should return accumulated characters', () => {
      displayManager.appendCharacter('T')
      displayManager.appendCharacter('e')
      displayManager.appendCharacter('s')
      displayManager.appendCharacter('t')
      expect(displayManager.getAccumulatedText()).toBe('Test')
    })

    it('should return empty string after clear', () => {
      displayManager.appendCharacter('A')
      displayManager.clearAsciiDisplay()
      expect(displayManager.getAccumulatedText()).toBe('')
    })
  })

  describe('integration scenarios', () => {
    it('should handle complete binary reveal sequence', () => {
      // Clear and prepare
      displayManager.clearBinaryBuffer()
      expect(binaryBuffer.textContent).toBe('\u00A0')

      // Reveal bits
      const bits = '10110010'
      for (let i = 0; i < bits.length; i += 1) {
        displayManager.revealBit(bits[i], i)
      }
      expect(binaryBuffer.textContent).toBe('10110010')

      // Fade out
      displayManager.fadeBinaryBuffer()
      expect(binaryBuffer.style.opacity).toBe('0')

      // Reset
      displayManager.resetBinaryBuffer()
      expect(binaryBuffer.textContent).toBe('\u00A0')
      expect(binaryBuffer.style.opacity).toBe('1')
    })

    it('should handle complete ASCII accumulation sequence', () => {
      // Accumulate text
      const text = 'Hello'
      for (const char of text) {
        displayManager.appendCharacter(char)
      }
      expect(asciiDisplay.textContent).toBe('Hello')
      expect(displayManager.getAccumulatedText()).toBe('Hello')

      // Fade out
      displayManager.fadeAsciiDisplay()
      expect(asciiDisplay.style.opacity).toBe('0')

      // Clear
      displayManager.clearAsciiDisplay()
      expect(asciiDisplay.textContent).toBe('')
      expect(displayManager.getAccumulatedText()).toBe('')
      expect(asciiDisplay.style.opacity).toBe('1')
    })

    it('should handle switching between accumulation and direct text modes', () => {
      // Start with accumulation
      displayManager.appendCharacter('A')
      displayManager.appendCharacter('B')
      expect(displayManager.getAccumulatedText()).toBe('AB')

      // Switch to direct (hex mode)
      displayManager.setAsciiText('0xDEAD')
      expect(asciiDisplay.textContent).toBe('0xDEAD')
      expect(displayManager.getAccumulatedText()).toBe('AB') // Unchanged

      // Clear and return to accumulation
      displayManager.clearAsciiDisplay()
      displayManager.appendCharacter('C')
      expect(displayManager.getAccumulatedText()).toBe('C')
    })

    it('should handle multiple reveal cycles', () => {
      // First cycle
      for (let i = 0; i < 8; i += 1) {
        displayManager.revealBit('1', i)
      }
      expect(binaryBuffer.textContent).toBe('11111111')

      // Clear and second cycle
      displayManager.clearBinaryBuffer()
      for (let i = 0; i < 8; i += 1) {
        displayManager.revealBit('0', i)
      }
      expect(binaryBuffer.textContent).toBe('00000000')
    })

    it('should maintain state independence between binary and ASCII displays', () => {
      // Update binary
      displayManager.revealBit('1', 0)
      displayManager.fadeBinaryBuffer()

      // Update ASCII
      displayManager.appendCharacter('A')
      displayManager.fadeAsciiDisplay()

      // Binary state should not affect ASCII state
      expect(binaryBuffer.style.opacity).toBe('0')
      expect(asciiDisplay.style.opacity).toBe('0')

      // Reset binary
      displayManager.resetBinaryBuffer()
      expect(binaryBuffer.style.opacity).toBe('1')
      expect(asciiDisplay.style.opacity).toBe('0') // Unchanged

      // Clear ASCII
      displayManager.clearAsciiDisplay()
      expect(asciiDisplay.style.opacity).toBe('1')
      expect(binaryBuffer.textContent).toBe('\u00A0') // Unchanged
    })
  })
})
