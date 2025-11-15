import { OGImageRoute } from 'astro-og-canvas'
import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'

import { borderColors, ogImageConfig } from '@/config/og'

const projects = await getCollection('projects')
const pages = Object.fromEntries(
  projects.map((project: CollectionEntry<'projects'>) => [project.slug, project]),
)

// eslint-disable-next-line new-cap -- OGImageRoute is a factory function, not a constructor
export const { getStaticPaths, GET } = OGImageRoute({
  param: 'slug',
  pages,

  getImageOptions: (_path, project: CollectionEntry<'projects'>) => ({
    title: project.data.title,
    description: project.data.description,

    ...ogImageConfig,

    // Accent border on left side (purple for projects)
    border: {
      color: borderColors.projects,
      width: 8,
      side: 'inline-start',
    },
  }),
})
