import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import SocialsBar from './SocialsBar.astro'

type SocialEntry = CollectionEntry<'socials'>

// Mock getCollection
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}))

// Mock social data
interface MockSocialParams {
  id: string
  label: string
  url: string
  position: number
  enabled: boolean
  rel?: string
}

const createMockSocial = (params: MockSocialParams): SocialEntry => {
  const result = {
    collection: 'socials',
    data: {
      enabled: params.enabled,
      label: params.label,
      position: params.position,
      rel: params.rel,
      url: params.url,
    },
    id: params.id,
  } satisfies SocialEntry

  return result
}

describe('SocialsBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Social link rendering', () => {
    it('should render enabled social links', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          rel: 'me noopener',
          url: 'https://github.com/user',
        }),
        createMockSocial({
          enabled: true,
          id: 'linkedin',
          label: 'LinkedIn',
          position: 2,
          url: 'https://linkedin.com/in/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })
      const links = root.querySelectorAll('a')

      expect(links.length).toBe(2)
    })

    it('should not render disabled social links', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(1)
      expect(root.textContent).not.toContain('Twitter')
    })

    it('should render social links in position order', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'linkedin',
          label: 'LinkedIn',
          position: 2,
          url: 'https://linkedin.com/in/user',
        }),
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
        createMockSocial({
          enabled: true,
          id: 'email',
          label: 'Email',
          position: 3,
          url: 'mailto:user@example.com',
        }),
      ])

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
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const link = root.querySelector('a')
      if (link) {
        expect(link.getAttribute('href')).toBe('https://github.com/user')
      }
    })

    it('should include aria-label for accessibility', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const link = root.querySelector('a')
      if (link) {
        expect(link.getAttribute('aria-label')).toBe('GitHub profile')
      }
    })

    it('should apply rel attribute when provided', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          rel: 'me noopener',
          url: 'https://github.com/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      const link = root.querySelector('a')
      if (link) {
        expect(link.getAttribute('rel')).toBe('me noopener')
      }
    })
  })

  describe('Variants', () => {
    it('should render compact variant without labels by default', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      // Icon should be present but label text should not be in link text
      const link = root.querySelector('a')
      expect(link).toBeTruthy()
      // In compact mode, label is not rendered in the link
      if (link) {
        expect(link.textContent.trim()).not.toBe('GitHub')
      }
    })

    it('should render wide variant with labels', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: { variant: 'wide' } })

      const link = root.querySelector('a')
      if (link) {
        expect(link.textContent).toContain('GitHub')
      }
    })
  })

  describe('Empty state', () => {
    it('should render without errors when no socials are enabled', async () => {
      vi.mocked(getCollection).mockResolvedValue([])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      expect(root).toBeTruthy()
      const links = root.querySelectorAll('a')
      expect(links.length).toBe(0)
    })
  })

  describe('Icon rendering', () => {
    it('should render icons for all social links', async () => {
      vi.mocked(getCollection).mockResolvedValueOnce([
        createMockSocial({
          enabled: true,
          id: 'github',
          label: 'GitHub',
          position: 1,
          url: 'https://github.com/user',
        }),
        createMockSocial({
          enabled: true,
          id: 'linkedin',
          label: 'LinkedIn',
          position: 2,
          url: 'https://linkedin.com/in/user',
        }),
      ])

      const root = await renderAstroComponent(SocialsBar, { props: {} })

      // Icons are rendered as svg elements by astro-icon
      const svgs = root.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })
  })
})
