/**
 * GSAP-based animation module for DigitalAnalyzer trace animations
 * Replaces complex setTimeout chains with cleaner GSAP timeline orchestration
 * @module DigitalAnalyzer.animation
 */
import { gsap } from 'gsap'

import type { DisplayManager } from './DigitalAnalyzer.display'

/** Decoder toggle brightness levels */
const DECODER_TOGGLE_BRIGHTNESS_DIM = 0.7 // Dimmed state (70% brightness)
const DECODER_TOGGLE_BRIGHTNESS_BRIGHT = 1.3 // Energized state (130% brightness)

/** Configuration for trace animation timing and behavior */
export interface TraceAnimationConfig {
  traceDrawDuration: number
  traceFadeDelay: number
  traceClearDelay: number
  byteCount: number
  dataSource: 'config' | 'random'
}

/** Options for creating a trace animation timeline */
export interface TraceAnimationOptions {
  pathElement: SVGPathElement
  binaryData: string
  currentChunk: string
  shouldClear: boolean
  displayManager: DisplayManager
  decoderToggle: HTMLElement | null
  config: TraceAnimationConfig
}

/**
 * Create GSAP timeline for trace animation with synchronized display updates
 * Orchestrates: decoder toggle glow, path drawing, bit/character reveal, fades, clears
 * @param options - Configuration and elements for animation
 * @returns GSAP timeline (call .kill() for cleanup)
 */
export function createTraceAnimation(options: TraceAnimationOptions): gsap.core.Timeline {
  const {
    pathElement,
    binaryData,
    currentChunk,
    shouldClear,
    displayManager,
    decoderToggle,
    config,
  } = options

  const timeline = gsap.timeline()
  const bitCount = binaryData.length

  // 1. Decoder toggle energize (immediate, at position 0)
  if (decoderToggle !== null) {
    // Use brightness filter instead of opacity for consistent "bright" effect in both modes
    timeline.to(
      decoderToggle,
      {
        scale: 1.1,
        filter: `brightness(${DECODER_TOGGLE_BRIGHTNESS_BRIGHT})`,
        duration: 0.2,
        ease: 'power2.out',
      },
      0,
    )
  }

  // 2. Path drawing animation (synchronized with bit reveals)
  const pathLength = pathElement.getTotalLength()
  timeline.fromTo(
    pathElement,
    { strokeDashoffset: pathLength },
    {
      strokeDashoffset: 0,
      duration: config.traceDrawDuration / 1000, // Convert ms to seconds for GSAP
      ease: 'none',
    },
    0,
  )

  // 3. Progressive bit reveal (synchronized with path drawing)
  // Note: clearBinaryBuffer() is called in hook.ts before creating timeline to prevent race conditions
  const msPerBit = config.traceDrawDuration / bitCount

  for (let i = 0; i < bitCount; i += 1) {
    const bit = binaryData[i]
    const revealTime = ((i + 1) * msPerBit) / 1000 // Convert to seconds for GSAP
    timeline.call(
      () => {
        displayManager.revealBit(bit, i)
      },
      undefined,
      revealTime,
    )
  }

  // 4. Progressive character reveal (config mode only)
  if (config.dataSource === 'config' && currentChunk.length > 0) {
    const msPerByte = config.traceDrawDuration / config.byteCount

    for (let i = 0; i < currentChunk.length; i += 1) {
      const char = currentChunk[i]
      const revealTime = ((i + 1) * msPerByte) / 1000 // Convert to seconds for GSAP
      timeline.call(
        () => {
          displayManager.appendCharacter(char)
        },
        undefined,
        revealTime,
      )
    }
  }

  // 5. Decoder toggle reset (after draw completes)
  if (decoderToggle !== null) {
    const resetTime = config.traceDrawDuration / 1000
    timeline.to(
      decoderToggle,
      {
        scale: 1,
        filter: `brightness(${DECODER_TOGGLE_BRIGHTNESS_DIM})`,
        duration: 0.3,
        ease: 'power2.out',
      },
      resetTime,
    )
  }

  // 6. Binary buffer fade and clear
  const fadeTime = (config.traceDrawDuration + config.traceFadeDelay) / 1000
  timeline.call(
    () => {
      displayManager.fadeBinaryBuffer()
    },
    undefined,
    fadeTime,
  )

  const clearTime = fadeTime + (200 + config.traceClearDelay) / 1000
  timeline.call(
    () => {
      displayManager.resetBinaryBuffer()
    },
    undefined,
    clearTime,
  )

  // 7. ASCII display fade (if shouldClear)
  if (shouldClear) {
    const asciiFadeTime = fadeTime + 0.5
    timeline.call(
      () => {
        displayManager.fadeAsciiDisplay()
      },
      undefined,
      asciiFadeTime,
    )

    const asciiClearTime = asciiFadeTime + (200 + config.traceClearDelay) / 1000
    timeline.call(
      () => {
        displayManager.clearAsciiDisplay()
      },
      undefined,
      asciiClearTime,
    )
  }

  return timeline
}
