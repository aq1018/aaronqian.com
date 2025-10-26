import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Bleed: negate a parent's Container gutters so a child can go edge-to-edge.
 * Use the *same* token as the surrounding Container.padX.
 */
export const bleedCva = cva('', {
  variants: {
    size: {
      none: 'mx-0',
      sm: '-mx-4 md:-mx-6', // negate Container sm
      md: '-mx-4 md:-mx-8 lg:-mx-12', // negate Container md
      lg: '-mx-6 md:-mx-10 lg:-mx-16', // negate Container lg (default)
      xl: '-mx-6 md:-mx-12 lg:-mx-20', // negate Container xl
    },
  },
  defaultVariants: {
    size: 'lg', // matches Container's default padX
  },
})

export type BleedStyle = VariantProps<typeof bleedCva>
