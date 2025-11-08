import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Stack: unified flex container with responsive direction support
 * Uses mobile-first approach with direction (base) and direction-{breakpoint} props
 * Note: 'direction' refers to flex-direction, not HTML's 'dir' attribute (text direction)
 */
export const stackCva = cva('flex', {
  defaultVariants: {
    align: 'stretch',
    direction: 'column',
    justify: 'start',
    space: 'md',
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
      stretch: 'items-stretch',
    },
    direction: {
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
    },
    'direction-lg': {
      column: 'lg:flex-col',
      'column-reverse': 'lg:flex-col-reverse',
      row: 'lg:flex-row',
      'row-reverse': 'lg:flex-row-reverse',
    },
    'direction-md': {
      column: 'md:flex-col',
      'column-reverse': 'md:flex-col-reverse',
      row: 'md:flex-row',
      'row-reverse': 'md:flex-row-reverse',
    },
    'direction-sm': {
      column: 'sm:flex-col',
      'column-reverse': 'sm:flex-col-reverse',
      row: 'sm:flex-row',
      'row-reverse': 'sm:flex-row-reverse',
    },
    'direction-xl': {
      column: 'xl:flex-col',
      'column-reverse': 'xl:flex-col-reverse',
      row: 'xl:flex-row',
      'row-reverse': 'xl:flex-row-reverse',
    },
    justify: {
      around: 'justify-around',
      between: 'justify-between',
      center: 'justify-center',
      end: 'justify-end',
      evenly: 'justify-evenly',
      start: 'justify-start',
    },
    space: {
      none: 'gap-0',
      xs: 'gap-2 md:gap-3', // 8 → 12
      sm: 'gap-3 md:gap-4 lg:gap-5', // 12 → 16 → 20
      md: 'gap-4 md:gap-5 lg:gap-6', // 16 → 20 → 24
      lg: 'gap-5 md:gap-6 lg:gap-8', // 20 → 24 → 32
      xl: 'gap-6 md:gap-8 lg:gap-10', // 24 → 32 → 40
    },
  },
})

export type StackStyle = VariantProps<typeof stackCva>
