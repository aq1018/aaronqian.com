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
      sm: 'py-12 sm:py-14 lg:py-16',
      md: 'py-14 sm:py-16 lg:py-18',
      lg: 'py-16 sm:py-18 lg:py-20',
      xl: 'py-18 sm:py-20 lg:py-22',
    },
  },
})

export type SurfaceStyle = VariantProps<typeof surfaceCva>
