# Reference Implementations

> Study these files when working on similar patterns.

## Simple Components

- **Button**: `ui/Button.astro`, `ui/Button.cva.ts`, `ui/Button.test.ts`
  - Element polymorphism (button/a based on `href` prop)
  - CVA variants for size and variant
  - Props pattern with `class` support
  - Comprehensive component tests

- **Link**: `ui/Link.astro`, `ui/Link.cva.ts`
  - External link handling (`target="_blank"`, `rel="noopener noreferrer"`)
  - Element polymorphism
  - CVA variants for styling

- **Badge**: `ui/Badge.astro`, `ui/Badge.cva.ts`
  - Simple CVA component
  - Color and size variants
  - Clean variant composition

## Layout Primitives

- **Section**: `ui/Section.astro`, `ui/Section.cva.ts`, `ui/Section.test.ts`
  - Vertical padding variants (hero, content, subsection)
  - Background variants (surface, bg)
  - Responsive design patterns

- **Container**: `ui/Container.astro`, `ui/Container.cva.ts`
  - Max-width variants (narrow, default, wide)
  - Horizontal padding patterns
  - Content centering

- **Stack**: `ui/Stack.astro`, `ui/Stack.cva.ts`
  - Directional spacing (vertical & horizontal)
  - Gap size variants (tight, small, medium, large)
  - Using CSS `gap` instead of `space-*`

## Hooks & Lifecycle

- **ThemeToggle**: `features/ThemeToggle.hook.ts`,
  `features/ThemeToggle.hook.test.ts`
  - Complete hook pattern with cleanup
  - `setup*()` and `initialize*()` functions
  - Cleanup function to prevent memory leaks
  - Comprehensive hook tests with lifecycle testing

- **PillToggle**: `ui/PillToggle.hook.ts`, `ui/PillToggle.hook.test.ts`
  - Toggle interaction hook
  - State management
  - Event listener cleanup
  - Hook testing patterns

- **DigitalAnalyzer**: `features/DigitalAnalyzer.hook.ts`
  - Complex hook with state management
  - Multiple event listeners
  - Advanced cleanup patterns

- **Orchestrators**:
  - `components/hooks.ts` (main orchestrator)
  - `ui/hooks.ts` (UI-level orchestrator)
  - `features/hooks.ts` (feature-level orchestrator)
  - Pattern: Each level imports and calls child orchestrators

- **CSS Orchestrators**:
  - `components/hooks.css` (main CSS orchestrator)
  - `ui/hooks.css` (UI-level CSS orchestrator)
  - `features/hooks.css` (feature-level CSS orchestrator)
  - Pattern: Import child `.hook.css` files

## Component Families (Parent + Subcomponents)

### PillToggle Family

- **Parent**: `ui/PillToggle.astro`
- **CVA**: `ui/PillToggle.cva.ts` (contains parent AND subcomponent variants)
- **Subcomponent**: `ui/PillToggleButton.astro` (imports parent CVA)
- **Pattern**: Single `.cva.ts` file for entire family

### DigitalAnalyzer Family

Complex component with multiple supporting files:

- `features/DigitalAnalyzer.astro` (parent)
- `features/DigitalAnalyzer.config.ts` (configuration constants)
- `features/DigitalAnalyzer.types.ts` (TypeScript types)
- `features/DigitalAnalyzer.utils.ts` (utility functions)
- `features/DigitalAnalyzer.hook.ts` (lifecycle management)
- `features/DigitalAnalyzerGrid.astro` (subcomponent)
- `features/DigitalAnalyzerTrace.astro` (subcomponent)

### CuttingMat Family

Large component family example:

- `features/CuttingMat.astro` (parent)
- `features/CuttingMat.config.ts`
- `features/CuttingMat.types.ts`
- 8 subcomponents:
  - `CuttingMatAxes.astro`
  - `CuttingMatGridLines.astro`
  - ... and 6 more

## Testing Patterns

### Component Tests

- `ui/Button.test.ts` - Component rendering, props, polymorphism
- `ui/Link.test.ts` - External link behavior, variants

### Hook Tests

- `ui/PillToggle.hook.test.ts` - Hook lifecycle, cleanup, event listeners
- `features/ThemeToggle.hook.test.ts` - State management, DOM manipulation

### Utils Tests

- `features/DigitalAnalyzer.utils.test.ts` - Pure function testing, edge cases

### Config Tests

- `features/CuttingMat.config.test.ts` - Configuration validation

### Types Tests

- `features/CuttingMat.types.test.ts` - Type guard testing, validation

## When to Use Each Pattern

| Pattern          | Use When                            | Example                     |
| ---------------- | ----------------------------------- | --------------------------- |
| Simple Component | Single component, variants needed   | Button, Badge, Link         |
| Layout Primitive | Spacing/layout abstraction          | Section, Container, Stack   |
| Component Family | Parent + multiple subcomponents     | PillToggle, DigitalAnalyzer |
| Hook             | View Transitions + global listeners | ThemeToggle, PillToggle     |
| Utils file       | 3+ helper functions                 | DigitalAnalyzer.utils.ts    |
| Config file      | 3+ configuration constants          | DigitalAnalyzer.config.ts   |
| Types file       | 3+ custom TypeScript types          | DigitalAnalyzer.types.ts    |
