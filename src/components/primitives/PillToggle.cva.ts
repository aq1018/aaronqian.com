import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * PillToggle Container Variants
 * Defines the outer container styling for the pill toggle group
 */
export const pillToggleVariants = cva(
  [
    'relative',
    'inline-flex',
    'items-center',
    'gap-0',
    'rounded-full',
    'bg-gray-200',
    'p-1',
    'dark:bg-gray-800',
  ],
  {
    defaultVariants: {},
    variants: {},
  },
)

/**
 * PillToggle Slider Variants
 * Defines the animated sliding indicator background
 */
export const pillToggleSliderVariants = cva(
  [
    'pointer-events-none',
    'absolute',
    'left-0',
    'top-0',
    'z-0',
    'm-1',
    'h-8',
    'w-8',
    'rounded-full',
    'bg-primary',
    'shadow-md',
    'opacity-0',
    'transition-all',
    'duration-200',
  ],
  {
    defaultVariants: {},
    variants: {},
  },
)

/**
 * PillToggle Button Variants
 * Defines the individual option buttons within the toggle
 */
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
    defaultVariants: {},
    variants: {},
  },
)

export type PillToggleVariants = VariantProps<typeof pillToggleVariants>
export type PillToggleSliderVariants = VariantProps<typeof pillToggleSliderVariants>
export type PillToggleButtonVariants = VariantProps<typeof pillToggleButtonVariants>
