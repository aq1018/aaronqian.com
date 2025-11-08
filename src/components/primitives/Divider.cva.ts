import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Divider: simple horizontal or vertical lines for visual separation
 */
export const dividerCva = cva('', {
  defaultVariants: {
    orientation: 'horizontal',
    weight: 'default',
  },
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'self-stretch w-px border-l',
    },
    weight: {
      default: 'border-border/65',
      strong: 'border-border/80',
      subtle: 'border-border/50',
    },
  },
})

export type DividerStyle = VariantProps<typeof dividerCva>
