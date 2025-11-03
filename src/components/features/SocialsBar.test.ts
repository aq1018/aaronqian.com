import '@testing-library/jest-dom/vitest'
import type { CollectionEntry } from 'astro:content'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import SocialsBar from './SocialsBar.astro'

import { renderAstroComponent } from '@test/testHelpers'

// Mock getCollection
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}))

const { getCollection } = await import('astro:content')

// Mock social data
interface MockSocialParams {
  id: string
  label: string
  url: string
  position: number
  enabled: boolean
  rel?: string
}

const createMockSocial = (params: MockSocialParams): CollectionEntry<'socials'> => {
  const result = {
    id: params.id,
    collection: 'socials',
    data: {
      label: params.label,
      url: params.url,
      position: params.position,
      enabled: params.enabled,
      rel: params.rel,
    },
  }
  return result as CollectionEntry<'socials'>
}

describe('SocialsBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Social link rendering', () => {
    it('should render enabled social links', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
          rel: 'me noopener',
        }),
        createMockSocial({
          id: 'linkedin',
          label: 'LinkedIn',
          url: 'https://linkedin.com/in/user',
          position: 2,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(2)
    })

    it('should not render disabled social links', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
        createMockSocial({
          id: 'twitter',
          label: 'Twitter',
          url: 'https://twitter.com/user',
          position: 2,
          enabled: false,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(1)
      expect(root.textContent).not.toContain('Twitter')
    })

    it('should render social links in position order', async () => {
      const socials = [
        createMockSocial({
          id: 'linkedin',
          label: 'LinkedIn',
          url: 'https://linkedin.com/in/user',
          position: 2,
          enabled: true,
        }),
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
        createMockSocial({
          id: 'email',
          label: 'Email',
          url: 'mailto:user@example.com',
          position: 3,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(3)
      // Links should be in position order (GitHub=1, LinkedIn=2, Email=3)
      expect(links[0].getAttribute('href')).toBe('https://github.com/user')
      expect(links[1].getAttribute('href')).toBe('https://linkedin.com/in/user')
      expect(links[2].getAttribute('href')).toBe('mailto:user@example.com')
    })
  })

  describe('Link attributes', () => {
    it('should include correct href attributes', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const link = root.querySelector('a')
      if (link !== null) {
        expect(link.getAttribute('href')).toBe('https://github.com/user')
      }
    })

    it('should include aria-label for accessibility', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const link = root.querySelector('a')
      if (link !== null) {
        expect(link.getAttribute('aria-label')).toBe('GitHub profile')
      }
    })

    it('should apply rel attribute when provided', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
          rel: 'me noopener',
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const link = root.querySelector('a')
      if (link !== null) {
        expect(link.getAttribute('rel')).toBe('me noopener')
      }
    })
  })

  describe('Variants', () => {
    it('should render compact variant without labels by default', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      // Icon should be present but label text should not be in link text
      const link = root.querySelector('a')
      expect(link).toBeTruthy()
      // In compact mode, label is not rendered in the link
      if (link !== null) {
        expect(link.textContent.trim()).not.toBe('GitHub')
      }
    })

    it('should render wide variant with labels', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: { variant: 'wide' } })

      const link = root.querySelector('a')
      if (link !== null) {
        expect(link.textContent).toContain('GitHub')
      }
    })
  })

  describe('Empty state', () => {
    it('should render without errors when no socials are enabled', async () => {
      vi.mocked(getCollection).mockResolvedValue([] as never)

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      expect(root).toBeTruthy()
      const links = root.querySelectorAll('a')
      expect(links.length).toBe(0)
    })
  })

  describe('Icon rendering', () => {
    it('should render icons for all social links', async () => {
      const socials = [
        createMockSocial({
          id: 'github',
          label: 'GitHub',
          url: 'https://github.com/user',
          position: 1,
          enabled: true,
        }),
        createMockSocial({
          id: 'linkedin',
          label: 'LinkedIn',
          url: 'https://linkedin.com/in/user',
          position: 2,
          enabled: true,
        }),
      ]

      vi.mocked(getCollection).mockImplementation(
        async (collection: string, filter?: (entry: { data: unknown }) => boolean) => {
          if (collection === 'socials' && filter !== undefined) {
            return await Promise.resolve(socials.filter((s) => filter({ data: s.data })) as never)
          }
          return await Promise.resolve([] as never)
        },
      )

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      // Icons are rendered as svg elements by astro-icon
      const svgs = root.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })
  })
})
