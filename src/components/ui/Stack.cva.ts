import { type VariantProps, cva } from 'class-variance-authority'

export const stackVariants = cva(['flex', 'flex-col'], {
  variants: {
    gap: {
      tight: 'space-y-2 sm:space-y-3',
      small: 'space-y-4 sm:space-y-5 lg:space-y-6',
      medium: 'space-y-8 sm:space-y-10 lg:space-y-12',
      large: 'space-y-12 sm:space-y-14 lg:space-y-16',
    },
  },
  defaultVariants: {
    gap: 'medium',
  },
})

export type StackVariants = VariantProps<typeof stackVariants>
