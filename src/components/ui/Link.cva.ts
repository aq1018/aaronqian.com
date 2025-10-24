import { type VariantProps, cva } from 'class-variance-authority'

export const linkVariants = cva(['transition-colors'], {
  variants: {
    variant: {
      // Navigation links (nav bar)
      nav: 'hover:text-primary-hover',
      // Content links (inline, underlined)
      content: 'text-link underline decoration-transparent hover:decoration-link',
      // Back buttons (with arrow)
      back: 'group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-link',
    },
    active: {
      true: '',
    },
  },
  compoundVariants: [
    {
      variant: 'nav',
      active: true,
      class: 'font-semibold text-primary',
    },
    {
      variant: 'nav',
      active: false,
      class: 'text-muted',
    },
  ],
  defaultVariants: {
    variant: 'content',
    active: false,
  },
})

export type LinkVariants = VariantProps<typeof linkVariants>
