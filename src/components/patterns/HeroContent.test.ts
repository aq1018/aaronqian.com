import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'

import HeroContent from './HeroContent.astro'

describe('HeroContent', () => {
  const renderComponent = async (props = {}, slots = {}) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(HeroContent, { props, slots })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  describe('Props rendering', () => {
    it('should render eyebrow prop', async () => {
      const root = await renderComponent({ eyebrow: 'TEST EYEBROW' })
      expect(root.textContent).toContain('TEST EYEBROW')
    })

    it('should render title prop', async () => {
      const root = await renderComponent({ title: 'Test Title' })
      expect(root.textContent).toContain('Test Title')
    })

    it('should render description prop', async () => {
      const root = await renderComponent({ description: 'Test description content' })
      expect(root.textContent).toContain('Test description content')
    })

    it('should render microLine prop', async () => {
      const root = await renderComponent({ microLine: 'Test micro line' })
      expect(root.textContent).toContain('Test micro line')
    })

    it('should render all props together', async () => {
      const root = await renderComponent({
        eyebrow: 'EYEBROW',
        title: 'Title',
        description: 'Description',
        microLine: 'Micro',
      })
      expect(root.textContent).toContain('EYEBROW')
      expect(root.textContent).toContain('Title')
      expect(root.textContent).toContain('Description')
      expect(root.textContent).toContain('Micro')
    })
  })

  describe('Centered alignment', () => {
    it('should apply text-center class by default', async () => {
      const root = await renderComponent({ title: 'Test' })
      const wrapper = root.querySelector('div')
      expect(wrapper?.className).toContain('text-center')
    })

    it('should apply text-center when centered=true', async () => {
      const root = await renderComponent({ title: 'Test', centered: true })
      const wrapper = root.querySelector('div')
      expect(wrapper?.className).toContain('text-center')
    })

    it('should not apply text-center when centered=false', async () => {
      const root = await renderComponent({ title: 'Test', centered: false })
      const wrapper = root.querySelector('div')
      expect(wrapper?.className).not.toContain('text-center')
    })
  })

  describe('Custom className', () => {
    it('should apply custom class', async () => {
      const root = await renderComponent({ class: 'custom-class' })
      const wrapper = root.querySelector('div')
      expect(wrapper?.className).toContain('custom-class')
    })

    it('should merge custom class with default classes', async () => {
      const root = await renderComponent({ class: 'custom-class' })
      const wrapper = root.querySelector('div')
      expect(wrapper?.className).toContain('custom-class')
      expect(wrapper?.className).toContain('max-w-6xl')
      expect(wrapper?.className).toContain('px-6')
    })
  })

  describe('Default classes', () => {
    it('should apply default wrapper classes', async () => {
      const root = await renderComponent()
      const wrapper = root.querySelector('div')
      expect(wrapper?.className).toContain('relative')
      expect(wrapper?.className).toContain('z-10')
      expect(wrapper?.className).toContain('mx-auto')
      expect(wrapper?.className).toContain('max-w-6xl')
      expect(wrapper?.className).toContain('px-6')
      expect(wrapper?.className).toContain('py-16')
    })
  })

  describe('Empty state', () => {
    it('should render without props', async () => {
      const root = await renderComponent()
      const wrapper = root.querySelector('div')
      expect(wrapper).toBeTruthy()
    })

    it('should render minimal content when no props provided', async () => {
      const root = await renderComponent()
      const wrapper = root.querySelector('div')
      expect(wrapper).toBeTruthy()
      // Should not have much text content
      const trimmedContent = root.textContent.trim()
      expect(trimmedContent.length).toBeLessThan(10)
    })
  })
})
