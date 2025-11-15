/**
 * Tests for JSON-LD generator functions
 */
import { describe, expect, it } from 'vitest'

import {
  generateArticleSchema,
  generateBlogPostingSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generatePersonSchema,
  generateWebSiteSchema,
} from './generators'

describe('generateWebSiteSchema', () => {
  it('should generate valid WebSite schema', () => {
    const schema = generateWebSiteSchema({
      name: 'Test Site',
      url: 'https://example.com',
      description: 'A test website',
    })

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('WebSite')
    expect(schema.name).toBe('Test Site')
    expect(schema.url).toBe('https://example.com')
    expect(schema.description).toBe('A test website')
    expect(schema.inLanguage).toBe('en-US')
  })

  it('should sanitize description', () => {
    const schema = generateWebSiteSchema({
      name: 'Test Site',
      url: 'https://example.com',
      description: '  Multiple   spaces\n  and newlines  ',
    })

    expect(schema.description).toBe('Multiple spaces and newlines')
  })
})

describe('generatePersonSchema', () => {
  it('should generate minimal Person schema', () => {
    const schema = generatePersonSchema({
      name: 'John Doe',
      url: 'https://example.com',
    })

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'John Doe',
      url: 'https://example.com',
    })
  })

  it('should include optional fields when provided', () => {
    const schema = generatePersonSchema({
      name: 'John Doe',
      url: 'https://example.com',
      description: 'A test person',
      email: 'john@example.com',
      image: 'https://example.com/photo.jpg',
      sameAs: ['https://twitter.com/johndoe', 'https://github.com/johndoe'],
    })

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'John Doe',
      url: 'https://example.com',
      description: 'A test person',
      email: 'john@example.com',
      image: { '@type': 'ImageObject', url: 'https://example.com/photo.jpg' },
      sameAs: ['https://twitter.com/johndoe', 'https://github.com/johndoe'],
    })
  })

  it('should not include sameAs if empty array', () => {
    const schema = generatePersonSchema({
      name: 'John Doe',
      url: 'https://example.com',
      sameAs: [],
    })

    expect(JSON.stringify(schema)).not.toContain('sameAs')
  })
})

describe('generateOrganizationSchema', () => {
  it('should generate minimal Organization schema', () => {
    const schema = generateOrganizationSchema({
      name: 'Test Org',
      url: 'https://example.com',
    })

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test Org',
      url: 'https://example.com',
    })
  })

  it('should include optional fields when provided', () => {
    const schema = generateOrganizationSchema({
      name: 'Test Org',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png',
      sameAs: ['https://twitter.com/testorg'],
    })

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Test Org',
      url: 'https://example.com',
      logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
      sameAs: ['https://twitter.com/testorg'],
    })
  })
})

describe('generateArticleSchema', () => {
  const config = {
    baseUrl: 'https://example.com',
    authorName: 'John Doe',
    authorUrl: 'https://example.com/author',
  }

  it('should generate minimal Article schema', () => {
    const schema = generateArticleSchema(
      {
        title: 'Test Article',
        description: 'A test article',
        datePublished: '2024-01-15',
      },
      config,
    )

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Article')
    expect(schema.headline).toBe('Test Article')
    expect(schema.description).toBe('A test article')
    expect(schema.datePublished).toMatch(/2024-01-15/)
    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'John Doe',
      url: 'https://example.com/author',
    })
  })

  it('should use custom author name if provided', () => {
    const schema = generateArticleSchema(
      {
        title: 'Test Article',
        description: 'A test article',
        datePublished: '2024-01-15',
        author: 'Jane Smith',
      },
      config,
    )

    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Jane Smith',
      url: 'https://example.com/author',
    })
  })

  it('should include optional fields when provided', () => {
    const schema = generateArticleSchema(
      {
        title: 'Test Article',
        description: 'A test article',
        datePublished: '2024-01-15',
        dateModified: '2024-01-16',
        url: '/blog/test',
        image: '/images/test.jpg',
      },
      config,
    )

    expect(schema.dateModified).toMatch(/2024-01-16/)
    expect(schema.url).toBe('https://example.com/blog/test')
    expect(schema.image).toEqual({
      '@type': 'ImageObject',
      url: 'https://example.com/images/test.jpg',
    })
  })
})

describe('generateBlogPostingSchema', () => {
  const config = {
    baseUrl: 'https://example.com',
    authorName: 'John Doe',
    authorUrl: 'https://example.com/author',
  }

  it('should generate minimal BlogPosting schema', () => {
    const schema = generateBlogPostingSchema(
      {
        title: 'Test Blog Post',
        description: 'A test blog post',
        datePublished: '2024-01-15',
      },
      config,
    )

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('BlogPosting')
    expect(schema.headline).toBe('Test Blog Post')
    expect(schema.description).toBe('A test blog post')
  })

  it('should include all optional fields', () => {
    const schema = generateBlogPostingSchema(
      {
        title: 'Test Blog Post',
        description: 'A test blog post',
        datePublished: '2024-01-15',
        dateModified: '2024-01-16',
        author: 'Jane Smith',
        url: '/blog/test',
        image: '/images/test.jpg',
      },
      config,
    )

    expect(schema.dateModified).toMatch(/2024-01-16/)
    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Jane Smith',
      url: 'https://example.com/author',
    })
    expect(schema.url).toBe('https://example.com/blog/test')
    expect(schema.image).toEqual({
      '@type': 'ImageObject',
      url: 'https://example.com/images/test.jpg',
    })
  })
})

describe('generateBreadcrumbSchema', () => {
  it('should generate BreadcrumbList schema', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'Post', url: '/blog/post' },
    ]

    const schema = generateBreadcrumbSchema(items, 'https://example.com')

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://example.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://example.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Post',
          item: 'https://example.com/blog/post',
        },
      ],
    })
  })

  it('should handle single breadcrumb', () => {
    const items = [{ name: 'Home', url: '/' }]
    const schema = generateBreadcrumbSchema(items, 'https://example.com')

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://example.com/',
        },
      ],
    })
  })

  it('should handle empty breadcrumb list', () => {
    const schema = generateBreadcrumbSchema([], 'https://example.com')

    expect(schema).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    })
  })
})
