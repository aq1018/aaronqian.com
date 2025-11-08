import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

/**
 * Grid: CSS Grid layout primitive with 12-column system
 *
 * Auto-detects container vs item based on presence of size props:
 * - Container: No size props → display grid with configurable columns
 * - Item: Has size/xs/sm/md/lg/xl → spans columns using col-span-*
 *
 * Usage:
 * ```astro
 * <Grid spacing="md" columns={12}>
 *   <Grid size={6}>Half width</Grid>
 *   <Grid size={{xs: 12, md: 6}}>Responsive</Grid>
 * </Grid>
 * ```
 */

/**
 * Container variants (when no size props present)
 */
export const gridContainerCva = cva('grid', {
  defaultVariants: {
    align: 'stretch',
    columns: 12,
    direction: 'row',
    justify: 'stretch',
    spacing: 'md',
  },
  variants: {
    align: {
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
      stretch: 'items-stretch',
    },
    columns: {
      1: 'grid-cols-1',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
    },
    direction: {
      column: 'grid-flow-col',
      dense: 'grid-flow-dense',
      row: 'grid-flow-row',
    },
    justify: {
      center: 'justify-items-center',
      end: 'justify-items-end',
      start: 'justify-items-start',
      stretch: 'justify-items-stretch',
    },
    spacing: {
      none: 'gap-0',
      xs: 'gap-2 md:gap-3', // 8 → 12px
      sm: 'gap-3 md:gap-4 lg:gap-5', // 12 → 16 → 20px
      md: 'gap-4 md:gap-5 lg:gap-6', // 16 → 20 → 24px
      lg: 'gap-5 md:gap-6 lg:gap-8', // 20 → 24 → 32px
      xl: 'gap-6 md:gap-8 lg:gap-10', // 24 → 32 → 40px
    },
  },
})

export type GridContainerStyle = VariantProps<typeof gridContainerCva>

/**
 * Item base classes (when size props present)
 * Supports responsive size and offset with flat prop syntax
 */
export const gridItemCva = cva('', {
  defaultVariants: {
    alignSelf: 'auto',
    justifySelf: 'auto',
  },
  variants: {
    // Base size (mobile-first)
    size: {
      1: 'col-span-1',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      auto: 'col-auto',
      grow: 'col-span-full',
    },
    'size-sm': {
      1: 'sm:col-span-1',
      10: 'sm:col-span-10',
      11: 'sm:col-span-11',
      12: 'sm:col-span-12',
      2: 'sm:col-span-2',
      3: 'sm:col-span-3',
      4: 'sm:col-span-4',
      5: 'sm:col-span-5',
      6: 'sm:col-span-6',
      7: 'sm:col-span-7',
      8: 'sm:col-span-8',
      9: 'sm:col-span-9',
      auto: 'sm:col-auto',
      grow: 'sm:col-span-full',
    },
    'size-md': {
      1: 'md:col-span-1',
      10: 'md:col-span-10',
      11: 'md:col-span-11',
      12: 'md:col-span-12',
      2: 'md:col-span-2',
      3: 'md:col-span-3',
      4: 'md:col-span-4',
      5: 'md:col-span-5',
      6: 'md:col-span-6',
      7: 'md:col-span-7',
      8: 'md:col-span-8',
      9: 'md:col-span-9',
      auto: 'md:col-auto',
      grow: 'md:col-span-full',
    },
    'size-lg': {
      1: 'lg:col-span-1',
      10: 'lg:col-span-10',
      11: 'lg:col-span-11',
      12: 'lg:col-span-12',
      2: 'lg:col-span-2',
      3: 'lg:col-span-3',
      4: 'lg:col-span-4',
      5: 'lg:col-span-5',
      6: 'lg:col-span-6',
      7: 'lg:col-span-7',
      8: 'lg:col-span-8',
      9: 'lg:col-span-9',
      auto: 'lg:col-auto',
      grow: 'lg:col-span-full',
    },
    'size-xl': {
      1: 'xl:col-span-1',
      10: 'xl:col-span-10',
      11: 'xl:col-span-11',
      12: 'xl:col-span-12',
      2: 'xl:col-span-2',
      3: 'xl:col-span-3',
      4: 'xl:col-span-4',
      5: 'xl:col-span-5',
      6: 'xl:col-span-6',
      7: 'xl:col-span-7',
      8: 'xl:col-span-8',
      9: 'xl:col-span-9',
      auto: 'xl:col-auto',
      grow: 'xl:col-span-full',
    },
    // Base offset (mobile-first)
    offset: {
      1: 'col-start-2',
      10: 'col-start-11',
      11: 'col-start-12',
      12: 'col-start-13',
      2: 'col-start-3',
      3: 'col-start-4',
      4: 'col-start-5',
      5: 'col-start-6',
      6: 'col-start-7',
      7: 'col-start-8',
      8: 'col-start-9',
      9: 'col-start-10',
    },
    'offset-sm': {
      1: 'sm:col-start-2',
      10: 'sm:col-start-11',
      11: 'sm:col-start-12',
      12: 'sm:col-start-13',
      2: 'sm:col-start-3',
      3: 'sm:col-start-4',
      4: 'sm:col-start-5',
      5: 'sm:col-start-6',
      6: 'sm:col-start-7',
      7: 'sm:col-start-8',
      8: 'sm:col-start-9',
      9: 'sm:col-start-10',
    },
    'offset-md': {
      1: 'md:col-start-2',
      10: 'md:col-start-11',
      11: 'md:col-start-12',
      12: 'md:col-start-13',
      2: 'md:col-start-3',
      3: 'md:col-start-4',
      4: 'md:col-start-5',
      5: 'md:col-start-6',
      6: 'md:col-start-7',
      7: 'md:col-start-8',
      8: 'md:col-start-9',
      9: 'md:col-start-10',
    },
    'offset-lg': {
      1: 'lg:col-start-2',
      10: 'lg:col-start-11',
      11: 'lg:col-start-12',
      12: 'lg:col-start-13',
      2: 'lg:col-start-3',
      3: 'lg:col-start-4',
      4: 'lg:col-start-5',
      5: 'lg:col-start-6',
      6: 'lg:col-start-7',
      7: 'lg:col-start-8',
      8: 'lg:col-start-9',
      9: 'lg:col-start-10',
    },
    'offset-xl': {
      1: 'xl:col-start-2',
      10: 'xl:col-start-11',
      11: 'xl:col-start-12',
      12: 'xl:col-start-13',
      2: 'xl:col-start-3',
      3: 'xl:col-start-4',
      4: 'xl:col-start-5',
      5: 'xl:col-start-6',
      6: 'xl:col-start-7',
      7: 'xl:col-start-8',
      8: 'xl:col-start-9',
      9: 'xl:col-start-10',
    },
    // Alignment overrides for individual items
    justifySelf: {
      auto: '', // Default - no class needed
      start: 'justify-self-start',
      center: 'justify-self-center',
      end: 'justify-self-end',
      stretch: 'justify-self-stretch',
    },
    alignSelf: {
      auto: '', // Default - no class needed
      start: 'self-start',
      center: 'self-center',
      end: 'self-end',
      stretch: 'self-stretch',
    },
  },
})

export type GridItemStyle = VariantProps<typeof gridItemCva>
