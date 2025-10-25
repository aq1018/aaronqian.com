/**
 * Display manager for DigitalAnalyzer binary buffer and ASCII text
 * Handles DOM manipulation for displaying binary data and decoded text
 *
 * @module DigitalAnalyzer.display
 */

/**
 * Manages display updates for binary buffer and ASCII text displays
 * Provides methods for revealing, fading, and clearing display elements
 */
export class DisplayManager {
  private readonly binaryBufferElement: HTMLElement | null
  private readonly asciiDisplayElement: HTMLElement | null
  private accumulatedText = ''

  /**
   * Create a new DisplayManager instance
   *
   * @param binaryBufferId - DOM element ID for binary buffer display
   * @param asciiDisplayId - DOM element ID for ASCII text display
   */
  constructor(binaryBufferId: string, asciiDisplayId: string) {
    this.binaryBufferElement = document.getElementById(binaryBufferId)
    this.asciiDisplayElement = document.getElementById(asciiDisplayId)
  }

  /**
   * Clear binary buffer and set to non-breaking space placeholder
   * Resets opacity and transitions to default state
   */
  clearBinaryBuffer(): void {
    if (this.binaryBufferElement !== null) {
      this.binaryBufferElement.textContent = '\u00A0'
      this.binaryBufferElement.style.opacity = '1'
      this.binaryBufferElement.style.transition = ''
    }
  }

  /**
   * Reveal a single bit in the binary buffer
   * Adds spacing after every 8 bits (byte boundaries)
   *
   * @param bit - The bit value ('0' or '1')
   * @param index - Current bit index (0-based)
   */
  revealBit(bit: string, index: number): void {
    if (this.binaryBufferElement !== null) {
      if (index === 0) {
        // Replace placeholder with first bit
        this.binaryBufferElement.textContent = bit
      } else if (index % 8 === 0) {
        // Add space after every 8 bits (byte boundary)
        this.binaryBufferElement.textContent += ' ' + bit
      } else {
        this.binaryBufferElement.textContent += bit
      }
    }
  }

  /**
   * Apply fade transition to binary buffer
   * Sets opacity to 0 with a smooth transition
   */
  fadeBinaryBuffer(): void {
    if (this.binaryBufferElement !== null) {
      this.binaryBufferElement.style.transition = 'opacity 200ms ease-out'
      this.binaryBufferElement.style.opacity = '0'
    }
  }

  /**
   * Reset binary buffer to placeholder after fade
   * Should be called after fadeBinaryBuffer() completes
   */
  resetBinaryBuffer(): void {
    if (this.binaryBufferElement !== null) {
      this.binaryBufferElement.textContent = '\u00A0'
      this.binaryBufferElement.style.opacity = '1'
    }
  }

  /**
   * Append a character to the accumulated ASCII text
   * Updates both internal state and DOM
   *
   * @param char - Character to append
   */
  appendCharacter(char: string): void {
    this.accumulatedText += char
    if (this.asciiDisplayElement !== null) {
      this.asciiDisplayElement.textContent = this.accumulatedText
    }
  }

  /**
   * Set ASCII display text directly
   * Does NOT update accumulated text (for non-accumulating modes like hex)
   *
   * @param text - Text to display
   */
  setAsciiText(text: string): void {
    if (this.asciiDisplayElement !== null) {
      this.asciiDisplayElement.textContent = text
    }
  }

  /**
   * Apply fade transition to ASCII display
   * Sets opacity to 0 with a smooth transition
   */
  fadeAsciiDisplay(): void {
    if (this.asciiDisplayElement !== null) {
      this.asciiDisplayElement.style.transition = 'opacity 200ms ease-out'
      this.asciiDisplayElement.style.opacity = '0'
    }
  }

  /**
   * Clear ASCII display and reset accumulated text
   * Should be called after fadeAsciiDisplay() completes
   */
  clearAsciiDisplay(): void {
    this.accumulatedText = ''
    if (this.asciiDisplayElement !== null) {
      this.asciiDisplayElement.textContent = ''
      this.asciiDisplayElement.style.opacity = '1'
    }
  }

  /**
   * Get current accumulated text
   * Useful for testing and state inspection
   *
   * @returns Current accumulated text
   */
  getAccumulatedText(): string {
    return this.accumulatedText
  }
}
