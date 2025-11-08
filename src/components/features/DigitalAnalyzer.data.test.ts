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
      fullMessage: testMessage,
      byteCount,
      bitCount,
      dataSource: 'config',
    })

    beforeEach(() => {
      const options: DataSourceOptions = {
        fullMessage: testMessage,
        byteCount,
        bitCount,
        dataSource: 'config',
      }
      manager = new DataSourceManager(options)
    })

    it('should extract first chunk of message', () => {
      const result = manager.getNextBinaryData()

      expect(result.currentChunk).toBe('HE') // First 2 chars
      expect(result.binaryData).toHaveLength(bitCount)
      expect(result.shouldClear).toBe(false)
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
      expect(result2.shouldClear).toBe(false)
    })

    it('should set shouldClear=true when reaching end of message', () => {
      manager.getNextBinaryData() // 'HE' (positions 0-1)
      manager.getNextBinaryData() // 'LL' (positions 2-3)
      const result3 = manager.getNextBinaryData() // 'O' (position 4, last char)

      expect(result3.currentChunk).toBe('O')
      expect(result3.shouldClear).toBe(true)
    })

    it('should loop back to start after reaching end', () => {
      // Cycle through entire message
      manager.getNextBinaryData() // 'HE'
      manager.getNextBinaryData() // 'LL'
      const lastResult = manager.getNextBinaryData() // 'O'
      expect(lastResult.shouldClear).toBe(true)

      // Next call should loop back to start
      const firstAgain = manager.getNextBinaryData() // 'HE'
      expect(firstAgain.currentChunk).toBe('HE')
      expect(firstAgain.shouldClear).toBe(false)
      expect(manager.getMessagePosition()).toBe(2) // Position advanced from start
    })

    it('should handle exact message length divisible by byteCount', () => {
      // Message length = 4, byteCount = 2 → exactly 2 chunks
      const options: DataSourceOptions = {
        fullMessage: 'TEST',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'config',
      }
      const exactManager = new DataSourceManager(options)

      const result1 = exactManager.getNextBinaryData() // 'TE'
      expect(result1.shouldClear).toBe(false)

      const result2 = exactManager.getNextBinaryData() // 'ST'
      expect(result2.shouldClear).toBe(true) // End reached

      const result3 = exactManager.getNextBinaryData() // Loop to 'TE'
      expect(result3.currentChunk).toBe('TE')
    })

    it('should handle single character message', () => {
      const options: DataSourceOptions = {
        fullMessage: 'A',
        byteCount: 1,
        bitCount: 8,
        dataSource: 'config',
      }
      const singleManager = new DataSourceManager(options)

      const result1 = singleManager.getNextBinaryData()
      expect(result1.currentChunk).toBe('A')
      expect(result1.shouldClear).toBe(true) // Immediately at end

      const result2 = singleManager.getNextBinaryData()
      expect(result2.currentChunk).toBe('A') // Loops
    })

    it('should handle empty message gracefully', () => {
      const options: DataSourceOptions = {
        fullMessage: '',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'config',
      }
      const emptyManager = new DataSourceManager(options)

      const result = emptyManager.getNextBinaryData()
      expect(result.currentChunk).toBe('')
      expect(result.binaryData).toBe('0000000000000000') // All padding
      expect(result.shouldClear).toBe(true) // Empty message is "at end"
    })
  })

  describe('random mode', () => {
    const bitCount = 16

    // Initialize with default options, will be reset in beforeEach
    let manager: DataSourceManager = new DataSourceManager({
      fullMessage: '',
      byteCount: 2,
      bitCount,
      dataSource: 'random',
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
      expect(result.shouldClear).toBe(false)
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
        expect(result.shouldClear).toBe(false)
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
        fullMessage: 'HELLO',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'config',
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
        fullMessage: '',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'random',
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
        fullMessage: 'TESTING',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'config',
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
        fullMessage: 'AB',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'config',
      }
      const manager = new DataSourceManager(options)

      const result = manager.getNextBinaryData()
      expect(result.shouldClear).toBe(true)
      expect(manager.getMessagePosition()).toBe(0) // Looped back
    })

    it('should always return 0 for random mode', () => {
      vi.mocked(utils.generateRandomBinary).mockReturnValue('1010101010101010')

      const options: DataSourceOptions = {
        fullMessage: '',
        byteCount: 2,
        bitCount: 16,
        dataSource: 'random',
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
        fullMessage: longMessage,
        byteCount: 10,
        bitCount: 80,
        dataSource: 'config',
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
        fullMessage: '',
        byteCount: 128,
        bitCount: 1024,
        dataSource: 'random',
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
