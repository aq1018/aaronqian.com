import { type VariantProps, cva } from 'class-variance-authority'

/**
 * Prose: Terminal-styled markdown content
 * Matches site's mono font, minimal color palette
 *
 * Unlike typical blog prose styling, this follows the terminal aesthetic
 * with monospace fonts and muted colors throughout.
 */
export const proseCva = cva(
  [
    // Base: terminal aesthetic
    'max-w-none',
    'font-mono',
    'leading-relaxed',
    'text-muted',

    // Headings: mono font, content color, semibold
    'prose-headings:font-mono',
    'prose-headings:text-content',
    'prose-headings:font-semibold',

    // Paragraphs: muted text
    'prose-p:text-muted',
    'prose-p:leading-relaxed',

    // Links: match Link primitive behavior
    'prose-a:text-link',
    'prose-a:underline',
    'prose-a:decoration-transparent',
    'prose-a:transition-colors',
    'hover:prose-a:decoration-link',

    // Emphasis: content color for visibility
    'prose-strong:text-content',
    'prose-strong:font-semibold',

    // Code inline: primary color with subtle background
    'prose-code:rounded',
    'prose-code:bg-muted/10',
    'prose-code:px-1',
    'prose-code:py-0.5',
    'prose-code:text-primary',
    'prose-code:font-mono',

    // Code blocks: muted background
    'prose-pre:bg-muted/10',
    'prose-pre:text-content',
    'prose-pre:p-4',
    'prose-pre:rounded',

    // Lists: muted text
    'prose-ul:text-muted',
    'prose-ol:text-muted',
    'prose-li:text-muted',

    // Tables: terminal table styling
    'prose-table:text-muted',
    'prose-th:text-content',
    'prose-th:font-semibold',

    // Quotes: subtle styling
    'prose-blockquote:text-muted',
    'prose-blockquote:border-l-border',

    // Horizontal rules
    'prose-hr:border-border',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm', // Default terminal size
        base: 'text-base', // Slightly larger for blog posts
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
)

export type ProseStyle = VariantProps<typeof proseCva>
