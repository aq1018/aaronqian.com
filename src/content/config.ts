import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  schema: ({ image }) =>
    z.object({
      categories: z.array(z.string()).optional(),
      date: z.coerce.date(),
      description: z.string(),
      draft: z.boolean().optional().default(false),
      hero: image().optional(),
      tags: z.array(z.string()).optional(),
      title: z.string(),
    }),
  type: 'content',
})

const projects = defineCollection({
  schema: z.object({
    aside: z.string(),
    description: z.string(),
    live: z.boolean().optional().default(false),
    order: z.number(),
    status: z.enum(['active', 'planning', 'done']),
    title: z.string(),
    url: z.string().url().optional(),
  }),
  type: 'content',
})

const projectLogs = defineCollection({
  schema: z.object({
    date: z.coerce.date(),
    project: z.string(),
    tags: z.array(z.string()),
    title: z.string(), // slug reference to parent project
  }),
  type: 'content',
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
