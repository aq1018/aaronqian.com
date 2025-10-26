import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Stack: vertical rhythm between siblings (flex-col + gap-y ramps)
 */
export const stackCva = cva('flex flex-col', {
  variants: {
    space: {
      none: 'gap-y-0',
      xs: 'gap-y-2 md:gap-y-3', // 8 → 12
      sm: 'gap-y-3 md:gap-y-4 lg:gap-y-5', // 12 → 16 → 20
      md: 'gap-y-4 md:gap-y-5 lg:gap-y-6', // 16 → 20 → 24
      lg: 'gap-y-5 md:gap-y-6 lg:gap-y-8', // 20 → 24 → 32
      xl: 'gap-y-6 md:gap-y-8 lg:gap-y-10', // 24 → 32 → 40
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    space: 'md',
    align: 'stretch',
  },
})

export type StackStyle = VariantProps<typeof stackCva>
