# AGENTS.md

> Architecture documentation and rules for AI agents working on this codebase.

## ⚠️ CRITICAL: Mandatory Compliance

**ALL rules, patterns, and conventions documented in this file are MANDATORY and
MUST be strictly followed.**

Failure to follow these rules will result in:

- ❌ Code that breaks View Transitions
- ❌ Memory leaks and duplicate event listeners
- ❌ Inconsistent component architecture
- ❌ Failed CI/CD pipeline and blocked merges
- ❌ Technical debt and maintenance issues

**Before making ANY changes:**

1. ✅ Read and understand the relevant sections
2. ✅ Follow the documented patterns EXACTLY
3. ✅ Run `npm run autofix && npm run ci` before committing
4. ✅ NEVER use `git commit --no-verify`

**When in doubt:**

1. 🔍 **Look at actual implementation first** - Search the codebase for similar
   patterns and prior art
2. 📖 **Reference implementations** - Study `Button.astro`, `Link.astro`,
   `Badge.astro`, `ThemeToggle.hook.ts`, `DigitalAnalyzer.hook.ts`
3. ❓ **If still uncertain, STOP and ASK** - Do NOT guess or make up patterns.
   Ask the user for clarification.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Structure](#component-structure)
3. [File Naming & Co-location](#file-naming--co-location)
4. [Hook Pattern](#hook-pattern)
5. [CVA Pattern](#cva-pattern)
6. [Styling Philosophy](#styling-philosophy)
7. [Git Commit Workflow](#git-commit-workflow)
8. [Testing & CI](#testing--ci)
9. [Component Best Practices](#component-best-practices)

---

## Architecture Overview

This is an Astro 5 website using:

- **Framework**: Astro 5.14.7 with View Transitions
- **Styling**: Tailwind CSS v4 + inline utility classes
- **Component Variants**: class-variance-authority (CVA)
- **Type Safety**: TypeScript 5+
- **Testing**: Vitest + Testing Library
- **Quality**: ESLint + Prettier + Husky pre-commit hooks

### Component Organization

```txt
src/components/
├── ui/              # Generic, reusable UI components (Button, Link, Badge, etc.)
├── features/        # Feature-specific components (Navigation, ThemeToggle, etc.)
├── pages/           # Page-level components (HomeHero, BlogIndex, etc.)
└── hooks.ts         # Main hooks orchestrator
```

**Hierarchy**:

- `ui/` → Generic components used across the entire app
- `features/` → Feature-specific components (can import from `ui/`)
- `pages/` → Page-level layouts (can import from `ui/` and `features/`)

---

## Component Structure

### Standard Component Files

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

### File Responsibilities

| File                 | Purpose                         | When to Use                                               |
| -------------------- | ------------------------------- | --------------------------------------------------------- |
| `Component.astro`    | Template, markup, props         | Always required                                           |
| `Component.cva.ts`   | CVA variant definitions         | For components with variants                              |
| `Component.hook.ts`  | Global lifecycle management     | Global DOM Event setup / teardown, e.g. `astro:page-load` |
| `Component.hook.css` | CSS needing Tailwind directives | Only when `@theme`, `@custom-variant`, etc. needed        |
| `<style>` in .astro  | Scoped CSS, animations          | Primary CSS method for component-specific styles          |
| `<script>` in .astro | Client-Side JS                  | Client side interactions, etc                             |

---

## File Naming & Co-location

### Principle: Co-location

> "Files that change together, live together"

All files related to a component should be **physically adjacent** in the file
system.

### Naming Convention

- **Components**: PascalCase (`Button.astro`, `ThemeToggle.astro`)
- **CVA files**: `<Component>.cva.ts`
- **Hook files**: `<Component>.hook.ts`, `<Component>.hook.css`
- **Test files**: `<Component>.test.ts`
- **Config files**: `<Component>.config.ts`
- **Type files**: `<Component>.types.ts`
- **Util files**: `<Component>.utils.ts`

### When to Create Optional Files

These files are **optional** and recommended for **complex components**:

| File Type    | Create When...                                                         | Example                     |
| ------------ | ---------------------------------------------------------------------- | --------------------------- |
| `.config.ts` | Component has **3+ configuration constants/options**                   | `DigitalAnalyzer.config.ts` |
| `.types.ts`  | Component has **3+ custom TypeScript types/interfaces**                | `DigitalAnalyzer.types.ts`  |
| `.utils.ts`  | Component has **3+ helper/utility functions**                          | `DigitalAnalyzer.utils.ts`  |
| `.hook.css`  | **ONLY** when Tailwind directives needed (`@theme`, `@custom-variant`) | `Badge.hook.css`            |
| `.test.ts`   | **Always recommended** for complex components                          | `Button.test.ts`            |

**Reference Implementations**:

- **Simple component**: `Button.astro` + `Button.cva.ts` + `Button.test.ts`
- **Complex component**: `DigitalAnalyzer.astro` + `.config.ts` + `.types.ts` +
  `.utils.ts` + `.hook.ts` + `.astro.test.ts`

### Import Aliases

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

### Hooks Orchestrator Pattern

Each level has a `hooks.ts` orchestrator that imports and initializes all hooks:

```typescript
// src/components/ui/hooks.ts
import { setupPillToggles } from './PillToggle.hook'
import { setupSomeOtherComponent } from './SomeOther.hook'

export function initUiHooks() {
  setupPillToggles()
  setupSomeOtherComponent()
}
```

```typescript
// src/components/features/hooks.ts
import { setupThemeToggle } from './ThemeToggle.hook'
import { setupDigitalAnalyzer } from './DigitalAnalyzer.hook'

export function initFeatureHooks() {
  setupThemeToggle()
  setupDigitalAnalyzer()
}
```

```typescript
// src/components/hooks.ts
import { initUiHooks } from './ui/hooks'
import { initFeatureHooks } from './features/hooks'

export function initComponentHooks() {
  initUiHooks()
  initFeatureHooks()
}
```

Then in `BaseLayout.astro`:

```astro
---
import { initComponentHooks } from '@/components/hooks'
---

<script>
  // Call ONCE on initial page load
  // Each individual setup*() function handles its own astro:page-load listener
  // This prevents double-registration of event listeners
  initComponentHooks()
</script>
```

**Important**: Do NOT add
`document.addEventListener('astro:page-load', initComponentHooks)` in
BaseLayout. Each individual `setup*()` function already registers its own
`astro:page-load` listener, so calling `initComponentHooks()` again on every
page load would cause duplicate event listener registrations.

---

## Hook Pattern

### `.hook.ts` Files (Client-side JavaScript)

Use for interactive client-side behavior. Always support Astro View Transitions
lifecycle.

**Important**: Each `.hook.ts` file manages its own lifecycle by registering its
own `astro:page-load` listener. This allows components to have full control over
their initialization and cleanup logic without relying on external
orchestration.

**Pattern**:

```typescript
// Component.hook.ts
type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize component behavior
 * Returns a cleanup function to prevent memory leaks
 */
export function initializeComponent(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  // Your initialization logic here
  const elements = document.querySelectorAll('[data-component]')
  const handlers = new Map()

  elements.forEach((element) => {
    const handler = (e: Event) => {
      // Handle event
    }
    element.addEventListener('click', handler)
    handlers.set(element, handler)
  })

  // Return cleanup function
  cleanup = () => {
    handlers.forEach((handler, element) => {
      element.removeEventListener('click', handler)
    })
    handlers.clear()
    cleanup = null
  }

  return cleanup
}

/**
 * Setup function called by hooks orchestrator
 * Registers its own astro:page-load listener
 */
export function setupComponent(): void {
  // Initial setup on first page load
  initializeComponent()

  // Re-initialize after View Transitions navigation
  document.addEventListener('astro:page-load', initializeComponent)

  // Cleanup before page swap to prevent memory leaks
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}
```

**Key points**:

- Each `setup*()` function registers its own `astro:page-load` listener
- `BaseLayout.astro` calls `initComponentHooks()` **once** on initial page load
- Individual components handle their own re-initialization on navigation
- Always implement cleanup to prevent memory leaks
- Use a cleanup tracking pattern to prevent duplicate listeners

### `.hook.css` Files (Tailwind Directives)

**IMPORTANT**: Only create `.hook.css` files when you need Tailwind v4
directives like:

- `@theme` - Extending theme tokens
- `@custom-variant` - Custom variants
- `@layer` - Layer-specific styles

**DO NOT** use `.hook.css` for:

- Regular CSS → Use `<style>` block in `.astro` file
- Animations → Use `<style>` block in `.astro` file
- Component-specific styles → Use `<style>` block in `.astro` file

**When to use** `.hook.css`:

```css
/* Badge.hook.css - Example of when it's needed */
@theme {
  --animation-pulse-subtle: pulseSubtle 3s ease-in-out infinite;
}

@keyframes pulseSubtle {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

Then import in `ui/hooks.css`:

```css
/* src/components/ui/hooks.css */
@import './Badge.hook.css';
@import './OtherComponent.hook.css';
```

The `ui/hooks.css` file is imported by `global.css`

### When to Use `<script>` vs `.hook.ts`

Understanding when to use inline `<script>` blocks versus separate `.hook.ts`
files is critical for maintainable code.

#### Use `<script>` in `.astro` when:

- ✅ **One-off, component-specific behavior** - Logic that only applies to this
  component instance
- ✅ **No cleanup needed** - Simple DOM manipulation with no listeners to remove
- ✅ **No shared state across navigations** - Doesn't need to persist through
  View Transitions
- ✅ **Simple interactions** - Basic event handling on the component's own
  elements

**Example:**

```astro
<!-- Component.astro -->
<div id="counter">0</div>
<button id="increment">+</button>

<script>
  // Simple, component-specific logic
  const button = document.getElementById('increment')
  const counter = document.getElementById('counter')
  let count = 0

  button?.addEventListener('click', () => {
    count++
    if (counter) counter.textContent = String(count)
  })
</script>
```

#### Use `.hook.ts` when:

- ✅ **Behavior needs to survive View Transitions** - Must work across page
  navigations
- ✅ **Requires cleanup/state management** - Event listeners that need proper
  removal
- ✅ **Event delegation or global listeners** - Listening on `document` or
  `window`
- ✅ **Shared functionality across multiple pages** - Same behavior on different
  pages
- ✅ **Complex state management** - Tracking state across multiple elements or
  pages

**Example:**

```typescript
// Component.hook.ts
export function setupComponent() {
  const initializeComponent = () => {
    // Logic that needs to run on every page load
    const elements = document.querySelectorAll('[data-component]')
    elements.forEach((element) => {
      element.addEventListener('click', handleClick)
    })
  }

  // Initial setup
  initializeComponent()

  // Re-initialize after View Transitions
  document.addEventListener('astro:page-load', initializeComponent)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    // Remove listeners, clear state, etc.
  })
}
```

**Rule of thumb**: If you're using Astro View Transitions and your component
appears on multiple pages, use `.hook.ts`. For simple, one-off interactions on a
single instance, use `<script>`.

---

## CVA Pattern

### `.cva.ts` Files (Class Variance Authority)

Extract all CVA variant definitions to separate `.cva.ts` files for better
organization and reusability.

**Pattern**:

```typescript
// Button.cva.ts
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    // Base styles (always applied)
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-lg',
    'font-medium',
    'transition-colors',
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
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        color: 'primary',
        class: 'bg-primary-600 text-white hover:bg-primary-700',
      },
      // ... more compound variants
    ],
    defaultVariants: {
      variant: 'solid',
      color: 'primary',
      size: 'md',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

Then in the component:

```astro
---
// Button.astro
import { buttonVariants, type ButtonVariants } from './Button.cva'

interface Props extends ButtonVariants {
  href?: string
  disabled?: boolean
  class?: string
}

const {
  variant,
  color,
  size,
  href,
  disabled,
  class: className,
  ...rest
} = Astro.props
const Element = href ? 'a' : 'button'
---

<Element
  {href}
  disabled={!href && disabled}
  class={buttonVariants({ variant, color, size, class: className })}
  {...rest}
>
  <slot />
</Element>
```

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

---

## Styling Philosophy

### Priority Order (Use in this order)

1. **Tailwind inline classes** - Primary styling method

   ```astro
   <div class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2"></div>
   ```

2. **`<style>` blocks** - Component-specific CSS, animations

   ```astro
   <style>
     @keyframes fadeIn {
       from {
         opacity: 0;
       }
       to {
         opacity: 1;
       }
     }

     .fade-in {
       animation: fadeIn 0.3s ease-in-out;
     }
   </style>
   ```

3. **`.hook.css` files** - ONLY when Tailwind directives needed
   ```css
   /* Component.hook.css */
   @theme {
     --color-custom: oklch(0.5 0.2 180);
   }
   ```

### Design System Tokens

Use semantic color tokens from `global.css`:

```css
/* Semantic tokens (preferred) */
text-fg            /* Foreground text */
text-muted         /* Muted text */
text-link          /* Link color */
text-primary       /* Primary brand color */
text-accent        /* Accent brand color */
bg-surface         /* Background surface */
border-border      /* Border color */

/* Palette tokens (when semantic doesn't fit) */
bg-primary-600     /* Cyan palette */
bg-accent-500      /* Harvest gold palette */
bg-gray-800        /* Gray palette */
```

---

## Git Commit Workflow

### 🚨 CRITICAL RULE 🚨

**NEVER COMMIT WITH `--no-verify` OR YOU WILL BE FIRED**

The pre-commit hooks exist for a reason. Bypassing them is **strictly
forbidden**.

### Correct Commit Workflow

Before committing, **always** run this sequence:

```bash
# 1. Auto-fix formatting and linting issues
npm run autofix

# 2. Run full CI pipeline (test + format check + type-check + lint + build)
npm run ci

# 3. Fix any remaining issues manually

# 4. Commit (hooks will run automatically)
git commit -m "Your message"
```

### What `npm run ci` Does

```json
"ci": "npm run test:run && npm run format:check && npm run type-check && npm run lint && npm run build"
```

This ensures:

- ✅ All tests pass
- ✅ Code is properly formatted
- ✅ No TypeScript errors
- ✅ No linting errors
- ✅ Build succeeds

### Pre-commit Hooks (Husky + lint-staged)

Hooks automatically run on staged files:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,astro}": ["prettier --check", "astro check", "eslint"],
  "*.{css,json,md}": ["prettier --check"]
}
```

If hooks fail, **fix the issues** - don't bypass them!

---

## Testing & CI

### Testing

```bash
# Run tests in watch mode (development)
npm run test

# Run tests once (CI)
npm run test:run
```

### Test Files

Co-locate tests with components:

```txt
src/components/ui/Button.test.ts
src/components/features/DigitalAnalyzer.test.ts
```

### CI Pipeline

The full CI pipeline runs:

1. **Tests** - Vitest (`npm run test:run`)
2. **Format check** - Prettier (`npm run format:check`)
3. **Type check** - Astro check (`npm run type-check`)
4. **Linting** - ESLint (`npm run lint`)
5. **Build** - Astro build (`npm run build`)

All must pass before merging.

---

## Component Best Practices

### Props Pattern

Always support custom className:

```ts
interface Props {
  // Component-specific props
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'

  // Always include
  class?: string
}

const { variant, size, class: className, ...rest } = Astro.props
```

### Element Polymorphism

Support rendering as different elements when appropriate:

```astro
---
// Button can render as <button> or <a> based on href prop
const Element = href ? 'a' : 'button'
---

<Element
  {href}
  type={!href ? type : undefined}
  class={buttonVariants({ variant, class: className })}
  {...rest}
>
  <slot />
</Element>
```

### External Links

Link component should handle external links safely:

```astro
---
const isExternal =
  external ||
  (href?.startsWith('http') && !href.startsWith(window.location.origin))
---

<a
  {href}
  target={isExternal ? '_blank' : undefined}
  rel={isExternal ? 'noopener noreferrer' : undefined}
>
  <slot />
</a>
```

### Accessibility

- Use semantic HTML elements
- Include ARIA labels when needed
- Support keyboard navigation
- Ensure focus states are visible

```astro
<button
  aria-label={ariaLabel}
  class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
>
  <slot />
</button>
```

### Astro View Transitions

All interactive components must support View Transitions:

```typescript
// In .hook.ts files
document.addEventListener('astro:page-load', initializeComponent)
document.addEventListener('astro:before-preparation', cleanupComponent)
```

In Astro components:

```astro
<a href="/page" transition:name="unique-name">Link</a>
```

---

## Quick Reference

### Creating a New Component Checklist

- Create `Component.astro` in appropriate directory (`ui/`, `features/`,
  `pages/`)
- Create `Component.cva.ts` if component has variants
- Create `Component.hook.ts` if interactive behavior needed
- Add hook to appropriate `hooks.ts` orchestrator
- Create `Component.hook.css` only if Tailwind directives needed
- Import `.hook.css` in `ui/hooks.css` or `features/hooks.css`
- Support custom `class` prop
- Include TypeScript types
- Write tests in `Component.test.ts`
- Run `npm run autofix && npm run ci` before committing

### Common Commands

```bash
# Development
npm run dev          # Start dev server

# Code Quality
npm run autofix      # Auto-fix formatting + linting
npm run ci           # Full CI pipeline (required before commit)

# Individual Checks
npm run lint         # Check linting
npm run lint:fix     # Fix linting
npm run format       # Format code
npm run format:check # Check formatting
npm run type-check   # Check TypeScript
npm run test         # Run tests (watch)
npm run test:run     # Run tests (once)
npm run build        # Build for production

# Git
git commit           # Commit (hooks run automatically)
# NEVER use --no-verify!
```

---

## Summary

This codebase values:

- **Co-location** - Related files live together
- **Separation of concerns** - CVA, hooks, styles in separate files
- **Type safety** - TypeScript everywhere
- **Quality** - Automated checks before every commit
- **Accessibility** - Semantic HTML and ARIA
- **Performance** - Astro View Transitions support

When in doubt, follow existing patterns in the codebase. Look at `Button.astro`,
`Link.astro`, and `Badge.astro` for reference implementations.

---

**Last Updated**: 2025-10-24 **Maintained By**: AI Agents working on this
codebase
