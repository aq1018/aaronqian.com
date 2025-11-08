import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Cluster: tight inline grouping with consistent spacing
 * Designed for small groups like tags, badges, icons with text
 */
export const clusterCva = cva('inline-flex', {
  defaultVariants: {
    align: 'center',
    space: 'md',
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
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
