# Testing & CI

> Testing requirements and best practices

## Testing Requirements (P1)

**For NEW code:** Tests MUST exist before commit.

**For EXISTING code:** Add tests when modifying components.

## What MUST Be Tested

| File Type             | Test Required | Test File Pattern               |
| --------------------- | ------------- | ------------------------------- |
| `Component.astro`     | ✅ Yes        | `Component.test.ts`             |
| `Component.hook.ts`   | ✅ Yes        | `Component.hook.test.ts`        |
| `Component.utils.ts`  | ✅ Yes        | `Component.utils.test.ts`       |
| `Component.config.ts` | ✅ Yes        | `Component.config.test.ts`      |
| `Component.types.ts`  | ✅ Yes        | `Component.types.test.ts`       |
| Subcomponents         | ✅ Yes        | `ComponentSubcomponent.test.ts` |

**Search for examples:** `Glob: **/*.test.ts`

## Test Coverage Targets (P2)

| File Type  | Minimum Coverage |
| ---------- | ---------------- |
| Utils      | 100%             |
| Hooks      | 90%              |
| Config     | 100%             |
| Components | 80%              |

## Testing Stack

- **Framework:** Vitest
- **DOM Testing:** `@testing-library/dom`
- **Assertions:** Vitest's `expect` API
- **Mocking:** Vitest's `vi` utilities

## Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  })

  afterEach(() => {
    // Cleanup
  })

  it('should do something when condition', () => {
    // Arrange - Set up test data
    // Act - Execute code
    // Assert - Verify results
    expect(result).toBe(expected)
  })
})
```

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

## Testing Hooks

**Must test:**

- ✅ Initialization (elements found, listeners attached, initial state)
- ✅ Interactions (user actions trigger expected behavior)
- ✅ Cleanup (listeners removed, state reset, no memory leaks)
- ✅ View Transitions (re-initialization works, no duplicate listeners)

**Search for examples:** `Glob: **/*.hook.test.ts`

## Testing Components

**Must test:**

- ✅ Default rendering
- ✅ Custom classes (class prop merging)
- ✅ Element polymorphism (if applicable)
- ✅ Variant combinations (if using CVA)

**Search for examples:** `Glob: **/Button.test.ts`, `**/Link.test.ts`

## Testing Utils

Aim for 100% coverage. Test all edge cases.

**Search for examples:** `Glob: **/*.utils.test.ts`

## Pre-Commit & CI

See docs/git-workflow.md for pre-commit hooks and full CI pipeline.
