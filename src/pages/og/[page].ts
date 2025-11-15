import { OGImageRoute } from 'astro-og-canvas'

import { borderColors, ogImageConfig } from '@/config/og'
import type { PageMetadata } from '@/config/pages'
import { staticPages } from '@/config/pages'

// eslint-disable-next-line new-cap -- OGImageRoute is a factory function, not a constructor
export const { getStaticPaths, GET } = OGImageRoute({
  param: 'page',
  pages: staticPages,

  getImageOptions: (_path, page: PageMetadata) => ({
    title: page.title,
    description: page.description,

    ...ogImageConfig,

    // Accent border on left side (gold for static pages)
    border: {
      color: borderColors.pages,
      width: 8,
      side: 'inline-start',
    },
  }),
})
