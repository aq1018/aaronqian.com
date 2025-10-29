import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Button from './Button.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Button.astro', () => {
  describe('Rendering', () => {
    it('should render as a button element', async () => {
      const root = await renderAstroComponent(Button, {
        props: {},
      })

      const button = root.querySelector('button')
      expect(button).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Button, {
        props: {},
        slots: { default: 'Click Me' },
      })

      const button = root.querySelector('button')
      expect(button?.textContent.trim()).toBe('Click Me')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Button, {
        props: { variant: 'solid', color: 'primary' },
      })

      const button = root.querySelector('button')
      expect(button).toHaveClasses(['inline-flex', 'items-center'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Button, {
        props: { class: 'custom-btn' },
      })

      const button = root.querySelector('button')
      expect(button?.classList.contains('custom-btn')).toBe(true)
      expect(button).toHaveClasses(['inline-flex']) // Base class still present
    })
  })

  describe('Type Attribute', () => {
    it('should default to submit type when not specified', async () => {
      const root = await renderAstroComponent(Button, {
        props: {},
      })

      const button = root.querySelector('button')
      expect(button?.type).toBe('submit')
    })

    it('should apply type="submit" when specified', async () => {
      const root = await renderAstroComponent(Button, {
        props: { type: 'submit' },
      })

      const button = root.querySelector('button')
      expect(button?.type).toBe('submit')
    })

    it('should apply type="reset" when specified', async () => {
      const root = await renderAstroComponent(Button, {
        props: { type: 'reset' },
      })

      const button = root.querySelector('button')
      expect(button?.type).toBe('reset')
    })
  })

  describe('Disabled State', () => {
    it('should not be disabled by default', async () => {
      const root = await renderAstroComponent(Button, {
        props: {},
      })

      const button = root.querySelector('button')
      expect(button?.disabled).toBe(false)
    })

    it('should apply disabled attribute when true', async () => {
      const root = await renderAstroComponent(Button, {
        props: { disabled: true },
      })

      const button = root.querySelector('button')
      expect(button?.disabled).toBe(true)
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Button, {
        props: { id: 'test-btn', 'data-testid': 'button', 'aria-label': 'Test button' },
      })

      const button = root.querySelector('button')
      expect(button?.id).toBe('test-btn')
      expect(button).toHaveDataAttribute('data-testid', 'button')
      expect(button?.getAttribute('aria-label')).toBe('Test button')
    })
  })
})
