// @ts-check
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig, envField } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://aaronqian.com',
  base: '/',
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
  vite: {
    plugins: [tailwindcss()],
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      watch: {
        ignored: ['**/*.test.ts', '**/*.spec.ts'],
      },
    },
  },
})
