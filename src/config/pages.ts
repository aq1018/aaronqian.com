/**
 * Static page metadata - shared between pages and OG image generation
 * This ensures page titles/descriptions are always in sync with OG images
 */

export interface PageMetadata {
  title: string
  description: string
}

export const staticPages = {
  home: {
    title: 'Aaron Qian - Input Coffee, Output Code',
    description:
      'Software Engineer, Freelancer, Father. Building projects and sharing tech insights.',
  },
  about: {
    title: 'About Aaron Qian',
    description:
      'Full-stack software engineer specializing in web development, cloud infrastructure, and open source.',
  },
  blog: {
    title: 'Blog - Aaron Qian',
    description:
      'Technical articles and insights on software development, best practices, and more.',
  },
  projects: {
    title: 'Projects - Aaron Qian',
    description: 'A collection of side projects, open source contributions, and experiments.',
  },
} as const satisfies Record<string, PageMetadata>

export type StaticPageKey = keyof typeof staticPages
