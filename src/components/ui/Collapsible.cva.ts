/**
 * Collapsible component variants
 * CVA pattern for expandable/collapsible content sections
 * Uses modern CSS Grid technique for smooth height transitions
 */

import { type VariantProps, cva } from 'class-variance-authority'

// Shared transition base (extracted to reduce duplication)
const transitionBase = 'transition-[grid-template-rows] ease-out'

export const collapsibleVariants = cva(
  [
    // Modern CSS Grid technique for height transitions
    'grid',
    'collapsible-wrapper',
  ],
  {
    variants: {
      speed: {
        fast: `${transitionBase} duration-150`,
        normal: `${transitionBase} duration-300`,
        slow: `${transitionBase} duration-500`,
      },
      bordered: {
        true: 'rounded-lg border border-border',
        false: '',
      },
    },
    defaultVariants: {
      speed: 'normal',
      bordered: false,
    },
  },
)

export const collapsibleContentVariants = cva([
  // Content wrapper with overflow hidden for grid technique
  'overflow-hidden',
  'collapsible-content',
])

export type CollapsibleVariants = VariantProps<typeof collapsibleVariants>
