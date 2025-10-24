import { type VariantProps, cva } from 'class-variance-authority'

export const textVariants = cva(
  [
    // Base styles
    'font-sans',
  ],
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      },
      variant: {
        body: 'text-fg',
        muted: 'text-muted',
        label: 'font-mono text-xs font-medium uppercase tracking-wide',
        caption: 'text-xs text-muted',
        lead: 'text-lg leading-relaxed',
      },
      leading: {
        tight: 'leading-tight',
        normal: 'leading-normal',
        relaxed: 'leading-relaxed',
        loose: 'leading-loose',
      },
      font: {
        sans: 'font-sans',
        mono: 'font-mono',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      color: {
        fg: 'text-fg',
        muted: 'text-muted',
        primary: 'text-primary',
        accent: 'text-accent',
      },
    },
    compoundVariants: [
      // Label variant overrides
      {
        variant: 'label',
        size: ['sm', 'base', 'lg', 'xl', '2xl'],
        class: 'text-xs', // Keep label at xs size
      },
      {
        variant: 'label',
        font: 'sans',
        class: 'font-mono', // Keep label as mono
      },
      {
        variant: 'label',
        weight: ['normal', 'semibold', 'bold'],
        class: 'font-medium', // Keep label at medium weight
      },
      // Caption variant overrides
      {
        variant: 'caption',
        size: ['sm', 'base', 'lg', 'xl', '2xl'],
        class: 'text-xs', // Keep caption at xs size
      },
      // Lead variant overrides
      {
        variant: 'lead',
        size: ['xs', 'sm', 'base', 'xl', '2xl'],
        class: 'text-lg', // Keep lead at lg size
      },
      {
        variant: 'lead',
        leading: ['tight', 'normal', 'loose'],
        class: 'leading-relaxed', // Keep lead at relaxed leading
      },
    ],
    defaultVariants: {
      size: 'base',
      variant: 'body',
      leading: 'normal',
      font: 'sans',
      weight: 'normal',
      align: 'left',
      color: 'fg',
    },
  },
)

export type TextVariants = VariantProps<typeof textVariants>
