import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Shared color variants for typography components
 * Simplified for terminal aesthetic - no fancy brand/status colors
 */
const colorVariants = {
  inherit: 'text-inherit',
  default: 'text-content',
  muted: 'text-muted',
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  info: 'text-info',
} as const

const whitespaceVariants = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
} as const

const truncateVariants = {
  true: 'truncate',
  false: '',
} as const

const breakVariants = {
  normal: 'break-normal',
  words: 'break-words',
  all: 'break-all',
} as const

const transformVariants = {
  none: '',
  capitalize: 'capitalize',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
} as const

/**
 * Heading variants - semantic heading styles with responsive typography
 */
export const headingVariants = cva('font-sans tracking-tight', {
  variants: {
    size: {
      'display-2': 'text-6xl md:text-7xl font-bold leading-[0.95]',
      'display-1': 'text-5xl md:text-6xl font-bold leading-[0.98]',
      h1: 'text-4xl md:text-5xl font-semibold leading-tight',
      h2: 'text-3xl md:text-4xl font-semibold leading-snug',
      h3: 'text-2xl md:text-3xl font-semibold leading-snug',
      h4: 'text-xl md:text-2xl font-medium leading-snug',
      h5: 'text-lg font-medium leading-normal',
      h6: 'text-base font-medium leading-normal',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
    },
    color: colorVariants,
    whitespace: whitespaceVariants,
    truncate: truncateVariants,
    break: breakVariants,
    transform: transformVariants,
  },
  defaultVariants: {
    size: 'h2',
    color: 'inherit',
    whitespace: 'normal',
    truncate: false,
    break: 'normal',
  },
})

export type HeadingStyle = VariantProps<typeof headingVariants>

/**
 * Text variants - body text and labels with comprehensive styling options
 */
export const textVariants = cva('', {
  variants: {
    size: {
      lead: 'text-lg leading-8',
      body: 'text-base leading-7',
      'body-dense': 'text-base leading-6',
      small: 'text-sm leading-6',
      'small-dense': 'text-sm leading-5',
      micro: 'text-xs leading-5',
      'label-lg': 'text-base leading-6 tracking-wide',
      label: 'text-sm leading-5 tracking-wide',
      'label-sm': 'text-xs leading-4 tracking-wider',
      xl: 'text-xl md:text-2xl leading-8',
      '2xl': 'text-2xl md:text-3xl leading-9',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
      justify: 'text-justify',
    },
    color: colorVariants,
    uppercase: {
      true: 'uppercase',
      false: '',
    },
    strong: {
      true: 'font-semibold',
      false: '',
    },
    italic: {
      true: 'italic',
      false: '',
    },
    strike: {
      true: 'line-through',
      false: '',
    },
    whitespace: whitespaceVariants,
    truncate: truncateVariants,
    break: breakVariants,
    transform: transformVariants,
  },
  defaultVariants: {
    size: 'body',
    color: 'inherit',
    uppercase: false,
    strong: false,
    italic: false,
    strike: false,
    whitespace: 'normal',
    truncate: false,
    break: 'normal',
  },
})

export type TextStyle = VariantProps<typeof textVariants>
