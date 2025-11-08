import { describe, expect, it } from 'vitest'

import AngleLines from '@/components/features/CuttingMatAngleLines.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('AngleLines', () => {
  const width = 4000
  const height = 4000
  const centerX = width / 2
  const bottomY = height
  const angleLineCount = 5
  const opacity = 0.175
  const strokeWidth = 1.5

  it('should create correct number of line elements', async () => {
    const root = await renderAstroComponent(AngleLines, {
      props: { angleLineCount, height, opacity, strokeWidth, width },
    })
    const lines = root.querySelectorAll('line')

    expect(lines.length).toBe(angleLineCount)
  })

  it('should create lines starting at bottom center', async () => {
    const root = await renderAstroComponent(AngleLines, {
      props: { angleLineCount, height, opacity, strokeWidth, width },
    })
    const lines = root.querySelectorAll('line')

    lines.forEach((line) => {
      expect(line.getAttribute('x1')).toBe(String(centerX))
      expect(line.getAttribute('y1')).toBe(String(bottomY))
    })
  })

  it('should distribute angles evenly from 30° to 150°', async () => {
    const root = await renderAstroComponent(AngleLines, {
      props: { angleLineCount: 5, height, opacity, strokeWidth, width },
    })
    const lines = root.querySelectorAll('line')

    const expectedAngles = [30, 60, 90, 120, 150]

    lines.forEach((line, i) => {
      const x2 = Number.parseFloat(line.getAttribute('x2') ?? '0')
      const y2 = Number.parseFloat(line.getAttribute('y2') ?? '0')

      const dx = x2 - centerX
      const dy = bottomY - y2
      const calculatedAngle = (Math.atan2(dy, dx) * 180) / Math.PI

      expect(calculatedAngle).toBeCloseTo(expectedAngles[i], 0.1)
    })
  })

  it('should apply correct opacity', async () => {
    const root = await renderAstroComponent(AngleLines, {
      props: { angleLineCount, height, opacity, strokeWidth, width },
    })
    const lines = root.querySelectorAll('line')

    lines.forEach((line) => {
      expect(line.getAttribute('opacity')).toBe(String(opacity))
    })
  })

  it('should apply correct stroke width', async () => {
    const root = await renderAstroComponent(AngleLines, {
      props: { angleLineCount, height, opacity, strokeWidth, width },
    })
    const lines = root.querySelectorAll('line')

    lines.forEach((line) => {
      expect(line.getAttribute('stroke-width')).toBe(String(strokeWidth))
    })
  })

  it('should handle different angle line counts', async () => {
    const root3 = await renderAstroComponent(AngleLines, {
      props: { angleLineCount: 3, height, opacity, strokeWidth, width },
    })
    const root7 = await renderAstroComponent(AngleLines, {
      props: { angleLineCount: 7, height, opacity, strokeWidth, width },
    })

    const lines3 = root3.querySelectorAll('line')
    const lines7 = root7.querySelectorAll('line')

    expect(lines3.length).toBe(3)
    expect(lines7.length).toBe(7)
  })

  it('should create lines long enough to reach edge of canvas', async () => {
    const root = await renderAstroComponent(AngleLines, {
      props: { angleLineCount, height, opacity, strokeWidth, width },
    })
    const lines = root.querySelectorAll('line')

    lines.forEach((line) => {
      const x2 = Number.parseFloat(line.getAttribute('x2') ?? '0')
      const y2 = Number.parseFloat(line.getAttribute('y2') ?? '0')

      const dx = x2 - centerX
      const dy = bottomY - y2
      const distance = Math.sqrt(dx * dx + dy * dy)

      const minDistance = Math.max(width, height) * 0.5
      expect(distance).toBeGreaterThanOrEqual(minDistance - 1)
    })
  })
})
