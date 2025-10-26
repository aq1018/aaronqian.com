# Troubleshooting Guide

> Common issues and solutions

## Quick Reference

| Problem                                  | Solution                                                 |
| ---------------------------------------- | -------------------------------------------------------- |
| Pre-commit hook failing                  | `npm run autofix && npm run ci`, then stage changes      |
| Hook not working across View Transitions | Check cleanup function implemented. See docs/hooks.md    |
| Memory leaks / duplicate listeners       | Implement cleanup function. See docs/hooks.md            |
| Component CSS - where to put it?         | Use `<style>` blocks in .astro (primary)                 |
| Subcomponent needs own CVA file?         | No. Always use parent's `.cva.ts` file                   |
| When to create .config.ts, .types.ts?    | If 3+ items. See docs/components.md                      |
| Tailwind classes not applying            | Use `cn()` utility. See docs/components.md               |
| Tests failing in CI but pass locally     | Run `npm run ci` (not `npm run test`)                    |
| ESLint errors                            | Use type guards from `src/utils/typeGuards.ts`           |
| Build failing but dev works              | Run `npm run build` locally. Fix import case sensitivity |
| Type 'X' not assignable to type 'Y'      | Use type guards or narrow the type                       |
| Module not found                         | Use `@/*` aliases. Check file path case sensitivity      |
| Components re-initializing incorrectly   | Follow hook pattern in docs/hooks.md                     |
| State not persisting across navigations  | Use `localStorage` or `sessionStorage`                   |
| Page loads feeling slow                  | Check for memory leaks (missing cleanup functions)       |

## Pre-commit Hook Issues

### Hook failing repeatedly

```bash
# For code files (.ts, .astro, .css)
npm run autofix && npm run ci

# For root docs (AGENTS.md, README.md)
npm run autofix

# For content markdown (src/content/**/*.md)
npm run autofix && npm run type-check

# Then stage changes
git add .
git commit
```

## Hook Pattern Issues

### Hook not working across View Transitions

**Check:**

1. `setup*()` registers `astro:page-load` listener
2. Cleanup function implemented and called
3. `BaseLayout.astro` calls `initComponentHooks()` ONCE (no `astro:page-load`
   wrapper)

**Search for examples:** `Glob: **/*.hook.ts`

### Memory leaks / duplicate listeners

**Fix:** Implement cleanup function in `.hook.ts`

```typescript
let cleanup: CleanupFunction | null = null

export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup() // Clean up first!

  // ... setup ...

  cleanup = () => {
    // Remove ALL listeners
  }
  return cleanup
}
```

**See:** docs/hooks.md Memory Leak Prevention section

## Styling Issues

### Component CSS location

- **`<style>` blocks** (PRIMARY): Use for all component-specific CSS
- **`Component.css`** (RARE): Only if shared across multiple .astro files

### Layout primitives vs inline classes

**Use primitives for:** Section padding, Container width, Stack spacing

**Use inline for:** Component-internal micro-spacing, one-off adjustments

**See:** docs/styling.md

## Component Structure Issues

### Subcomponent CVA file

**Never create separate `.cva.ts` for subcomponents.** Always use parent's
`.cva.ts` file.

**Search for examples:** `Glob: **/PillToggle.cva.ts`

### When to create optional files

| File            | Create When...             |
| --------------- | -------------------------- |
| `.config.ts`    | 3+ configuration constants |
| `.types.ts`     | 3+ custom TypeScript types |
| `.utils.ts`     | 3+ helper functions        |
| `Component.css` | Shared CSS (rare)          |

## CVA & Styling Issues

### Classes not applying / conflicts

**Always use `cn()` utility:**

```typescript
// ✅ Correct
class={cn(variants({ variant, size }), className)}

// ❌ Wrong
class={variants({ variant, size, class: className })}
```

## Testing Issues

### Tests failing in CI but pass locally

**Run what CI runs:**

```bash
npm run ci
```

**Don't run:** `npm run test` (watch mode may cache results)

### Can't test TypeScript type errors

**Don't test compile-time type checking.** ESLint and `tsc` handle this.

**Test instead:** Runtime type guards, validation functions, error handling

## ESLint Issues

### Unsafe member access / unsafe assignment

**Use type guards from `src/utils/typeGuards.ts`:**

```typescript
// ❌ Wrong
const value = someObject.property

// ✅ Right
if (isValidObject(someObject)) {
  const value = someObject.property
}
```

**Creating new type guards:**

```typescript
// Add to src/utils/typeGuards.ts
export function isMyType(value: unknown): value is MyType {
  return (
    typeof value === 'object' && value !== null && 'expectedProperty' in value
  )
}
```

**Never:** Modify ESLint config or use disable comments (P0)

## Build Issues

### Build failing but dev works

**Common causes:** Import case sensitivity, missing dependencies, TypeScript
errors

**Fix:**

1. Run `npm run build` locally
2. Fix import case: `import Button from './button'` → `'./Button'`
3. Add missing dependencies: `npm install <package>`

**Always test locally:** `npm run autofix && npm run ci`

## Type Safety Issues

### Type 'X' not assignable to type 'Y'

**Solutions:**

1. Use type guards (preferred)
2. Narrow the type (`typeof`, `instanceof`)
3. Provide proper types for props

**Avoid:** Type assertions (`as`) unless absolutely necessary

## Import Issues

### Module not found

**Use `@/*` aliases:**

```typescript
// ✅ Correct
import { Button } from '@/components/ui/Button.astro'

// ❌ Wrong (from inside src/)
import { Button } from '../../../components/ui/Button.astro'
```

**Check:** File path case sensitivity, file exists

## View Transitions Issues

### Components re-initializing incorrectly

**Follow hook pattern:** See docs/hooks.md

**Requirements:**

1. `setup*()` registers `astro:page-load` listener
2. Cleanup function removes all listeners
3. `BaseLayout.astro` calls orchestrator ONCE

### State not persisting

**Use `localStorage` or `sessionStorage`:**

```typescript
// Save
localStorage.setItem('key', value)

// Restore
const value = localStorage.getItem('key')
```

**Search for examples:** `Glob: **/ThemeToggle.hook.ts`

## Performance Issues

### Page loads slow

**Likely cause:** Memory leaks from missing cleanup functions

**Fix:** Implement cleanup in all `.hook.ts` files. See docs/hooks.md

**Diagnostics:** Browser DevTools → Performance tab → Record navigation

## When to Ask for Help

**Stop and ask when:**

- Deviating from P0 or P1 rule
- Creating new architectural patterns
- Touching >10 files
- Uncertain about requirements

**See:** AGENTS.md "When to Ask vs. Proceed" section
