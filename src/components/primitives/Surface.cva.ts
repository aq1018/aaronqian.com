import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Surface: semantic section wrapper with vertical padding
 * Simplified for terminal aesthetic - no fancy themes or backgrounds
 */
export const surfaceCva = cva('relative w-full', {
  defaultVariants: {
    padY: 'md',
  },
  variants: {
    padY: {
      none: 'py-0',
      sm: 'py-12 sm:py-14 lg:py-16', // 48 → 56 → 64px
      md: 'py-16 sm:py-20 lg:py-24', // 64 → 80 → 96px (default)
      lg: 'py-20 sm:py-24 lg:py-28', // 80 → 96 → 112px
      xl: 'py-24 sm:py-28 lg:py-32', // 96 → 112 → 128px
    },
  },
})

export type SurfaceStyle = VariantProps<typeof surfaceCva>
