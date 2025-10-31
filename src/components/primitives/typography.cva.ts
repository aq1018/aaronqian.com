import { type VariantProps, cva } from 'class-variance-authority'

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

const alignVariants = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
  justify: 'text-justify',
} as const

const whitespaceVariants = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
} as const

const truncateVariants = {
  true: 'typography-truncate',
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

const familyVariants = {
  inherit: '',
  sans: 'font-sans',
  mono: 'font-mono',
} as const

export const headingVariants = cva('', {
  variants: {
    size: {
      'display-2': 'typography-heading-display-2',
      'display-1': 'typography-heading-display-1',
      h1: 'typography-heading-h1',
      h2: 'typography-heading-h2',
      h3: 'typography-heading-h3',
      h4: 'typography-heading-h4',
      h5: 'typography-heading-h5',
      h6: 'typography-heading-h6',
    },
    line: {
      auto: '',
      none: 'leading-none',
      tight: 'leading-heading-base',
      normal: 'leading-heading-sm',
      relaxed: 'leading-relaxed',
    },
    preset: {
      default: '',
      hero: 'typography-preset-hero',
      kicker: 'typography-preset-kicker',
      note: 'typography-preset-note',
      longread: 'typography-preset-longread',
    },
    align: alignVariants,
    color: colorVariants,
    family: familyVariants,
    whitespace: whitespaceVariants,
    truncate: truncateVariants,
    break: breakVariants,
    transform: transformVariants,
  },
  compoundVariants: [
    // mono display gets the mono tracking
    {
      family: 'mono',
      size: 'display-2',
      class: 'tracking-heading-display-mono',
    },
    {
      family: 'mono',
      size: 'display-1',
      class: 'tracking-heading-display-mono',
    },
  ],
  defaultVariants: {
    size: 'h2',
    line: 'auto',
    preset: 'default',
    color: 'inherit',
    family: 'mono',
    whitespace: 'normal',
    truncate: false,
    break: 'normal',
    transform: 'none',
  },
})

export type HeadingStyle = VariantProps<typeof headingVariants>

export const textVariants = cva('', {
  variants: {
    size: {
      lead: 'typography-text-lead',
      body: 'typography-text-body',
      'body-dense': 'typography-text-body-dense',
      small: 'typography-text-small',
      'small-dense': 'typography-text-small-dense',
      micro: 'typography-text-micro',
      'label-lg': 'typography-text-label-lg',
      label: 'typography-text-label',
      'label-sm': 'typography-text-label-sm',
      xl: 'typography-text-xl',
      '2xl': 'typography-text-2xl',
    },
    line: {
      auto: '',
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
    preset: {
      default: '',
      note: 'typography-preset-note',
      longread: 'typography-preset-longread',
      kicker: 'typography-preset-kicker',
    },
    align: alignVariants,
    color: colorVariants,
    family: familyVariants,
    uppercase: { true: 'uppercase', false: '' },
    strong: { true: 'font-semibold', false: '' },
    italic: { true: 'italic', false: '' },
    strike: { true: 'line-through', false: '' },
    whitespace: whitespaceVariants,
    truncate: truncateVariants,
    break: breakVariants,
    transform: transformVariants,
  },
  compoundVariants: [
    {
      truncate: true,
      class: 'typography-truncate',
    },
  ],
  defaultVariants: {
    size: 'body',
    line: 'auto',
    preset: 'default',
    color: 'inherit',
    family: 'inherit',
    uppercase: false,
    strong: false,
    italic: false,
    strike: false,
    whitespace: 'normal',
    truncate: false,
    break: 'normal',
    transform: 'none',
  },
})

export type TextStyle = VariantProps<typeof textVariants>
