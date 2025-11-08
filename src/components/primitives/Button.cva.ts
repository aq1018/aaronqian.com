import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

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
    'motion-reduce:transition-none',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    compoundVariants: [
      // Solid: background + content color
      ...colors.map((color) => ({
        class: `bg-${color} text-${color}-content`,
        color,
        variant: 'solid' as const,
      })),

      // Outline: border + text + translucent hover background
      ...colors.map((color) => ({
        class: `border-${color} text-${color} hover:bg-${color}/10`,
        color,
        variant: 'outline' as const,
      })),

      // Soft: subtle background + text + translucent hover
      ...colors.map((color) => ({
        class: `bg-${color}/20 text-${color} hover:bg-${color}/30`,
        color,
        variant: 'soft' as const,
      })),

      // Ghost: text + translucent hover background
      ...colors.map((color) => ({
        class: `text-${color} hover:bg-${color}/10`,
        color,
        variant: 'ghost' as const,
      })),

      // Link: text only
      ...colors.map((color) => ({
        class: `text-${color}`,
        color,
        variant: 'link' as const,
      })),
    ],
    defaultVariants: {
      color: 'primary',
      fullWidth: false,
      size: 'md',
      variant: 'solid',
    },
    variants: {
      color: {
        accent: 'focus-visible:outline-accent',
        danger: 'focus-visible:outline-danger',
        info: 'focus-visible:outline-info',
        neutral: 'focus-visible:outline-neutral',
        primary: 'focus-visible:outline-primary',
        secondary: 'focus-visible:outline-secondary',
        success: 'focus-visible:outline-success',
        warning: 'focus-visible:outline-warning',
      },
      fullWidth: {
        true: 'w-full',
      },
      size: {
        lg: 'px-6 py-3',
        md: 'px-4 py-2',
        sm: 'px-3 py-1.5',
      },
      variant: {
        ghost: `bg-transparent ${translucentHover}`,
        link: 'bg-transparent underline-offset-4 hover:underline hover:brightness-110 cursor-pointer',
        outline: `border-2 bg-transparent ${translucentHover}`,
        soft: translucentHover,
        solid: solidHover,
      },
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
