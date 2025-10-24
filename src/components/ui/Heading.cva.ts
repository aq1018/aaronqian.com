import { type VariantProps, cva } from 'class-variance-authority'

export const headingVariants = cva(
  [
    // Base styles
    'font-sans',
    'tracking-tight',
  ],
  {
    variants: {
      level: {
        h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold',
        h2: 'text-2xl sm:text-3xl md:text-4xl font-bold',
        h3: 'text-xl sm:text-2xl md:text-3xl font-semibold',
        h4: 'text-lg sm:text-xl font-semibold',
        h5: 'text-base sm:text-lg font-semibold',
        h6: 'text-sm sm:text-base font-semibold',
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
      color: {
        fg: 'text-fg',
        muted: 'text-muted',
        primary: 'text-primary',
        accent: 'text-accent',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    compoundVariants: [
      // Override level's font-weight when weight is explicitly set
      {
        level: ['h1', 'h2'],
        weight: 'normal',
        class: 'font-normal',
      },
      {
        level: ['h1', 'h2'],
        weight: 'medium',
        class: 'font-medium',
      },
      {
        level: ['h1', 'h2'],
        weight: 'semibold',
        class: 'font-semibold',
      },
      {
        level: ['h3', 'h4', 'h5', 'h6'],
        weight: 'normal',
        class: 'font-normal',
      },
      {
        level: ['h3', 'h4', 'h5', 'h6'],
        weight: 'medium',
        class: 'font-medium',
      },
      {
        level: ['h3', 'h4', 'h5', 'h6'],
        weight: 'bold',
        class: 'font-bold',
      },
    ],
    defaultVariants: {
      level: 'h2',
      font: 'sans',
      weight: 'bold',
      color: 'fg',
      align: 'left',
    },
  },
)

export type HeadingVariants = VariantProps<typeof headingVariants>
