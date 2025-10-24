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
- ❌ Untested code that will break in production
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

## Priority Levels & Agent Behavior

This codebase uses a three-tier priority system to help agents understand what's
absolute vs. what requires judgment.

### P0 - NEVER VIOLATE (System breaks if ignored)

**These rules are absolute. Violating them causes production failures.**

- ✅ **View Transitions lifecycle patterns** - Must implement cleanup functions
  to prevent memory leaks
- ✅ **Memory leak prevention** - Always remove event listeners in cleanup
  functions
- ✅ **No `git commit --no-verify`** - Pre-commit hooks are mandatory
- ✅ **Run `npm run autofix && npm run ci` BEFORE committing** - Fix ALL errors
  locally before attempting commit
- ✅ **`data-*` attributes for hook selectors** - Never use CSS classes as hook
  selectors

### P1 - FOLLOW STRICTLY (Required for consistency)

**These rules maintain architecture consistency. Follow them exactly unless you
ask for approval to deviate.**

- ✅ **Component structure & naming conventions** - PascalCase, subcomponent
  prefixes
- ✅ **CVA file organization** - One `.cva.ts` per component family
- ✅ **Co-location patterns** - Related files live together
- ✅ **Hook orchestrator pattern** - Each level has `hooks.ts` and `hooks.css`
- ✅ **Testing requirements for new code** - New features must have tests before
  commit
- ✅ **File naming conventions** - `Component.hook.ts`, `Component.cva.ts`, etc.
- ✅ **Import aliases** - Use `@/*` instead of relative paths from `src/`

### P2 - USE JUDGMENT (Best practices, ask if deviating)

**These are recommendations. Use good judgment, but ask for approval before
deviating.**

- ✅ **Specific test coverage percentages** - Target: Utils 100%, Hooks 90%,
  Components 80%
- ✅ **Optional file creation thresholds** - When to create `.config.ts`,
  `.types.ts`, `.utils.ts`
- ✅ **Documentation style preferences** - Comment formatting, README structure
- ✅ **Opportunistic refactoring** - Improving existing code while working on
  related features

### How Priority Affects Agent Behavior

| Priority | Can Deviate? | If Deviating...                                        |
| -------- | ------------ | ------------------------------------------------------ |
| **P0**   | ❌ Never     | Do not proceed. Ask user to clarify requirements.      |
| **P1**   | ⚠️ Rarely    | Ask for approval BEFORE deviating. Explain reasoning.  |
| **P2**   | ✅ Sometimes | Use judgment. Ask if uncertain whether deviation fits. |

---

## When to Ask vs. Proceed

Understanding when to work autonomously vs. when to ask for guidance is critical
for velocity.

### Proceed Autonomously (No Approval Needed)

**You can proceed directly when:**

- ✅ **Following documented P1 patterns exactly** - Implementing components
  using established patterns
- ✅ **Bug fixes within existing architecture** - Fixing issues without changing
  patterns
- ✅ **Adding tests to existing components** - Improving test coverage
- ✅ **Refactoring that preserves behavior** - Code cleanup without functional
  changes
- ✅ **Documentation updates** - Improving clarity without changing meaning
- ✅ **Styling adjustments** - Using existing design tokens and patterns

### Ask for Approval FIRST

**Stop and ask when:**

- ❓ **Deviating from any P0 or P1 rule** - Need explicit permission
- ❓ **Creating new architectural patterns** - New component types, new file
  structures
- ❓ **Unsure if change qualifies as "complex"** - When delegation threshold is
  unclear
- ❓ **Touching >10 files** - High risk of unintended consequences
- ❓ **Breaking changes to public APIs** - Component props, hook signatures
- ❓ **Changes affecting build process** - Package.json, config files
- ❓ **Uncertain about requirements** - User intent is ambiguous

### Use Delegation (TodoWrite + Task Tool)

**Delegate to sub-agents when:**

- 📋 **Creating new component families** - Multiple related files (parent +
  subcomponents + tests + hooks + CVA)
- 📋 **4+ file changes with complex logic** - Risk of context overflow
- 📋 **Large refactoring across multiple components** - Need coordination and
  oversight
- 📋 **Any task where context might overflow** - Better to delegate than lose
  track

### Work Directly (No Delegation)

**Work directly for:**

- 🔨 **1-3 file edits** - Small enough to manage in main context
- 🔨 **Simple bug fixes** - Straightforward changes
- 🔨 **Documentation updates** - Low complexity
- 🔨 **Adding tests to existing code** - Clear, focused task

---

## AI Context Preservation

**CRITICAL**: Preserve your context window to maintain code quality and avoid
incomplete implementations.

### The Pattern: Planning → Todo List → Delegate

For complex tasks, use this workflow to prevent context overflow:

1. **Enter Planning Mode** - Break down the task into smaller steps
2. **Create Todo List** - Use TodoWrite to track all sub-tasks
3. **Delegate Each Todo** - Use Task tool to delegate each item to a sub-agent
4. **Coordinate Results** - Your main context stays clean for oversight

### When to Use This Pattern

**Use planning mode + delegation for:**

- Creating new component families (multiple related files)
- Large refactoring across multiple components
- Migrating patterns across the codebase
- Any task requiring **4+ file operations OR complex logic**
- Complex multi-step features

**Work directly for:**

- Single file edits
- Quick bug fixes
- Documentation updates
- Simple refactoring (1-3 files)

### Example Workflow

```text
User: "Create a new Dropdown component following our patterns"

Step 1: Enter planning mode, create todo list
[TodoWrite]
- Research PillToggle pattern (delegate to sub-agent)
- Create Dropdown.astro + tests (delegate to sub-agent)
- Create DropdownItem.astro + tests (delegate to sub-agent)
- Create Dropdown.cva.ts with variants (delegate to sub-agent)
- Create Dropdown.hook.ts + tests (delegate to sub-agent)
- Integrate into ui/hooks.ts (do directly - simple)
- Run CI and verify (do directly)

Step 2: Delegate complex sub-tasks
[Task tool] "Research PillToggle pattern and document key patterns"
[Task tool] "Create Dropdown.astro following PillToggle pattern with tests"
[Task tool] "Create DropdownItem.astro subcomponent with tests"
... etc

Step 3: Your context stays clean for coordination and final integration
```

### Why This Matters

**Without delegation:**

- ❌ Context fills up with implementation details
- ❌ Lose track of overall requirements
- ❌ Forget to create necessary files
- ❌ Incomplete implementations

**With delegation:**

- ✅ Main context preserved for high-level coordination
- ✅ Each sub-agent focuses on one clear task
- ✅ Better quality control and oversight
- ✅ Can handle much larger tasks

### Simple Rule

If a task requires more than **4 files OR complex logic**, use planning mode +
todo list + delegation.

---

## Table of Contents

1. [Priority Levels & Agent Behavior](#priority-levels--agent-behavior)
2. [When to Ask vs. Proceed](#when-to-ask-vs-proceed)
3. [AI Context Preservation](#ai-context-preservation)
4. [Architecture Overview](#architecture-overview)
5. [Component Structure](#component-structure)
6. [File Naming & Co-location](#file-naming--co-location)
7. [Hook Pattern](#hook-pattern)
8. [CVA Pattern](#cva-pattern)
9. [Styling Philosophy](#styling-philosophy)
10. [Git Commit Workflow](#git-commit-workflow)
11. [Testing & CI](#testing--ci)
12. [Component Best Practices](#component-best-practices)
13. [Troubleshooting](#troubleshooting)
14. [Quick Reference](#quick-reference)

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

| File                 | Purpose                         | When to Use                                                                    |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| `Component.astro`    | Template, markup, props         | Always required                                                                |
| `Component.cva.ts`   | CVA variant definitions         | For components with variants                                                   |
| `Component.hook.ts`  | Global lifecycle management     | Global DOM Event setup / teardown, e.g. `astro:page-load` _(See Hook Pattern)_ |
| `Component.hook.css` | CSS needing Tailwind directives | Only when `@theme`, `@custom-variant`, etc. needed _(See Styling Philosophy)_  |
| `<style>` in .astro  | Scoped CSS, animations          | Primary CSS method for component-specific styles _(See Styling Philosophy)_    |
| `<script>` in .astro | Client-Side JS                  | Client side interactions, etc _(See Hook Pattern)_                             |

---

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

### CVA File Organization

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

**For detailed pattern explanation, see this section. All other sections will
reference back here to avoid repetition.**

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

### `data-*` Attributes Pattern for Hooks

**CRITICAL**: Always use `data-*` attributes as selectors in `.hook.ts` files
for global event delegation. This prevents coupling to CSS classes and provides
semantic, stable selectors.

**Pattern**:

```astro
---
// Component.astro
---

<!-- Use data-* attributes for hook targeting -->
<button data-toggle-button data-toggle-target="menu-id">Toggle</button>
<div id="menu-id" class="hidden">Menu content</div>
```

```typescript
// Component.hook.ts
export function initializeComponent() {
  // Select elements using data attributes
  const buttons = document.querySelectorAll('[data-toggle-button]')

  buttons.forEach((button) => {
    const targetId = button.getAttribute('data-toggle-target')
    const target = document.getElementById(targetId)
    // ... setup logic
  })
}
```

**Real-world examples from codebase**:

- **PillToggle**: `data-toggle-button`, `data-toggle-target`
- **ThemeToggle**: `data-value`, `data-slider`
- **DigitalAnalyzer**: `data-digital-analyzer`, `data-lightning-bolt`

**Why `data-*` attributes?**

- ✅ Semantic purpose: Clear intent for JavaScript interaction
- ✅ Stable selectors: Won't break if CSS classes change
- ✅ HTML5 standard: Valid, accessible attributes
- ✅ Namespacing: Prevents conflicts with other attributes
- ❌ Never use CSS classes for hook selectors (`.class-name`)
- ❌ Never use IDs for multiple elements (`#id` is unique per page)

**Naming convention**:

- Use kebab-case: `data-toggle-button`, not `data-toggleButton`
- Be specific: `data-digital-analyzer` not `data-component`
- Prefix with component name when possible: `data-theme-toggle-button`

### `.hook.css` Files (Tailwind Directives)

**IMPORTANT**: Only create `.hook.css` files when you need Tailwind v4
directives like:

- `@theme` - Extending theme tokens
- `@custom-variant` - Custom variants
- `@layer` - Layer-specific styles

**DO NOT** use `.hook.css` for:

- Regular CSS → Use `<style>` block in `.astro` file _(See Styling Philosophy)_
- Animations → Use `<style>` block in `.astro` file _(See Styling Philosophy)_
- Component-specific styles → Use `<style>` block in `.astro` file _(See Styling
  Philosophy)_

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

**CSS Orchestration (mirrors hooks.ts structure)**:

```css
/* src/components/ui/hooks.css */
@import './Badge.hook.css';
/* ... other UI component hook CSS */

/* src/components/features/hooks.css */
@import './ThemeToggle.hook.css';
/* ... other feature component hook CSS */

/* src/components/hooks.css - Main orchestrator */
@import './ui/hooks.css';
@import './features/hooks.css';

/* src/styles/global.css */
@import '../components/hooks.css';
```

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
import { cn } from '@/lib/utils'

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
  class={cn(buttonVariants({ variant, color, size }), className)}
  {...rest}
>
  <slot />
</Element>
```

**IMPORTANT: Always use `cn` utility for class merging**

```typescript
import { cn } from '@/lib/utils'

// ✅ Correct - Use cn() to merge CVA variants with custom classes
class={cn(buttonVariants({ variant, color, size }), className)}

// ❌ Wrong - Don't pass className to CVA directly
class={buttonVariants({ variant, color, size, class: className })}
```

**Why `cn` is required:**

The `cn` utility combines `clsx` + `tailwind-merge` to:

- **Deduplicate Tailwind classes**: `cn('px-2', 'px-4')` → `'px-4'` (not both)
- **Handle conditional classes**: `cn('base', condition && 'active')`
- **Merge classes correctly**: Prevents conflicts and ensures proper precedence

Without `cn`, custom classes can conflict with CVA variant classes, leading to
unexpected styling.

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

**This is the authoritative section on styling. All other sections reference
back here.**

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

### 🚨 MANDATORY PRE-COMMIT WORKFLOW 🚨

**NEVER COMMIT WITH `--no-verify` OR THE SYSTEM WILL BREAK**

The pre-commit hooks exist to prevent production failures. Bypassing them is
**strictly forbidden**.

### The Problem

Running commit → hook fails → fix one error → commit again → hook fails → repeat
**wastes massive time and fills the git history with unnecessary commits**.

### The Solution

**Run EVERYTHING locally first, fix ALL issues at once, then commit.**

### REQUIRED SEQUENCE

**The required sequence depends on what you're changing:**

#### For Code Changes (TypeScript, Astro, CSS, etc.)

**Follow this exact sequence:**

```bash
# Step 1: Auto-fix formatting and linting
npm run autofix

# Step 2: Run full CI pipeline
npm run ci
# This runs: test + format check + type-check + lint + build

# Step 3: Fix ALL errors and warnings shown
# Read the output carefully and fix everything

# Step 4: Repeat steps 1-3 until EVERYTHING passes
npm run autofix && npm run ci

# Step 5: ONLY THEN stage and commit
git add .
git commit -m "Your message"
```

#### For Documentation-Only Changes

**Documentation files have different requirements based on location:**

##### A. Root Documentation (AGENTS.md, CLAUDE.md, README.md)

**For documentation NOT part of the Astro build:**

```bash
# Step 1: Auto-fix formatting and linting
npm run autofix

# Step 2: Verify output (no errors)

# Step 3: Stage and commit
git add .
git commit -m "Your message"
```

##### B. Content Collection Markdown (src/content/\*_/_.md)

**For markdown files WITH frontmatter schemas (blog, projects, projectLogs):**

```bash
# Step 1: Auto-fix formatting and linting
npm run autofix

# Step 2: Validate frontmatter schemas
npm run type-check
# This runs `astro check` which validates against Zod schemas

# Step 3: (Optional but recommended) Verify build
npm run build
# Catches additional errors like broken images, invalid references

# Step 4: Stage and commit
git add .
git commit -m "Your message"
```

**Why different workflows?**

- **Root documentation**: Only needs formatting/linting
- **Content collection markdown**: Needs formatting/linting + schema
  validation + optional build check
- **Code files**: Need ALL checks (tests, type-check, linting, build)
- Pre-commit hooks run `prettier --check` on all `.md` files
- Pre-commit hooks run `astro check` on `.ts`/`.astro` files only

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

### DO NOT

- ❌ Commit before running full CI locally
- ❌ Fix errors one at a time through repeated hook failures
- ❌ Use `git commit --no-verify` (EVER, under ANY circumstances)
- ❌ Skip `npm run autofix` before `npm run ci`
- ❌ Ignore warnings (treat them as errors)

### Pre-commit Hooks (Husky + lint-staged)

Hooks automatically run on staged files:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx,astro}": ["prettier --check", "astro check", "eslint"],
  "*.{css,json,md}": ["prettier --check"]
}
```

If hooks fail after you've run full CI, **something is wrong with your
workflow**. Go back and ensure you're following the required sequence.

### Why This Matters

**Pre-commit hooks catch:**

- View Transition bugs that only appear in production
- Memory leaks from missing cleanup functions
- TypeScript errors that break the build
- Formatting inconsistencies
- Linting violations

**If you bypass hooks, you WILL:**

- Break production
- Create memory leaks
- Block other work with broken builds
- Waste time debugging issues that would have been caught

---

## Testing & CI

### Testing Philosophy

**For NEW code**: Tests MUST exist before commit. You can write tests before OR
during implementation (timing is flexible), but they must be complete and
passing before you commit.

**For EXISTING code**: When modifying existing components, you SHOULD add tests
if they're missing. Improve coverage opportunistically. Philosophy: **"Do it
once, do it right"** - prefer quality over speed. Even if adding comprehensive
tests slows down the current task, it pays dividends in maintainability.

### Test-Driven Development (TDD)

**TDD Workflow (Recommended for NEW features)**:

1. ✅ **Write tests FIRST** - Define expected behavior before implementation
2. ✅ **Watch tests fail** - Confirm test is valid (red phase)
3. ✅ **Implement minimum code** - Make tests pass (green phase)
4. ✅ **Refactor** - Improve code while keeping tests green
5. ✅ **Commit** - Only commit when tests pass

**Flexible Approach (Acceptable for simpler cases)**:

1. ✅ **Implement feature** - Write the code
2. ✅ **Write comprehensive tests** - Cover all logic paths
3. ✅ **Verify coverage** - Meet minimum targets
4. ✅ **Commit** - Only commit when tests pass and coverage is adequate

### What MUST be tested

| File Type             | Test Required | Test File Pattern               | Example                         |
| --------------------- | ------------- | ------------------------------- | ------------------------------- |
| `Component.astro`     | ✅ Yes        | `Component.test.ts`             | `Button.test.ts`                |
| `Component.hook.ts`   | ✅ Yes        | `Component.hook.test.ts`        | `PillToggle.hook.test.ts`       |
| `Component.utils.ts`  | ✅ Yes        | `Component.utils.test.ts`       | `DigitalAnalyzer.utils.test.ts` |
| `Component.config.ts` | ✅ Yes        | `Component.config.test.ts`      | `CuttingMat.config.test.ts`     |
| `Component.types.ts`  | ✅ Yes        | `Component.types.test.ts`       | `CuttingMat.types.test.ts`      |
| Subcomponents         | ✅ Yes        | `ComponentSubcomponent.test.ts` | `PillToggleButton.test.ts`      |

### Testing Stack

- **Framework**: Vitest
- **DOM Testing**: `@testing-library/dom` (for hooks and components)
- **Assertions**: Vitest's `expect` API
- **Mocking**: Vitest's `vi` utilities

### Test File Structure

**Pattern for hooks**:

```typescript
// PillToggle.hook.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initializeToggles, setupToggles } from './PillToggle.hook'

describe('PillToggle Hook', () => {
  beforeEach(() => {
    // Reset DOM before each test
    document.body.innerHTML = ''
  })

  afterEach(() => {
    // Clean up
    document.body.innerHTML = ''
  })

  describe('initializeToggles', () => {
    it('should initialize toggle buttons and menus', () => {
      // Arrange: Setup DOM
      document.body.innerHTML = `
        <button data-toggle-button>Toggle</button>
        <div class="hidden">Menu</div>
      `

      // Act: Initialize
      const cleanup = initializeToggles()

      // Assert: Verify behavior
      const button = document.querySelector('[data-toggle-button]')
      expect(button).toBeTruthy()

      // Cleanup
      cleanup()
    })

    it('should toggle menu visibility on click', () => {
      // Test user interaction
    })

    it('should cleanup event listeners', () => {
      // Test memory leak prevention
    })
  })
})
```

**Pattern for utils**:

```typescript
// Component.utils.test.ts
import { describe, expect, it } from 'vitest'
import { calculateGridSize, generateSquareWavePath } from './Component.utils'

describe('calculateGridSize', () => {
  it('should calculate grid size based on container width', () => {
    const result = calculateGridSize(1600, 2)
    expect(result).toBe(100)
  })

  it('should handle edge cases', () => {
    expect(calculateGridSize(0, 1)).toBe(0)
  })
})

describe('generateSquareWavePath', () => {
  it('should generate valid SVG path for binary data', () => {
    const path = generateSquareWavePath('10101010', 0, 100, 50)
    expect(path).toContain('M')
    expect(path).toContain('L')
  })
})
```

**Pattern for config**:

```typescript
// Component.config.test.ts
import { describe, expect, it } from 'vitest'
import { defaultOptions } from './Component.config'

describe('Component Config', () => {
  describe('defaultOptions', () => {
    it('should have all required properties', () => {
      expect(defaultOptions).toHaveProperty('opacity')
      expect(defaultOptions).toHaveProperty('duration')
    })

    it('should have valid default values', () => {
      expect(defaultOptions.opacity).toBeGreaterThan(0)
      expect(defaultOptions.opacity).toBeLessThanOrEqual(1)
    })

    it('should allow merging with custom options', () => {
      const custom = { ...defaultOptions, opacity: 0.5 }
      expect(custom.opacity).toBe(0.5)
    })
  })
})
```

**Pattern for types**:

```typescript
// Component.types.test.ts
import { describe, expect, it } from 'vitest'
import type { ComponentOptions } from './Component.types'

describe('Component Types', () => {
  it('should accept valid ComponentOptions', () => {
    const validOptions: ComponentOptions = {
      mode: 'light',
      enabled: true,
    }
    expect(validOptions).toBeDefined()
  })

  it('should enforce type constraints', () => {
    // Type-level tests using TypeScript compiler
    // @ts-expect-error - Invalid mode should fail
    const invalid: ComponentOptions = { mode: 'invalid' }
  })
})
```

### Test Coverage Requirements

**Minimum coverage targets (P2 - Best Practice)**:

- **Utils**: 100% - Pure functions must be fully tested
- **Hooks**: 90%+ - All logic paths and cleanup must be tested
- **Config**: 100% - Configuration validation is critical
- **Components**: 80%+ - Major rendering paths and interactions

**What to test**:

✅ **DO test**:

- Business logic and calculations
- User interactions (clicks, inputs, toggles)
- State changes
- Edge cases and error conditions
- Cleanup and memory management (critical for hooks)
- Integration between components
- Accessibility (ARIA attributes, keyboard navigation)

❌ **DON'T test**:

- Third-party library internals
- Trivial getters/setters
- Type definitions (TypeScript handles this)

### Running Tests

```bash
# Development: Watch mode with hot reload
npm run test

# CI: Run once and exit
npm run test:run

# Coverage report (if configured)
npm run test:coverage
```

### Test-First Example Workflow

**Scenario**: Adding a new `formatDate` utility

```typescript
// 1. Write test FIRST
// utils/date.test.ts
import { describe, expect, it } from 'vitest'
import { formatDate } from './date'

describe('formatDate', () => {
  it('should format ISO date to MM/DD/YYYY', () => {
    expect(formatDate('2024-10-24')).toBe('10/24/2024')
  })
})

// 2. Watch test FAIL (function doesn't exist yet)
// ❌ Test fails: formatDate is not defined

// 3. Implement minimum code to pass
// utils/date.ts
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

// 4. Watch test PASS
// ✅ Test passes

// 5. Add more test cases (edge cases)
// utils/date.test.ts
it('should handle invalid dates', () => {
  expect(() => formatDate('invalid')).toThrow()
})

// 6. Refactor implementation to handle edge cases
// 7. Commit when all tests pass
```

### Pre-Commit Test Enforcement

Tests run automatically in the pre-commit hook via Husky:

```bash
# .husky/pre-commit runs:
npm run test:run  # Must pass
npm run lint      # Must pass
npm run build     # Must pass
```

**NEVER bypass tests** with `--no-verify`. If tests are failing, fix them.

### CI Pipeline

The full CI pipeline runs:

1. **Tests** - Vitest (`npm run test:run`) ← **MUST PASS**
2. **Format check** - Prettier (`npm run format:check`)
3. **Type check** - Astro check (`npm run type-check`)
4. **Linting** - ESLint (`npm run lint`)
5. **Build** - Astro build (`npm run build`)

All must pass before merging. No exceptions.

### Testing Best Practices

1. **AAA Pattern**: Arrange, Act, Assert

   ```typescript
   it('should do something', () => {
     // Arrange: Setup
     const input = 'test'

     // Act: Execute
     const result = myFunction(input)

     // Assert: Verify
     expect(result).toBe('expected')
   })
   ```

2. **One assertion per test** (when possible)
3. **Descriptive test names**: `"should <expected behavior> when <condition>"`
4. **Test behavior, not implementation**
5. **Clean up side effects**: Use `beforeEach` and `afterEach`
6. **Mock external dependencies**: Don't test third-party code
7. **Test edge cases**: Empty arrays, null, undefined, boundary values

---

## Component Best Practices

### Props Pattern

Always support custom className and use `cn` utility for class merging:

```ts
import { cn } from '@/lib/utils'
import { componentVariants, type ComponentVariants } from './Component.cva'

interface Props extends ComponentVariants {
  // Component-specific props
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'

  // Always include
  class?: string
}

const { variant, size, class: className, ...rest } = Astro.props
```

### Element Polymorphism

Support rendering as different elements when appropriate. Always use `cn` for
class merging:

```astro
---
import { cn } from '@/lib/utils'
import { buttonVariants } from './Button.cva'

// Button can render as <button> or <a> based on href prop
const Element = href ? 'a' : 'button'
---

<Element
  {href}
  type={!href ? type : undefined}
  class={cn(buttonVariants({ variant, size }), className)}
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

All interactive components must support View Transitions. See
[Hook Pattern](#hook-pattern) for the full lifecycle implementation.

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

## Troubleshooting

Common problems and their solutions.

### Pre-commit hook failing repeatedly?

**Symptom**: You commit → hook fails → fix error → commit → hook fails → repeat

**Root cause**: You didn't run the appropriate checks BEFORE committing

**Solution for code changes**:

```bash
# 1. Stop committing
# 2. Run full CI locally
npm run autofix && npm run ci

# 3. Fix ALL errors shown
# 4. Repeat until everything passes
npm run autofix && npm run ci

# 5. THEN commit
git add .
git commit -m "Your message"
```

**Solution for root documentation (AGENTS.md, CLAUDE.md, README.md)**:

```bash
# 1. Stop committing
# 2. Run autofix (format + lint only)
npm run autofix

# 3. Verify output (should be clean)
# 4. THEN commit
git add .
git commit -m "Your message"
```

**Solution for content collection markdown (src/content/**/\*.md)\*\*:

```bash
# 1. Stop committing
# 2. Run autofix + type-check
npm run autofix && npm run type-check

# 3. (Optional) Run build to catch runtime errors
npm run build

# 4. Fix all errors shown
# 5. THEN commit
git add .
git commit -m "Your message"
```

### Not sure if task needs delegation?

**Rule of thumb**:

- **4+ files OR complex logic** → Use delegation (TodoWrite + Task tool)
- **Uncertain?** → Delegate (better safe than context overflow)
- **1-3 simple files** → Work directly

**When to delegate**:

- Creating new component families (multiple related files)
- Large refactoring across components
- Any task where you might lose track of requirements

### Hook pattern not working across View Transitions?

**Check 1**: Does each `setup*()` function register its own `astro:page-load`
listener?

```typescript
// ✅ Correct
export function setupComponent() {
  initializeComponent() // Initial setup
  document.addEventListener('astro:page-load', initializeComponent) // Re-init
}
```

**Check 2**: Is cleanup function implemented and called?

```typescript
// ✅ Correct
export function initializeComponent() {
  if (cleanup !== null) {
    cleanup() // Clean up previous init
  }

  // ... setup logic

  cleanup = () => {
    // Remove listeners, clear state
  }

  return cleanup
}
```

**Check 3**: Is `BaseLayout.astro` calling `initComponentHooks()` only ONCE?

```astro
<!-- ✅ Correct -->
<script>
  initComponentHooks() // Called ONCE, no astro:page-load wrapper
</script>
```

### Tests failing in CI but pass locally?

**Cause**: You're not running the full CI pipeline locally

**Solution**:

```bash
# Don't run individual commands
# ❌ npm run test
# ❌ npm run lint

# Run the full CI pipeline exactly
# ✅ npm run ci
npm run ci

# This runs: test + format check + type-check + lint + build
```

### Which workflow for my markdown file?

**Question**: I'm editing a `.md` file - do I need `autofix`, `type-check`, or
full `ci`?

**Answer**: Depends on location:

| File Location                        | Workflow                                | Why                                         |
| ------------------------------------ | --------------------------------------- | ------------------------------------------- |
| Root (AGENTS.md, README.md, etc.)    | `npm run autofix`                       | Not part of build, no schema validation     |
| `src/content/**/*.md`                | `npm run autofix && npm run type-check` | Has frontmatter with Zod schema validation  |
| Code files (`.ts`, `.astro`, `.css`) | `npm run autofix && npm run ci`         | Needs tests, type-check, linting, and build |

**Quick check**: If your markdown file is in `src/content/` (blog, projects,
projectLogs), it has frontmatter schemas and needs `type-check`. If it's in the
root directory, it doesn't.

### Memory leaks / duplicate event listeners?

**Symptom**: Handlers fire multiple times after navigating between pages

**Cause**: Not properly cleaning up event listeners before View Transitions

**Solution**: Implement cleanup function in `.hook.ts`:

```typescript
let cleanup: CleanupFunction | null = null

export function initializeComponent() {
  // Clean up previous initialization
  if (cleanup !== null) {
    cleanup()
  }

  // Setup listeners
  const handler = () => {
    /* ... */
  }
  element.addEventListener('click', handler)

  // Return cleanup function
  cleanup = () => {
    element.removeEventListener('click', handler)
    cleanup = null
  }

  return cleanup
}
```

### Should I create .hook.css or use `<style>` block?

**Use `.hook.css` ONLY when you need Tailwind v4 directives**:

- `@theme` - Extending theme tokens
- `@custom-variant` - Custom variants
- `@layer` - Layer-specific styles

**Use `<style>` block for everything else**:

- Regular CSS
- Animations (`@keyframes`)
- Component-specific styles

See [Styling Philosophy](#styling-philosophy) for details.

### Subcomponent CVA: Separate file or parent's file?

**ALWAYS use parent's .cva.ts file** for subcomponent variants.

```typescript
// ✅ Correct: PillToggle.cva.ts contains variants for PillToggle AND PillToggleButton
export const pillToggleVariants = cva(/* ... */)
export const pillToggleButtonVariants = cva(/* ... */)
export const pillToggleSliderVariants = cva(/* ... */)

// ❌ Wrong: Creating PillToggleButton.cva.ts
// This causes drift and violates co-location pattern
```

See [CVA File Organization](#cva-file-organization) for why this matters.

---

## Quick Reference

### Creating a New Component Checklist

**Workflow (Follow in order)**:

1. **Determine if tests should be first** (TDD recommended for complex
   features):
   - Complex feature → Write tests FIRST
   - Simple component → Tests during or after implementation OK
   - MUST have tests before commit regardless

2. **Create component files** in appropriate directory (`ui/`, `features/`,
   `pages/`):
   - Create `Component.astro`
   - Create `Component.cva.ts` if component has variants (will contain variants
     for all subcomponents too)
   - Create `Component.hook.ts` if interactive behavior needed
   - Create `Component.utils.ts` if 3+ helper functions needed
   - Create `Component.config.ts` if 3+ configuration options needed
   - Create `Component.types.ts` if 3+ custom types needed

3. **Implement functionality**:
   - Add hook to appropriate `hooks.ts` orchestrator if using `.hook.ts`
   - Create `Component.hook.css` ONLY if Tailwind directives needed (`@theme`,
     etc.)
   - Import `.hook.css` in `ui/hooks.css` or `features/hooks.css` if created
   - Support custom `class` prop in all components

4. **Create subcomponents** as `Component<Subcomponent>.astro`:
   - Name with parent prefix: `PillToggleButton.astro`
   - Subcomponents import variants from parent's `Component.cva.ts` file
   - Write tests for each subcomponent

5. **Write comprehensive tests** (if not done in step 1):
   - `Component.test.ts` - Component rendering and props
   - `Component.hook.test.ts` - Hook behavior and cleanup
   - `Component.utils.test.ts` - Utility functions (100% coverage target)
   - `Component.config.test.ts` - Configuration validation (100% coverage
     target)
   - `Component.types.test.ts` - Type constraints
   - `Component<Subcomponent>.test.ts` - Subcomponent tests

6. **BEFORE committing**:
   - **For code changes**: Run `npm run autofix && npm run ci` - Full CI
     pipeline
   - **For root documentation** (AGENTS.md, README.md): Run `npm run autofix` -
     Format + lint only
   - **For content markdown** (src/content/\*_/_.md): Run
     `npm run autofix && npm run type-check` - Plus schema validation
   - Fix ALL errors and warnings
   - Repeat until everything passes

7. **Commit only when**:
   - ✅ All tests pass
   - ✅ Full CI pipeline passes (`npm run ci`)
   - ✅ Code coverage meets targets (or is improving)

**Critical reminders:**

- ❌ Do NOT commit before running `npm run autofix && npm run ci`
- ❌ Do NOT commit with failing tests
- ❌ Do NOT create separate `.cva.ts` files for subcomponents
- ❌ Do NOT bypass `--no-verify` on commits
- ❌ Do NOT use CSS classes as hook selectors
- ❌ Do NOT pass className directly to CVA variants
- ✅ DO run full CI before commit to avoid hook failure loop
- ✅ DO write tests before commit (timing flexible, but tests required)
- ✅ DO name subcomponents with parent prefix (e.g., `PillToggleButton.astro`)
- ✅ DO export all variants from parent's `.cva.ts` file
- ✅ DO use `data-*` attributes for hook selectors (never CSS classes)
- ✅ DO use `cn()` utility to merge CVA variants with custom classes
- ✅ DO test edge cases and error conditions
- ✅ DO test cleanup and memory management in hooks
- ✅ DO improve existing code opportunistically (add tests when modifying)

### Common Commands

```bash
# Development
npm run dev          # Start dev server

# Code Quality (Run BEFORE committing)
npm run autofix      # Auto-fix formatting + linting
npm run ci           # Full CI pipeline (REQUIRED before commit)

# Individual Checks (Use ci instead for pre-commit)
npm run lint         # Check linting
npm run lint:fix     # Fix linting
npm run format       # Format code
npm run format:check # Check formatting
npm run type-check   # Check TypeScript
npm run test         # Run tests (watch)
npm run test:run     # Run tests (once)
npm run build        # Build for production

# Git (Never use --no-verify!)
git commit           # Commit (hooks run automatically)
```

### Priority Reference

| Rule                              | Priority | Can Deviate?    |
| --------------------------------- | -------- | --------------- |
| View Transitions lifecycle        | P0       | ❌ Never        |
| Run autofix && ci before commit   | P0       | ❌ Never        |
| No `--no-verify`                  | P0       | ❌ Never        |
| Component naming conventions      | P1       | ⚠️ Ask first    |
| CVA file organization             | P1       | ⚠️ Ask first    |
| Use `cn()` for class merging      | P1       | ⚠️ Ask first    |
| Testing for new code              | P1       | ⚠️ Ask first    |
| Specific coverage percentages     | P2       | ✅ Use judgment |
| Optional file creation thresholds | P2       | ✅ Use judgment |

### Decision Flowchart

```text
Should I delegate this task?
├─ 1-3 simple files? → Work directly
├─ 4+ files OR complex logic? → Delegate
└─ Uncertain? → Delegate (safer)

Should I ask for approval?
├─ Following documented P1 patterns? → Proceed
├─ Deviating from P0/P1? → Ask first
└─ Uncertain? → Ask first

Should I create a .hook.css file?
├─ Need @theme, @custom-variant, @layer? → Yes, create .hook.css
└─ Regular CSS or animations? → No, use <style> in .astro

Should I use <script> or .hook.ts?
├─ Needs View Transitions support? → .hook.ts
├─ Multiple pages? → .hook.ts
├─ Needs cleanup? → .hook.ts
└─ One-off, simple interaction? → <script>
```

---

## Summary

This codebase values:

- **Strict adherence to patterns** - Consistency prevents bugs and technical
  debt
- **Co-location** - Related files live together for maintainability
- **Separation of concerns** - CVA, hooks, styles in separate files with clear
  responsibilities
- **Type safety** - TypeScript everywhere catches errors early
- **Quality over speed** - Do it right the first time, even if it takes longer
- **Testing discipline** - New code must be tested; improve existing code
  opportunistically
- **Memory safety** - Proper cleanup prevents leaks in View Transitions
- **Accessibility** - Semantic HTML and ARIA for all interactive components
- **Process discipline** - Always run full CI before committing

**When in doubt:**

1. Look at existing implementations: `Button.astro`, `Link.astro`, `Badge.astro`
2. Reference the [Hook Pattern](#hook-pattern), [CVA Pattern](#cva-pattern), and
   [Styling Philosophy](#styling-philosophy) sections
3. Check [Troubleshooting](#troubleshooting) for common issues
4. Ask the user for clarification rather than guessing

**Remember**: The strictness of these patterns exists to prevent production
failures, not to slow you down. Following them precisely ensures code quality,
prevents memory leaks, maintains consistency, and makes the codebase
maintainable long-term.

---

**Last Updated**: 2025-10-24 **Maintained By**: AI Agents working on this
codebase
