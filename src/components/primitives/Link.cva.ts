import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

export const linkVariants = cva(['transition-colors'], {
  compoundVariants: [
    {
      active: true,
      class: 'text-primary',
      variant: 'nav',
    },
    {
      active: false,
      class: 'text-muted',
      variant: 'nav',
    },
  ],
  defaultVariants: {
    active: false,
    variant: 'content',
  },
  variants: {
    active: {
      true: '',
    },
    variant: {
      // Navigation links (nav bar)
      nav: 'hover:[color:color-mix(in_oklab,var(--color-primary),black_10%)]',
      // Content links (inline, underlined)
      content: 'text-link underline decoration-transparent hover:decoration-link',
      // Back buttons (with arrow)
      back: 'group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-link',
    },
  },
})

export type LinkVariants = VariantProps<typeof linkVariants>
