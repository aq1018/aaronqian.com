import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const iconVariants = cva(['inline-block'], {
  defaultVariants: {
    size: 'sm',
  },
  variants: {
    size: {
      lg: 'h-8 w-8',
      md: 'h-5 w-5',
      sm: 'h-4 w-4',
      xl: 'h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14',
    },
  },
})

export type IconVariants = VariantProps<typeof iconVariants>
