import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import BlogListItem from './BlogListItem.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('BlogListItem Component', () => {
  const mockPost: CollectionEntry<'blog'> = {
    id: 'test-post/index.md',
    slug: 'test-post',
    collection: 'blog',
    data: {
      title: 'Test Blog Post',
      description: 'A test blog post description',
      date: new Date('2023-01-15'),
      tags: ['testing', 'vitest'],
    },
  } as unknown as CollectionEntry<'blog'>

  describe('Rendering', () => {
    it('should render as a list item (li)', async () => {
      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: mockPost,
        },
      })

      expect(root.innerHTML).toContain('<li')
    })

    it('should render post title as a link', async () => {
      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: mockPost,
        },
      })

      expect(root.innerHTML).toContain('Test Blog Post')
      expect(root.innerHTML).toContain('/blog/test-post')
    })

    it('should render post date', async () => {
      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: mockPost,
        },
      })

      // Date rendering can vary by timezone, just check year is present
      expect(root.innerHTML).toContain('2023')
      expect(root.innerHTML).toContain('Jan')
    })

    it('should render post description', async () => {
      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: mockPost,
        },
      })

      expect(root.innerHTML).toContain('A test blog post description')
    })
  })

  describe('Tags', () => {
    it('should render tags when present', async () => {
      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: mockPost,
        },
      })

      expect(root.innerHTML).toContain('testing')
      expect(root.innerHTML).toContain('vitest')
    })

    it('should not render tags when array is empty', async () => {
      const postWithoutTags = {
        ...mockPost,
        data: { ...mockPost.data, tags: [] },
      }

      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: postWithoutTags,
        },
      })

      expect(root.innerHTML).toContain('Test Blog Post')
      expect(root.innerHTML).not.toContain('testing')
    })

    it('should not render tags when undefined', async () => {
      const postWithoutTags = {
        ...mockPost,
        data: { ...mockPost.data, tags: undefined },
      }

      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: postWithoutTags,
        },
      })

      expect(root.innerHTML).toContain('Test Blog Post')
    })
  })

  describe('Edge Cases', () => {
    it('should handle long post titles', async () => {
      const longTitlePost = {
        ...mockPost,
        data: {
          ...mockPost.data,
          title: 'This is a Very Long Blog Post Title That Should Still Render Correctly',
        },
      }

      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: longTitlePost,
        },
      })

      expect(root.innerHTML).toContain(
        'This is a Very Long Blog Post Title That Should Still Render Correctly',
      )
    })

    it('should handle long descriptions', async () => {
      const longDescPost = {
        ...mockPost,
        data: {
          ...mockPost.data,
          description:
            'This is a very long description that goes into great detail about the blog post content',
        },
      }

      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: longDescPost,
        },
      })

      expect(root.innerHTML).toContain(
        'This is a very long description that goes into great detail about the blog post content',
      )
    })

    it('should handle multiple tags', async () => {
      const multiTagPost = {
        ...mockPost,
        data: {
          ...mockPost.data,
          tags: ['javascript', 'typescript', 'testing', 'vitest', 'astro'],
        },
      }

      const root = await renderAstroComponent(BlogListItem, {
        props: {
          post: multiTagPost,
        },
      })

      expect(root.innerHTML).toContain('javascript')
      expect(root.innerHTML).toContain('typescript')
      expect(root.innerHTML).toContain('testing')
      expect(root.innerHTML).toContain('vitest')
      expect(root.innerHTML).toContain('astro')
    })
  })
})
