/**
 * Data source management for digital analyzer signal visualization
 * Manages binary data generation and message position tracking
 */

import { generateRandomBinary, stringToBinary } from '@/components/features/DigitalAnalyzer.utils'

/**
 * Data source modes for binary data generation
 * - 'config': Loop through configured message, converting text to binary
 * - 'random': Generate random binary data
 */
export type DataSourceMode = 'config' | 'random'

/**
 * Configuration options for DataSourceManager
 */
export interface DataSourceOptions {
  /** Full message text to loop through (used in 'config' mode) */
  fullMessage: string
  /** Number of bytes (characters) to process per pulse */
  byteCount: number
  /** Total number of bits in the binary data (byteCount * bitsPerByte) */
  bitCount: number
  /** Data source mode */
  dataSource: DataSourceMode
}

/**
 * Result of getting next binary data
 */
export interface BinaryDataResult {
  /** Binary data string padded to bitCount length */
  binaryData: string
  /** Text chunk being displayed (empty for random mode) */
  currentChunk: string
  /** Whether message has looped back to start (only true for 'config' mode) */
  shouldClear: boolean
}

/**
 * Manages data source for binary data generation
 * Handles message position tracking and looping for 'config' mode
 */
export class DataSourceManager {
  private messagePosition = 0
  private readonly options: DataSourceOptions

  /**
   * Create a new DataSourceManager
   * @param options - Configuration options for data source
   */
  constructor(options: DataSourceOptions) {
    this.options = options
  }

  /**
   * Get next binary data based on configured data source mode
   *
   * For 'config' mode:
   * - Extracts next chunk of text from message (length = byteCount)
   * - Converts to binary representation
   * - Advances message position
   * - Sets shouldClear=true when reaching end of message
   * - Loops back to start after reaching end
   *
   * For 'random' mode:
   * - Generates random binary data
   *
   * @returns BinaryDataResult with binary data, current text chunk, and loop flag
   */
  getNextBinaryData(): BinaryDataResult {
    const charsPerPulse = this.options.byteCount

    switch (this.options.dataSource) {
      case 'config': {
        // Get chunk of message starting from current position
        const chunk = this.options.fullMessage.slice(
          this.messagePosition,
          this.messagePosition + charsPerPulse,
        )
        const binaryData = stringToBinary(chunk).padEnd(this.options.bitCount, '0')

        // Check if we've reached the end and need to loop next time
        const shouldClear = this.messagePosition + charsPerPulse >= this.options.fullMessage.length

        // Advance position
        if (shouldClear) {
          this.messagePosition = 0 // Loop back to start
        } else {
          this.messagePosition += charsPerPulse
        }

        return { binaryData, currentChunk: chunk, shouldClear }
      }

      case 'random':
        return {
          binaryData: generateRandomBinary(this.options.bitCount),
          currentChunk: '',
          shouldClear: false,
        }
    }
  }

  /**
   * Reset message position to start
   * Useful when restarting message loop in 'config' mode
   */
  reset(): void {
    this.messagePosition = 0
  }

  /**
   * Get current message position
   * Used for testing and debugging
   */
  getMessagePosition(): number {
    return this.messagePosition
  }
}
