import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Inset: interior padding for cards/panels/islands.
 * - `space` provides responsive padding for all sides.
 * - `squish` reduces vertical padding for button-like layouts (overrides space's vertical padding).
 */
export const insetCva = cva('', {
  defaultVariants: {
    space: 'md',
    squish: 'none',
  },
  variants: {
    space: {
      none: 'p-0',
      xs: 'p-2 md:p-3', // 8 → 12
      sm: 'p-3 md:p-4 lg:p-5', // 12 → 16 → 20
      md: 'p-4 md:p-5 lg:p-6', // 16 → 20 → 24   (default)
      lg: 'p-5 md:p-6 lg:p-8', // 20 → 24 → 32
      xl: 'p-6 md:p-8 lg:p-10', // 24 → 32 → 40
    },
    squish: {
      lg: 'py-4',
      md: 'py-3',
      none: '',
      sm: 'py-2',
    },
  },
})

export type InsetStyle = VariantProps<typeof insetCva>
