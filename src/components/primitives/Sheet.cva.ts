import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Color options (matches Button component)
 */
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

/**
 * Sheet: Base bordered container primitive
 * Terminal aesthetic - flat borders, no shadows
 * Similar to Button but for containers (no text color management)
 *
 * Page → Surface → Container → Layout → **Sheet** → Content
 *
 * Variants:
 * - outline: Border with hover background
 * - soft: Subtle background with hover
 * - bar: Left border with opacity shift on hover
 */
export const sheetCva = cva(['overflow-hidden'], {
  compoundVariants: [
    // Outline variant with hover
    ...colors.flatMap((color) => [
      {
        class: `border-${color} hover:bg-${color}/5`,
        color,
        hover: true,
        variant: 'outline' as const,
      },
      {
        class: `border-${color}`,
        color,
        hover: false,
        variant: 'outline' as const,
      },
    ]),

    // Soft variant with hover
    ...colors.flatMap((color) => [
      {
        class: `bg-${color}/10 hover:bg-${color}/15`,
        color,
        hover: true,
        variant: 'soft' as const,
      },
      {
        class: `bg-${color}/10`,
        color,
        hover: false,
        variant: 'soft' as const,
      },
    ]),

    // Bar variant with hover (left border opacity shift)
    ...colors.flatMap((color) => [
      {
        class: `border-l-neutral/30 hover:border-l-${color}`,
        color,
        hover: true,
        variant: 'bar' as const,
      },
      {
        class: `border-l-${color}/30`,
        color,
        hover: false,
        variant: 'bar' as const,
      },
    ]),
  ],
  defaultVariants: {
    color: 'neutral',
    hover: false,
    padding: 'md',
    variant: 'outline',
  },
  variants: {
    color: {
      accent: '',
      danger: '',
      info: '',
      neutral: '',
      primary: '',
      secondary: '',
      success: '',
      warning: '',
    },
    hover: {
      false: '',
      true: 'transition-colors',
    },
    padding: {
      lg: 'p-8',
      md: 'p-6',
      none: 'p-0',
      sm: 'p-4',
    },
    variant: {
      bar: 'bg-transparent border-l-2',
      outline: 'border-2 rounded',
      soft: '',
    },
  },
})

export type SheetStyle = VariantProps<typeof sheetCva>
