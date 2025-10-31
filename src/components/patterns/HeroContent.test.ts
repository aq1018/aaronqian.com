import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import HeroContent from './HeroContent.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('HeroContent', () => {
  describe('Props rendering', () => {
    it('should render eyebrow prop', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { eyebrow: 'TEST EYEBROW' },
      })
      expect(root.textContent).toContain('TEST EYEBROW')
    })

    it('should render title prop', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { title: 'Test Title' },
      })
      expect(root.textContent).toContain('Test Title')
    })

    it('should render description prop', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { description: 'Test description content' },
      })
      expect(root.textContent).toContain('Test description content')
    })

    it('should render microLine prop', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { microLine: 'Test micro line' },
      })
      expect(root.textContent).toContain('Test micro line')
    })

    it('should render all props together', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: {
          eyebrow: 'EYEBROW',
          title: 'Title',
          description: 'Description',
          microLine: 'Micro',
        },
      })
      expect(root.textContent).toContain('EYEBROW')
      expect(root.textContent).toContain('Title')
      expect(root.textContent).toContain('Description')
      expect(root.textContent).toContain('Micro')
    })
  })

  describe('Centered alignment', () => {
    it('should center content by default', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { title: 'Test' },
      })
      const heading = root.querySelector('h1')
      expect(heading?.className).toContain('text-center')
    })

    it('should center content when centered=true', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { title: 'Test', centered: true },
      })
      const heading = root.querySelector('h1')
      expect(heading?.className).toContain('text-center')
    })

    it('should not center content when centered=false', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { title: 'Test', centered: false },
      })
      const heading = root.querySelector('h1')
      expect(heading?.className).not.toContain('text-center')
    })
  })

  describe('Custom className', () => {
    it('should apply custom class to Container', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { class: 'custom-class' },
      })
      const container = root.querySelector('div')
      expect(container?.className).toContain('custom-class')
    })

    it('should merge custom class with Container classes', async () => {
      const root = await renderAstroComponent(HeroContent, {
        props: { class: 'custom-class' },
      })
      const container = root.querySelector('div')
      expect(container?.className).toContain('custom-class')
      expect(container?.className).toContain('w-full')
    })
  })

  describe('Default classes', () => {
    it('should render with Container component', async () => {
      const root = await renderAstroComponent(HeroContent, { props: {} })
      const container = root.querySelector('div')
      expect(container?.className).toContain('relative')
      expect(container?.className).toContain('w-full')
      expect(container?.className).toContain('mx-auto')
    })
  })

  describe('Empty state', () => {
    it('should render without props', async () => {
      const root = await renderAstroComponent(HeroContent, { props: {} })
      const wrapper = root.querySelector('div')
      expect(wrapper).toBeTruthy()
    })

    it('should render minimal content when no props provided', async () => {
      const root = await renderAstroComponent(HeroContent, { props: {} })
      const wrapper = root.querySelector('div')
      expect(wrapper).toBeTruthy()
      // Should not have much text content
      const trimmedContent = root.textContent.trim()
      expect(trimmedContent.length).toBeLessThan(10)
    })
  })
})
