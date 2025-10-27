import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Stack: unified flex container with responsive direction support
 * Direction is controlled separately via Stack.utils getDirectionClasses()
 * Defaults to flex-col (vertical) but can be row (horizontal) or responsive
 */
export const stackCva = cva('flex', {
  variants: {
    space: {
      none: 'gap-0',
      xs: 'gap-2 md:gap-3', // 8 → 12
      sm: 'gap-3 md:gap-4 lg:gap-5', // 12 → 16 → 20
      md: 'gap-4 md:gap-5 lg:gap-6', // 16 → 20 → 24
      lg: 'gap-5 md:gap-6 lg:gap-8', // 20 → 24 → 32
      xl: 'gap-6 md:gap-8 lg:gap-10', // 24 → 32 → 40
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
  },
  defaultVariants: {
    space: 'md',
    align: 'stretch',
    justify: 'start',
  },
})

export type StackStyle = VariantProps<typeof stackCva>
