// @ts-check
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],

  env: {
    schema: {
      GISCUS_REPO: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      GISCUS_REPO_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      GISCUS_CATEGORY: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
      GISCUS_CATEGORY_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: false,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/*.test.ts', '**/*.spec.ts'],
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  },

  adapter: cloudflare({
    imageService: 'compile',
  }),
})
