# Styling Philosophy & Design System

> **This is the authoritative document on styling. All other docs reference back
> here.**

## Priority Order (Use in this order)

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

## Design System Tokens

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

## Layout Primitives (MANDATORY P1)

**ALWAYS use layout primitives for spacing. Never use inline spacing classes in
page components.**

### Section - Vertical Padding

Wraps content sections with responsive vertical padding.

| Variant      | Classes                   | Use Case               |
| ------------ | ------------------------- | ---------------------- |
| `hero`       | `py-20 sm:py-24 lg:py-28` | Hero sections          |
| `content`    | `py-16 sm:py-20 lg:py-24` | Main content (default) |
| `subsection` | `py-12 sm:py-14 lg:py-16` | Nested sections        |

**Props**: `variant`, `background` ('surface' \| 'bg'), `class`

### Container - Max-width & Horizontal Padding

Centers content with responsive horizontal padding.

| Size      | Classes     | Use Case                    |
| --------- | ----------- | --------------------------- |
| `narrow`  | `max-w-3xl` | Blog posts, focused content |
| `default` | `max-w-4xl` | Standard content            |
| `wide`    | `max-w-7xl` | Dashboards, wide layouts    |

**Base**: `mx-auto px-4 sm:px-6 lg:px-8` (always applied) **Props**: `size`,
`class`

### Stack - Directional Spacing

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

**Reference**: See docs/references.md for `Section.astro`, `Container.astro`,
`Stack.astro`

### Composing Layout Primitives

**Composition Pattern**: `Section` > `Container` > `Stack` > content

**Example**:

```astro
<Section variant="hero">
  <Container size="default">
    <Stack gap="medium">
      <h1>Hero Title</h1>
      <p>Hero description</p>
      <Button>Call to Action</Button>
    </Stack>
  </Container>
</Section>
```

### Anti-Patterns

**❌ DON'T**:

- `py-16` - Use `<Section variant="content">` instead
- `mx-auto max-w-4xl` - Use `<Container size="default">` instead
- `space-y-*` - Use `<Stack gap="...">` instead
- `flex gap-*` inline - Use `<Stack direction="horizontal" gap="...">` instead

**✅ DO**:

- Use `Section`, `Container`, `Stack` primitives for all layout spacing
- Only use inline spacing for component-internal micro-spacing

**Reference**: See docs/references.md for `HomeHero.astro`, `BlogIndex.astro`
composition examples

### When to Use Utility Classes vs. Primitives

**Use primitives for**:

- Section padding (vertical spacing between major sections)
- Container width (horizontal boundaries and padding)
- Vertical/horizontal stacking (spacing between siblings)
- Any repeating spacing pattern

**Inline spacing is OK for**:

- Component-internal micro-spacing (badge padding, button padding)
- Table cells and grid items
- Border accents and dividers
- One-off adjustments within primitives

**Rule**: Layout spacing between siblings = Stack. Component-internal or one-off
= inline classes OK.

## CSS Architecture

### When to Use Each Styling Method

| Method           | Use For                                       | Example                              |
| ---------------- | --------------------------------------------- | ------------------------------------ |
| Tailwind classes | All styling (primary method)                  | `class="flex items-center gap-2"`    |
| `<style>` block  | Component-scoped CSS, animations, pseudo      | `@keyframes`, `:hover`, `::before`   |
| `.hook.css`      | Tailwind directives (`@theme`, `@layer`, etc) | Custom theme tokens, global variants |

### `.hook.css` Files

**ONLY create when you need Tailwind v4 directives**: `@theme`,
`@custom-variant`, `@layer`

**DO NOT use for**: Regular CSS, animations, component styles → Use `<style>`
block in `.astro` instead

**Orchestration**: Import in `ui/hooks.css` or `features/hooks.css`, which roll
up to `components/hooks.css`, imported by `styles/global.css`

**Example** (`Badge.hook.css`):

```css
@theme {
  --color-badge-primary: var(--color-primary-600);
  --color-badge-accent: var(--color-accent-500);
}
```

**Reference**: See docs/references.md for `Badge.hook.css`, `ui/hooks.css`,
`features/hooks.css`, `components/hooks.css`

### CSS Orchestrator Pattern

Each level imports child `.hook.css` files:

```css
/* ui/hooks.css */
@import './Badge.hook.css';
@import './PillToggle.hook.css';
```

```css
/* features/hooks.css */
@import './ThemeToggle.hook.css';
@import './DigitalAnalyzer.hook.css';
```

```css
/* components/hooks.css */
@import './ui/hooks.css';
@import './features/hooks.css';
```

Then `styles/global.css` imports `components/hooks.css`.

## Responsive Design

### Breakpoint System

Tailwind default breakpoints:

```css
sm: 640px   /* Small tablets and up */
md: 768px   /* Tablets and up */
lg: 1024px  /* Laptops and up */
xl: 1280px  /* Desktops and up */
2xl: 1536px /* Large desktops */
```

### Responsive Patterns

**Mobile-first approach**: Base styles are for mobile, use breakpoints to
enhance for larger screens.

```astro
<!-- ✅ Mobile-first -->
<div class="text-sm sm:text-base lg:text-lg">...</div>

<!-- ❌ Desktop-first -->
<div class="text-lg lg:text-base sm:text-sm">...</div>
```

## Dark Mode

This codebase uses CSS-based theme switching (not Tailwind's `dark:` variant).

Theme is controlled by:

- ThemeToggle component (`features/ThemeToggle.astro`)
- Theme hook (`features/ThemeToggle.hook.ts`)
- CSS custom properties in `global.css`

**Color tokens automatically adapt to theme** - use semantic tokens and they'll
switch with the theme.

## Accessibility (a11y)

### Color Contrast

All color combinations must meet WCAG AA standards:

- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

### Focus States

All interactive elements must have visible focus states:

```css
/* ✅ Good */
.button {
  @apply focus:outline-none focus:ring-2 focus:ring-primary;
}

/* ❌ Bad - no focus indicator */
.button {
  @apply focus:outline-none;
}
```

### Motion Sensitivity

Respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance

### CSS Best Practices

- ✅ Use Tailwind utilities (purged in production)
- ✅ Scope animations to component `<style>` blocks
- ✅ Avoid deep selector nesting
- ✅ Use CSS custom properties for theme values
- ❌ Avoid `@apply` in `.hook.css` (use in component `<style>` if needed)

### Critical CSS

Astro automatically inlines critical CSS. Keep component styles scoped and
minimal.

## Troubleshooting

### .hook.css or `<style>` block?

**`.hook.css`**: ONLY for Tailwind directives (`@theme`, `@custom-variant`,
`@layer`) **`<style>`**: Everything else (regular CSS, animations)

If you're writing regular CSS, use `<style>` in the `.astro` file.

### When to use Layout Primitives?

**Always for**:

- Vertical spacing between sections → `<Section>`
- Horizontal content boundaries → `<Container>`
- Spacing between sibling elements → `<Stack>`

**Never for**:

- Component-internal padding → inline classes OK
- One-off micro-adjustments → inline classes OK

### CVA vs inline classes?

See docs/components.md for CVA usage guidelines.
