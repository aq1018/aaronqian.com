/**
 * GSAP-based animation module for DigitalAnalyzer trace animations
 * Replaces complex setTimeout chains with cleaner GSAP timeline orchestration
 * @module DigitalAnalyzer.animation
 */
import { gsap } from 'gsap'

import type { DisplayManager } from './DigitalAnalyzer.display'

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
  lightningBolt: HTMLElement | null
  config: TraceAnimationConfig
  getLightningGlowColor: (isDark: boolean) => string
}

/**
 * Create GSAP timeline for trace animation with synchronized display updates
 * Orchestrates: lightning glow, path drawing, bit/character reveal, fades, clears
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
    lightningBolt,
    config,
    getLightningGlowColor,
  } = options

  const timeline = gsap.timeline()
  const bitCount = binaryData.length

  // 1. Lightning bolt glow (immediate, at position 0)
  if (lightningBolt !== null) {
    const isDark = document.documentElement.classList.contains('dark')
    const glowColor = getLightningGlowColor(isDark)
    timeline.set(
      lightningBolt,
      {
        opacity: 1,
        scale: 1.1,
        filter: `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 4px ${glowColor})`,
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

  // 5. Lightning bolt reset (after draw completes)
  if (lightningBolt !== null) {
    const resetTime = config.traceDrawDuration / 1000
    timeline.set(
      lightningBolt,
      {
        opacity: 0.7,
        scale: 1,
        filter: 'none',
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
