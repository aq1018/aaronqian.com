import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Badge component variants
 * Semantic, composable badge system using design tokens
 */
export const badgeVariants = cva(
  ['inline-flex', 'items-center', 'rounded', 'font-mono', 'font-semibold', 'whitespace-nowrap'],
  {
    compoundVariants: [
      // Solid variant
      { class: 'bg-primary text-primary-content', color: 'primary', variant: 'solid' },
      { class: 'bg-accent text-accent-content', color: 'accent', variant: 'solid' },
      { class: 'bg-secondary text-secondary-content', color: 'secondary', variant: 'solid' },
      { class: 'bg-success text-success-content', color: 'success', variant: 'solid' },
      { class: 'bg-warning text-warning-content', color: 'warning', variant: 'solid' },
      { class: 'bg-danger text-danger-content', color: 'danger', variant: 'solid' },
      { class: 'bg-info text-info-content', color: 'info', variant: 'solid' },
      { class: 'bg-neutral text-neutral-content', color: 'neutral', variant: 'solid' },
      { class: 'bg-muted/20 text-muted', color: 'muted', variant: 'solid' },

      // Outline variant
      { class: 'border-2 border-primary text-primary', color: 'primary', variant: 'outline' },
      { class: 'border-2 border-accent text-accent', color: 'accent', variant: 'outline' },
      { class: 'border-2 border-secondary text-secondary', color: 'secondary', variant: 'outline' },
      { class: 'border-2 border-success text-success', color: 'success', variant: 'outline' },
      { class: 'border-2 border-warning text-warning', color: 'warning', variant: 'outline' },
      { class: 'border-2 border-danger text-danger', color: 'danger', variant: 'outline' },
      { class: 'border-2 border-info text-info', color: 'info', variant: 'outline' },
      { class: 'border-2 border-neutral text-neutral', color: 'neutral', variant: 'outline' },
      { class: 'border-2 border-muted text-muted', color: 'muted', variant: 'outline' },

      // Soft variant
      { class: 'bg-primary/20 text-primary', color: 'primary', variant: 'soft' },
      { class: 'bg-accent/20 text-accent', color: 'accent', variant: 'soft' },
      { class: 'bg-secondary/20 text-secondary', color: 'secondary', variant: 'soft' },
      { class: 'bg-success/20 text-success', color: 'success', variant: 'soft' },
      { class: 'bg-warning/20 text-warning', color: 'warning', variant: 'soft' },
      { class: 'bg-danger/20 text-danger', color: 'danger', variant: 'soft' },
      { class: 'bg-info/20 text-info', color: 'info', variant: 'soft' },
      { class: 'bg-neutral/20 text-neutral', color: 'neutral', variant: 'soft' },
      { class: 'bg-muted/10 text-muted', color: 'muted', variant: 'soft' },
    ],
    defaultVariants: {
      color: 'neutral',
      pulse: false,
      size: 'sm',
      uppercase: false,
      variant: 'solid',
    },
    variants: {
      color: {
        // Brand colors
        primary: '',
        accent: '',
        secondary: '',
        // Status colors
        success: '',
        warning: '',
        danger: '',
        info: '',
        // Utility colors
        neutral: '',
        muted: '',
      },
      pulse: {
        true: 'animate-pulse-subtle',
      },
      size: {
        md: 'text-sm px-2.5 py-1',
        sm: 'text-xs px-2 py-1',
        xs: 'text-xs px-1.5 py-0.5',
      },
      uppercase: {
        true: 'uppercase tracking-wider',
      },
      variant: {
        outline: 'bg-transparent',
        soft: '',
        solid: '',
      },
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
