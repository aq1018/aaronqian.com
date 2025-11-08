// @ts-check
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'
import { defineConfig, envField } from 'astro/config'

// https://astro.build/config
export default defineConfig({
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
    },
  },
  integrations: [icon()],
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
