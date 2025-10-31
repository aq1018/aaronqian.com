# Styling Philosophy & Design System

> Styling rules, design system layers, and layout primitives

## Styling Priority Order

1. **Tailwind inline classes** - Primary styling method
2. **`<style>` blocks** - Component-specific CSS, animations, pseudo-elements
3. **`Component.css` files** - RARE, only for shared styles across multiple
   .astro files (currently unused)

## 3-Layer Design System Architecture

```text
Layer 1: colors.css     → OKLCH color palette (internal, not exposed)
Layer 2: light.css      → Light theme mappings
         dark.css       → Dark theme mappings
Layer 3: tokens.css     → Theme-integrated semantic tokens (exposed to Tailwind)
```

**Import order (in global.css):**

```css
@import './fonts.css';
@import './colors.css'; /* Layer 1 */
@import './light.css'; /* Layer 2a */
@import './dark.css'; /* Layer 2b */
@import './tokens.css'; /* Layer 3 */
@import './utils.css'; /* Color variations */
@import './components.css'; /* Component styles */
@import './base.css'; /* Base element styles */
```

## When to Modify Each Layer

| Layer            | Modify When...                          |
| ---------------- | --------------------------------------- |
| `colors.css`     | Adding new color families               |
| `light.css`      | Changing light theme color mappings     |
| `dark.css`       | Changing dark theme color mappings      |
| `tokens.css`     | Adding new semantic token categories    |
| `utils.css`      | Adding new color variation utilities    |
| `components.css` | Adding component-specific styles (rare) |

## Semantic Tokens

**Use these ONLY:**

```css
/* Utility colors */
text-content, text-muted, bg-background, border-border

/* Brand colors (all have -content pairs) */
bg-primary, text-primary-content
bg-accent, text-accent-content
bg-secondary, text-secondary-content
bg-neutral, text-neutral-content

/* Status colors (all have -content pairs) */
bg-danger, text-danger-content
bg-success, text-success-content
bg-warning, text-warning-content
bg-info, text-info-content
```

**Content pairing:** Every color has a `-content` variant for automatic
contrast:

```css
bg-primary text-primary-content  /* White text on primary background */
```

## Color Variations

**Rule: Use increments of 10 for all variations**

### Opacity

```css
bg-primary/50      /* 50% opacity */
text-accent/20     /* 20% opacity */
```

### Brightness

```css
brightness-90      /* Darken by 10% */
brightness-110     /* Lighten by 10% */
```

### Color Mixing (utils.css)

**Syntax:** `{property}-{tint|shade}-{color?}/{percentage}`

```css
bg-tint-primary/10     /* Mix primary with 10% white (lighter) */
bg-shade-primary/10    /* Mix primary with 10% black (darker) */
text-shade-accent/20   /* Mix accent with 20% black */

/* Fallback (no color specified) */
bg-tint/10             /* Mix black with 10% white */
```

**Available properties:** text, bg, border, decoration, outline, shadow, ring,
accent, caret, fill, stroke

## Layout Primitives (P1)

**ALWAYS use layout primitives for spacing. Never use inline spacing in page
components.** Minor text spacing adjustments (`tracking-*`, `leading-*`) are
permitted outside primitives when a semantic prop or primitive variant does not
exist.

### Section - Vertical Padding

| Variant      | Classes                   | Use Case        |
| ------------ | ------------------------- | --------------- |
| `hero`       | `py-20 sm:py-24 lg:py-28` | Hero sections   |
| `content`    | `py-16 sm:py-20 lg:py-24` | Main content    |
| `subsection` | `py-12 sm:py-14 lg:py-16` | Nested sections |

**Props:** `variant`, `background` ('surface' \| 'bg'), `class`

### Container - Max-width & Horizontal Padding

| Size      | Classes     | Use Case                 |
| --------- | ----------- | ------------------------ |
| `narrow`  | `max-w-3xl` | Blog posts               |
| `default` | `max-w-4xl` | Standard content         |
| `wide`    | `max-w-7xl` | Dashboards, wide layouts |

**Base:** `mx-auto px-4 sm:px-6 lg:px-8` (always applied)

**Props:** `size`, `class`

### Stack - Directional Spacing

| Gap      | Classes                      | Use Case       |
| -------- | ---------------------------- | -------------- |
| `tight`  | `gap-2 sm:gap-3`             | Very related   |
| `small`  | `gap-4 sm:gap-5 lg:gap-6`    | Related items  |
| `medium` | `gap-8 sm:gap-10 lg:gap-12`  | Content items  |
| `large`  | `gap-12 sm:gap-14 lg:gap-16` | Major sections |

**Direction:** `vertical` (flex-col, default) \| `horizontal` (flex-row)

**Justify:** `start` \| `center` \| `end` \| `between` - Controls alignment
along the main axis

**Props:** `direction`, `gap`, `justify`, `class`

### Composition Pattern

`Section` > `Container` > `Stack` > content

```astro
<Section variant="hero">
  <Container size="default">
    <Stack gap="medium">
      <h1>Title</h1>
      <p>Description</p>
    </Stack>
  </Container>
</Section>
```

### When to Use

**Use primitives for:**

- Section padding (vertical spacing between major sections)
- Container width (horizontal boundaries and padding)
- Vertical/horizontal stacking (spacing between siblings)

**Inline spacing OK for:**

- Component-internal micro-spacing (badge padding, button padding)
- Table cells and grid items
- One-off adjustments within primitives

**Search for examples:** `Glob: **/Section.astro`, `**/Container.astro`,
`**/Stack.astro`

## Container & Content Primitives (P1)

**ALWAYS use these primitives for containers and content. Avoid ad-hoc
styling.**

### Sheet - Base Container Primitive

Base container component with Button-like variant system. Use for cards, panels,
list items, and alerts.

| Variant   | Visual Style                                | Use Case                     |
| --------- | ------------------------------------------- | ---------------------------- |
| `outline` | 2px border, hover background tint           | Cards, emphasized containers |
| `soft`    | Background tint, darker on hover            | Subtle containers, panels    |
| `bar`     | Transparent bg, left border (opacity shift) | List items, project entries  |

**Colors:** `primary` \| `accent` \| `secondary` \| `neutral` \| `danger` \|
`success` \| `warning` \| `info`

**Padding:** `none` (p-0) \| `sm` (p-4) \| `md` (p-6) \| `lg` (p-8)

**Hover:** `true` \| `false` - Controls transition effects for interactive vs
static content

**Props:** `variant`, `color`, `padding`, `hover`, `as` (div \| article \|
section), `class`

**Examples:**

```astro
<!-- Project list item with bar variant -->
<Sheet variant="bar" color="neutral" padding="sm" hover>
  <h3>Project Title</h3>
  <p>Description</p>
</Sheet>

<!-- Empty state with soft variant -->
<Sheet variant="soft" color="neutral" padding="lg">
  <Text tone="muted">No entries found.</Text>
</Sheet>

<!-- Alert-style container -->
<Sheet variant="outline" color="danger" padding="md">
  <p>Error message</p>
</Sheet>
```

**Search for examples:** `Glob: **/Sheet.astro`, `Grep: variant="bar"`

### Prose - Terminal-Styled Content

Markdown content wrapper with terminal aesthetic (monospace, muted base color).

**Size:** `sm` (text-sm, default) \| `base` (text-base)

**Props:** `size`, `class`

**Features:**

- Monospace font family
- Terminal-friendly prose classes
- Muted text with primary-colored code
- Consistent spacing for headings, lists, tables
- Inline code with subtle background

**Examples:**

```astro
<!-- Blog post content -->
<Prose size="base">
  <Content />
</Prose>

<!-- Project log entry -->
<Prose>
  <Content />
</Prose>
```

**Search for examples:** `Glob: **/Prose.astro`, `Grep: prose prose-invert`

## Responsive Design

**Breakpoints:**

```css
sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
```

**Mobile-first approach:**

```astro
<!-- ✅ Correct -->
<div class="text-sm sm:text-base lg:text-lg">...</div>
```

## Dark Mode

Theme controlled by ThemeToggle component. Color tokens automatically adapt.

**Do NOT use Tailwind's `dark:` variant.** Use semantic tokens instead.

## Accessibility

**Color contrast:** WCAG AA standards (4.5:1 normal text, 3:1 large text)

**Focus states:** All interactive elements must have visible focus:

```css
focus:outline-none focus:ring-2 focus:ring-primary
```

**Motion sensitivity:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
