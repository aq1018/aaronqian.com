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

export const collections = {
  blog,
  projects,
  projectLogs,
}
