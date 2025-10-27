import { type VariantProps, cva } from 'class-variance-authority'

export const iconVariants = cva(['inline-block'], {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-8 w-8',
      xl: 'h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export type IconVariants = VariantProps<typeof iconVariants>
