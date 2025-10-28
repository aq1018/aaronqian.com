import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Stack: unified flex container with responsive direction support
 * Uses mobile-first approach with direction (base) and direction-{breakpoint} props
 * Note: 'direction' refers to flex-direction, not HTML's 'dir' attribute (text direction)
 */
export const stackCva = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'column-reverse': 'flex-col-reverse',
    },
    'direction-sm': {
      row: 'sm:flex-row',
      column: 'sm:flex-col',
      'row-reverse': 'sm:flex-row-reverse',
      'column-reverse': 'sm:flex-col-reverse',
    },
    'direction-md': {
      row: 'md:flex-row',
      column: 'md:flex-col',
      'row-reverse': 'md:flex-row-reverse',
      'column-reverse': 'md:flex-col-reverse',
    },
    'direction-lg': {
      row: 'lg:flex-row',
      column: 'lg:flex-col',
      'row-reverse': 'lg:flex-row-reverse',
      'column-reverse': 'lg:flex-col-reverse',
    },
    'direction-xl': {
      row: 'xl:flex-row',
      column: 'xl:flex-col',
      'row-reverse': 'xl:flex-row-reverse',
      'column-reverse': 'xl:flex-col-reverse',
    },
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
    direction: 'column',
    space: 'md',
    align: 'stretch',
    justify: 'start',
  },
})

export type StackStyle = VariantProps<typeof stackCva>
