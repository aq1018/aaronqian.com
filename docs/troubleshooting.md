# Troubleshooting Guide

> Common issues and solutions when working with this codebase.

## Pre-commit Hook Issues

### Pre-commit hook failing repeatedly?

**Problem**: Hooks keep failing even after running `npm run ci`

**Solution**: Run checks BEFORE committing (see table in docs/git-workflow.md)

```bash
# For code files (.ts, .astro, .css)
npm run autofix && npm run ci

# For root docs (AGENTS.md, README.md)
npm run autofix

# For content markdown (src/content/**/*.md)
npm run autofix && npm run type-check
```

**Common mistakes**:

- Running `ci` before `autofix`
- Not staging autofix changes before committing
- Only running individual commands instead of full pipeline

### Hooks fail with "Command not found"?

**Problem**: Husky hooks fail to find npm commands

**Solution**:

1. Make sure you ran `npm install`
2. Verify `node_modules/.bin` is accessible
3. Check that you're running from project root

## Hook Pattern Issues

### Hook pattern not working across View Transitions?

**Problem**: Hook works on initial load but breaks on navigation

**Check**:

1. Each `setup*()` registers `astro:page-load` listener ✓
2. Cleanup function implemented and called ✓
3. `BaseLayout.astro` calls `initComponentHooks()` ONCE (no `astro:page-load`
   wrapper) ✓

**Reference**: See docs/hooks.md and docs/references.md for
`ThemeToggle.hook.ts`, `PillToggle.hook.ts`

**Example of correct pattern**:

```typescript
// ✅ Correct
export function setupComponent(): void {
  initializeComponent() // Initial run
  document.addEventListener('astro:page-load', initializeComponent)
  document.addEventListener('astro:before-preparation', () => cleanup?.())
}

// ❌ Wrong - no cleanup
export function setupComponent(): void {
  document.addEventListener('astro:page-load', initializeComponent)
  // Missing cleanup listener!
}
```

### Memory leaks / duplicate listeners?

**Problem**: Event listeners accumulate, causing performance issues

**Solution**: Implement cleanup function in `.hook.ts` (see docs/hooks.md Memory
Leak Prevention section)

**Common causes**:

- Not removing event listeners in cleanup function
- Not calling cleanup before re-initialization
- Not tracking cleanup state

**Example fix**:

```typescript
// ✅ Correct - cleanup prevents memory leaks
let cleanup: CleanupFunction | null = null

export function initializeComponent(): CleanupFunction {
  if (cleanup !== null) cleanup() // Clean up previous first!

  const button = document.querySelector('[data-component]')
  const handleClick = () => {
    /* ... */
  }
  button?.addEventListener('click', handleClick)

  cleanup = () => {
    button?.removeEventListener('click', handleClick) // Remove listener!
  }
  return cleanup
}
```

## Styling Issues

### .hook.css or `<style>` block?

**Decision tree**:

- Need Tailwind directives (`@theme`, `@custom-variant`, `@layer`)? →
  `.hook.css`
- Everything else (regular CSS, animations)? → `<style>` in `.astro`

**Examples**:

```css
/* Use .hook.css for: */
@theme {
  --color-custom: oklch(0.5 0.2 180);
}

@custom-variant button-fancy {
  /* ... */
}
```

```astro
<!-- Use <style> in .astro for: -->
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

  .component::before {
    content: '→';
  }
</style>
```

See docs/styling.md for full styling philosophy.

### Layout primitives vs inline classes?

**Use layout primitives for**:

- Vertical spacing between sections → `<Section>`
- Horizontal content boundaries → `<Container>`
- Spacing between siblings → `<Stack>`

**Use inline classes for**:

- Component-internal micro-spacing (padding, margins within a component)
- One-off adjustments
- Table cells, grid items

**Examples**:

```astro
<!-- ✅ Use primitives for layout -->
<Section variant="hero">
  <Container size="default">
    <Stack gap="medium">
      <h1>Title</h1>
      <p>Description</p>
    </Stack>
  </Container>
</Section>

<!-- ✅ Inline classes OK for component-internal spacing -->
<button class="px-4 py-2 rounded-lg"> Click me </button>
```

See docs/styling.md for complete guidance.

## Component Structure Issues

### Subcomponent CVA file?

**Problem**: Wondering if subcomponent needs its own `.cva.ts` file

**Solution**: **ALWAYS** use parent's `.cva.ts` file for subcomponent variants
(never create separate `.cva.ts` for subcomponents)

**Why**: Keeps component family styling co-located and prevents drift.

**Example**:

```txt
ui/
├── PillToggle.astro
├── PillToggle.cva.ts       ← Contains parent AND subcomponent variants
└── PillToggleButton.astro  ← Imports from PillToggle.cva.ts
```

See docs/components.md for CVA file organization.

### When to create .config.ts, .types.ts, .utils.ts?

**Create when you have 3+ items**:

| File Type    | Create When...                                  |
| ------------ | ----------------------------------------------- |
| `.config.ts` | Component has **3+ configuration constants**    |
| `.types.ts`  | Component has **3+ custom TypeScript types**    |
| `.utils.ts`  | Component has **3+ helper/utility functions**   |
| `.hook.css`  | Need Tailwind directives (not based on count)   |
| `.test.ts`   | Always recommended for components, hooks, utils |

See docs/components.md for details.

## CVA & Styling Issues

### Classes not applying / conflicts?

**Problem**: Tailwind classes not applying or conflicting

**Solution**: Always use `cn()` utility for class merging

```typescript
// ✅ Correct - cn() deduplicates and merges properly
class={cn(buttonVariants({ variant, size }), className)}

// ❌ Wrong - can cause conflicts
class={buttonVariants({ variant, size, class: className })}
```

See docs/components.md for CVA pattern.

## Testing Issues

### Tests failing in CI but pass locally?

**Problem**: `npm run test` passes locally but CI fails

**Solution**: Run `npm run ci` (not individual commands)

**Why**:

- `npm run test` runs in watch mode and may cache results
- `npm run test:run` runs once (like CI)
- `npm run ci` runs the full pipeline including `test:run`

```bash
# Run what CI runs:
npm run ci
```

See docs/testing.md and docs/git-workflow.md for details.

### Can't test TypeScript type errors?

**Problem**: Want to test that TypeScript catches type errors

**Solution**: Don't test compile-time type checking. ESLint and `tsc` handle
this.

**What to test instead**:

- Runtime type guards (using type guard functions)
- Validation functions
- Error handling for invalid input

**Example**:

```typescript
// ❌ Don't test this (compile-time)
it('should fail to compile with wrong type', () => {
  // Can't test compile-time errors in runtime tests
})

// ✅ Test runtime type guards instead
it('should validate input type at runtime', () => {
  expect(isValidInput(invalidData)).toBe(false)
})
```

See docs/testing.md for testing best practices.

## ESLint Issues

### ESLint errors?

**Problem**: ESLint reports type errors or unsafe operations

**Solution**: Use type guards from `src/utils/typeGuards.ts` or add new ones.
Never modify ESLint config or use disable comments.

**Common errors and fixes**:

#### "Unsafe member access on any value"

```typescript
// ❌ Wrong
const value = someObject.property

// ✅ Right - use type guard
if (isValidObject(someObject)) {
  const value = someObject.property
}
```

#### "Unsafe assignment"

```typescript
// ❌ Wrong
const data = await fetchData()

// ✅ Right - use type guard
const rawData = await fetchData()
if (isExpectedDataShape(rawData)) {
  const data = rawData
}
```

**Creating new type guards**:

Add to `src/utils/typeGuards.ts`:

```typescript
export function isMyType(value: unknown): value is MyType {
  return (
    typeof value === 'object' && value !== null && 'expectedProperty' in value
  )
}
```

See AGENTS.md P0 rules - never modify ESLint config.

## Build Issues

### Build failing but dev works?

**Problem**: `npm run dev` works but `npm run build` fails

**Common causes**:

- Import errors (case sensitivity - dev is forgiving, build is not)
- Missing dependencies
- Environment variable issues
- TypeScript errors ignored in dev mode
- Dynamic imports not properly handled

**Solution**:

1. Run `npm run build` locally
2. Read the error message carefully
3. Fix the specific issue shown
4. Common fixes:
   - Fix import case sensitivity: `import Button from './button'` → `'./Button'`
   - Add missing dependencies: `npm install <package>`
   - Ensure all imports have proper file extensions in import statements

**Always test build locally before committing**:

```bash
npm run autofix && npm run ci  # Includes build
```

## Type Safety Issues

### "Type 'X' is not assignable to type 'Y'"?

**Problem**: TypeScript type mismatch

**Solutions**:

1. **Use type guards** (preferred):

```typescript
if (isExpectedType(value)) {
  // TypeScript now knows value is ExpectedType
  doSomething(value)
}
```

2. **Narrow the type**:

```typescript
if (typeof value === 'string') {
  // TypeScript knows value is string here
}
```

3. **Provide proper types** (for props):

```typescript
interface Props {
  variant: 'primary' | 'secondary' // Specific types, not 'string'
  size?: 'sm' | 'md' | 'lg'
}
```

**Avoid**: Type assertions (`as`) unless absolutely necessary. They bypass type
safety.

## Import Issues

### Module not found errors?

**Problem**: Import statements failing

**Solutions**:

1. **Use `@/*` alias** for imports from `src/`:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/Button.astro'

// ❌ Wrong (from inside src/)
import { Button } from '../../../components/ui/Button.astro'
```

2. **Check file path case sensitivity**:

```typescript
// If file is Button.astro:
import { Button } from '@/components/ui/Button.astro' // ✅
import { Button } from '@/components/ui/button.astro' // ❌ (dev works, build fails)
```

3. **Ensure file exists**:

- Check spelling
- Check that file has expected exports

See docs/components.md for import patterns.

## View Transitions Issues

### Components re-initializing incorrectly?

**Problem**: Components lose state or duplicate on navigation

**Solution**: Follow hook pattern in docs/hooks.md

**Key requirements**:

1. Each `setup*()` registers its own `astro:page-load` listener
2. Cleanup function removes all event listeners
3. `BaseLayout.astro` calls orchestrator ONCE (no page-load wrapper)

### State not persisting across navigations?

**Problem**: Want state to persist between pages

**Solution**: Use `localStorage` or `sessionStorage`

**Example** (from ThemeToggle):

```typescript
export function initializeThemeToggle(): CleanupFunction {
  // Restore from localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    applyTheme(savedTheme)
  }

  // Save on change
  const handleChange = () => {
    localStorage.setItem('theme', currentTheme)
  }

  // ... rest of hook
}
```

## Performance Issues

### Page loads feeling slow?

**Possible causes**:

- Memory leaks from missing cleanup functions → See docs/hooks.md
- Duplicate event listeners → Implement proper cleanup
- Large bundle size → Check imports, use code splitting
- Missing View Transitions → Check navigation links

**Diagnostics**:

1. Open browser DevTools → Performance tab
2. Record a navigation
3. Look for:
   - Growing memory usage (memory leak)
   - Excessive event listeners
   - Long tasks

## Getting Help

### When to Ask for Help

Stop and ask when:

- ❓ Deviating from any P0 or P1 rule
- ❓ Creating new architectural patterns
- ❓ Unsure if change qualifies as "complex"
- ❓ Touching >10 files
- ❓ Breaking changes to public APIs
- ❓ Uncertain about requirements

See AGENTS.md "When to Ask vs. Proceed" section.

### What to Include When Asking

1. **What you're trying to do** - High-level goal
2. **What you've tried** - Steps already taken
3. **Error messages** - Full text, not paraphrased
4. **Relevant code** - Minimal reproduction
5. **Context** - Which pattern you're following, which docs you've read

### Before Asking

1. 🔍 **Search the codebase** for similar patterns
2. 📖 **Read relevant docs** in `docs/` folder
3. 👀 **Study reference implementations** in docs/references.md
4. 🧪 **Try running the checks**: `npm run autofix && npm run ci`
