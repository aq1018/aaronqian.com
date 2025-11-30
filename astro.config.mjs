// @ts-check
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'
import rehypeFigure from '@microflash/rehype-figure'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig, envField } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import remarkDirective from 'remark-directive'
import remarkMath from 'remark-math'

import remark3dDirective from './src/utils/remark-3d-directive.ts'
import remarkImageLightbox from './src/utils/remark-image-lightbox.ts'

const isTest = process.env.VITEST === 'true'

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: isTest
    ? undefined
    : cloudflare({
        imageService: 'compile',
      }),
  site: 'https://aaronqian.com',
  base: '/',
  trailingSlash: 'never',
  env: {
    schema: {
      GISCUS_CATEGORY: envField.string({
        access: 'public',
        context: 'client',
        optional: false,
      }),
      GISCUS_CATEGORY_ID: envField.string({
        access: 'public',
        context: 'client',
        optional: false,
      }),
      GISCUS_REPO: envField.string({
        access: 'public',
        context: 'client',
        optional: false,
      }),
      GISCUS_REPO_ID: envField.string({
        access: 'public',
        context: 'client',
        optional: false,
      }),
      GA_MEASUREMENT_ID: envField.string({
        access: 'public',
        context: 'client',
        optional: true,
      }),
    },
  },
  integrations: [icon(), sitemap()],
  markdown: {
    remarkPlugins: [remarkMath, remarkDirective, remark3dDirective, remarkImageLightbox],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
      rehypeFigure,
      rehypeKatex,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      __dirname: JSON.stringify(new URL('.', import.meta.url).pathname),
    },
    optimizeDeps: {
      exclude: ['occt-import-js'],
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
      watch: {
        ignored: ['**/*.test.ts', '**/*.spec.ts'],
      },
    },
  },
})
