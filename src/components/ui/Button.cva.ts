import { type VariantProps, cva } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-lg',
    'font-medium',
    'font-mono',
    'uppercase',
    'tracking-wider',
    'transition-colors',
    'focus-visible:outline',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        solid: '',
        outline: 'border-2 bg-transparent',
        ghost: 'bg-transparent',
      },
      color: {
        primary: '',
        accent: '',
        neutral: '',
      },
      size: {
        sm: 'px-3 py-1.5',
        md: 'px-4 py-2',
        lg: 'px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      // Primary Solid
      {
        variant: 'solid',
        color: 'primary',
        class:
          'bg-primary-500 text-white hover:bg-primary-600 focus-visible:outline-primary-500 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-500',
      },
      // Primary Outline
      {
        variant: 'outline',
        color: 'primary',
        class:
          'border-primary-500 text-primary-500 hover:bg-primary-50 focus-visible:outline-primary-500 dark:border-primary-600 dark:text-primary-600 dark:hover:bg-primary-950',
      },
      // Primary Ghost
      {
        variant: 'ghost',
        color: 'primary',
        class:
          'text-primary-500 hover:bg-primary-100 focus-visible:outline-primary-500 dark:text-primary-600 dark:hover:bg-primary-900',
      },

      // Accent Solid
      {
        variant: 'solid',
        color: 'accent',
        class:
          'bg-accent-500 text-gray-900 hover:bg-accent-600 focus-visible:outline-accent-500 dark:bg-accent-600 dark:hover:bg-accent-500',
      },
      // Accent Outline
      {
        variant: 'outline',
        color: 'accent',
        class:
          'border-accent-600 text-accent-700 hover:bg-accent-50 focus-visible:outline-accent-600 dark:border-accent-500 dark:text-accent-400 dark:hover:bg-accent-950',
      },
      // Accent Ghost
      {
        variant: 'ghost',
        color: 'accent',
        class:
          'text-accent-700 hover:bg-accent-100 focus-visible:outline-accent-600 dark:text-accent-400 dark:hover:bg-accent-900',
      },

      // Neutral Solid
      {
        variant: 'solid',
        color: 'neutral',
        class:
          'bg-gray-800 text-white hover:bg-gray-900 focus-visible:outline-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-100',
      },
      // Neutral Outline
      {
        variant: 'outline',
        color: 'neutral',
        class:
          'border-gray-400 text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-900',
      },
      // Neutral Ghost
      {
        variant: 'ghost',
        color: 'neutral',
        class: 'text-fg hover:bg-gray-100 focus-visible:outline-gray-600 dark:hover:bg-gray-900',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
