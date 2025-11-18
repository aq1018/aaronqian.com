import { OGImageRoute } from 'astro-og-canvas'
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

import { borderColors, ogImageConfig } from '@/config/og'
import { getBlogSlug } from '@/lib/blog'

const posts = await getCollection('blog')
const pages = Object.fromEntries(
  posts.map((post: CollectionEntry<'blog'>) => [getBlogSlug(post.id), post]),
)

// eslint-disable-next-line new-cap -- OGImageRoute is a factory function, not a constructor
export const { getStaticPaths, GET } = OGImageRoute({
  param: 'slug',
  pages,

  getImageOptions: (_path, post: CollectionEntry<'blog'>) => ({
    title: post.data.title,
    description: post.data.description,

    ...ogImageConfig,

    // Accent border on left side (cyan for blog posts)
    border: {
      color: borderColors.blog,
      width: 8,
      side: 'inline-start',
    },
  }),
})
