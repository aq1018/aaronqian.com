# Component Structure & Organization

> Detailed guide for component architecture, naming, and file organization.

## Standard Component Files

Each component follows a co-location pattern:

```txt
src/components/ui/Button/
├── Button.astro          # Component template (required)
├── Button.cva.ts         # CVA variant definitions (if using CVA)
├── Button.hook.ts        # Global lifecycle management for Button (if needed)
├── Button.hook.css       # CSS with Tailwind directives (if needed)
└── Button.test.ts        # Component tests (if needed)
```

**Simplified (most common)**:

```txt
src/components/ui/
├── Button.astro
└── Button.cva.ts
```

## File Responsibilities

| File                 | Purpose                         | When to Use                                                                   |
| -------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `Component.astro`    | Template, markup, props         | Always required                                                               |
| `Component.cva.ts`   | CVA variant definitions         | For components with variants                                                  |
| `Component.hook.ts`  | Global lifecycle management     | Global DOM Event setup / teardown, e.g. `astro:page-load` → See docs/hooks.md |
| `Component.hook.css` | CSS needing Tailwind directives | Only when `@theme`, `@custom-variant`, etc. needed → See docs/styling.md      |
| `<style>` in .astro  | Scoped CSS, animations          | Primary CSS method for component-specific styles → See docs/styling.md        |
| `<script>` in .astro | Client-Side JS                  | Client side interactions → See docs/hooks.md                                  |

## File Naming & Co-location

### Principle: Co-location

> "Files that change together, live together"

All files related to a component should be **physically adjacent** in the file
system.

### Naming Convention

- **Components**: PascalCase (`Button.astro`, `ThemeToggle.astro`)
- **Subcomponents**: `<Parent><Child>.astro` (e.g., `PillToggleButton.astro`,
  `DigitalAnalyzerGrid.astro`, `CuttingMatAxes.astro`)
- **CVA files**: `<Component>.cva.ts` (one per component family, contains
  variants for parent and all subcomponents)
- **Hook files**: `<Component>.hook.ts`, `<Component>.hook.css`
- **Test files**: `<Component>.test.ts` or `<Component><Subcomponent>.test.ts`
- **Config files**: `<Component>.config.ts`
- **Type files**: `<Component>.types.ts`
- **Util files**: `<Component>.utils.ts`

### Subcomponent Naming Rules

**Pattern**: `<ParentComponent><SubcomponentName>.astro`

**Examples**:

- `PillToggle.astro` → subcomponents: `PillToggleButton.astro`,
  `PillToggleSlider.astro`
- `DigitalAnalyzer.astro` → subcomponents: `DigitalAnalyzerGrid.astro`,
  `DigitalAnalyzerTrace.astro`
- `CuttingMat.astro` → subcomponents: `CuttingMatAxes.astro`,
  `CuttingMatGridLines.astro`

**Critical Rule**: All subcomponents must be prefixed with the parent component
name. This ensures:

- Clear ownership and relationship
- Easy file sorting and discovery
- Prevents naming collisions

## CVA File Organization

**ONE `.cva.ts` file per component family** - The parent component's `.cva.ts`
file contains all CVA variants for both the parent and its subcomponents.

**Why this matters**: Keeping all variants for a component family in one file
prevents drift between parent and child styling, ensures consistency, and makes
it easier to see all visual variations at once.

**Example structure**:

```typescript
// PillToggle.cva.ts - Single CVA file for entire PillToggle family
import { cva, type VariantProps } from 'class-variance-authority'

// Parent component variants
export const pillToggleVariants = cva(
  ['relative', 'inline-flex', 'rounded-full'],
  {
    variants: {
      size: {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

// Subcomponent variants in the SAME file
export const pillToggleButtonVariants = cva(
  ['relative', 'z-10', 'px-4', 'transition-colors'],
  {
    variants: {
      selected: {
        true: 'text-fg',
        false: 'text-muted hover:text-fg',
      },
    },
    defaultVariants: { selected: false },
  },
)

export type PillToggleVariants = VariantProps<typeof pillToggleVariants>
export type PillToggleButtonVariants = VariantProps<
  typeof pillToggleButtonVariants
>
```

**Usage in subcomponents**:

```astro
---
// PillToggleButton.astro imports from parent's CVA file
import {
  pillToggleButtonVariants,
  type PillToggleButtonVariants,
} from './PillToggle.cva'

interface Props extends PillToggleButtonVariants {
  class?: string
}
---

<button class={pillToggleButtonVariants({ selected, class: className })}>
  <slot />
</button>
```

**Benefits:**

- ✅ Single source of truth for component family styling
- ✅ Co-located variants are easier to maintain
- ✅ Reduces file proliferation
- ✅ Clear ownership: variants belong to parent component
- ✅ Prevents parent/child styling drift

## When to Create Optional Files

These files are **optional** and recommended for **complex components**:

| File Type    | Create When...                                                         | Example                     |
| ------------ | ---------------------------------------------------------------------- | --------------------------- |
| `.config.ts` | Component has **3+ configuration constants/options**                   | `DigitalAnalyzer.config.ts` |
| `.types.ts`  | Component has **3+ custom TypeScript types/interfaces**                | `DigitalAnalyzer.types.ts`  |
| `.utils.ts`  | Component has **3+ helper/utility functions**                          | `DigitalAnalyzer.utils.ts`  |
| `.hook.css`  | **ONLY** when Tailwind directives needed (`@theme`, `@custom-variant`) | `Badge.hook.css`            |
| `.test.ts`   | **Always recommended** for all components                              | `Button.test.ts`            |

**Reference Implementations**: See docs/references.md

- **Simple component**: `Button.astro` + `Button.cva.ts` + `Button.test.ts`
- **Complex component**: `DigitalAnalyzer.astro` + `.config.ts` + `.types.ts` +
  `.utils.ts` + `.hook.ts` + `.test.ts`

## Import Aliases

This project uses TypeScript path aliases for cleaner imports:

```typescript
// tsconfig.json configures:
"paths": {
  "@/*": ["./src/*"]
}

// Use it like this:
import { Button } from '@/components/ui/Button.astro'
import { setupThemeToggle } from '@/components/features/ThemeToggle.hook'
import '@/styles/global.css'
```

**Always prefer** `@/*` aliases over relative paths for imports from `src/`.

## Component Organization Hierarchy

```txt
src/components/
├── ui/              # Generic, reusable UI components (Button, Link, Badge, etc.)
│   ├── hooks.ts     # UI hooks orchestrator
│   └── hooks.css    # UI Tailwind directives orchestrator
├── features/        # Feature-specific components (Navigation, ThemeToggle, etc.)
│   ├── hooks.ts     # Feature hooks orchestrator
│   └── hooks.css    # Feature Tailwind directives orchestrator
├── pages/           # Page-level components (HomeHero, BlogIndex, etc.)
├── hooks.ts         # Main hooks orchestrator (imports ui & features)
└── hooks.css        # Main CSS orchestrator (imports ui & features)
```

**Hierarchy**:

- `ui/` → Generic components used across the entire app
- `features/` → Feature-specific components (can import from `ui/`)
- `pages/` → Page-level layouts (can import from `ui/` and `features/`)

## CVA Pattern

### `.cva.ts` Files (Class Variance Authority)

Extract CVA variant definitions to separate `.cva.ts` files.

**Structure**:

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

export const componentVariants = cva(
  [
    /* base classes */
  ],
  {
    variants: {
      /* variant definitions */
    },
    compoundVariants: [
      /* compound combinations */
    ],
    defaultVariants: {
      /* defaults */
    },
  },
)

export type ComponentVariants = VariantProps<typeof componentVariants>
```

**CRITICAL (P1): Always use `cn()` utility for class merging**

```typescript
// ✅ Correct
class={cn(buttonVariants({ variant, size }), className)}

// ❌ Wrong
class={buttonVariants({ variant, size, class: className })}
```

**Why**: `cn()` deduplicates Tailwind classes and prevents conflicts.

**Reference**: See docs/references.md for `Button.cva.ts`, `Badge.cva.ts`,
`Link.cva.ts`

### When to Use CVA

Use CVA for components with:

- Multiple visual variants (Button, Badge, Card, Link)
- Color schemes (primary, accent, neutral)
- Size variants (sm, md, lg)
- Complex compound variants

**DO NOT** use CVA for:

- Single-variant components
- Components with only boolean props
- Simple wrappers

## Component Best Practices

### Props Pattern

Always support custom `class` prop. Extend CVA variant types.

**Reference**: See docs/references.md for `Button.astro`, `Link.astro`

### Element Polymorphism

Render as different elements based on props (e.g., `button` vs `a` based on
`href`). Always use `cn()` for class merging.

**Reference**: See docs/references.md for `Button.astro` (button/a polymorphism)

### External Links

Handle external links safely with `target="_blank"` and
`rel="noopener noreferrer"`.

**Reference**: See docs/references.md for `Link.astro`

### Accessibility

- Semantic HTML elements
- ARIA labels when needed
- Keyboard navigation support
- Visible focus states

**Reference**: See docs/references.md for `Button.astro`, `Navigation.astro`

### Astro View Transitions

All interactive components must support View Transitions. See docs/hooks.md for
lifecycle implementation.

**Reference**: See docs/references.md for `ThemeToggle.hook.ts`,
`PillToggle.hook.ts`
