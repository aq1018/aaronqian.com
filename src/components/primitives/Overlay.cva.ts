import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Overlay: simplified visual overlays for readability
 * Terminal aesthetic - just practical background overlays and gradients
 */
export const overlayCva = cva('absolute inset-0 pointer-events-none', {
  defaultVariants: {
    blur: 'none',
    preset: 'none',
  },
  variants: {
    blur: {
      lg: 'backdrop-blur-lg',
      md: 'backdrop-blur',
      none: '',
      sm: 'backdrop-blur-sm',
    },
    preset: {
      'bottom-fade': 'bg-gradient-to-t from-background/40 to-transparent',
      medium: 'bg-background/40',
      none: '',
      'radial-fade': 'bg-radial from-transparent from-40% to-background',
      soft: 'bg-background/20',
      strong: 'bg-background/60',
      'top-fade': 'bg-gradient-to-b from-background/40 to-transparent',
    },
  },
})

export type OverlayStyle = VariantProps<typeof overlayCva>
