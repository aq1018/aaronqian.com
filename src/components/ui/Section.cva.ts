import { type VariantProps, cva } from 'class-variance-authority'

export const sectionVariants = cva(['w-full'], {
  variants: {
    variant: {
      hero: ['py-20', 'sm:py-24', 'lg:py-28'],
      content: ['py-16', 'sm:py-20', 'lg:py-24'],
      subsection: ['py-12', 'sm:py-14', 'lg:py-16'],
    },
    background: {
      surface: 'bg-background',
    },
  },
  defaultVariants: {
    variant: 'content',
    background: 'surface',
  },
})

export type SectionVariants = VariantProps<typeof sectionVariants>
