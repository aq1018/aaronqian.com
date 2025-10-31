# Component Structure & Organization

> Component architecture, naming, and file organization rules

## File Structure

| File                  | Purpose                     | When Required                        |
| --------------------- | --------------------------- | ------------------------------------ |
| `Component.astro`     | Template, markup, props     | Always                               |
| `Component.cva.ts`    | CVA variant definitions     | If component has variants            |
| `Component.hook.ts`   | Global lifecycle management | If interactive across multiple pages |
| `Component.css`       | Shared utility classes      | For component families (see below)   |
| `<style>` in .astro   | Scoped CSS, animations      | Primary CSS method                   |
| `<script>` in .astro  | Client-side JS              | One-off interactions                 |
| `Component.test.ts`   | Tests                       | Required for all components          |
| `Component.utils.ts`  | Utility functions           | If 3+ functions                      |
| `Component.config.ts` | Configuration constants     | If 3+ config constants               |
| `Component.types.ts`  | TypeScript types            | If 3+ custom types                   |

## File Naming Conventions

- **Components:** PascalCase (`Button.astro`, `ThemeToggle.astro`)
- **Subcomponents:** `<Parent><Child>.astro` (`PillToggleButton.astro`)
- **CVA files:** `<Component>.cva.ts` (one per component family)
- **Hook files:** `<Component>.hook.ts`
- **Test files:** `<Component>.test.ts` or `<Component><Sub>.test.ts`

**Critical rule:** All subcomponents must be prefixed with parent component
name.

## CVA Organization (P1)

**ONE `.cva.ts` file per component family.** Parent's `.cva.ts` contains all
variants for parent AND subcomponents.

**Search for examples:** `Glob: **/PillToggle.cva.ts`

**Critical rule:** Always use `cn()` utility for class merging:

```typescript
// ✅ Correct
class={cn(variants({ variant, size }), className)}

// ❌ Wrong
class={variants({ variant, size, class: className })}
```

## Component.css Pattern (P1)

Use a shared `.css` file when multiple closely related components share CVA
variants and CSS tokens.

**When to use:**

- Related components sharing a design system (e.g., Heading + Text)
- Many shared custom CSS properties or utility classes
- Dual-family system (e.g., sans vs mono typography)

**Example:** `typography.cva.ts` + `typography.css`

- Both `Heading.astro` and `Text.astro` import from these shared files
- `typography.css` defines custom utility classes with `@apply`
- `typography.cva.ts` maps variants to these utility classes

**Structure:**

```css
/* typography.css */
@theme {
  --leading-sans-0: 0.97;
  --tracking-sans-0: -0.01em;
}

@layer utilities {
  .typography-heading-h1 {
    @apply text-3xl font-semibold md:text-4xl lg:text-5xl;
    @apply leading-sans-1 tracking-sans-1;
  }
}
```

```typescript
// typography.cva.ts
export const headingVariants = cva('', {
  variants: {
    size: {
      h1: 'typography-heading-h1', // Uses custom utility class
      h2: 'typography-heading-h2',
    },
  },
})

export const textVariants = cva('', {
  variants: {
    size: {
      body: 'typography-text-body',
      small: 'typography-text-small',
    },
  },
})
```

**Benefits:**

- Centralized typography definitions
- Shared leading/tracking tokens across component family
- More maintainable than inline Tailwind classes
- Follows Tailwind v4 custom `@theme` patterns

**ESLint Note:** Files using `@apply` with custom utilities must be added to
ESLint ignores (CSS parser cannot handle Tailwind directives).

**Search for examples:** `Glob: **/typography.{cva.ts,css}`

## Import Aliases (P1)

Always use `@/*` aliases for imports from `src/`:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/Button.astro'

// ❌ Wrong (from inside src/)
import { Button } from '../../../components/ui/Button.astro'
```

## Component Hierarchy

```txt
src/components/
├── primitives/      # Domain-agnostic primitives
├── patterns/        # Domain-agnostic patterns (complex primitives)
├── features/        # Feature-specific components
│   └── hooks.ts     # Feature hooks orchestrator
├── pages/           # Page-level components
└── hooks.ts         # Main hooks orchestrator
```

**Hierarchy:** `primitives/` → `patterns/` → `features/` → `pages/`

## 3-Layer Architecture (P1)

**Layer 1: primitives/** - Domain-agnostic, interfaces with Tailwind

- Simple: Button, Text, Badge, Stack, Inline
- Complex: Grid, List, Card, Sheet

**Layer 2: features/** - Domain-specific, uses primitives only **Layer 3:
pages/** - Page sections, uses primitives + features

**Rules:**

- Primitives → Tailwind allowed
- Features/Pages → Primitives only, semantic props (text spacing fine-tuning
  with `tracking-*` or `leading-*` utilities is permitted when no primitive prop
  covers the use case)
- Ad-hoc classes in features/pages = missing primitive

❌ `<Grid columns="2fr 140px 3fr">` (Tailwind pass-through) ✅
`<Grid columns="3" gap="md">` (semantic)

**Search:** `Grep: class=".*md:` in `features/pages/` for violations

## Primitive Components Catalog

### Layout Primitives

**Surface** - Page section background wrapper

- Props: `class`
- Use: Wraps major page sections with consistent background
- Example: `<Surface><Container>...</Container></Surface>`

**Container** - Max-width & horizontal padding wrapper

- Props: `width` (narrow \| default \| wide), `class`
- Use: Controls content max-width and horizontal padding
- Example: `<Container width="narrow">...</Container>`

**Stack** - Vertical/horizontal flex container with spacing

- Props: `space` (xs \| sm \| md \| lg \| xl), `justify` (start \| center \| end
  \| between), `class`
- Use: Spacing between sibling elements
- Example: `<Stack space="md" justify="center">...</Stack>`

**Inline** - Horizontal inline-flex container with wrapping

- Props: `space` (xs \| sm \| md \| lg), `wrap` (boolean), `align` (start \|
  center \| end \| baseline), `class`
- Use: Inline elements that can wrap (tags, badges)
- Example: `<Inline space="sm" wrap>...</Inline>`

**Cluster** - Flex container with wrapping and centered alignment

- Props: `space` (xs \| sm \| md \| lg), `class`
- Use: Multiple items that flow and wrap naturally
- Example: `<Cluster space="sm">...</Cluster>`

**Inset** - Adds internal padding to children

- Props: `space` (xs \| sm \| md \| lg \| xl), `class`
- Use: Padding around content
- Example: `<Inset space="md">...</Inset>`

**Bleed** - Negative margin to break out of parent padding

- Props: `space` (xs \| sm \| md \| lg \| xl), `class`
- Use: Full-width content within padded container
- Example: `<Bleed space="md">...</Bleed>`

**Divider** - Horizontal or vertical separator line

- Props: `orientation` (horizontal \| vertical), `spacing` (xs \| sm \| md \| lg
  \| xl \| none), `class`
- Use: Visual separation between sections
- Example: `<Divider spacing="md" />`

**Grid** - CSS Grid layout with 12-column system and responsive sizing

- Container Props: `columns` (1-12, default 12), `spacing` (none \| xs \| sm \|
  md \| lg \| xl), `direction` (row \| column \| dense), `justify` (start \|
  center \| end \| stretch), `align` (start \| center \| end \| stretch),
  `class`
- Item Props: `size` (1-12 \| auto \| grow \| responsive object), `offset` (1-12
  \| responsive object), `justifySelf` (auto \| start \| center \| end \|
  stretch), `alignSelf` (auto \| start \| center \| end \| stretch), `class`
- Use: Grid layouts, card grids, responsive columns
- Auto-detects: Container (no size) vs Item (has size)
- Examples:
  - Container: `<Grid spacing="md" columns={12}>...</Grid>`
  - Simple item: `<Grid size={6}>Half width</Grid>`
  - Responsive: `<Grid size={{ xs: 12, md: 6, lg: 4 }}>...</Grid>`
  - With offset: `<Grid size={6} offset={3}>Centered</Grid>`

### Container Primitives

**Sheet** - Base container with variants (similar to Button for containers)

- Props: `variant` (outline \| soft \| bar), `color` (primary \| accent \|
  secondary \| neutral \| danger \| success \| warning \| info), `padding` (none
  \| sm \| md \| lg), `hover` (boolean), `as` (div \| article \| section \| li),
  `class`
- Use: Cards, panels, list items, alerts, any styled container
- Example: `<Sheet variant="bar" color="neutral" padding="sm" hover>...</Sheet>`

### Content Primitives

**Text** - Styled paragraph/span/div with typography variants

- Props: `size` (xs \| sm \| base \| lg \| xl \| 2xl), `align` (left \| center
  \| right), `tone` (content \| muted), `uppercase` (boolean), `strong`
  (boolean), `italic` (boolean), `strike` (boolean), `whitespace` (normal \|
  nowrap \| pre \| pre-line \| pre-wrap \| break-spaces), `truncate` (boolean),
  `break` (normal \| words \| all \| keep), `as` (p \| span \| div \| label),
  `class`
- Use: Body text, descriptions, labels
- Example: `<Text size="lg" tone="muted">...</Text>`

**Heading** - Semantic heading with size variants

- Props: `level` (h1 \| h2 \| h3 \| h4 \| h5 \| h6), `size` (h1 \| h2 \| h3 \|
  h4 \| h5 \| h6), `align` (left \| center \| right), `class`
- Use: Section headings (level for semantics, size for visual hierarchy)
- Example: `<Heading level="h2" size="h1">...</Heading>`

**Prose** - Terminal-styled markdown content wrapper

- Props: `size` (sm \| base), `class`
- Use: Blog posts, project logs, markdown content
- Example: `<Prose size="base"><Content /></Prose>`

### Interactive Primitives

**Button** - Styled button/link with variants

- Props: `variant` (solid \| outline \| ghost), `color` (primary \| accent \|
  secondary \| neutral \| danger \| success \| warning \| info), `size` (sm \|
  md \| lg), `fullWidth` (boolean), `href` (string), `external` (boolean),
  `type` (button \| submit \| reset), `disabled` (boolean), `class`
- Use: Actions, CTAs, navigation links
- Example: `<Button variant="solid" color="primary" size="lg">...</Button>`

**Link** - Styled anchor with underline variants

- Props: `href` (required), `underline` (always \| hover \| none), `external`
  (boolean), `class`
- Use: Inline text links, navigation
- Example: `<Link href="/blog" underline="hover">...</Link>`

**Badge** - Inline label with color variants

- Props: `color` (primary \| accent \| secondary \| neutral \| danger \| success
  \| warning \| info), `size` (xs \| sm \| md), `uppercase` (boolean), `pulse`
  (boolean), `class`
- Use: Status indicators, tags, labels
- Example: `<Badge color="primary" pulse>LIVE</Badge>`

**Collapsible** - Expandable content container with CSS transitions

- Props: `id` (required), `speed` (fast \| normal \| slow), `bordered`
  (boolean), `class`
- Use: Expandable panels, accordions, progressive disclosure
- Example: `<Collapsible id="details" speed="normal">...</Collapsible>`

**Overlay** - Modal backdrop with opacity variants

- Props: `opacity` (light \| medium \| heavy), `class`
- Use: Modal backgrounds, image lightboxes
- Example: `<Overlay opacity="heavy" />`

## Component Patterns

**Props:** Always support custom `class` prop. Extend CVA variant types.

**Element Polymorphism:** Render as different elements based on props (e.g.,
`button` vs `a` based on `href`).

**External Links:** Handle with `target="_blank"` and
`rel="noopener noreferrer"`.

**Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, visible
focus states.

**Search for examples:**

- Props pattern: `Glob: **/Button.astro`
- Element polymorphism: `Glob: **/Button.astro`
- External links: `Glob: **/Link.astro`
- View Transitions lifecycle: See docs/hooks.md
