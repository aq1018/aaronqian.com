import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'

import Link from './Link.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('Link.astro', () => {
  describe('Rendering', () => {
    it('should render as an anchor element', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/test' },
      })

      const a = root.querySelector('a')
      expect(a).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/test' },
        slots: { default: 'Link Text' },
      })

      const a = root.querySelector('a')
      expect(a?.textContent.trim()).toBe('Link Text')
    })

    it('should apply href attribute', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/test-path' },
      })

      const a = root.querySelector('a')
      expect(a?.getAttribute('href')).toBe('/test-path')
    })

    it('should render with variant classes applied', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/test', variant: 'nav', active: true },
      })

      const a = root.querySelector('a')
      expect(a).toHaveClasses(['transition-colors'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/test', class: 'custom-link' },
      })

      const a = root.querySelector('a')
      expect(a?.classList.contains('custom-link')).toBe(true)
      expect(a).toHaveClasses(['transition-colors'])
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/test', id: 'test-link', 'data-testid': 'link' },
      })

      const a = root.querySelector('a')
      expect(a?.id).toBe('test-link')
      expect(a).toHaveDataAttribute('data-testid', 'link')
    })
  })

  describe('External Link Detection', () => {
    it('should not set target/rel for internal links', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/internal' },
      })

      const a = root.querySelector('a')
      expect(a?.target).toBeFalsy()
      expect(a?.rel).toBeFalsy()
    })

    it('should set target and rel for external links (http)', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: 'https://example.com', external: true },
      })

      const a = root.querySelector('a')
      expect(a?.getAttribute('target')).toBe('_blank')
      expect(a?.getAttribute('rel')).toBe('noopener noreferrer')
    })

    it('should respect explicit external prop', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: '/path', external: true },
      })

      const a = root.querySelector('a')
      expect(a?.target).toBe('_blank')
      expect(a?.rel).toBe('noopener noreferrer')
    })

    it('should allow custom target override', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: 'https://example.com', target: '_self' },
      })

      const a = root.querySelector('a')
      expect(a?.target).toBe('_self')
    })

    it('should allow custom rel override', async () => {
      const root = await renderAstroComponent(Link, {
        props: { href: 'https://example.com', rel: 'custom-rel' },
      })

      const a = root.querySelector('a')
      expect(a?.rel).toBe('custom-rel')
    })
  })
})
