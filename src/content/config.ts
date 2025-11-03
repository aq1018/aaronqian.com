import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      hero: image().optional(),
      categories: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
      draft: z.boolean().optional().default(false),
    }),
})

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'planning', 'done']),
    url: z.string().url().optional(),
    aside: z.string(),
    order: z.number(),
    live: z.boolean().optional().default(false),
  }),
})

const projectLogs = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.coerce.date(),
    title: z.string(),
    tags: z.array(z.string()),
    project: z.string(), // slug reference to parent project
  }),
})

const socials = defineCollection({
  type: 'data',
  schema: z.object({
    label: z.string(),
    url: z.string(),
    position: z.number(),
    enabled: z.boolean(),
    rel: z.string().optional(),
  }),
})

const devTools = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.string(),
    blurb: z.string(),
    url: z.string().url().optional(),
    position: z.number(),
    enabled: z.boolean(),
    tags: z.array(z.string()).optional(),
  }),
})

const benchTools = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.string(),
    blurb: z.string(),
    url: z.string().url().optional(),
    position: z.number(),
    enabled: z.boolean(),
    tags: z.array(z.string()).optional(),
  }),
})

const testimonials = defineCollection({
  type: 'data',
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    title: z.string().optional(),
    position: z.number(),
    enabled: z.boolean(),
  }),
})

const about = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      tagline: z.string(),
      heroImage: image(),
      heroImageAlt: z.string(),
      workingStyle: z.array(z.string()),
      availability: z.string().optional(),
    }),
})

export const collections = {
  blog,
  projects,
  projectLogs,
  socials,
  devTools,
  benchTools,
  testimonials,
  about,
}
