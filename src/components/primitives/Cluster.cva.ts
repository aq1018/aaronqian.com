import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Cluster: tight inline grouping with consistent spacing
 * Designed for small groups like tags, badges, icons with text
 */
export const clusterCva = cva('inline-flex', {
  defaultVariants: {
    align: 'center',
    direction: 'row',
    space: 'md',
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
    },
    direction: {
      column: 'flex-col',
      row: 'flex-row',
    },
    'direction-sm': {
      column: 'sm:flex-col',
      row: 'sm:flex-row',
    },
    'direction-md': {
      column: 'md:flex-col',
      row: 'md:flex-row',
    },
    'direction-lg': {
      column: 'lg:flex-col',
      row: 'lg:flex-row',
    },
    'direction-xl': {
      column: 'xl:flex-col',
      row: 'xl:flex-row',
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
      none: 'gap-0', // 0px
      xs: 'gap-1', // 4px
      sm: 'gap-1.5', // 6px
      md: 'gap-2', // 8px
      lg: 'gap-2.5', // 10px
      xl: 'gap-3', // 12px
    },
  },
})

export type ClusterStyle = VariantProps<typeof clusterCva>
