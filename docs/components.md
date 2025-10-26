# Component Structure & Organization

> Component architecture, naming, and file organization rules

## File Structure

| File                  | Purpose                     | When Required                        |
| --------------------- | --------------------------- | ------------------------------------ |
| `Component.astro`     | Template, markup, props     | Always                               |
| `Component.cva.ts`    | CVA variant definitions     | If component has variants            |
| `Component.hook.ts`   | Global lifecycle management | If interactive across multiple pages |
| `Component.css`       | Component-specific CSS      | Rare (use `<style>` blocks instead)  |
| `<style>` in .astro   | Scoped CSS, animations      | Primary CSS method                   |
| `<script>` in .astro  | Client-side JS              | One-off interactions                 |
| `Component.test.ts`   | Tests                       | Required for all components          |
| `Component.utils.ts`  | Utility functions           | If 3+ functions                      |
| `Component.config.ts` | Configuration constants     | If 3+ config constants               |
| `Component.types.ts`  | TypeScript types            | If 3+ custom types                   |

## File Naming Conventions

- **Components:** PascalCase (`Button.astro`, `ThemeToggle.astro`)
- **Subcomponents:** `<Parent><Child>.astro` (`PillToggleButton.astro`)
- **CVA files:** `<Component>.cva.ts` (one per component family)
- **Hook files:** `<Component>.hook.ts`
- **Test files:** `<Component>.test.ts` or `<Component><Sub>.test.ts`

**Critical rule:** All subcomponents must be prefixed with parent component
name.

## CVA Organization (P1)

**ONE `.cva.ts` file per component family.** Parent's `.cva.ts` contains all
variants for parent AND subcomponents.

**Search for examples:** `Glob: **/PillToggle.cva.ts`

**Critical rule:** Always use `cn()` utility for class merging:

```typescript
// ✅ Correct
class={cn(variants({ variant, size }), className)}

// ❌ Wrong
class={variants({ variant, size, class: className })}
```

## Import Aliases (P1)

Always use `@/*` aliases for imports from `src/`:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/Button.astro'

// ❌ Wrong (from inside src/)
import { Button } from '../../../components/ui/Button.astro'
```

## Component Hierarchy

```txt
src/components/
├── ui/              # Generic, reusable UI components
│   └── hooks.ts     # UI hooks orchestrator
├── features/        # Feature-specific components
│   └── hooks.ts     # Feature hooks orchestrator
├── pages/           # Page-level components
└── hooks.ts         # Main hooks orchestrator
```

**Hierarchy:** `ui/` → `features/` → `pages/`

## Component Patterns

**Props:** Always support custom `class` prop. Extend CVA variant types.

**Element Polymorphism:** Render as different elements based on props (e.g.,
`button` vs `a` based on `href`).

**External Links:** Handle with `target="_blank"` and
`rel="noopener noreferrer"`.

**Accessibility:** Semantic HTML, ARIA labels, keyboard navigation, visible
focus states.

**Search for examples:**

- Props pattern: `Glob: **/Button.astro`
- Element polymorphism: `Glob: **/Button.astro`
- External links: `Glob: **/Link.astro`
- View Transitions lifecycle: See docs/hooks.md
