import { type VariantProps, cva } from 'class-variance-authority'

export const pillToggleButtonVariants = cva(
  [
    'relative',
    'z-10',
    'flex',
    'h-8',
    'w-8',
    'cursor-pointer',
    'items-center',
    'justify-center',
    'rounded-full',
    'transition-colors',
    'duration-200',
    'text-gray-600',
    'dark:text-gray-400',
    '[&.selected]:text-white',
    'dark:[&.selected]:text-white',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
)

export type PillToggleButtonVariants = VariantProps<typeof pillToggleButtonVariants>
