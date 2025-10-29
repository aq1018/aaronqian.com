import 'vitest/config'
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
