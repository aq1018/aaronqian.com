# Hook Pattern & Lifecycle Management

> Detailed guide for `.hook.ts` files, lifecycle management, and Astro View
> Transitions.

**For detailed pattern explanation, see this file. All other docs reference back
here to avoid repetition.**

## `.hook.ts` Files (Client-side JavaScript)

Use for interactive client-side behavior. Always support Astro View Transitions
lifecycle.

**Pattern Requirements**:

- Each `.hook.ts` file manages its own lifecycle by registering
  `astro:page-load` listener
- Export `setup*()` function (called once by orchestrator on initial load)
- Export `initialize*()` function (called on every page load/transition)
- **MUST** implement cleanup function to prevent memory leaks (P0)
- Track cleanup state to prevent duplicate listeners

**Minimal Pattern**:

```typescript
type CleanupFunction = () => void
let cleanup: CleanupFunction | null = null

export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup() // Clean up previous

  // ... initialization logic ...
  // Set up event listeners, DOM manipulation, etc.

  cleanup = () => {
    /* remove listeners, clear state */
  }
  return cleanup
}

export function setupComponent(): void {
  initializeComponent() // Initial run
  document.addEventListener('astro:page-load', initializeComponent) // Re-init on transitions
  document.addEventListener('astro:before-preparation', () => cleanup?.()) // Cleanup before navigation
}
```

**Reference**: See docs/references.md for `ThemeToggle.hook.ts`,
`PillToggle.hook.ts`, `DigitalAnalyzer.hook.ts`

## `data-*` Attributes for Hook Selectors

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

**Reference**: See docs/references.md for `ThemeToggle.astro`,
`PillToggle.astro`

## `.hook.css` Files (Tailwind Directives)

**ONLY create when you need Tailwind v4 directives**: `@theme`,
`@custom-variant`, `@layer`

**DO NOT use for**: Regular CSS, animations, component styles → Use `<style>`
block in `.astro` instead

**Orchestration**: Import in `ui/hooks.css` or `features/hooks.css`, which roll
up to `components/hooks.css`, imported by `styles/global.css`

**Reference**: See docs/references.md for `Badge.hook.css`, `ui/hooks.css`,
`features/hooks.css`, `components/hooks.css`

## When to Use `<script>` vs `.hook.ts`

**Use `<script>` in `.astro`**:

- One-off, component-specific behavior
- No cleanup needed
- Simple interactions on component's own elements
- Won't be used across multiple pages

**Use `.hook.ts`**:

- Needs to survive View Transitions
- Requires cleanup/state management
- Global listeners (`document`/`window`)
- Shared across multiple pages

**Rule**: View Transitions + multiple pages = `.hook.ts`. Simple one-off =
`<script>`.

## Hooks Orchestrator Pattern

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

## Memory Leak Prevention

**CRITICAL (P0)**: Always implement cleanup functions to prevent memory leaks.

### Common Memory Leak Scenarios

❌ **No cleanup function**:

```typescript
// BAD - Memory leak
export function setupComponent() {
  document.addEventListener('astro:page-load', () => {
    const button = document.querySelector('[data-component]')
    button?.addEventListener('click', handleClick) // ← Never removed!
  })
}
```

✅ **Proper cleanup**:

```typescript
// GOOD - Cleanup prevents memory leak
let cleanup: CleanupFunction | null = null

export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup() // Clean up previous

  const button = document.querySelector('[data-component]')
  const handleClick = () => {
    /* ... */
  }
  button?.addEventListener('click', handleClick)

  cleanup = () => {
    button?.removeEventListener('click', handleClick)
  }
  return cleanup
}

export function setupComponent(): void {
  initializeComponent()
  document.addEventListener('astro:page-load', initializeComponent)
  document.addEventListener('astro:before-preparation', () => cleanup?.())
}
```

### Cleanup Checklist

Your cleanup function must:

- ✅ Remove all event listeners added during initialization
- ✅ Clear any intervals/timeouts
- ✅ Cancel any pending requests
- ✅ Clear any references to DOM elements
- ✅ Reset any module-level state

## Astro View Transitions Lifecycle

Understanding the View Transitions lifecycle is critical for proper hook
implementation:

```text
1. User clicks link
2. astro:before-preparation → Clean up current page
3. astro:after-preparation → New page content loaded
4. astro:before-swap → DOM about to be swapped
5. astro:after-swap → DOM swapped
6. astro:page-load → Re-initialize everything ← Your hook re-runs here
```

**Your hook pattern works by:**

- `astro:page-load` → Re-initialize on every page (including first load)
- `astro:before-preparation` → Clean up before navigation

## Testing Hooks

All `.hook.ts` files must have corresponding `.hook.test.ts` files.

**What to test**:

✅ **Initialization**:

- Elements are found correctly
- Event listeners are attached
- Initial state is set

✅ **Interactions**:

- User actions trigger expected behavior
- State changes correctly
- DOM updates as expected

✅ **Cleanup** (CRITICAL):

- Event listeners are removed
- State is reset
- No memory leaks

✅ **View Transitions**:

- Re-initialization works correctly
- Cleanup prevents duplicate listeners
- State persists (if intended) or resets (if intended)

**Reference**: See docs/references.md and docs/testing.md for hook testing
patterns

## Common Hook Patterns

### Toggle/State Management

See `ThemeToggle.hook.ts`, `PillToggle.hook.ts` for examples of:

- Managing boolean state
- Toggling CSS classes
- Persisting state to localStorage

### Complex State

See `DigitalAnalyzer.hook.ts` for examples of:

- Managing multiple pieces of state
- Coordinating multiple event listeners
- Advanced cleanup patterns

### Global Event Listeners

Pattern for document/window listeners:

```typescript
export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup()

  const handleResize = () => {
    /* ... */
  }
  const handleScroll = () => {
    /* ... */
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleScroll)

  cleanup = () => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
  }
  return cleanup
}
```

## Troubleshooting

### Hook not working across View Transitions?

**Check**:

1. Each `setup*()` registers `astro:page-load` listener
2. Cleanup function implemented and called
3. `BaseLayout.astro` calls `initComponentHooks()` ONCE (no `astro:page-load`
   wrapper)

**Reference**: See docs/references.md for `ThemeToggle.hook.ts`,
`PillToggle.hook.ts`

### Memory leaks / duplicate listeners?

**Solution**: Implement cleanup function (see Memory Leak Prevention section
above)

### .hook.css or `<style>` block?

**`.hook.css`**: ONLY for Tailwind directives (`@theme`, `@custom-variant`,
`@layer`) **`<style>`**: Everything else (regular CSS, animations) → See
docs/styling.md
