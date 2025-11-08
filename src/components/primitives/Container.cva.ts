import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Container: constrains content width and provides responsive horizontal gutters
 */
export const containerCva = cva('relative w-full', {
  defaultVariants: {
    center: true,
    fluidUntil: 'none',
    padX: 'lg',
    width: 'default',
  },
  variants: {
    center: {
      false: '',
      true: 'mx-auto',
    },
    fluidUntil: {
      none: 'mx-auto', // Constrained immediately with centering
      sm: 'mx-auto sm:w-full', // Full-width until sm
      md: 'mx-auto md:w-full', // Full-width until md
      lg: 'mx-auto lg:w-full', // Full-width until lg
      xl: 'mx-auto xl:w-full', // Full-width until xl
    },
    padX: {
      none: 'px-0',
      sm: 'px-4 md:px-6', // 16 → 24
      md: 'px-4 md:px-8 lg:px-12', // 16 → 32 → 48
      lg: 'px-6 md:px-10 lg:px-16', // 24 → 40 → 64
      xl: 'px-6 md:px-12 lg:px-20', // 24 → 48 → 80
    },
    width: {
      narrow: 'max-w-5xl', // 1024px - for reading content
      default: 'max-w-6xl', // 1152px - standard content width
      wide: 'max-w-7xl', // 1280px - wide layouts
      full: '', // No constraint - full viewport width
    },
  },
})

export type ContainerStyle = VariantProps<typeof containerCva>
