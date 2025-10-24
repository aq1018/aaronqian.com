import { type VariantProps, cva } from 'class-variance-authority'

export const containerVariants = cva(
  [
    // Base classes - always applied
    'mx-auto', // Center container
    'px-4', // Mobile padding
    'sm:px-6', // Small breakpoint padding
    'lg:px-8', // Large breakpoint padding
  ],
  {
    variants: {
      size: {
        narrow: 'max-w-3xl',
        default: 'max-w-4xl',
        wide: 'max-w-7xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export type ContainerVariants = VariantProps<typeof containerVariants>
