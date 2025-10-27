import { type VariantProps, cva } from 'class-variance-authority'

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
  variants: {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    },
    spacing: {
      none: 'gap-0',
      xs: 'gap-2 md:gap-3', // 8 → 12px
      sm: 'gap-3 md:gap-4 lg:gap-5', // 12 → 16 → 20px
      md: 'gap-4 md:gap-5 lg:gap-6', // 16 → 20 → 24px
      lg: 'gap-5 md:gap-6 lg:gap-8', // 20 → 24 → 32px
      xl: 'gap-6 md:gap-8 lg:gap-10', // 24 → 32 → 40px
    },
    direction: {
      row: 'grid-flow-row',
      column: 'grid-flow-col',
      dense: 'grid-flow-dense',
    },
    justify: {
      start: 'justify-items-start',
      center: 'justify-items-center',
      end: 'justify-items-end',
      stretch: 'justify-items-stretch',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: {
    columns: 12,
    spacing: 'md',
    direction: 'row',
    justify: 'stretch',
    align: 'stretch',
  },
})

export type GridContainerStyle = VariantProps<typeof gridContainerCva>

/**
 * Item base classes (when size props present)
 * Note: Size and offset are handled dynamically in Grid.astro
 * to support responsive objects
 */
export const gridItemCva = cva('', {
  variants: {
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
  defaultVariants: {
    justifySelf: 'auto',
    alignSelf: 'auto',
  },
})

export type GridItemStyle = VariantProps<typeof gridItemCva>
