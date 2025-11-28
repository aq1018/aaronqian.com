/* eslint-disable max-lines */
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

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
 * - fill: Solid background with hover
 */
export const sheetCva = cva([], {
  compoundVariants: [
    // Outline variant with hover
    // Primary
    {
      class: 'border-primary hover:bg-primary/5',
      color: 'primary',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-primary',
      color: 'primary',
      hover: false,
      variant: 'outline' as const,
    },
    // Accent
    {
      class: 'border-accent hover:bg-accent/5',
      color: 'accent',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-accent',
      color: 'accent',
      hover: false,
      variant: 'outline' as const,
    },
    // Secondary
    {
      class: 'border-secondary hover:bg-secondary/5',
      color: 'secondary',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-secondary',
      color: 'secondary',
      hover: false,
      variant: 'outline' as const,
    },
    // Neutral
    {
      class: 'border-neutral hover:bg-neutral/5',
      color: 'neutral',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-neutral',
      color: 'neutral',
      hover: false,
      variant: 'outline' as const,
    },
    // Danger
    {
      class: 'border-danger hover:bg-danger/5',
      color: 'danger',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-danger',
      color: 'danger',
      hover: false,
      variant: 'outline' as const,
    },
    // Success
    {
      class: 'border-success hover:bg-success/5',
      color: 'success',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-success',
      color: 'success',
      hover: false,
      variant: 'outline' as const,
    },
    // Warning
    {
      class: 'border-warning hover:bg-warning/5',
      color: 'warning',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-warning',
      color: 'warning',
      hover: false,
      variant: 'outline' as const,
    },
    // Info
    {
      class: 'border-info hover:bg-info/5',
      color: 'info',
      hover: true,
      variant: 'outline' as const,
    },
    {
      class: 'border-info',
      color: 'info',
      hover: false,
      variant: 'outline' as const,
    },

    // Soft variant with hover
    // Primary
    {
      class: 'bg-primary/10 hover:bg-primary/15',
      color: 'primary',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-primary/10',
      color: 'primary',
      hover: false,
      variant: 'soft' as const,
    },
    // Accent
    {
      class: 'bg-accent/10 hover:bg-accent/15',
      color: 'accent',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-accent/10',
      color: 'accent',
      hover: false,
      variant: 'soft' as const,
    },
    // Secondary
    {
      class: 'bg-secondary/10 hover:bg-secondary/15',
      color: 'secondary',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-secondary/10',
      color: 'secondary',
      hover: false,
      variant: 'soft' as const,
    },
    // Neutral
    {
      class: 'bg-neutral/10 hover:bg-neutral/15',
      color: 'neutral',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-neutral/10',
      color: 'neutral',
      hover: false,
      variant: 'soft' as const,
    },
    // Danger
    {
      class: 'bg-danger/10 hover:bg-danger/15',
      color: 'danger',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-danger/10',
      color: 'danger',
      hover: false,
      variant: 'soft' as const,
    },
    // Success
    {
      class: 'bg-success/10 hover:bg-success/15',
      color: 'success',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-success/10',
      color: 'success',
      hover: false,
      variant: 'soft' as const,
    },
    // Warning
    {
      class: 'bg-warning/10 hover:bg-warning/15',
      color: 'warning',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-warning/10',
      color: 'warning',
      hover: false,
      variant: 'soft' as const,
    },
    // Info
    {
      class: 'bg-info/10 hover:bg-info/15',
      color: 'info',
      hover: true,
      variant: 'soft' as const,
    },
    {
      class: 'bg-info/10',
      color: 'info',
      hover: false,
      variant: 'soft' as const,
    },

    // Bar variant with hover (left border opacity shift + background)
    // Primary
    {
      class: 'border-l-neutral/30 hover:border-l-primary hover:bg-primary/5',
      color: 'primary',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-primary/30',
      color: 'primary',
      hover: false,
      variant: 'bar' as const,
    },
    // Accent
    {
      class: 'border-l-neutral/30 hover:border-l-accent hover:bg-accent/5',
      color: 'accent',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-accent/30',
      color: 'accent',
      hover: false,
      variant: 'bar' as const,
    },
    // Secondary
    {
      class: 'border-l-neutral/30 hover:border-l-secondary hover:bg-secondary/5',
      color: 'secondary',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-secondary/30',
      color: 'secondary',
      hover: false,
      variant: 'bar' as const,
    },
    // Neutral
    {
      class: 'border-l-neutral/30 hover:border-l-neutral hover:bg-neutral/5',
      color: 'neutral',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-neutral/30',
      color: 'neutral',
      hover: false,
      variant: 'bar' as const,
    },
    // Danger
    {
      class: 'border-l-neutral/30 hover:border-l-danger hover:bg-danger/5',
      color: 'danger',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-danger/30',
      color: 'danger',
      hover: false,
      variant: 'bar' as const,
    },
    // Success
    {
      class: 'border-l-neutral/30 hover:border-l-success hover:bg-success/5',
      color: 'success',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-success/30',
      color: 'success',
      hover: false,
      variant: 'bar' as const,
    },
    // Warning
    {
      class: 'border-l-neutral/30 hover:border-l-warning hover:bg-warning/5',
      color: 'warning',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-warning/30',
      color: 'warning',
      hover: false,
      variant: 'bar' as const,
    },
    // Info
    {
      class: 'border-l-neutral/30 hover:border-l-info hover:bg-info/5',
      color: 'info',
      hover: true,
      variant: 'bar' as const,
    },
    {
      class: 'border-l-info/30',
      color: 'info',
      hover: false,
      variant: 'bar' as const,
    },

    // Fill variant with hover
    // Primary
    {
      class: 'bg-primary text-primary-content hover:bg-primary/90',
      color: 'primary',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-primary text-primary-content',
      color: 'primary',
      hover: false,
      variant: 'fill' as const,
    },
    // Accent
    {
      class: 'bg-accent text-accent-content hover:bg-accent/90',
      color: 'accent',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-accent text-accent-content',
      color: 'accent',
      hover: false,
      variant: 'fill' as const,
    },
    // Secondary
    {
      class: 'bg-secondary text-secondary-content hover:bg-secondary/90',
      color: 'secondary',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-secondary text-secondary-content',
      color: 'secondary',
      hover: false,
      variant: 'fill' as const,
    },
    // Neutral
    {
      class: 'bg-neutral text-neutral-content hover:bg-neutral/90',
      color: 'neutral',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-neutral text-neutral-content',
      color: 'neutral',
      hover: false,
      variant: 'fill' as const,
    },
    // Danger
    {
      class: 'bg-danger text-danger-content hover:bg-danger/90',
      color: 'danger',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-danger text-danger-content',
      color: 'danger',
      hover: false,
      variant: 'fill' as const,
    },
    // Success
    {
      class: 'bg-success text-success-content hover:bg-success/90',
      color: 'success',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-success text-success-content',
      color: 'success',
      hover: false,
      variant: 'fill' as const,
    },
    // Warning
    {
      class: 'bg-warning text-warning-content hover:bg-warning/90',
      color: 'warning',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-warning text-warning-content',
      color: 'warning',
      hover: false,
      variant: 'fill' as const,
    },
    // Info
    {
      class: 'bg-info text-info-content hover:bg-info/90',
      color: 'info',
      hover: true,
      variant: 'fill' as const,
    },
    {
      class: 'bg-info text-info-content',
      color: 'info',
      hover: false,
      variant: 'fill' as const,
    },
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
      fill: 'overflow-hidden',
      outline: 'border-2 rounded overflow-hidden',
      soft: 'overflow-hidden',
    },
  },
})

export type SheetStyle = VariantProps<typeof sheetCva>
