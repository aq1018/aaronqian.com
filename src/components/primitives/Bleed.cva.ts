import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Bleed: negate a parent's Container gutters so a child can go edge-to-edge.
 * Use the *same* token as the surrounding Container.padX.
 */
export const bleedCva = cva('', {
  defaultVariants: {
    size: 'lg', // Matches Container's default padX
  },
  variants: {
    size: {
      none: 'mx-0',
      sm: '-mx-4 md:-mx-6', // Negate Container sm
      md: '-mx-4 md:-mx-8 lg:-mx-12', // Negate Container md
      lg: '-mx-6 md:-mx-10 lg:-mx-16', // Negate Container lg (default)
      xl: '-mx-6 md:-mx-12 lg:-mx-20', // Negate Container xl
    },
  },
})

export type BleedStyle = VariantProps<typeof bleedCva>
