import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

const colorVariants = {
  accent: 'text-accent',
  danger: 'text-danger',
  default: 'text-content',
  info: 'text-info',
  inherit: 'text-inherit',
  muted: 'text-muted',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
} as const

const alignVariants = {
  center: 'text-center',
  end: 'text-end',
  justify: 'text-justify',
  start: 'text-start',
} as const

const whitespaceVariants = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
} as const

const truncateVariants = {
  false: '',
  true: 'typography-truncate',
} as const

const breakVariants = {
  all: 'break-all',
  normal: 'break-normal',
  words: 'break-words',
} as const

const transformVariants = {
  capitalize: 'capitalize',
  lowercase: 'lowercase',
  none: '',
  uppercase: 'uppercase',
} as const

const familyVariants = {
  inherit: '',
  mono: 'font-mono',
  sans: 'font-sans',
} as const

export const headingVariants = cva('', {
  compoundVariants: [
    // mono display gets the mono tracking
    {
      class: 'tracking-heading-display-mono',
      family: 'mono',
      size: 'display-2',
    },
    {
      class: 'tracking-heading-display-mono',
      family: 'mono',
      size: 'display-1',
    },
  ],
  defaultVariants: {
    break: 'normal',
    color: 'inherit',
    family: 'mono',
    line: 'auto',
    preset: 'default',
    size: 'h2',
    transform: 'none',
    truncate: false,
    whitespace: 'normal',
  },
  variants: {
    align: alignVariants,
    break: breakVariants,
    color: colorVariants,
    family: familyVariants,
    line: {
      auto: '',
      none: 'leading-none',
      normal: 'leading-heading-sm',
      relaxed: 'leading-relaxed',
      tight: 'leading-heading-base',
    },
    preset: {
      default: '',
      hero: 'typography-preset-hero',
      kicker: 'typography-preset-kicker',
      longread: 'typography-preset-longread',
      note: 'typography-preset-note',
    },
    size: {
      'display-1': 'typography-heading-display-1',
      'display-2': 'typography-heading-display-2',
      h1: 'typography-heading-h1',
      h2: 'typography-heading-h2',
      h3: 'typography-heading-h3',
      h4: 'typography-heading-h4',
      h5: 'typography-heading-h5',
      h6: 'typography-heading-h6',
    },
    transform: transformVariants,
    truncate: truncateVariants,
    whitespace: whitespaceVariants,
  },
})

export type HeadingStyle = VariantProps<typeof headingVariants>

export const textVariants = cva('', {
  compoundVariants: [
    {
      class: 'typography-truncate',
      truncate: true,
    },
  ],
  defaultVariants: {
    break: 'normal',
    color: 'inherit',
    family: 'inherit',
    italic: false,
    line: 'auto',
    preset: 'default',
    size: 'body',
    strike: false,
    strong: false,
    transform: 'none',
    truncate: false,
    uppercase: false,
    whitespace: 'normal',
  },
  variants: {
    align: alignVariants,
    break: breakVariants,
    color: colorVariants,
    family: familyVariants,
    italic: { false: '', true: 'italic' },
    line: {
      auto: '',
      loose: 'leading-loose',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      tight: 'leading-tight',
    },
    preset: {
      default: '',
      kicker: 'typography-preset-kicker',
      longread: 'typography-preset-longread',
      note: 'typography-preset-note',
    },
    size: {
      '2xl': 'typography-text-2xl',
      body: 'typography-text-body',
      'body-dense': 'typography-text-body-dense',
      label: 'typography-text-label',
      'label-lg': 'typography-text-label-lg',
      'label-sm': 'typography-text-label-sm',
      lead: 'typography-text-lead',
      micro: 'typography-text-micro',
      small: 'typography-text-small',
      'small-dense': 'typography-text-small-dense',
      xl: 'typography-text-xl',
    },
    strike: { false: '', true: 'line-through' },
    strong: { false: '', true: 'font-semibold' },
    transform: transformVariants,
    truncate: truncateVariants,
    uppercase: { false: '', true: 'uppercase' },
    whitespace: whitespaceVariants,
  },
})

export type TextStyle = VariantProps<typeof textVariants>
