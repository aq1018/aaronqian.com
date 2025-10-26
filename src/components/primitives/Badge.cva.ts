import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Badge component variants
 * Semantic, composable badge system using design tokens
 */
export const badgeVariants = cva(
  ['inline-flex', 'items-center', 'rounded', 'font-mono', 'font-semibold', 'whitespace-nowrap'],
  {
    variants: {
      size: {
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2.5 py-1',
      },
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
      variant: {
        solid: '',
        outline: 'bg-transparent',
        soft: '',
      },
      pulse: {
        true: 'animate-pulse-subtle',
      },
      uppercase: {
        true: 'uppercase tracking-wider',
      },
    },
    compoundVariants: [
      // Solid variant
      { color: 'primary', variant: 'solid', class: 'bg-primary text-primary-content' },
      { color: 'accent', variant: 'solid', class: 'bg-accent text-accent-content' },
      { color: 'secondary', variant: 'solid', class: 'bg-secondary text-secondary-content' },
      { color: 'success', variant: 'solid', class: 'bg-success text-success-content' },
      { color: 'warning', variant: 'solid', class: 'bg-warning text-warning-content' },
      { color: 'danger', variant: 'solid', class: 'bg-danger text-danger-content' },
      { color: 'info', variant: 'solid', class: 'bg-info text-info-content' },
      { color: 'neutral', variant: 'solid', class: 'bg-neutral text-neutral-content' },
      { color: 'muted', variant: 'solid', class: 'bg-muted/20 text-muted' },

      // Outline variant
      { color: 'primary', variant: 'outline', class: 'border-2 border-primary text-primary' },
      { color: 'accent', variant: 'outline', class: 'border-2 border-accent text-accent' },
      { color: 'secondary', variant: 'outline', class: 'border-2 border-secondary text-secondary' },
      { color: 'success', variant: 'outline', class: 'border-2 border-success text-success' },
      { color: 'warning', variant: 'outline', class: 'border-2 border-warning text-warning' },
      { color: 'danger', variant: 'outline', class: 'border-2 border-danger text-danger' },
      { color: 'info', variant: 'outline', class: 'border-2 border-info text-info' },
      { color: 'neutral', variant: 'outline', class: 'border-2 border-neutral text-neutral' },
      { color: 'muted', variant: 'outline', class: 'border-2 border-muted text-muted' },

      // Soft variant
      { color: 'primary', variant: 'soft', class: 'bg-primary/20 text-primary' },
      { color: 'accent', variant: 'soft', class: 'bg-accent/20 text-accent' },
      { color: 'secondary', variant: 'soft', class: 'bg-secondary/20 text-secondary' },
      { color: 'success', variant: 'soft', class: 'bg-success/20 text-success' },
      { color: 'warning', variant: 'soft', class: 'bg-warning/20 text-warning' },
      { color: 'danger', variant: 'soft', class: 'bg-danger/20 text-danger' },
      { color: 'info', variant: 'soft', class: 'bg-info/20 text-info' },
      { color: 'neutral', variant: 'soft', class: 'bg-neutral/20 text-neutral' },
      { color: 'muted', variant: 'soft', class: 'bg-muted/10 text-muted' },
    ],
    defaultVariants: {
      size: 'sm',
      color: 'neutral',
      variant: 'solid',
      pulse: false,
      uppercase: false,
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
