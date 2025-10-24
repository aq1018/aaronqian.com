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

## AI Context Preservation

**CRITICAL**: Manage your context window effectively to maintain code quality
and avoid errors.

### When to Delegate to Sub-Agents

**Delegate large/complex tasks to sub-agents** using the Task tool to preserve
your context for coordination and decision-making.

**Delegate when:**

- ✅ **Large refactoring** - Renaming files, moving components, restructuring
  directories
- ✅ **Multiple file operations** - Creating 5+ related files (component family
  with tests)
- ✅ **Exploratory tasks** - Searching codebase for patterns, understanding
  architecture
- ✅ **Research tasks** - Reading multiple files to understand implementation
- ✅ **Repetitive operations** - Applying same pattern across many files
- ✅ **Complex implementations** - Multi-step feature requiring coordination
  across files
- ✅ **Migration tasks** - Updating patterns across entire codebase

**Example - Delegate this**:

```typescript
User: 'Create a new Dropdown component with all files following our patterns'

// This requires:
// - Dropdown.astro
// - Dropdown.cva.ts
// - Dropdown.hook.ts
// - Dropdown.hook.test.ts
// - DropdownItem.astro (subcomponent)
// - DropdownMenu.astro (subcomponent)
// - Integration into hooks.ts orchestrator
// ✅ DELEGATE to sub-agent - Complex, 7+ files
```

### When to Work in Same Context

**Handle simple tasks directly** without delegation to maintain efficiency.

**Work in same context when:**

- ✅ **Single file edits** - Fixing a bug, updating a function
- ✅ **Simple refactoring** - Renaming a variable, extracting a function
- ✅ **Documentation updates** - Updating comments, README, this file
- ✅ **Configuration changes** - Updating package.json, tsconfig.json
- ✅ **Quick fixes** - Correcting typos, fixing linting errors
- ✅ **Reading 1-3 files** - Understanding a specific component or pattern
- ✅ **Git operations** - Committing, creating PRs (after implementation is
  done)

**Example - Do directly**:

```typescript
User: 'Fix the typo in Button.astro line 42'

// This requires:
// - Read Button.astro
// - Edit one line
// - Run autofix
// ✅ DO DIRECTLY - Simple, 1 file
```

### Decision Matrix

| Task Type                           | Files Affected | Complexity | Action         |
| ----------------------------------- | -------------- | ---------- | -------------- |
| Create new component family         | 7+             | High       | 🤖 Delegate    |
| Refactor across multiple components | 5+             | High       | 🤖 Delegate    |
| Explore codebase architecture       | Many (read)    | Medium     | 🤖 Delegate    |
| Migrate pattern across codebase     | 10+            | High       | 🤖 Delegate    |
| Add feature to existing component   | 2-3            | Medium     | ✅ Do directly |
| Fix bug in single file              | 1              | Low        | ✅ Do directly |
| Update documentation                | 1-2            | Low        | ✅ Do directly |
| Create simple utility function      | 2 (+ test)     | Low        | ✅ Do directly |
| Commit and create PR                | N/A            | Low        | ✅ Do directly |

### Why Context Preservation Matters

**Running out of context leads to**:

- ❌ Incomplete implementations
- ❌ Forgetting requirements mid-task
- ❌ Inconsistent patterns
- ❌ Missed edge cases
- ❌ Poor coordination between related changes

**Preserving context enables**:

- ✅ Better oversight and coordination
- ✅ Consistent decision-making
- ✅ Catching errors across multiple changes
- ✅ Maintaining architectural vision
- ✅ Effective communication with user

### Delegation Best Practices

When delegating to sub-agents:

1. **Be specific** - Provide clear, detailed instructions
2. **Reference patterns** - Point to examples: "Follow the pattern in
   PillToggle.astro"
3. **Include requirements** - List all files needed, patterns to follow
4. **Request verification** - Ask sub-agent to run tests and CI
5. **Review results** - Check sub-agent's work before committing

**Good delegation example**:

```txt
Task: Create complete Dropdown component

Requirements:
- Follow PillToggle.astro pattern for structure
- Create Dropdown.astro (parent), DropdownItem.astro, DropdownMenu.astro
- Create Dropdown.cva.ts with variants for all 3 components
- Create Dropdown.hook.ts with keyboard navigation (Arrow Up/Down, Enter, Escape)
- Add data-dropdown-* attributes for hook selectors
- Write comprehensive tests: Dropdown.hook.test.ts
- Add to ui/hooks.ts orchestrator
- Follow TDD: write tests FIRST
- Run npm run ci before finishing
```

### Red Flags (Context Issues)

**Stop and delegate if you notice**:

- 🚨 You're about to read more than 5 files
- 🚨 You're creating more than 4 new files
- 🚨 You're losing track of what you've already done
- 🚨 You're repeating the same operation across many files
- 🚨 The task requires understanding a large portion of the codebase
- 🚨 You're unsure if all requirements will fit in remaining context

**Rule of thumb**: If you're thinking "this is getting complex", delegate it.

---

## Table of Contents

1. [AI Context Preservation](#ai-context-preservation)
2. [Architecture Overview](#architecture-overview)
3. [Component Structure](#component-structure)
4. [File Naming & Co-location](#file-naming--co-location)
5. [Hook Pattern](#hook-pattern)
6. [CVA Pattern](#cva-pattern)
7. [Styling Philosophy](#styling-philosophy)
8. [Git Commit Workflow](#git-commit-workflow)
9. [Testing & CI](#testing--ci)
10. [Component Best Practices](#component-best-practices)

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

**Why?**

- ✅ Single source of truth for component family styling
- ✅ Co-located variants are easier to maintain
- ✅ Reduces file proliferation
- ✅ Clear ownership: variants belong to parent component

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

### Test-Driven Development (TDD)

**MANDATORY**: All components, hooks, utils, helpers, configs, and types
**MUST** be tested. Writing tests is not optional.

**TDD Workflow**:

1. ✅ **Write tests FIRST** - Define expected behavior before implementation
2. ✅ **Watch tests fail** - Confirm test is valid (red phase)
3. ✅ **Implement minimum code** - Make tests pass (green phase)
4. ✅ **Refactor** - Improve code while keeping tests green
5. ✅ **Commit** - Only commit when tests pass

**What MUST be tested**:

| File Type             | Test Required | Test File Pattern               | Example                             |
| --------------------- | ------------- | ------------------------------- | ----------------------------------- |
| `Component.astro`     | ✅ Yes        | `Component.astro.test.ts`       | `DigitalAnalyzer.astro.test.ts`     |
| `Component.hook.ts`   | ✅ Yes        | `Component.hook.test.ts`        | `PillToggle.hook.test.ts`           |
| `Component.utils.ts`  | ✅ Yes        | `Component.utils.test.ts`       | `DigitalAnalyzer.utils.test.ts`     |
| `Component.config.ts` | ✅ Yes        | `Component.config.test.ts`      | `CuttingMat.config.test.ts`         |
| `Component.types.ts`  | ✅ Yes        | `Component.types.test.ts`       | `CuttingMat.types.test.ts`          |
| Subcomponents         | ✅ Yes        | `ComponentSubcomponent.test.ts` | `DigitalAnalyzerGrid.astro.test.ts` |

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

**Minimum coverage targets**:

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
- Cleanup and memory management
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

**TDD Workflow (Test-First)**:

1. **Write tests FIRST** before any implementation:
   - Create `Component.test.ts` with expected behavior
   - Watch tests fail (red phase)

2. **Create component files** in appropriate directory (`ui/`, `features/`,
   `pages/`):
   - Create `Component.astro`
   - Create `Component.cva.ts` if component has variants (will contain variants
     for all subcomponents too)
   - Create `Component.hook.ts` if interactive behavior needed
   - Create `Component.utils.ts` if helper functions needed
   - Create `Component.config.ts` if configuration needed
   - Create `Component.types.ts` if custom types needed

3. **Implement to make tests pass** (green phase):
   - Implement minimum code to pass tests
   - Add hook to appropriate `hooks.ts` orchestrator
   - Create `Component.hook.css` only if Tailwind directives needed
   - Import `.hook.css` in `ui/hooks.css` or `features/hooks.css`
   - Support custom `class` prop in all components

4. **Create subcomponents** as `Component<Subcomponent>.astro`:
   - Write tests FIRST for each subcomponent
   - Subcomponents import variants from parent's `Component.cva.ts` file
   - Test subcomponent rendering and behavior

5. **Write comprehensive tests**:
   - `Component.astro.test.ts` - Component rendering and props
   - `Component.hook.test.ts` - Hook behavior and cleanup
   - `Component.utils.test.ts` - Utility functions (100% coverage)
   - `Component.config.test.ts` - Configuration validation (100% coverage)
   - `Component.types.test.ts` - Type constraints
   - `Component<Subcomponent>.test.ts` - Subcomponent tests

6. **Refactor and verify**:
   - Run `npm run test` - Ensure all tests pass
   - Run `npm run autofix` - Format and lint
   - Run `npm run ci` - Full CI pipeline must pass

7. **Commit only when**:
   - ✅ All tests pass
   - ✅ CI pipeline passes
   - ✅ Code coverage meets minimums

**Critical reminders:**

- ❌ Do NOT implement before writing tests
- ❌ Do NOT commit with failing tests
- ❌ Do NOT create separate `.cva.ts` files for subcomponents
- ❌ Do NOT bypass `--no-verify` on commits
- ✅ DO write tests FIRST (TDD)
- ✅ DO achieve minimum coverage targets (Utils: 100%, Hooks: 90%, Config: 100%)
- ✅ DO name subcomponents with parent prefix (e.g., `PillToggleButton.astro`)
- ✅ DO export all variants from parent's `.cva.ts` file
- ✅ DO use `data-*` attributes for hook selectors (never CSS classes)
- ✅ DO test edge cases and error conditions
- ✅ DO test cleanup and memory management in hooks

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
