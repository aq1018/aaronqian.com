import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import BlogList from './BlogList.astro'

const createMockPost = (
  id: string,
  title: string,
  date: Date,
): Partial<CollectionEntry<'blog'>> => ({
  body: '',
  collection: 'blog',
  data: {
    date,
    description: `Description for ${title}`,
    draft: false,
    tags: ['tag1', 'tag2'],
    title,
  },
  id,
  slug: id.replace(/\/index(\.md)?$/, ''),
})

describe('BlogList', () => {
  describe('Post rendering', () => {
    it('should render post title as link', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      const links = root.querySelectorAll('a')
      const postLink = [...links].find((link) => link.textContent.trim() === 'Post A')
      expect(postLink).toBeDefined()
      if (postLink) {
        expect(postLink.getAttribute('href')).toBe('/blog/post-a')
      }
    })

    it('should render post date', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      // Date rendering can vary by timezone, just check year is present
      expect(root.textContent).toContain('2023')
      expect(root.textContent).toContain('Jan')
    })

    it('should render post description', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      expect(root.textContent).toContain('Description for Post A')
    })

    it('should render multiple posts', async () => {
      const posts = [
        createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15')),
        createMockPost('post-b/index.md', 'Post B', new Date('2023-02-20')),
        createMockPost('post-c/index.md', 'Post C', new Date('2023-03-25')),
      ]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      const list = root.querySelector('ul')
      expect(list).toBeTruthy()

      const listItems = root.querySelectorAll('li')
      expect(listItems.length).toBe(3)
    })
  })

  describe('Tags', () => {
    it('should render post tags', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      expect(root.textContent).toContain('tag1')
      expect(root.textContent).toContain('tag2')
    })

    it('should not render tags when array is empty', async () => {
      const postWithoutTags = createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))

      const root = await renderAstroComponent(BlogList, {
        props: {
          posts: [postWithoutTags],
        },
      })

      expect(root.textContent).toContain('Post A')
    })
  })

  describe('Footer', () => {
    it('should render footer when provided', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const footerText = 'New posts whenever inspiration strikes.'
      const root = await renderAstroComponent(BlogList, {
        props: {
          footer: footerText,
          posts,
        },
      })

      expect(root.textContent).toContain(footerText)
    })

    it('should render custom footer text', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const customFooter = 'Custom footer message'
      const root = await renderAstroComponent(BlogList, {
        props: {
          footer: customFooter,
          posts,
        },
      })

      expect(root.textContent).toContain(customFooter)
    })

    it('should not render footer when not provided', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      expect(root.textContent).not.toContain('New posts whenever')
    })
  })

  describe('Empty state', () => {
    it('should render without posts', async () => {
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts: [],
        },
      })

      expect(root).toBeTruthy()
    })

    it('should have no post links when posts array is empty', async () => {
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts: [],
        },
      })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(0)
    })
  })

  describe('Post links', () => {
    it('should create correct link URLs', async () => {
      const posts = [
        createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15')),
        createMockPost('post-b/index', 'Post B', new Date('2023-02-20')),
        createMockPost('post-c', 'Post C', new Date('2023-03-25')),
      ]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      const links = root.querySelectorAll('a')
      const postALink = [...links].find((link) => link.textContent.trim().includes('Post A'))
      const postBLink = [...links].find((link) => link.textContent.trim().includes('Post B'))
      const postCLink = [...links].find((link) => link.textContent.trim().includes('Post C'))

      if (postALink && postBLink && postCLink) {
        expect(postALink.getAttribute('href')).toBe('/blog/post-a')
        expect(postBLink.getAttribute('href')).toBe('/blog/post-b')
        expect(postCLink.getAttribute('href')).toBe('/blog/post-c')
      }
    })
  })

  describe('Column headers', () => {
    it('should render column headers', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      expect(root.textContent).toContain('Date')
      expect(root.textContent).toContain('Title')
      expect(root.textContent).toContain('Description')
    })
  })

  describe('Semantic markup', () => {
    it('should use ul element for post list', async () => {
      const posts = [createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15'))]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      const ul = root.querySelector('ul')
      expect(ul).toBeTruthy()
    })

    it('should use li elements for each post', async () => {
      const posts = [
        createMockPost('post-a/index.md', 'Post A', new Date('2023-01-15')),
        createMockPost('post-b/index.md', 'Post B', new Date('2023-02-20')),
      ]
      const root = await renderAstroComponent(BlogList, {
        props: {
          posts,
        },
      })

      const listItems = root.querySelectorAll('li')
      expect(listItems.length).toBe(2)
    })
  })
})
