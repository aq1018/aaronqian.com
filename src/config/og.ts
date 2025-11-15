import type { OGImageRoute } from 'astro-og-canvas'
import type { Get } from 'type-fest'

type OGImageOptions = Awaited<ReturnType<Parameters<typeof OGImageRoute>[0]['getImageOptions']>>
type SharedOGImageConfig = Omit<OGImageOptions, 'title' | 'description' | 'border'>
type RGBColor = NonNullable<Get<OGImageOptions, 'font.title.color'>>

/**
 * Shared OG image configuration
 * Used across all OG image generators (pages, blog, projects)
 */

export const ogImageConfig: SharedOGImageConfig = {
  // Dark mode background gradient (zinc-900 to zinc-800)
  bgGradient: [
    [24, 24, 27],
    [39, 39, 42],
  ],

  // Logo configuration
  logo: {
    path: './public/images/logo.png',
    size: [120],
  },

  // Spacing
  padding: 70,

  // Fonts
  fonts: ['./public/fonts/inter-variable-full.woff2'],

  // Font styling
  font: {
    title: {
      color: [255, 255, 255], // white (better contrast)
      size: 56,
      families: ['Inter'],
      weight: 'Bold',
      lineHeight: 1.2,
    },
    description: {
      color: [228, 228, 231], // zinc-200 (lighter for better contrast)
      size: 32,
      families: ['Inter'],
      weight: 'Normal',
      lineHeight: 1.3,
    },
  },
}

// Border colors for different content types
export const borderColors: Record<string, RGBColor> = {
  pages: [250, 204, 21], // gold-400/yellow-400
  blog: [34, 211, 238], // cyan-400
  projects: [192, 132, 252], // purple-400
}
