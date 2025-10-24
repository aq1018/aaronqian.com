import { type VariantProps, cva } from 'class-variance-authority'

export const stackVariants = cva(['flex'], {
  variants: {
    direction: {
      vertical: 'flex-col',
      horizontal: 'flex-row items-center',
    },
    gap: {
      tight: 'gap-2 sm:gap-3',
      small: 'gap-4 sm:gap-5 lg:gap-6',
      medium: 'gap-8 sm:gap-10 lg:gap-12',
      large: 'gap-12 sm:gap-14 lg:gap-16',
    },
  },
  defaultVariants: {
    direction: 'vertical',
    gap: 'medium',
  },
})

export type StackVariants = VariantProps<typeof stackVariants>
