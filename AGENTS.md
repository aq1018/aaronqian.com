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
2. 📖 **Study reference implementations** - See section below
3. ❓ **If still uncertain, STOP and ASK** - Do NOT guess or make up patterns.
   Ask the user for clarification.

---

## 📚 Reference Implementations

**Study these files when working on similar patterns:**

### Simple Components

- **Button**: `ui/Button.astro`, `ui/Button.cva.ts`, `ui/Button.test.ts` -
  Element polymorphism, CVA variants
- **Link**: `ui/Link.astro`, `ui/Link.cva.ts` - External link handling,
  polymorphism
- **Badge**: `ui/Badge.astro`, `ui/Badge.cva.ts` - Simple CVA component

### Layout Primitives

- **Section**: `ui/Section.astro`, `ui/Section.cva.ts`, `ui/Section.test.ts` -
  Vertical padding variants
- **Container**: `ui/Container.astro`, `ui/Container.cva.ts` - Max-width and
  horizontal padding
- **Stack**: `ui/Stack.astro`, `ui/Stack.cva.ts` - Directional spacing (vertical
  & horizontal)

### Hooks & Lifecycle

- **ThemeToggle**: `features/ThemeToggle.hook.ts`,
  `features/ThemeToggle.hook.test.ts` - Complete hook with cleanup
- **PillToggle**: `ui/PillToggle.hook.ts`, `ui/PillToggle.hook.test.ts` - Toggle
  interaction hook
- **DigitalAnalyzer**: `features/DigitalAnalyzer.hook.ts` - Complex hook with
  state management
- **Orchestrators**: `components/hooks.ts` (main), `ui/hooks.ts`,
  `features/hooks.ts`
- **CSS Orchestrators**: `components/hooks.css`, `ui/hooks.css`,
  `features/hooks.css`

### Component Families (Parent + Subcomponents)

- **PillToggle**: `ui/PillToggle.astro`, `ui/PillToggle.cva.ts` (contains parent
  AND subcomponent variants), `ui/PillToggleButton.astro` (imports parent CVA)
- **DigitalAnalyzer**: `features/DigitalAnalyzer.astro` +
  `DigitalAnalyzer.config.ts` + `DigitalAnalyzer.types.ts` +
  `DigitalAnalyzer.utils.ts` + `DigitalAnalyzer.hook.ts` +
  `DigitalAnalyzerGrid.astro` + `DigitalAnalyzerTrace.astro`
- **CuttingMat**: `features/CuttingMat.astro` + `CuttingMat.config.ts` +
  `CuttingMat.types.ts` + 8 subcomponents (`CuttingMatAxes.astro`,
  `CuttingMatGridLines.astro`, etc.)

### Testing Patterns

- **Component tests**: `ui/Button.test.ts`, `ui/Link.test.ts`
- **Hook tests**: `ui/PillToggle.hook.test.ts`,
  `features/ThemeToggle.hook.test.ts`
- **Utils tests**: `features/DigitalAnalyzer.utils.test.ts`
- **Config tests**: `features/CuttingMat.config.test.ts`
- **Types tests**: `features/CuttingMat.types.test.ts`

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
- ✅ **Never modify ESLint config or use disable comments** - Fix errors with
  proper typing instead

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
- ✅ **Layout primitives for spacing** - Use Section, Container, Stack
  components instead of inline spacing classes
- ✅ **Type guards over type assertions** - Use or extend
  `src/utils/typeGuards.ts` instead of `as` casts

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

**Pattern Requirements**:

- Each `.hook.ts` file manages its own lifecycle by registering
  `astro:page-load` listener
- Export `setup*()` function (called once by orchestrator on initial load)
- Export `initialize*()` function (called on every page load/transition)
- **MUST** implement cleanup function to prevent memory leaks
- Track cleanup state to prevent duplicate listeners

**Minimal Pattern**:

```typescript
type CleanupFunction = () => void
let cleanup: CleanupFunction | null = null

export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup() // Clean up previous
  // ... initialization logic ...
  cleanup = () => {
    /* remove listeners, clear state */
  }
  return cleanup
}

export function setupComponent(): void {
  initializeComponent() // Initial
  document.addEventListener('astro:page-load', initializeComponent) // Re-init
  document.addEventListener('astro:before-preparation', () => cleanup?.())
}
```

**Reference**: `features/ThemeToggle.hook.ts`, `ui/PillToggle.hook.ts`,
`features/DigitalAnalyzer.hook.ts`

### `data-*` Attributes for Hook Selectors

**CRITICAL (P0)**: Always use `data-*` attributes as selectors in `.hook.ts`
files. Never use CSS classes.

**Why**: Semantic, stable selectors that won't break when styling changes.

**Naming**: kebab-case, specific, prefixed with component name

```html
<!-- ✅ Correct -->
<button data-theme-toggle data-value="dark">Toggle</button>

<!-- ❌ Wrong -->
<button class="toggle-button">Toggle</button>
```

**Reference**: `features/ThemeToggle.astro`, `ui/PillToggle.astro`

### `.hook.css` Files (Tailwind Directives)

**ONLY create when you need Tailwind v4 directives**: `@theme`,
`@custom-variant`, `@layer`

**DO NOT use for**: Regular CSS, animations, component styles → Use `<style>`
block in `.astro` instead

**Orchestration**: Import in `ui/hooks.css` or `features/hooks.css`, which roll
up to `components/hooks.css`, imported by `styles/global.css`

**Reference**: `ui/Badge.hook.css`, `ui/hooks.css`, `features/hooks.css`,
`components/hooks.css`

### When to Use `<script>` vs `.hook.ts`

**Use `<script>` in `.astro`**:

- One-off, component-specific behavior
- No cleanup needed
- Simple interactions on component's own elements

**Use `.hook.ts`**:

- Needs to survive View Transitions
- Requires cleanup/state management
- Global listeners (`document`/`window`)
- Shared across multiple pages

**Rule**: View Transitions + multiple pages = `.hook.ts`. Simple one-off =
`<script>`.

---

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

**CRITICAL: Always use `cn()` utility for class merging**

```typescript
// ✅ Correct
class={cn(buttonVariants({ variant, size }), className)}

// ❌ Wrong
class={buttonVariants({ variant, size, class: className })}
```

**Why**: `cn()` deduplicates Tailwind classes and prevents conflicts.

**Reference**: `ui/Button.cva.ts`, `ui/Badge.cva.ts`, `ui/Link.cva.ts`

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

### 🚨 MANDATORY (P0) 🚨

**NEVER use `git commit --no-verify`**

### Pre-Commit Sequence

**Run ALL checks locally BEFORE committing to avoid hook failure loops.**

| File Type                                    | Workflow                                |
| -------------------------------------------- | --------------------------------------- |
| **Code** (`.ts`, `.astro`, `.css`)           | `npm run autofix && npm run ci`         |
| **Root docs** (AGENTS.md, README.md)         | `npm run autofix`                       |
| **Content markdown** (`src/content/**/*.md`) | `npm run autofix && npm run type-check` |

### `npm run ci` Pipeline

Runs: test + format check + type-check + lint + build (all must pass)

### Pre-commit Hooks (Husky)

Automatically run on staged files:

- `*.{ts,astro}`: prettier, astro check, eslint
- `*.{css,json,md}`: prettier

**If hooks fail after running CI, your workflow is wrong. Go back and verify.**

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

**Test patterns**: AAA (Arrange, Act, Assert), `beforeEach`/`afterEach` for
cleanup

**Reference**:

- **Hook tests**: `ui/PillToggle.hook.test.ts`,
  `features/ThemeToggle.hook.test.ts`
- **Utils tests**: `features/DigitalAnalyzer.utils.test.ts`
- **Config tests**: `features/CuttingMat.config.test.ts`
- **Types tests**: `features/CuttingMat.types.test.ts`
- **Component tests**: `ui/Button.test.ts`, `ui/Link.test.ts`

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
npm run test       # Development: Watch mode
npm run test:run   # CI: Run once and exit
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

1. AAA Pattern (Arrange, Act, Assert)
2. One assertion per test (when possible)
3. Descriptive names: `"should <behavior> when <condition>"`
4. Test behavior, not implementation
5. Clean up side effects: `beforeEach`/`afterEach`
6. Mock external dependencies
7. Test edge cases: empty arrays, null, undefined, boundaries
8. Every test must have at least one `expect()` assertion
9. Don't test compile-time type checking (ESLint handles this)

---

## Component Best Practices

### Layout Primitives (MANDATORY P1)

**ALWAYS use layout primitives for spacing. Never use inline spacing classes in
page components.**

#### Section - Vertical Padding

Wraps content sections with responsive vertical padding.

| Variant      | Classes                   | Use Case               |
| ------------ | ------------------------- | ---------------------- |
| `hero`       | `py-20 sm:py-24 lg:py-28` | Hero sections          |
| `content`    | `py-16 sm:py-20 lg:py-24` | Main content (default) |
| `subsection` | `py-12 sm:py-14 lg:py-16` | Nested sections        |

**Props**: `variant`, `background` ('surface' \| 'bg'), `class`

#### Container - Max-width & Horizontal Padding

Centers content with responsive horizontal padding.

| Size      | Classes     | Use Case                    |
| --------- | ----------- | --------------------------- |
| `narrow`  | `max-w-3xl` | Blog posts, focused content |
| `default` | `max-w-4xl` | Standard content            |
| `wide`    | `max-w-7xl` | Dashboards, wide layouts    |

**Base**: `mx-auto px-4 sm:px-6 lg:px-8` (always applied) **Props**: `size`,
`class`

#### Stack - Directional Spacing

Groups related items with consistent spacing (vertical or horizontal).

**Direction**: `vertical` (flex-col, default) \| `horizontal` (flex-row)

**Gap Sizes**:

| Gap      | Classes                      | Use Case                |
| -------- | ---------------------------- | ----------------------- |
| `tight`  | `gap-2 sm:gap-3`             | Very related items      |
| `small`  | `gap-4 sm:gap-5 lg:gap-6`    | Related items           |
| `medium` | `gap-8 sm:gap-10 lg:gap-12`  | Content items (default) |
| `large`  | `gap-12 sm:gap-14 lg:gap-16` | Major sections          |

**Props**: `direction`, `gap`, `class`

**Note**: Uses CSS `gap` (not `space-y-*`/`space-x-*`) for directional
consistency.

**Reference**: `ui/Section.astro`, `ui/Container.astro`, `ui/Stack.astro`

#### Composing & Anti-Patterns

**Composition**: `Section` > `Container` > `Stack` > content

**❌ DON'T**: `py-16`, `mx-auto max-w-4xl`, `space-y-*`, `flex gap-*` inline
**✅ DO**: Use `Section`, `Container`, `Stack` primitives

**Reference**: `pages/HomeHero.astro`, `pages/BlogIndex.astro` for composition
examples

#### When to Use Utility Classes vs. Primitives

**Use primitives**: Section padding, container width, vertical/horizontal
stacking, any repeating pattern

**Inline spacing OK**: Component-internal micro-spacing (badge padding, button
padding), table cells, border accents, one-off adjustments within primitives

**Rule**: Layout spacing between siblings = Stack. Component-internal or one-off
= inline classes OK.

### Props Pattern

Always support custom `class` prop. Extend CVA variant types.

**Reference**: `ui/Button.astro`, `ui/Link.astro`

### Element Polymorphism

Render as different elements based on props (e.g., `button` vs `a` based on
`href`). Always use `cn()` for class merging.

**Reference**: `ui/Button.astro` (button/a polymorphism)

### External Links

Handle external links safely with `target="_blank"` and
`rel="noopener noreferrer"`.

**Reference**: `ui/Link.astro`

### Accessibility

- Semantic HTML elements
- ARIA labels when needed
- Keyboard navigation support
- Visible focus states

**Reference**: `ui/Button.astro`, `features/Navigation.astro`

### Astro View Transitions

All interactive components must support View Transitions. See Hook Pattern for
lifecycle implementation.

**Reference**: `features/ThemeToggle.hook.ts`, `ui/PillToggle.hook.ts`

---

## Troubleshooting

### Pre-commit hook failing repeatedly?

**Solution**: Run checks BEFORE committing (see Git Commit Workflow table)

### Hook pattern not working across View Transitions?

**Check**:

1. Each `setup*()` registers `astro:page-load` listener
2. Cleanup function implemented and called
3. `BaseLayout.astro` calls `initComponentHooks()` ONCE (no `astro:page-load`
   wrapper)

**Reference**: `features/ThemeToggle.hook.ts`, `ui/PillToggle.hook.ts`

### Tests failing in CI but pass locally?

**Solution**: Run `npm run ci` (not individual commands)

### Memory leaks / duplicate listeners?

**Solution**: Implement cleanup function in `.hook.ts` (see Hook Pattern
section)

### .hook.css or `<style>` block?

**`.hook.css`**: ONLY for Tailwind directives (`@theme`, `@custom-variant`,
`@layer`) **`<style>`**: Everything else (regular CSS, animations)

### Subcomponent CVA file?

**ALWAYS** use parent's `.cva.ts` file for subcomponent variants (never create
separate `.cva.ts` for subcomponents)

### ESLint errors?

**Solution**: Use type guards from `src/utils/typeGuards.ts` or add new ones.
Never modify ESLint config or use disable comments

---

## Quick Reference

### Creating a New Component

1. **Tests**: TDD recommended; must have tests before commit
2. **Files**: Create `.astro`, `.cva.ts` (if variants), `.hook.ts` (if
   interactive), `.utils.ts`/`.config.ts`/`.types.ts` (if 3+ items)
3. **Implement**: Add to `hooks.ts` orchestrator, support `class` prop
4. **Subcomponents**: Prefix with parent name, import parent's CVA
5. **Tests**: Component, hook, utils, config, types tests
6. **Before commit**: Run appropriate workflow (see Git Commit table)
7. **Commit when**: All tests pass, CI passes, coverage targets met

**Critical P0/P1 Rules**:

- ❌ No `--no-verify`, no CSS class selectors in hooks, no separate subcomponent
  CVA files
- ✅ Use `data-*` for hooks, `cn()` for class merging, layout primitives for
  spacing

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
| No ESLint config edits or disable | P0       | ❌ Never        |
| Component naming conventions      | P1       | ⚠️ Ask first    |
| CVA file organization             | P1       | ⚠️ Ask first    |
| Use `cn()` for class merging      | P1       | ⚠️ Ask first    |
| Layout primitives for spacing     | P1       | ⚠️ Ask first    |
| Testing for new code              | P1       | ⚠️ Ask first    |
| Type guards over assertions       | P1       | ⚠️ Ask first    |
| Specific coverage percentages     | P2       | ✅ Use judgment |
| Optional file creation thresholds | P2       | ✅ Use judgment |

### Decision Flowchart

**Delegate?** 4+ files OR complex logic = Yes. 1-3 simple files = No. **Ask
approval?** Deviating from P0/P1 = Yes. Following patterns = No. **Layout?**
Section/Container/Stack for layout. Inline for component-internal.
**.hook.css?** Tailwind directives = Yes. Regular CSS = `<style>` in .astro.
**`.hook.ts`?** View Transitions + multiple pages = Yes. One-off = `<script>`.

---

## Summary

This codebase values strict adherence to patterns, co-location, type safety,
testing discipline, memory safety (cleanup functions), and accessibility.

**When in doubt**: Study reference implementations (see top section), check
relevant pattern sections, review Troubleshooting, or ask user for
clarification.

**Remember**: These strict patterns prevent production failures, memory leaks,
and technical debt.

---

**Last Updated**: 2025-10-24 **Maintained By**: AI Agents working on this
codebase
