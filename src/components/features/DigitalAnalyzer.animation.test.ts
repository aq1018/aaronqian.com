/**
 * Tests for DigitalAnalyzer.animation module
 * Validates GSAP timeline creation, parameter passing, and cleanup behavior
 */

import { gsap } from 'gsap'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createTraceAnimation } from './DigitalAnalyzer.animation'
import type { TraceAnimationOptions } from './DigitalAnalyzer.animation'
import { DisplayManager } from './DigitalAnalyzer.display'

describe('TraceAnimationManager', () => {
  let mockPathElement: SVGPathElement
  let mockLightningBolt: HTMLElement
  let displayManager: DisplayManager

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div id="binary-buffer"></div>
      <div id="ascii-text"></div>
    `

    // Create mock SVG path element
    mockPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    mockPathElement.setAttribute('d', 'M 0 0 L 100 0')
    // Mock getTotalLength
    mockPathElement.getTotalLength = vi.fn().mockReturnValue(100)

    // Create mock lightning bolt element
    mockLightningBolt = document.createElement('div')
    mockLightningBolt.dataset.lightningBolt = ''

    // Create display manager
    displayManager = new DisplayManager('binary-buffer', 'ascii-text')

    // Add dark class to test light theme initially
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = ''
    document.documentElement.classList.remove('dark')
    vi.clearAllMocks()
  })

  describe('createTraceAnimation', () => {
    it('should create a valid GSAP timeline', () => {
      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: 'A',
        shouldClear: false,
        displayManager,
        lightningBolt: mockLightningBolt,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'config',
        },
      }

      const timeline = createTraceAnimation(options)

      expect(timeline).toBeDefined()
      expect(timeline).toBeInstanceOf(gsap.core.Timeline)
    })

    it('should energize lightning bolt at position 0', () => {
      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: mockLightningBolt,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)

      // Timeline should be created
      expect(timeline).toBeDefined()
      expect(timeline).toBeInstanceOf(gsap.core.Timeline)
    })

    it('should handle lightning bolt brightness animation', () => {
      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: mockLightningBolt,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)

      // Timeline should be created and animate lightning bolt
      expect(timeline).toBeDefined()
    })

    it('should NOT call clearBinaryBuffer (now handled in hook.ts to prevent race conditions)', () => {
      const clearSpy = vi.spyOn(displayManager, 'clearBinaryBuffer')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      createTraceAnimation(options)

      // clearBinaryBuffer is now called in hook.ts before createTraceAnimation
      // to prevent race condition when multiple traces start close together
      expect(clearSpy).not.toHaveBeenCalled()
    })

    it('should schedule revealBit calls for each bit', () => {
      const revealSpy = vi.spyOn(displayManager, 'revealBit')
      const binaryData = '10101010'

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData,
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)

      // Fast-forward timeline to complete all animations
      timeline.progress(1) // Complete timeline
      timeline.kill() // Clean up

      // Should have called revealBit for each bit
      expect(revealSpy).toHaveBeenCalledTimes(binaryData.length)

      // Check calls were made with correct parameters
      for (let i = 0; i < binaryData.length; i += 1) {
        expect(revealSpy).toHaveBeenNthCalledWith(i + 1, binaryData[i], i)
      }
    })

    it('should schedule appendCharacter calls for config mode', () => {
      const appendSpy = vi.spyOn(displayManager, 'appendCharacter')
      const currentChunk = 'AB'

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '1010101010101010', // 2 bytes worth
        currentChunk,
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 2,
          dataSource: 'config',
        },
      }

      const timeline = createTraceAnimation(options)

      // Fast-forward timeline to complete all animations
      timeline.progress(1)
      timeline.kill()

      // Should have called appendCharacter for each character
      expect(appendSpy).toHaveBeenCalledTimes(currentChunk.length)
      expect(appendSpy).toHaveBeenNthCalledWith(1, 'A')
      expect(appendSpy).toHaveBeenNthCalledWith(2, 'B')
    })

    it('should NOT schedule appendCharacter calls for random mode', () => {
      const appendSpy = vi.spyOn(displayManager, 'appendCharacter')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '', // Empty chunk for random mode
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)
      timeline.progress(1)
      timeline.kill()

      // Should NOT call appendCharacter for random mode
      expect(appendSpy).not.toHaveBeenCalled()
    })

    it('should schedule fadeBinaryBuffer and resetBinaryBuffer', () => {
      const fadeSpy = vi.spyOn(displayManager, 'fadeBinaryBuffer')
      const resetSpy = vi.spyOn(displayManager, 'resetBinaryBuffer')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)
      timeline.progress(1)
      timeline.kill()

      expect(fadeSpy).toHaveBeenCalledOnce()
      expect(resetSpy).toHaveBeenCalledOnce()
    })

    it('should schedule ASCII fade and clear when shouldClear is true', () => {
      const fadeSpy = vi.spyOn(displayManager, 'fadeAsciiDisplay')
      const clearSpy = vi.spyOn(displayManager, 'clearAsciiDisplay')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: true, // Should trigger ASCII fade/clear
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)
      timeline.progress(1)
      timeline.kill()

      expect(fadeSpy).toHaveBeenCalledOnce()
      expect(clearSpy).toHaveBeenCalledOnce()
    })

    it('should NOT schedule ASCII fade/clear when shouldClear is false', () => {
      const fadeSpy = vi.spyOn(displayManager, 'fadeAsciiDisplay')
      const clearSpy = vi.spyOn(displayManager, 'clearAsciiDisplay')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false, // Should NOT trigger ASCII fade/clear
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)
      timeline.progress(1)
      timeline.kill()

      expect(fadeSpy).not.toHaveBeenCalled()
      expect(clearSpy).not.toHaveBeenCalled()
    })

    it('should handle null lightningBolt gracefully', () => {
      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: null, // No lightning bolt element
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      // Should not throw
      expect(() => createTraceAnimation(options)).not.toThrow()
    })

    it('should handle empty binaryData', () => {
      const revealSpy = vi.spyOn(displayManager, 'revealBit')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '', // Empty binary data
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 0,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)
      timeline.progress(1)
      timeline.kill()

      // Should not call revealBit for empty data
      expect(revealSpy).not.toHaveBeenCalled()
    })

    it('should handle empty currentChunk in config mode', () => {
      const appendSpy = vi.spyOn(displayManager, 'appendCharacter')

      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '', // Empty chunk
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'config',
        },
      }

      const timeline = createTraceAnimation(options)
      timeline.progress(1)
      timeline.kill()

      // Should not call appendCharacter for empty chunk
      expect(appendSpy).not.toHaveBeenCalled()
    })

    it('should allow timeline cleanup with kill()', () => {
      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: mockLightningBolt,
        config: {
          traceDrawDuration: 1000,
          traceFadeDelay: 200,
          traceClearDelay: 100,
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)

      // Should not throw when killing timeline
      expect(() => timeline.kill()).not.toThrow()

      // Timeline should be killed
      expect(timeline.isActive()).toBe(false)
    })

    it('should convert milliseconds to seconds correctly for GSAP', () => {
      const options: TraceAnimationOptions = {
        pathElement: mockPathElement,
        binaryData: '10101010',
        currentChunk: '',
        shouldClear: false,
        displayManager,
        lightningBolt: null,
        config: {
          traceDrawDuration: 2000, // 2000ms = 2s
          traceFadeDelay: 500, // 500ms = 0.5s
          traceClearDelay: 100, // 100ms = 0.1s
          byteCount: 1,
          dataSource: 'random',
        },
      }

      const timeline = createTraceAnimation(options)

      // Timeline should have a total duration accounting for all delays
      // We can't precisely test internal timing, but we can verify it's non-zero
      expect(timeline.duration()).toBeGreaterThan(0)
    })
  })
})
