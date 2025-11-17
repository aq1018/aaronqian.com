import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  schema: z.object({
    categories: z.array(z.string()).optional(),
    date: z.coerce.date(),
    description: z.string(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional(),
    title: z.string(),
  }),
  type: 'content',
})

const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projects' }),
  schema: z.object({
    aside: z.string(),
    description: z.string(),
    live: z.boolean().optional().default(false),
    order: z.number(),
    status: z.enum(['active', 'planning', 'done']),
    title: z.string(),
    url: z.string().url().optional(),
  }),
})

const projectLogs = defineCollection({
  loader: glob({ pattern: '*/logs/*.md', base: './src/content/projects' }),
  schema: z.object({
    date: z.coerce.date(),
    project: z.string(),
    tags: z.array(z.string()),
    title: z.string(), // slug reference to parent project
  }),
})

const socials = defineCollection({
  schema: z.object({
    enabled: z.boolean(),
    label: z.string(),
    position: z.number(),
    rel: z.string().optional(),
    url: z.string(),
  }),
  type: 'data',
})

const testimonials = defineCollection({
  schema: z.object({
    author: z.string(),
    enabled: z.boolean(),
    position: z.number(),
    quote: z.string(),
    title: z.string().optional(),
  }),
  type: 'data',
})

const principles = defineCollection({
  schema: z.object({
    enabled: z.boolean(),
    position: z.number(),
    title: z.string(),
  }),
  type: 'content',
})

const about = defineCollection({
  schema: z.object({
    availability: z.string().optional(),
    description: z.string(),
    microLine: z.string().optional(),
    title: z.string(),
    workingStyle: z.array(z.string()),
  }),
  type: 'content',
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
