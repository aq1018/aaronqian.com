import { type VariantProps, cva } from 'class-variance-authority'

export const badgeVariants = cva(['rounded', 'px-2', 'py-0.5', 'text-xs', 'font-bold'], {
  variants: {
    variant: {
      // LIVE status badges
      status: 'bg-primary text-gray-950',
      // Content tags
      tag: 'bg-highlight text-muted',
      // Outlined tags
      outline: 'border-2 border-primary text-primary bg-transparent',
    },
    pulse: {
      true: 'animate-pulse-subtle',
    },
  },
  defaultVariants: {
    variant: 'status',
    pulse: false,
  },
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
