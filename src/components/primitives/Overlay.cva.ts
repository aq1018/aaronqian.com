import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Overlay: simplified visual overlays for readability
 * Terminal aesthetic - just practical background overlays and gradients
 */
export const overlayCva = cva('absolute inset-0 pointer-events-none', {
  variants: {
    preset: {
      none: '',
      soft: 'bg-background/20',
      medium: 'bg-background/40',
      strong: 'bg-background/60',
      'top-fade': 'bg-gradient-to-b from-background/40 to-transparent',
      'bottom-fade': 'bg-gradient-to-t from-background/40 to-transparent',
      'radial-fade': 'bg-radial from-transparent from-40% to-background',
    },
    blur: {
      none: '',
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur',
      lg: 'backdrop-blur-lg',
    },
  },
  defaultVariants: {
    preset: 'none',
    blur: 'none',
  },
})

export type OverlayStyle = VariantProps<typeof overlayCva>
