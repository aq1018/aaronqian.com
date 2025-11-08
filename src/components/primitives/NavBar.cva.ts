import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * NavBar: Navigation bar container primitive
 * Handles positioning, borders, background, and backdrop effects
 *
 * Part of compound component: NavBar + NavBarContent
 *
 * Positioning:
 * - static: Normal flow
 * - sticky: Sticks to top/bottom when scrolling
 * - fixed: Fixed to viewport top/bottom
 */
export const navBarCva = cva(['w-full'], {
  compoundVariants: [
    // Sticky positioning
    {
      class: 'sticky top-0 z-50',
      placement: 'top',
      position: 'sticky',
    },
    {
      class: 'sticky bottom-0 z-50',
      placement: 'bottom',
      position: 'sticky',
    },
    // Fixed positioning
    {
      class: 'fixed top-0 z-50',
      placement: 'top',
      position: 'fixed',
    },
    {
      class: 'fixed bottom-0 z-50',
      placement: 'bottom',
      position: 'fixed',
    },
  ],
  defaultVariants: {
    backdrop: false,
    border: 'none',
    placement: 'top',
    position: 'static',
  },
  variants: {
    backdrop: {
      false: 'bg-background',
      true: 'bg-background/95 backdrop-blur-sm',
    },
    border: {
      both: 'border-y border-border',
      bottom: 'border-b border-border',
      none: '',
      top: 'border-t border-border',
    },
    placement: {
      bottom: '',
      top: '',
    },
    position: {
      fixed: '',
      static: '',
      sticky: '',
    },
  },
})

export type NavBarStyle = VariantProps<typeof navBarCva>
