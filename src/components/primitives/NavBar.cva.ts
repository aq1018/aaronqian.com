import { type VariantProps, cva } from 'class-variance-authority'

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
  variants: {
    position: {
      static: '',
      sticky: '',
      fixed: '',
    },
    placement: {
      top: '',
      bottom: '',
    },
    border: {
      none: '',
      top: 'border-t border-border',
      bottom: 'border-b border-border',
      both: 'border-y border-border',
    },
    backdrop: {
      true: 'bg-background/95 backdrop-blur-sm',
      false: 'bg-background',
    },
  },
  compoundVariants: [
    // Sticky positioning
    {
      position: 'sticky',
      placement: 'top',
      class: 'sticky top-0 z-50',
    },
    {
      position: 'sticky',
      placement: 'bottom',
      class: 'sticky bottom-0 z-50',
    },
    // Fixed positioning
    {
      position: 'fixed',
      placement: 'top',
      class: 'fixed top-0 z-50',
    },
    {
      position: 'fixed',
      placement: 'bottom',
      class: 'fixed bottom-0 z-50',
    },
  ],
  defaultVariants: {
    position: 'static',
    placement: 'top',
    border: 'none',
    backdrop: false,
  },
})

export type NavBarStyle = VariantProps<typeof navBarCva>
