import { type VariantProps, cva } from 'class-variance-authority'

export const iconButtonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'transition-colors',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-primary',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      shape: {
        circular: 'rounded-full',
        square: 'rounded-lg',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      shape: 'circular',
      size: 'md',
    },
  },
)

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>
