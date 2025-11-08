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
 * Add decoder toggle energize animation to timeline
 */
function addDecoderEnergize(timeline: gsap.core.Timeline, decoderToggle: HTMLElement | null): void {
  if (decoderToggle != null) {
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
}

/**
 * Add path drawing animation to timeline
 */
function addPathDrawing(
  timeline: gsap.core.Timeline,
  pathElement: SVGPathElement,
  duration: number,
): void {
  const pathLength = pathElement.getTotalLength()
  timeline.fromTo(
    pathElement,
    { strokeDashoffset: pathLength },
    {
      strokeDashoffset: 0,
      duration: duration / 1000,
      ease: 'none',
    },
    0,
  )
}

/**
 * Add progressive bit reveal animations to timeline
 */
function addBitReveals(
  timeline: gsap.core.Timeline,
  binaryData: string,
  displayManager: DisplayManager,
  duration: number,
): void {
  const bitCount = binaryData.length
  const msPerBit = duration / bitCount

  for (let i = 0; i < bitCount; i += 1) {
    const bit = binaryData[i]
    const revealTime = ((i + 1) * msPerBit) / 1000
    timeline.call(
      () => {
        displayManager.revealBit(bit, i)
      },
      undefined,
      revealTime,
    )
  }
}

/**
 * Add progressive character reveal animations to timeline (config mode only)
 */
function addCharacterReveals(
  timeline: gsap.core.Timeline,
  currentChunk: string,
  displayManager: DisplayManager,
  config: TraceAnimationConfig,
): void {
  if (config.dataSource === 'config' && currentChunk.length > 0) {
    const msPerByte = config.traceDrawDuration / config.byteCount

    for (let i = 0; i < currentChunk.length; i += 1) {
      const char = currentChunk[i]
      const revealTime = ((i + 1) * msPerByte) / 1000
      timeline.call(
        () => {
          displayManager.appendCharacter(char)
        },
        undefined,
        revealTime,
      )
    }
  }
}

/**
 * Add decoder toggle reset animation to timeline
 */
function addDecoderReset(
  timeline: gsap.core.Timeline,
  decoderToggle: HTMLElement | null,
  duration: number,
): void {
  if (decoderToggle != null) {
    const resetTime = duration / 1000
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
}

/**
 * Add binary buffer fade and clear animations to timeline
 */
function addBinaryFadeAndClear(
  timeline: gsap.core.Timeline,
  displayManager: DisplayManager,
  config: TraceAnimationConfig,
): number {
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

  return fadeTime
}

/**
 * Add ASCII display fade and clear animations to timeline (if shouldClear)
 */
function addAsciiFadeAndClear(
  timeline: gsap.core.Timeline,
  displayManager: DisplayManager,
  fadeTime: number,
  traceClearDelay: number,
): void {
  const asciiFadeTime = fadeTime + 0.5
  timeline.call(
    () => {
      displayManager.fadeAsciiDisplay()
    },
    undefined,
    asciiFadeTime,
  )

  const asciiClearTime = asciiFadeTime + (200 + traceClearDelay) / 1000
  timeline.call(
    () => {
      displayManager.clearAsciiDisplay()
    },
    undefined,
    asciiClearTime,
  )
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

  addDecoderEnergize(timeline, decoderToggle)
  addPathDrawing(timeline, pathElement, config.traceDrawDuration)
  addBitReveals(timeline, binaryData, displayManager, config.traceDrawDuration)
  addCharacterReveals(timeline, currentChunk, displayManager, config)
  addDecoderReset(timeline, decoderToggle, config.traceDrawDuration)

  const fadeTime = addBinaryFadeAndClear(timeline, displayManager, config)
  if (shouldClear) {
    addAsciiFadeAndClear(timeline, displayManager, fadeTime, config.traceClearDelay)
  }

  return timeline
}
