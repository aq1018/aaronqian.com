import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Cluster: tight inline grouping with consistent spacing
 * Designed for small groups like tags, badges, icons with text
 */
export const clusterCva = cva('inline-flex', {
  variants: {
    space: {
      none: 'gap-0', // 0px
      xs: 'gap-1', // 4px
      sm: 'gap-1.5', // 6px
      md: 'gap-2', // 8px
      lg: 'gap-2.5', // 10px
      xl: 'gap-3', // 12px
    },
    align: {
      center: 'items-center',
      start: 'items-start',
      end: 'items-end',
      baseline: 'items-baseline',
    },
  },
  defaultVariants: {
    space: 'md',
    align: 'center',
  },
})

export type ClusterStyle = VariantProps<typeof clusterCva>
