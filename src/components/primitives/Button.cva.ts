import { type VariantProps, cva } from 'class-variance-authority'

// Color options for button variants
const colors = [
  'primary',
  'accent',
  'secondary',
  'neutral',
  'danger',
  'success',
  'warning',
  'info',
] as const

// Shared hover patterns (extracted to reduce duplication)
const solidHover = 'hover:brightness-90 dark:hover:brightness-110 disabled:hover:brightness-100'
const translucentHover = 'disabled:hover:bg-transparent'

export const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-lg',
    'font-medium',
    'font-mono',
    'uppercase',
    'tracking-wider',
    'transition-colors',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: solidHover,
        outline: `border-2 bg-transparent ${translucentHover}`,
        soft: translucentHover,
        ghost: `bg-transparent ${translucentHover}`,
        link: 'bg-transparent underline-offset-4 hover:underline',
      },
      color: {
        primary: 'focus-visible:outline-primary',
        accent: 'focus-visible:outline-accent',
        secondary: 'focus-visible:outline-secondary',
        neutral: 'focus-visible:outline-neutral',
        danger: 'focus-visible:outline-danger',
        success: 'focus-visible:outline-success',
        warning: 'focus-visible:outline-warning',
        info: 'focus-visible:outline-info',
      },
      size: {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      // Solid: background + content color
      ...colors.map((color) => ({
        variant: 'solid' as const,
        color,
        class: `bg-${color} text-${color}-content`,
      })),

      // Outline: border + text + translucent hover background
      ...colors.map((color) => ({
        variant: 'outline' as const,
        color,
        class: `border-${color} text-${color} hover:bg-${color}/10`,
      })),

      // Soft: subtle background + text + translucent hover
      ...colors.map((color) => ({
        variant: 'soft' as const,
        color,
        class: `bg-${color}/20 text-${color} hover:bg-${color}/30`,
      })),

      // Ghost: text + translucent hover background
      ...colors.map((color) => ({
        variant: 'ghost' as const,
        color,
        class: `text-${color} hover:bg-${color}/10`,
      })),

      // Link: text only
      ...colors.map((color) => ({
        variant: 'link' as const,
        color,
        class: `text-${color}`,
      })),
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
