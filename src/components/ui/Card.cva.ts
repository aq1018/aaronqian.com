import { type VariantProps, cva } from 'class-variance-authority'

export const cardVariants = cva(['rounded', 'p-4'], {
  variants: {
    variant: {
      // Full border
      bordered: 'border border-border bg-surface',
      // Left accent border (used in project lists)
      accent: 'border-l-2 border-primary/30 pl-4 transition-colors hover:border-primary',
      // Hover effects
      hover: 'border border-border/20 bg-surface transition-colors hover:bg-surface-hover',
    },
  },
  defaultVariants: {
    variant: 'bordered',
  },
})

export type CardVariants = VariantProps<typeof cardVariants>
