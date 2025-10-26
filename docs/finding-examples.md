# Finding Examples in the Codebase

> Search patterns for finding implementation examples

## Quick Reference

| Looking for...              | Search Pattern                                             | Primary Examples             |
| --------------------------- | ---------------------------------------------------------- | ---------------------------- |
| Simple component            | `Glob: **/Button*`                                         | Button, Link, Badge          |
| Component family            | `Glob: **/PillToggle*`                                     | PillToggle, PillToggleButton |
| Complex component           | `Glob: **/DigitalAnalyzer*`                                | DigitalAnalyzer (features/)  |
| All CVA files               | `Glob: **/*.cva.ts`                                        |                              |
| All hooks                   | `Glob: **/*.hook.ts`                                       |                              |
| All tests                   | `Glob: **/*.test.ts`                                       |                              |
| CVA variant definitions     | `Grep: "cva\("`                                            |                              |
| Cleanup patterns            | `Grep: "cleanup.*null"`                                    |                              |
| Hook selectors              | `Grep: "data-"`                                            |                              |
| Type guards                 | `Grep: "value is"`                                         |                              |
| Layout primitives           | `Glob: **/Section.astro`, `Container.astro`, `Stack.astro` |                              |
| Generic UI components       | `Glob: **/ui/*.astro`                                      | ui/ directory                |
| Feature-specific components | `Glob: **/features/*.astro`                                | features/ directory          |
| Page layouts                | `Glob: **/pages/*.astro`                                   | pages/ directory             |

## Directory Structure

```txt
src/components/
├── ui/              # Generic, reusable components
├── features/        # Feature-specific components
└── pages/           # Page-level components
```

## File Naming Patterns

| Pattern      | Example                  |
| ------------ | ------------------------ |
| Component    | `Button.astro`           |
| Subcomponent | `PillToggleButton.astro` |
| CVA variants | `Button.cva.ts`          |
| Hook         | `Button.hook.ts`         |
| Test         | `Button.test.ts`         |
| Utils        | `Component.utils.ts`     |
| Config       | `Component.config.ts`    |
| Types        | `Component.types.ts`     |

## Component File Organization

**Simple component:**

```txt
Button.astro, Button.cva.ts, Button.test.ts
```

**Component family:**

```txt
PillToggle.astro, PillToggleButton.astro, PillToggle.cva.ts (contains both), PillToggle.hook.ts
```

**Complex component:**

```txt
DigitalAnalyzer.astro, DigitalAnalyzer.config.ts, DigitalAnalyzer.types.ts,
DigitalAnalyzer.utils.ts, DigitalAnalyzer.hook.ts, (+ tests for each)
```
