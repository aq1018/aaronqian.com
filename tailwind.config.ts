// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  // This content glob just satisfies tools; v4 reads tokens from your CSS.
  content: ['./src/**/*.{astro,html,js,ts}'],
} satisfies Config
