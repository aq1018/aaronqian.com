# Testing & CI

> Testing requirements and patterns

**After creating/modifying test files:** Follow Per-File Validation workflow
(AGENTS.md).

## Testing Requirements (P1)

**For NEW code:** Tests MUST exist before commit.

**For EXISTING code:** Add tests when modifying components.

## File Naming & Co-location

- **Extension:** `.test.ts` only (no `.test.tsx` or `.spec.*`)
- **Co-location:** Tests live next to source files
- **Pattern:** `Component.[module].test.ts`

Examples:

- `Button.astro` → `Button.astro.test.ts`
- `Button.cva.ts` → `Button.cva.test.ts`
- `PillToggle.hook.ts` → `PillToggle.hook.test.ts`

## What MUST Be Tested

| File Type             | Test Required | Test File Pattern               |
| --------------------- | ------------- | ------------------------------- |
| `Component.astro`     | ✅ Yes        | `Component.astro.test.ts`       |
| `Component.hook.ts`   | ✅ Yes        | `Component.hook.test.ts`        |
| `Component.utils.ts`  | ✅ Yes        | `Component.utils.test.ts`       |
| `Component.config.ts` | ✅ Yes        | `Component.config.test.ts`      |
| `Component.types.ts`  | ✅ Yes        | `Component.types.test.ts`       |
| Subcomponents         | ✅ Yes        | `ComponentSubcomponent.test.ts` |

## Test Coverage Targets (P2)

| File Type  | Minimum Coverage |
| ---------- | ---------------- |
| Utils      | 100%             |
| Hooks      | 90%              |
| Config     | 100%             |
| Components | 80%              |

## Testing Stack

- **Framework:** Vitest (happy-dom environment)
- **Assertions:** Vitest `expect` API
- **Matchers:** `@testing-library/jest-dom/vitest`
- **Config:** `vitest.config.ts`, `test/vitest.setup.ts`

## Test Utilities

**Location:** `test/testHelpers.ts`, `test/vitest.setup.ts`

**Custom Matchers:**

- `toContainClasses(classes)` - Assert class string contains classes
- `toHaveAllVariantClasses(props, classes)` - CVA variant assertion
- `toRenderElement(selector)` - Element exists in rendered component
- `toHaveDataAttribute(attribute, value?)` - data-\* attribute assertion
- `toHaveClasses(classes)` - Element has CSS classes

**Rendering:**

- `renderAstroComponent(component, { props, slots })` - Astro components

**CVA Testing:**

- `testBaseClasses(variantFn, baseClasses)`
- `testAllVariants(variantFn, propName, values)`
- `testCompoundVariants(variantFn, variantCombinations)`
- `testDefaultVariants(variantFn, expectedClasses)`
- `testEdgeCases(variantFn, props, defaultClasses)`

**Hook Testing:**

- `setupTestDOM(html)` - Setup DOM with cleanup
- `expectEventListenersRemoved(cleanup, element, eventType)`
- `simulateEvent(element, eventType, eventInit?)`

## Test Commands

```bash
npm run test       # Watch mode (development)
npm run test:run   # Run once (CI)
```

## What to Test

**DO test:**

- Business logic and calculations
- User interactions (clicks, inputs, toggles, keyboard)
- State changes
- Edge cases (null, undefined, empty arrays, boundaries)
- Cleanup and memory management (CRITICAL for hooks)
- Integration between components
- Accessibility (ARIA, keyboard navigation, focus)

**DON'T test:**

- Third-party library internals
- Trivial getters/setters
- Type definitions (TypeScript handles this)
- CSS styling (unless critical to functionality)

## Testing Hooks (P0)

**Must test:**

- ✅ Initialization (elements found, listeners attached, initial state)
- ✅ Interactions (user actions trigger expected behavior)
- ✅ Cleanup (listeners removed, observers disconnected, no memory leaks)
- ✅ View Transitions (re-initialization works, no duplicate listeners)
- ✅ Double initialization prevention (previous cleanup called automatically)
- ✅ Cleanup idempotency (safe to call multiple times)

**View Transitions Lifecycle (P0):**

- `astro:page-load` - Initialize/re-initialize features
- `astro:before-preparation` - Cleanup before navigation
- References: `DigitalAnalyzer.hook.test.ts:348-520`,
  `Comments.hook.test.ts:555-584`

**Examples:** `DigitalAnalyzer.hook.test.ts`, `PillToggle.hook.test.ts`,
`Comments.hook.test.ts`

## Testing Components

**Must test:**

- ✅ Default rendering
- ✅ Props handling
- ✅ Slots rendering
- ✅ HTML attributes passthrough
- ✅ Custom classes (class prop merging)
- ✅ Element polymorphism (if applicable)
- ✅ Variant combinations (if using CVA)

**Examples:** `Button.astro.test.ts`, `DigitalAnalyzer.astro.test.ts`

## Testing CVA Variants

**Structure:**

- Base classes verification
- Default variants
- All variant values systematically
- Compound variants (combinations)
- Edge cases (undefined/null/empty)
- Semantic usage scenarios
- Accessibility checks

**Examples:** `Button.cva.test.ts`, `Badge.cva.test.ts`

## Testing Utils

Aim for 100% coverage. Test all edge cases.

**Examples:** `typeGuards.test.ts`

## Browser API Testing Patterns

**ResizeObserver/MutationObserver/IntersectionObserver:**

- Inline class mocks with vi.fn() methods
- Test observe/disconnect calls
- Reference: `DigitalAnalyzer.hook.test.ts:114-171`,
  `Comments.hook.test.ts:174-332`

**Timer Management:**

```typescript
function setupFakeTimers(): () => void {
  vi.clearAllTimers()
  vi.useFakeTimers()
  return () => {
    vi.clearAllTimers()
    vi.useRealTimers()
  }
}
```

**Property Overrides:**

- `Object.defineProperty(iframe, 'contentWindow', { value: { postMessage: vi.fn() } })`
- Reference: `Comments.hook.test.ts:54-85`

## Mock Data Factories

For Astro content collections, use factory functions:

```typescript
const createMock = (id: string): CollectionEntry<'type'> =>
  ({
    /* mock */
  }) as unknown as CollectionEntry<'type'>
```

**Examples:** `projects.test.ts:11-33`, `ProjectList.test.ts`

## Pre-Commit & CI

See docs/git-workflow.md for pre-commit hooks and full CI pipeline.
