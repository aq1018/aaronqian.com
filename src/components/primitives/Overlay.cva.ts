import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Overlay: simplified visual overlays for readability
 * Terminal aesthetic - just practical black overlays and gradients
 */
export const overlayCva = cva('absolute inset-0 pointer-events-none', {
  variants: {
    preset: {
      none: '',
      soft: 'bg-black/20',
      medium: 'bg-black/40',
      strong: 'bg-black/60',
      'top-fade': 'bg-gradient-to-b from-black/40 to-transparent',
      'bottom-fade': 'bg-gradient-to-t from-black/40 to-transparent',
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
