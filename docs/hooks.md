# Hook Pattern & Lifecycle Management

> `.hook.ts` files for client-side JavaScript with View Transitions support

**After creating/modifying `.hook.ts` files:** Follow Per-File Validation
workflow (AGENTS.md).

## Required Pattern (P0)

**Every `.hook.ts` file MUST follow this pattern:**

```typescript
type CleanupFunction = () => void
let cleanup: CleanupFunction | null = null

export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup() // Clean up previous

  // Setup: DOM queries, event listeners, state initialization
  const element = document.querySelector('[data-component]')
  const handleEvent = () => {
    /* ... */
  }
  element?.addEventListener('event', handleEvent)

  // Cleanup function (P0 - MUST implement)
  cleanup = () => {
    element?.removeEventListener('event', handleEvent)
    // Remove ALL listeners, clear state, cancel requests
  }
  return cleanup
}

export function setupComponent(): void {
  initializeComponent() // Initial run
  document.addEventListener('astro:page-load', initializeComponent)
  document.addEventListener('astro:before-preparation', () => cleanup?.())
}
```

**Search for examples:** `Glob: **/*.hook.ts`

## `data-*` Attributes for Selectors (P0)

**ALWAYS use `data-*` attributes as selectors.** Never use CSS classes.

```html
<!-- ✅ Correct -->
<button data-theme-toggle>Toggle</button>

<!-- ❌ Wrong -->
<button class="toggle-button">Toggle</button>
```

**Naming:** kebab-case, specific, prefixed with component name

**Search for examples:** `Grep: "data-"`

## When to Use `.hook.ts` vs `<script>`

| Use `.hook.ts`                     | Use `<script>`          |
| ---------------------------------- | ----------------------- |
| Needs to survive View Transitions  | One-off behavior        |
| Requires cleanup/state management  | No cleanup needed       |
| Global listeners (document/window) | Component-specific only |
| Shared across multiple pages       | Single page only        |

**Rule:** View Transitions + multiple pages = `.hook.ts`. Simple one-off =
`<script>`.

## Hooks Orchestrator Pattern (P1)

Each level has a `hooks.ts` orchestrator:

```typescript
// src/components/ui/hooks.ts
import { setupPillToggle } from './PillToggle.hook'

export function initUiHooks() {
  setupPillToggle()
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

**In BaseLayout.astro:**

```astro
<script>
  // Call ONCE on initial page load
  // Each setup*() handles its own astro:page-load listener
  initComponentHooks()
</script>
```

**Critical:** Do NOT wrap `initComponentHooks()` in `astro:page-load` listener.

**Search for examples:** `Glob: **/hooks.ts`

## Memory Leak Prevention (P0)

**Cleanup function MUST:**

- ✅ Remove all event listeners
- ✅ Clear all intervals/timeouts
- ✅ Cancel all pending requests
- ✅ Clear references to DOM elements
- ✅ Reset module-level state

**Common mistake:** Not implementing cleanup function.

**Search for examples:** `Grep: "cleanup.*null"`

## View Transitions Lifecycle

```text
1. astro:before-preparation → Clean up current page
2. astro:page-load → Re-initialize everything
```

**Your hook must:**

- Listen to `astro:page-load` for re-initialization
- Listen to `astro:before-preparation` for cleanup

## Testing Hooks

All `.hook.ts` files MUST have `.hook.test.ts` files.

**Test:**

- ✅ Initialization (elements found, listeners attached, initial state)
- ✅ Interactions (user actions trigger expected behavior)
- ✅ Cleanup (listeners removed, state reset, no memory leaks)
- ✅ View Transitions (re-initialization works, no duplicate listeners)

**Search for examples:** `Glob: **/*.hook.test.ts`
