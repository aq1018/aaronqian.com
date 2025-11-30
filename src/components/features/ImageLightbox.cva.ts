import { cva } from 'class-variance-authority'

export const imageLightboxOverlay = cva(
  'fixed inset-0 z-50 bg-black/90 backdrop-blur-sm transition-[opacity,visibility] duration-200 ease-in-out',
  {
    variants: {
      state: {
        hidden: 'invisible opacity-0',
        active: 'visible opacity-100',
      },
    },
    defaultVariants: {
      state: 'hidden',
    },
  },
)

export const imageLightboxImage = cva('max-h-full max-w-full object-contain', {
  variants: {
    type: {
      default: '',
      svg: 'h-[90vh] w-auto', // SVGs often need explicit height
    },
  },
  defaultVariants: {
    type: 'default',
  },
})

export const imageLightboxClose = cva(
  'absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
        solid: 'bg-gray-900 text-white hover:bg-gray-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
