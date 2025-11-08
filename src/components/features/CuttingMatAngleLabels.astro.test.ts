import { describe, expect, it } from 'vitest'

import AngleLabels from '@/components/features/CuttingMatAngleLabels.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('AngleLabels', () => {
  const width = 4000
  const height = 4000
  const angleLineCount = 5
  const majorLineInterval = 200
  const angleLabelArcIndex = 2
  const labelOpacity = 0.175

  it('should create text elements for each angle', async () => {
    const root = await renderAstroComponent(AngleLabels, {
      props: {
        angleLabelArcIndex,
        angleLineCount,
        height,
        labelOpacity,
        majorLineInterval,
        width,
      },
    })

    const labels = root.querySelectorAll('text')
    // Should have 2x angleLineCount (background + foreground for each)
    expect(labels.length).toBe(angleLineCount * 2)
  })

  it('should create background and foreground text pairs', async () => {
    const root = await renderAstroComponent(AngleLabels, {
      props: {
        angleLabelArcIndex,
        angleLineCount: 5,
        height,
        labelOpacity,
        majorLineInterval,
        width,
      },
    })

    const labels = root.querySelectorAll('text')
    for (let i = 0; i < 5; i += 1) {
      const bg = labels[i * 2]
      const fg = labels[i * 2 + 1]

      expect(bg.getAttribute('x')).toBe(fg.getAttribute('x'))
      expect(bg.getAttribute('y')).toBe(fg.getAttribute('y'))
      expect(bg.textContent).toBe(fg.textContent)
    }
  })

  it('should display correct angle values', async () => {
    const root = await renderAstroComponent(AngleLabels, {
      props: {
        angleLabelArcIndex,
        angleLineCount: 5,
        height,
        labelOpacity,
        majorLineInterval,
        width,
      },
    })

    const labels = root.querySelectorAll('text')
    const expectedLabels = ['30°', '60°', '90°', '120°', '150°']

    for (let i = 0; i < 5; i += 1) {
      const fg = labels[i * 2 + 1]
      expect(fg.textContent).toBe(expectedLabels[i])
    }
  })

  it('should use CSS variable for background color', async () => {
    const root = await renderAstroComponent(AngleLabels, {
      props: {
        angleLabelArcIndex,
        angleLineCount,
        height,
        labelOpacity,
        majorLineInterval,
        width,
      },
    })

    const labels = root.querySelectorAll('text')
    const bg = labels[0]
    const bgFill = bg.getAttribute('fill')
    const bgStroke = bg.getAttribute('stroke')

    expect(bgFill).toBe('var(--color-background)')
    expect(bgStroke).toBe('var(--color-background)')
  })
})
