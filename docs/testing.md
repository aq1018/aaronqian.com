# Testing & CI

> Comprehensive guide for testing philosophy, requirements, and best practices.

## Testing Philosophy

**For NEW code**: Tests MUST exist before commit. You can write tests before OR
during implementation (timing is flexible), but they must be complete and
passing before you commit.

**For EXISTING code**: When modifying existing components, you SHOULD add tests
if they're missing. Improve coverage opportunistically.

**Philosophy**: **"Do it once, do it right"** - prefer quality over speed. Even
if adding comprehensive tests slows down the current task, it pays dividends in
maintainability.

## Test-Driven Development (TDD)

### TDD Workflow (Recommended for NEW features)

1. ✅ **Write tests FIRST** - Define expected behavior before implementation
2. ✅ **Watch tests fail** - Confirm test is valid (red phase)
3. ✅ **Implement minimum code** - Make tests pass (green phase)
4. ✅ **Refactor** - Improve code while keeping tests green
5. ✅ **Commit** - Only commit when tests pass

### Flexible Approach (Acceptable for simpler cases)

1. ✅ **Implement feature** - Write the code
2. ✅ **Write comprehensive tests** - Cover all logic paths
3. ✅ **Verify coverage** - Meet minimum targets
4. ✅ **Commit** - Only commit when tests pass and coverage is adequate

## What MUST Be Tested

| File Type             | Test Required | Test File Pattern               | Example                         |
| --------------------- | ------------- | ------------------------------- | ------------------------------- |
| `Component.astro`     | ✅ Yes        | `Component.test.ts`             | `Button.test.ts`                |
| `Component.hook.ts`   | ✅ Yes        | `Component.hook.test.ts`        | `PillToggle.hook.test.ts`       |
| `Component.utils.ts`  | ✅ Yes        | `Component.utils.test.ts`       | `DigitalAnalyzer.utils.test.ts` |
| `Component.config.ts` | ✅ Yes        | `Component.config.test.ts`      | `CuttingMat.config.test.ts`     |
| `Component.types.ts`  | ✅ Yes        | `Component.types.test.ts`       | `CuttingMat.types.test.ts`      |
| Subcomponents         | ✅ Yes        | `ComponentSubcomponent.test.ts` | `PillToggleButton.test.ts`      |

## Testing Stack

- **Framework**: Vitest
- **DOM Testing**: `@testing-library/dom` (for hooks and components)
- **Assertions**: Vitest's `expect` API
- **Mocking**: Vitest's `vi` utilities

## Test File Structure

**Test patterns**: AAA (Arrange, Act, Assert), `beforeEach`/`afterEach` for
cleanup

**Basic structure**:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup - runs before each test
  })

  afterEach(() => {
    // Cleanup - runs after each test
  })

  it('should do something when condition', () => {
    // Arrange - Set up test data and conditions

    // Act - Execute the code being tested

    // Assert - Verify the results
    expect(result).toBe(expected)
  })
})
```

**Reference**: See docs/references.md for test examples:

- **Hook tests**: `PillToggle.hook.test.ts`, `ThemeToggle.hook.test.ts`
- **Utils tests**: `DigitalAnalyzer.utils.test.ts`
- **Config tests**: `CuttingMat.config.test.ts`
- **Types tests**: `CuttingMat.types.test.ts`
- **Component tests**: `Button.test.ts`, `Link.test.ts`

## Test Coverage Requirements

**Minimum coverage targets (P2 - Best Practice)**:

- **Utils**: 100% - Pure functions must be fully tested
- **Hooks**: 90%+ - All logic paths and cleanup must be tested
- **Config**: 100% - Configuration validation is critical
- **Components**: 80%+ - Major rendering paths and interactions

## What to Test

### ✅ DO Test

- **Business logic and calculations** - Core functionality
- **User interactions** - Clicks, inputs, toggles, keyboard events
- **State changes** - How state updates in response to actions
- **Edge cases and error conditions** - Null, undefined, empty arrays,
  boundaries
- **Cleanup and memory management** - CRITICAL for hooks (see docs/hooks.md)
- **Integration between components** - How components work together
- **Accessibility** - ARIA attributes, keyboard navigation, focus management

### ❌ DON'T Test

- **Third-party library internals** - Trust that libraries work
- **Trivial getters/setters** - Simple property access
- **Type definitions** - TypeScript handles compile-time type checking
- **CSS styling** - Visual appearance (unless critical to functionality)

## Running Tests

```bash
npm run test       # Development: Watch mode (automatically re-runs on changes)
npm run test:run   # CI: Run once and exit (used in pre-commit hooks)
```

## Testing Hooks

Hooks require special attention to test lifecycle and cleanup.

### What to Test in Hooks

✅ **Initialization**:

```typescript
it('should initialize on page load', () => {
  // Test that elements are found
  // Test that event listeners are attached
  // Test that initial state is set
})
```

✅ **Interactions**:

```typescript
it('should handle click events', () => {
  // Simulate user action
  // Verify state changes
  // Verify DOM updates
})
```

✅ **Cleanup** (CRITICAL):

```typescript
it('should clean up event listeners', () => {
  // Initialize hook
  // Trigger cleanup
  // Verify listeners removed
  // Verify state reset
})
```

✅ **View Transitions**:

```typescript
it('should re-initialize on page transition', () => {
  // Initialize hook
  // Simulate astro:page-load event
  // Verify re-initialization
  // Verify no duplicate listeners
})
```

**Reference**: See docs/references.md for `PillToggle.hook.test.ts`,
`ThemeToggle.hook.test.ts`

## Testing Components

### Component Test Patterns

```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/dom'

describe('Button', () => {
  it('should render with default variant', () => {
    // Test default rendering
  })

  it('should apply custom classes', () => {
    // Test class prop merging
  })

  it('should render as anchor when href provided', () => {
    // Test element polymorphism
  })
})
```

**Reference**: See docs/references.md for `Button.test.ts`, `Link.test.ts`

## Testing Utils

Pure functions are the easiest to test. Aim for 100% coverage.

```typescript
describe('utilityFunction', () => {
  it('should handle normal input', () => {
    expect(utilityFunction('input')).toBe('expected')
  })

  it('should handle edge case: empty string', () => {
    expect(utilityFunction('')).toBe('default')
  })

  it('should handle edge case: null', () => {
    expect(utilityFunction(null)).toThrow()
  })
})
```

**Reference**: See docs/references.md for `DigitalAnalyzer.utils.test.ts`

## Testing Best Practices

1. **AAA Pattern** (Arrange, Act, Assert) - Clear test structure
2. **One assertion per test** (when possible) - Easier to debug failures
3. **Descriptive names**: `"should <behavior> when <condition>"` -
   Self-documenting
4. **Test behavior, not implementation** - Don't test internal details
5. **Clean up side effects**: `beforeEach`/`afterEach` - Isolated tests
6. **Mock external dependencies** - Fast, reliable tests
7. **Test edge cases**: empty arrays, null, undefined, boundaries
8. **Every test must have at least one `expect()` assertion** - Prevent empty
   tests
9. **Don't test compile-time type checking** - ESLint handles this

## Pre-Commit Test Enforcement

Tests run automatically in the pre-commit hook via Husky:

```bash
# .husky/pre-commit runs:
npm run test:run  # Must pass
npm run lint      # Must pass
npm run build     # Must pass
```

**NEVER bypass tests** with `--no-verify`. If tests are failing, fix them.

See docs/git-workflow.md for full pre-commit workflow.

## CI Pipeline

The full CI pipeline runs:

1. **Tests** - Vitest (`npm run test:run`) ← **MUST PASS**
2. **Format check** - Prettier (`npm run format:check`)
3. **Type check** - Astro check (`npm run type-check`)
4. **Linting** - ESLint (`npm run lint`)
5. **Build** - Astro build (`npm run build`)

All must pass before merging. No exceptions.

See docs/git-workflow.md for details.

## Mocking & Test Utilities

### Mocking Functions

```typescript
import { vi } from 'vitest'

const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('async value')

expect(mockFn).toHaveBeenCalledWith('arg')
expect(mockFn).toHaveBeenCalledTimes(1)
```

### Mocking Modules

```typescript
vi.mock('./module', () => ({
  namedExport: vi.fn(),
}))
```

### Mocking Timers

```typescript
import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
})

it('should debounce', () => {
  vi.advanceTimersByTime(1000)
  // Test debounced behavior
})
```

### DOM Testing Utilities

```typescript
import { screen, fireEvent } from '@testing-library/dom'

// Query elements
const button = screen.getByRole('button', { name: /click me/i })

// Simulate events
fireEvent.click(button)
fireEvent.input(input, { target: { value: 'text' } })

// Assertions
expect(button).toHaveAttribute('aria-pressed', 'true')
```

## Troubleshooting

### Tests failing in CI but pass locally?

**Solution**: Run `npm run ci` locally (not individual commands). CI runs the
full pipeline.

### How to test async code?

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})
```

### How to test errors?

```typescript
it('should throw on invalid input', () => {
  expect(() => functionThatThrows()).toThrow('Error message')
})
```

### Tests are slow?

- Mock expensive operations (API calls, timers)
- Use `vi.useFakeTimers()` for time-based tests
- Avoid unnecessary DOM manipulation
- Run specific test files during development: `npm run test -- Button.test.ts`
