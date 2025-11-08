/**
 * Tests for DigitalAnalyzer.data.ts - Data source management
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DataSourceManager } from './DigitalAnalyzer.data'
import type { DataSourceOptions } from './DigitalAnalyzer.data'
import * as utils from './DigitalAnalyzer.utils'

// Mock the utils module to control random generation
vi.mock('./DigitalAnalyzer.utils', async () => {
  const actual = await vi.importActual<typeof utils>('./DigitalAnalyzer.utils')
  return {
    ...actual,
    generateRandomBinary: vi.fn(),
  }
})

describe('DataSourceManager', () => {
  describe('config mode', () => {
    const testMessage = 'HELLO'
    const byteCount = 2
    const bitCount = byteCount * 8 // 16 bits

    // Initialize with default options, will be reset in beforeEach
    let manager: DataSourceManager = new DataSourceManager({
      bitCount,
      byteCount,
      dataSource: 'config',
      fullMessage: testMessage,
    })

    beforeEach(() => {
      const options: DataSourceOptions = {
        bitCount,
        byteCount,
        dataSource: 'config',
        fullMessage: testMessage,
      }
      manager = new DataSourceManager(options)
    })

    it('should extract first chunk of message', () => {
      const result = manager.getNextBinaryData()

      expect(result.currentChunk).toBe('HE') // First 2 chars
      expect(result.binaryData).toHaveLength(bitCount)
      expect(result.shouldClear).toBeFalsy()
    })

    it('should convert text chunk to binary', () => {
      const result = manager.getNextBinaryData()

      // "HE" = 'H' (72 = 01001000) + 'E' (69 = 01000101)
      expect(result.binaryData).toBe('0100100001000101')
    })

    it('should pad binary data to bitCount length', () => {
      // Create manager with small message
      const smallOptions: DataSourceOptions = {
        fullMessage: 'A', // Only 1 char
        byteCount: 2, // But request 2 bytes
        bitCount: 16,
        dataSource: 'config',
      }
      const smallManager = new DataSourceManager(smallOptions)

      const result = smallManager.getNextBinaryData()

      // 'A' (65 = 01000001) + padding
      expect(result.binaryData).toBe('0100000100000000')
      expect(result.binaryData).toHaveLength(16)
    })

    it('should advance message position on subsequent calls', () => {
      manager.getNextBinaryData() // 'HE'
      const result2 = manager.getNextBinaryData() // 'LL'

      expect(result2.currentChunk).toBe('LL')
      expect(result2.shouldClear).toBeFalsy()
    })

    it('should set shouldClear=true when reaching end of message', () => {
      manager.getNextBinaryData() // 'HE' (positions 0-1)
      manager.getNextBinaryData() // 'LL' (positions 2-3)
      const result3 = manager.getNextBinaryData() // 'O' (position 4, last char)

      expect(result3.currentChunk).toBe('O')
      expect(result3.shouldClear).toBeTruthy()
    })

    it('should loop back to start after reaching end', () => {
      // Cycle through entire message
      manager.getNextBinaryData() // 'HE'
      manager.getNextBinaryData() // 'LL'
      const lastResult = manager.getNextBinaryData() // 'O'
      expect(lastResult.shouldClear).toBeTruthy()

      // Next call should loop back to start
      const firstAgain = manager.getNextBinaryData() // 'HE'
      expect(firstAgain.currentChunk).toBe('HE')
      expect(firstAgain.shouldClear).toBeFalsy()
      expect(manager.getMessagePosition()).toBe(2) // Position advanced from start
    })

    it('should handle exact message length divisible by byteCount', () => {
      // Message length = 4, byteCount = 2 → exactly 2 chunks
      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'config',
        fullMessage: 'TEST',
      }
      const exactManager = new DataSourceManager(options)

      const result1 = exactManager.getNextBinaryData() // 'TE'
      expect(result1.shouldClear).toBeFalsy()

      const result2 = exactManager.getNextBinaryData() // 'ST'
      expect(result2.shouldClear).toBeTruthy() // End reached

      const result3 = exactManager.getNextBinaryData() // Loop to 'TE'
      expect(result3.currentChunk).toBe('TE')
    })

    it('should handle single character message', () => {
      const options: DataSourceOptions = {
        bitCount: 8,
        byteCount: 1,
        dataSource: 'config',
        fullMessage: 'A',
      }
      const singleManager = new DataSourceManager(options)

      const result1 = singleManager.getNextBinaryData()
      expect(result1.currentChunk).toBe('A')
      expect(result1.shouldClear).toBeTruthy() // Immediately at end

      const result2 = singleManager.getNextBinaryData()
      expect(result2.currentChunk).toBe('A') // Loops
    })

    it('should handle empty message gracefully', () => {
      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'config',
        fullMessage: '',
      }
      const emptyManager = new DataSourceManager(options)

      const result = emptyManager.getNextBinaryData()
      expect(result.currentChunk).toBe('')
      expect(result.binaryData).toBe('0000000000000000') // All padding
      expect(result.shouldClear).toBeTruthy() // Empty message is "at end"
    })
  })

  describe('random mode', () => {
    const bitCount = 16

    // Initialize with default options, will be reset in beforeEach
    let manager: DataSourceManager = new DataSourceManager({
      bitCount,
      byteCount: 2,
      dataSource: 'random',
      fullMessage: '',
    })

    beforeEach(() => {
      vi.clearAllMocks()
      vi.mocked(utils.generateRandomBinary).mockReturnValue('1010101010101010')

      const options: DataSourceOptions = {
        fullMessage: '', // Not used in random mode
        byteCount: 2,
        bitCount,
        dataSource: 'random',
      }
      manager = new DataSourceManager(options)
    })

    it('should generate random binary data', () => {
      const result = manager.getNextBinaryData()

      expect(utils.generateRandomBinary).toHaveBeenCalledWith(bitCount)
      expect(result.binaryData).toBe('1010101010101010')
      expect(result.currentChunk).toBe('')
      expect(result.shouldClear).toBeFalsy()
    })

    it('should call generateRandomBinary on each call', () => {
      manager.getNextBinaryData()
      manager.getNextBinaryData()
      manager.getNextBinaryData()

      expect(utils.generateRandomBinary).toHaveBeenCalledTimes(3)
    })

    it('should never set shouldClear=true', () => {
      for (let i = 0; i < 10; i += 1) {
        const result = manager.getNextBinaryData()
        expect(result.shouldClear).toBeFalsy()
      }
    })

    it('should always return empty currentChunk', () => {
      const result = manager.getNextBinaryData()
      expect(result.currentChunk).toBe('')
    })
  })

  describe('reset()', () => {
    it('should reset message position to zero', () => {
      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'config',
        fullMessage: 'HELLO',
      }
      const manager = new DataSourceManager(options)

      // Advance through message
      manager.getNextBinaryData() // 'HE'
      manager.getNextBinaryData() // 'LL'
      expect(manager.getMessagePosition()).toBe(4)

      // Reset
      manager.reset()
      expect(manager.getMessagePosition()).toBe(0)

      // Verify next call starts from beginning
      const result = manager.getNextBinaryData()
      expect(result.currentChunk).toBe('HE')
    })

    it('should work with random mode (no effect but should not error)', () => {
      vi.mocked(utils.generateRandomBinary).mockReturnValue('1010101010101010')

      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'random',
        fullMessage: '',
      }
      const manager = new DataSourceManager(options)

      expect(() => {
        manager.reset()
      }).not.toThrow()
      expect(manager.getMessagePosition()).toBe(0)
    })
  })

  describe('getMessagePosition()', () => {
    it('should return current position in config mode', () => {
      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'config',
        fullMessage: 'TESTING',
      }
      const manager = new DataSourceManager(options)

      expect(manager.getMessagePosition()).toBe(0)

      manager.getNextBinaryData() // Positions 0-1
      expect(manager.getMessagePosition()).toBe(2)

      manager.getNextBinaryData() // Positions 2-3
      expect(manager.getMessagePosition()).toBe(4)
    })

    it('should return 0 after message loops', () => {
      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'config',
        fullMessage: 'AB',
      }
      const manager = new DataSourceManager(options)

      const result = manager.getNextBinaryData()
      expect(result.shouldClear).toBeTruthy()
      expect(manager.getMessagePosition()).toBe(0) // Looped back
    })

    it('should always return 0 for random mode', () => {
      vi.mocked(utils.generateRandomBinary).mockReturnValue('1010101010101010')

      const options: DataSourceOptions = {
        bitCount: 16,
        byteCount: 2,
        dataSource: 'random',
        fullMessage: '',
      }
      const manager = new DataSourceManager(options)

      manager.getNextBinaryData()
      manager.getNextBinaryData()
      expect(manager.getMessagePosition()).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000)
      const options: DataSourceOptions = {
        bitCount: 80,
        byteCount: 10,
        dataSource: 'config',
        fullMessage: longMessage,
      }
      const manager = new DataSourceManager(options)

      // Should not error on long message
      expect(() => manager.getNextBinaryData()).not.toThrow()

      // Should correctly track position
      // First call in the test above + 10 more = 11 total calls * 10 bytes = 110
      for (let i = 0; i < 10; i += 1) {
        manager.getNextBinaryData()
      }
      expect(manager.getMessagePosition()).toBe(110)
    })

    it('should handle large bitCount', () => {
      vi.mocked(utils.generateRandomBinary).mockReturnValue('1'.repeat(1024))

      const options: DataSourceOptions = {
        bitCount: 1024,
        byteCount: 128,
        dataSource: 'random',
        fullMessage: '',
      }
      const manager = new DataSourceManager(options)

      const result = manager.getNextBinaryData()
      expect(result.binaryData).toHaveLength(1024)
    })

    it('should handle special characters in message', () => {
      const options: DataSourceOptions = {
        fullMessage: '🚀✨', // Emojis
        byteCount: 2,
        bitCount: 16,
        dataSource: 'config',
      }
      const manager = new DataSourceManager(options)

      // Should not error (stringToBinary handles any Unicode)
      expect(() => manager.getNextBinaryData()).not.toThrow()
    })
  })
})
