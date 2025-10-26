// @ts-check
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  integrations: [icon()],

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
