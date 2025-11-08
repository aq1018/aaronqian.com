/**
 * Display manager for DigitalAnalyzer binary buffer and ASCII text
 * Handles DOM manipulation for displaying binary data and decoded text
 *
 * @module DigitalAnalyzer.display
 */

/**
 * Manages display updates for binary buffer and ASCII text displays
 * Provides methods for revealing, fading, and clearing display elements
 * Uses data-buffer-target + data-buffer-type selectors for scoped updates
 */
export class DisplayManager {
  private readonly binaryBufferElements: NodeListOf<HTMLElement>
  private readonly asciiDisplayElements: NodeListOf<HTMLElement>
  private accumulatedText = ''

  /**
   * Create a new DisplayManager instance
   * Targets elements with matching data-buffer-target and data-buffer-type attributes
   *
   * @param analyzerName - Name of the DigitalAnalyzer instance to target
   */
  constructor(analyzerName: string) {
    this.binaryBufferElements = document.querySelectorAll<HTMLElement>(
      `[data-buffer-target="${analyzerName}"][data-buffer-type="binary"]`,
    )
    this.asciiDisplayElements = document.querySelectorAll<HTMLElement>(
      `[data-buffer-target="${analyzerName}"][data-buffer-type="ascii"]`,
    )
  }

  /**
   * Clear binary buffer and set to non-breaking space placeholder
   * Resets opacity and transitions to default state
   * Updates all binary buffer elements on the page
   */
  clearBinaryBuffer(): void {
    for (const element of this.binaryBufferElements) {
      element.textContent = '\u00A0'
      element.style.opacity = '1'
      element.style.transition = ''
    }
  }

  /**
   * Reveal a single bit in the binary buffer
   * Adds spacing after every 8 bits (byte boundaries)
   * Updates all binary buffer elements on the page
   *
   * @param bit - The bit value ('0' or '1')
   * @param index - Current bit index (0-based)
   */
  revealBit(bit: string, index: number): void {
    for (const element of this.binaryBufferElements) {
      if (index === 0) {
        // Replace placeholder with first bit
        element.textContent = bit
      } else if (index % 8 === 0) {
        // Add space after every 8 bits (byte boundary)
        element.textContent += ` ${bit}`
      } else {
        element.textContent += bit
      }
    }
  }

  /**
   * Apply fade transition to binary buffer
   * Sets opacity to 0 with a smooth transition
   * Updates all binary buffer elements on the page
   */
  fadeBinaryBuffer(): void {
    for (const element of this.binaryBufferElements) {
      element.style.transition = 'opacity 200ms ease-out'
      element.style.opacity = '0'
    }
  }

  /**
   * Reset binary buffer to placeholder after fade
   * Should be called after fadeBinaryBuffer() completes
   * Updates all binary buffer elements on the page
   */
  resetBinaryBuffer(): void {
    for (const element of this.binaryBufferElements) {
      element.textContent = '\u00A0'
      element.style.opacity = '1'
    }
  }

  /**
   * Append a character to the accumulated ASCII text
   * Updates both internal state and DOM
   * Updates all ASCII buffer elements on the page
   *
   * @param char - Character to append
   */
  appendCharacter(char: string): void {
    this.accumulatedText += char
    for (const element of this.asciiDisplayElements) {
      element.textContent = this.accumulatedText
    }
  }

  /**
   * Set ASCII display text directly
   * Does NOT update accumulated text (for non-accumulating modes like hex)
   * Updates all ASCII buffer elements on the page
   *
   * @param text - Text to display
   */
  setAsciiText(text: string): void {
    for (const element of this.asciiDisplayElements) {
      element.textContent = text
    }
  }

  /**
   * Apply fade transition to ASCII display
   * Sets opacity to 0 with a smooth transition
   * Updates all ASCII buffer elements on the page
   */
  fadeAsciiDisplay(): void {
    for (const element of this.asciiDisplayElements) {
      element.style.transition = 'opacity 200ms ease-out'
      element.style.opacity = '0'
    }
  }

  /**
   * Clear ASCII display and reset accumulated text
   * Should be called after fadeAsciiDisplay() completes
   * Updates all ASCII buffer elements on the page
   */
  clearAsciiDisplay(): void {
    this.accumulatedText = ''
    for (const element of this.asciiDisplayElements) {
      element.textContent = ''
      element.style.opacity = '1'
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
