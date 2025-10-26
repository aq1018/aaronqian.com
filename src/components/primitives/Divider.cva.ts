import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Divider: simple horizontal or vertical lines for visual separation
 */
export const dividerCva = cva('', {
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'self-stretch w-px border-l',
    },
    weight: {
      subtle: 'border-border/50',
      default: 'border-border/65',
      strong: 'border-border/80',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    weight: 'default',
  },
})

export type DividerStyle = VariantProps<typeof dividerCva>
