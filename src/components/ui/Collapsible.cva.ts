/**
 * Collapsible component variants
 * CVA pattern for expandable/collapsible content sections
 * Uses modern CSS Grid technique for smooth height transitions
 */

import { type VariantProps, cva } from 'class-variance-authority'

export const collapsibleVariants = cva([
  // Modern CSS Grid technique for height transitions
  'grid',
  'transition-[grid-template-rows]',
  'duration-300',
  'ease-out',
  'collapsible-wrapper',
])

export const collapsibleContentVariants = cva([
  // Content wrapper with overflow hidden for grid technique
  'overflow-hidden',
  'collapsible-content',
])

export type CollapsibleVariants = VariantProps<typeof collapsibleVariants>
