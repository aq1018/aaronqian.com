/**
 * Stack utility functions for generating Tailwind flex direction classes
 *
 * IMPORTANT: All class names are hardcoded in lookup objects to ensure
 * Tailwind's JIT compiler can detect them. Dynamic string interpolation
 * like `${bp}:flex-${value}` prevents class detection.
 */

// Responsive direction type
export interface ResponsiveDirection {
  xs?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  sm?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  md?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  lg?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  xl?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
}

/**
 * Comprehensive lookup map for direction classes
 * Maps keys like 'row', 'column', 'sm-row', 'md-column' to complete class names
 */
const DIRECTION_CLASS_MAP: Partial<Record<string, string>> = {
  // Base classes (no breakpoint prefix)
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',

  // sm: breakpoint
  'sm-row': 'sm:flex-row',
  'sm-column': 'sm:flex-col',
  'sm-row-reverse': 'sm:flex-row-reverse',
  'sm-column-reverse': 'sm:flex-col-reverse',

  // md: breakpoint
  'md-row': 'md:flex-row',
  'md-column': 'md:flex-col',
  'md-row-reverse': 'md:flex-row-reverse',
  'md-column-reverse': 'md:flex-col-reverse',

  // lg: breakpoint
  'lg-row': 'lg:flex-row',
  'lg-column': 'lg:flex-col',
  'lg-row-reverse': 'lg:flex-row-reverse',
  'lg-column-reverse': 'lg:flex-col-reverse',

  // xl: breakpoint
  'xl-row': 'xl:flex-row',
  'xl-column': 'xl:flex-col',
  'xl-row-reverse': 'xl:flex-row-reverse',
  'xl-column-reverse': 'xl:flex-col-reverse',
}

/**
 * Generate flex direction classes from direction value
 */
export function getDirectionClasses(
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse' | ResponsiveDirection | undefined,
): string {
  if (direction === undefined) return ''

  if (typeof direction === 'object') {
    // Handle responsive object
    const classes: string[] = []
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    breakpoints.forEach((bp) => {
      const value = direction[bp]
      if (value !== undefined) {
        const key = bp === 'xs' ? value : `${bp}-${value}`
        const className = DIRECTION_CLASS_MAP[key]
        if (className !== undefined) {
          classes.push(className)
        }
      }
    })

    return classes.join(' ')
  }

  // Handle simple value
  return DIRECTION_CLASS_MAP[direction] ?? ''
}
