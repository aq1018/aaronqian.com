import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Inline: horizontal rhythm between siblings (flex-row + gap-x ramps)
 */
export const inlineCva = cva('flex flex-row', {
  variants: {
    space: {
      none: 'gap-x-0',
      xs: 'gap-x-2 md:gap-x-3', // 8 → 12
      sm: 'gap-x-3 md:gap-x-4 lg:gap-x-5', // 12 → 16 → 20
      md: 'gap-x-4 md:gap-x-5 lg:gap-x-6', // 16 → 20 → 24
      lg: 'gap-x-5 md:gap-x-6 lg:gap-x-8', // 20 → 24 → 32
      xl: 'gap-x-6 md:gap-x-8 lg:gap-x-10', // 24 → 32 → 40
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    space: 'md',
    align: 'center',
    justify: 'start',
    wrap: false,
  },
})

export type InlineStyle = VariantProps<typeof inlineCva>
