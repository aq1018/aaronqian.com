/**
 * Grid utility functions for generating Tailwind Grid classes
 *
 * IMPORTANT: All class names are hardcoded in lookup objects to ensure
 * Tailwind's JIT compiler can detect them. Dynamic string interpolation
 * like `${bp}:col-span-${value}` prevents class detection.
 */

// Responsive size/offset types
export interface ResponsiveValue {
  xs?: number | 'auto' | 'grow'
  sm?: number | 'auto' | 'grow'
  md?: number | 'auto' | 'grow'
  lg?: number | 'auto' | 'grow'
  xl?: number | 'auto' | 'grow'
}

export interface ResponsiveOffset {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

/**
 * Comprehensive lookup map for size classes
 * Maps keys like '1', 'auto', 'sm-4', 'md-grow' to complete class names
 */
const SIZE_CLASS_MAP: Partial<Record<string, string>> = {
  // Base classes (no breakpoint prefix)
  '1': 'col-span-1',
  '2': 'col-span-2',
  '3': 'col-span-3',
  '4': 'col-span-4',
  '5': 'col-span-5',
  '6': 'col-span-6',
  '7': 'col-span-7',
  '8': 'col-span-8',
  '9': 'col-span-9',
  '10': 'col-span-10',
  '11': 'col-span-11',
  '12': 'col-span-12',
  auto: 'col-auto',
  grow: 'col-span-full',

  // sm: breakpoint
  'sm-1': 'sm:col-span-1',
  'sm-2': 'sm:col-span-2',
  'sm-3': 'sm:col-span-3',
  'sm-4': 'sm:col-span-4',
  'sm-5': 'sm:col-span-5',
  'sm-6': 'sm:col-span-6',
  'sm-7': 'sm:col-span-7',
  'sm-8': 'sm:col-span-8',
  'sm-9': 'sm:col-span-9',
  'sm-10': 'sm:col-span-10',
  'sm-11': 'sm:col-span-11',
  'sm-12': 'sm:col-span-12',
  'sm-auto': 'sm:col-auto',
  'sm-grow': 'sm:col-span-full',

  // md: breakpoint
  'md-1': 'md:col-span-1',
  'md-2': 'md:col-span-2',
  'md-3': 'md:col-span-3',
  'md-4': 'md:col-span-4',
  'md-5': 'md:col-span-5',
  'md-6': 'md:col-span-6',
  'md-7': 'md:col-span-7',
  'md-8': 'md:col-span-8',
  'md-9': 'md:col-span-9',
  'md-10': 'md:col-span-10',
  'md-11': 'md:col-span-11',
  'md-12': 'md:col-span-12',
  'md-auto': 'md:col-auto',
  'md-grow': 'md:col-span-full',

  // lg: breakpoint
  'lg-1': 'lg:col-span-1',
  'lg-2': 'lg:col-span-2',
  'lg-3': 'lg:col-span-3',
  'lg-4': 'lg:col-span-4',
  'lg-5': 'lg:col-span-5',
  'lg-6': 'lg:col-span-6',
  'lg-7': 'lg:col-span-7',
  'lg-8': 'lg:col-span-8',
  'lg-9': 'lg:col-span-9',
  'lg-10': 'lg:col-span-10',
  'lg-11': 'lg:col-span-11',
  'lg-12': 'lg:col-span-12',
  'lg-auto': 'lg:col-auto',
  'lg-grow': 'lg:col-span-full',

  // xl: breakpoint
  'xl-1': 'xl:col-span-1',
  'xl-2': 'xl:col-span-2',
  'xl-3': 'xl:col-span-3',
  'xl-4': 'xl:col-span-4',
  'xl-5': 'xl:col-span-5',
  'xl-6': 'xl:col-span-6',
  'xl-7': 'xl:col-span-7',
  'xl-8': 'xl:col-span-8',
  'xl-9': 'xl:col-span-9',
  'xl-10': 'xl:col-span-10',
  'xl-11': 'xl:col-span-11',
  'xl-12': 'xl:col-span-12',
  'xl-auto': 'xl:col-auto',
  'xl-grow': 'xl:col-span-full',
}

/**
 * Comprehensive lookup map for offset classes
 * Maps keys like '1', 'md-4' to complete class names
 */
const OFFSET_CLASS_MAP: Partial<Record<string, string>> = {
  // Base classes (no breakpoint prefix)
  '1': 'col-start-2',
  '2': 'col-start-3',
  '3': 'col-start-4',
  '4': 'col-start-5',
  '5': 'col-start-6',
  '6': 'col-start-7',
  '7': 'col-start-8',
  '8': 'col-start-9',
  '9': 'col-start-10',
  '10': 'col-start-11',
  '11': 'col-start-12',
  '12': 'col-start-13',

  // sm: breakpoint
  'sm-1': 'sm:col-start-2',
  'sm-2': 'sm:col-start-3',
  'sm-3': 'sm:col-start-4',
  'sm-4': 'sm:col-start-5',
  'sm-5': 'sm:col-start-6',
  'sm-6': 'sm:col-start-7',
  'sm-7': 'sm:col-start-8',
  'sm-8': 'sm:col-start-9',
  'sm-9': 'sm:col-start-10',
  'sm-10': 'sm:col-start-11',
  'sm-11': 'sm:col-start-12',
  'sm-12': 'sm:col-start-13',

  // md: breakpoint
  'md-1': 'md:col-start-2',
  'md-2': 'md:col-start-3',
  'md-3': 'md:col-start-4',
  'md-4': 'md:col-start-5',
  'md-5': 'md:col-start-6',
  'md-6': 'md:col-start-7',
  'md-7': 'md:col-start-8',
  'md-8': 'md:col-start-9',
  'md-9': 'md:col-start-10',
  'md-10': 'md:col-start-11',
  'md-11': 'md:col-start-12',
  'md-12': 'md:col-start-13',

  // lg: breakpoint
  'lg-1': 'lg:col-start-2',
  'lg-2': 'lg:col-start-3',
  'lg-3': 'lg:col-start-4',
  'lg-4': 'lg:col-start-5',
  'lg-5': 'lg:col-start-6',
  'lg-6': 'lg:col-start-7',
  'lg-7': 'lg:col-start-8',
  'lg-8': 'lg:col-start-9',
  'lg-9': 'lg:col-start-10',
  'lg-10': 'lg:col-start-11',
  'lg-11': 'lg:col-start-12',
  'lg-12': 'lg:col-start-13',

  // xl: breakpoint
  'xl-1': 'xl:col-start-2',
  'xl-2': 'xl:col-start-3',
  'xl-3': 'xl:col-start-4',
  'xl-4': 'xl:col-start-5',
  'xl-5': 'xl:col-start-6',
  'xl-6': 'xl:col-start-7',
  'xl-7': 'xl:col-start-8',
  'xl-8': 'xl:col-start-9',
  'xl-9': 'xl:col-start-10',
  'xl-10': 'xl:col-start-11',
  'xl-11': 'xl:col-start-12',
  'xl-12': 'xl:col-start-13',
}

/**
 * Generate column span classes from size value
 */
export function getSizeClasses(
  size: number | 'auto' | 'grow' | ResponsiveValue | undefined,
): string {
  if (size === undefined) return ''

  if (typeof size === 'object') {
    // Handle responsive object
    const classes: string[] = []
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    breakpoints.forEach((bp) => {
      const value = size[bp]
      if (value !== undefined) {
        const key = bp === 'xs' ? String(value) : `${bp}-${value}`
        const className = SIZE_CLASS_MAP[key]
        if (className !== undefined) {
          classes.push(className)
        }
      }
    })

    return classes.join(' ')
  }

  // Handle simple value
  return SIZE_CLASS_MAP[String(size)] ?? ''
}

/**
 * Generate offset classes from offset value
 */
export function getOffsetClasses(offset: number | ResponsiveOffset | undefined): string {
  if (offset === undefined) return ''

  if (typeof offset === 'object') {
    // Handle responsive object
    const classes: string[] = []
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    breakpoints.forEach((bp) => {
      const value = offset[bp]
      if (value !== undefined) {
        const key = bp === 'xs' ? String(value) : `${bp}-${value}`
        const className = OFFSET_CLASS_MAP[key]
        if (className !== undefined) {
          classes.push(className)
        }
      }
    })

    return classes.join(' ')
  }

  // Handle simple value
  return OFFSET_CLASS_MAP[String(offset)] ?? ''
}
