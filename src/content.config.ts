import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/blog' }),
  schema: z.object({
    categories: z.array(z.string()).optional(),
    lastUpdatedOn: z.coerce.date(),
    description: z.string(),
    draft: z.boolean().optional().default(false),
    slug: z.string().optional(),
    tags: z.array(z.string()).optional(),
    title: z.string(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: z.object({
    aside: z.string(),
    description: z.string(),
    links: z
      .object({
        site: z.url().optional(),
        github: z.url().optional(),
        docs: z.url().optional(),
      })
      .optional(),
    order: z.number(),
    status: z.enum(['in-development', 'active', 'completed', 'up-for-adoption']),
    title: z.string(),
  }),
})

const projectLogs = defineCollection({
  loader: glob({ pattern: '*/logs/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()),
    title: z.string(),
  }),
})

const socials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/socials' }),
  schema: z.object({
    enabled: z.boolean(),
    label: z.string(),
    position: z.number(),
    rel: z.string().optional(),
    url: z.string(),
  }),
})

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    author: z.string(),
    enabled: z.boolean(),
    position: z.number(),
    quote: z.string(),
    title: z.string().optional(),
  }),
})

const principles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/principles' }),
  schema: z.object({
    enabled: z.boolean(),
    position: z.number(),
    title: z.string(),
  }),
})

const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    availability: z.string().optional(),
    description: z.string(),
    microLine: z.string().optional(),
    title: z.string(),
    workingStyle: z.array(z.string()),
  }),
})

export const collections = {
  about,
  blog,
  principles,
  projectLogs,
  projects,
  socials,
  testimonials,
}
