import { type VariantProps, cva } from 'class-variance-authority'

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
  variants: {
    variant: {
      outline: 'border-2 rounded',
      soft: '',
      bar: 'bg-transparent border-l-2',
    },
    color: {
      primary: '',
      accent: '',
      secondary: '',
      neutral: '',
      danger: '',
      success: '',
      warning: '',
      info: '',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    hover: {
      true: 'transition-colors',
      false: '',
    },
  },
  compoundVariants: [
    // Outline variant with hover
    ...colors.flatMap((color) => [
      {
        variant: 'outline' as const,
        color,
        hover: true,
        class: `border-${color} hover:bg-${color}/5`,
      },
      {
        variant: 'outline' as const,
        color,
        hover: false,
        class: `border-${color}`,
      },
    ]),

    // Soft variant with hover
    ...colors.flatMap((color) => [
      {
        variant: 'soft' as const,
        color,
        hover: true,
        class: `bg-${color}/10 hover:bg-${color}/15`,
      },
      {
        variant: 'soft' as const,
        color,
        hover: false,
        class: `bg-${color}/10`,
      },
    ]),

    // Bar variant with hover (left border opacity shift)
    ...colors.flatMap((color) => [
      {
        variant: 'bar' as const,
        color,
        hover: true,
        class: `border-l-${color}/30 hover:border-l-${color}`,
      },
      {
        variant: 'bar' as const,
        color,
        hover: false,
        class: `border-l-${color}/30`,
      },
    ]),
  ],
  defaultVariants: {
    variant: 'outline',
    color: 'neutral',
    padding: 'md',
    hover: false,
  },
})

export type SheetStyle = VariantProps<typeof sheetCva>
