import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import DraftBanner from './DraftBanner.astro'

describe('DraftBanner', () => {
  it('should render the draft warning banner', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    expect(root).toBeTruthy()
  })

  it('should contain the draft warning text', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    expect(root.textContent).toContain('Draft')
    expect(root.textContent).toContain('This content is a work in progress')
  })

  it('should contain the draft emoji', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    expect(root.textContent).toContain('📝')
  })

  it('should have centered text', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    const textElement = root.querySelector('.text-center')
    expect(textElement).toBeTruthy()
  })

  it('should have semibold font weight', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    const textElement = root.querySelector('.font-semibold')
    expect(textElement).toBeTruthy()
  })

  it('should use danger color border', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    const borderElement = root.querySelector(String.raw`.border-danger\/20`)
    expect(borderElement).toBeTruthy()
  })

  it('should be sticky at the top', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    const stickyElement = root.querySelector('.sticky')
    expect(stickyElement).toBeTruthy()
    expect(stickyElement?.classList.contains('top-0')).toBeTruthy()
  })

  it('should have high z-index for layering', async () => {
    const root = await renderAstroComponent(DraftBanner, { props: {} })

    const zIndexElement = root.querySelector('.z-50')
    expect(zIndexElement).toBeTruthy()
  })
})
