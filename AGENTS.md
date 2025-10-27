# AGENTS.md

> Architecture documentation and rules for AI agents working on this codebase.

## ⚠️ CRITICAL: Mandatory Compliance

ALL rules documented here are MANDATORY. Violating them causes production
failures, memory leaks, failed CI/CD, and blocked merges.

**Before ANY changes:**

1. Load relevant docs from Documentation Map below
2. Search codebase for similar patterns (Glob/Grep)
3. Follow patterns EXACTLY
4. Run `npm run autofix && npm run ci` before committing
5. NEVER use `git commit --no-verify`

**When uncertain: STOP and ASK. Do NOT guess.**

---

## 📖 Documentation Map

| Working On...                       | Read Documentation       |
| ----------------------------------- | ------------------------ |
| Creating components, naming, CVA    | docs/components.md       |
| Hooks, lifecycle, View Transitions  | docs/hooks.md            |
| Styling, layout primitives, tokens  | docs/styling.md          |
| Design system layers, colors, theme | docs/styling.md          |
| Writing tests, TDD, coverage        | docs/testing.md          |
| Git workflow, commits, CI pipeline  | docs/git-workflow.md     |
| Finding examples, searching code    | docs/finding-examples.md |
| Troubleshooting common issues       | docs/troubleshooting.md  |

---

## Priority Levels

| Priority | Can Deviate? | If Deviating...                                   |
| -------- | ------------ | ------------------------------------------------- |
| **P0**   | ❌ Never     | Do not proceed. Ask user to clarify requirements. |
| **P1**   | ⚠️ Rarely    | Ask for approval BEFORE deviating.                |
| **P2**   | ✅ Sometimes | Use judgment. Ask if uncertain.                   |

### P0 Rules (NEVER VIOLATE)

- View Transitions lifecycle patterns with cleanup functions
- Memory leak prevention (always remove event listeners)
- No `git commit --no-verify`
- Run `npm run autofix && npm run ci` BEFORE committing
- `data-*` attributes for hook selectors (never CSS classes)
- Never modify ESLint config or use disable comments

### P1 Rules (FOLLOW STRICTLY)

- Component structure & naming conventions (PascalCase, subcomponent prefixes)
- CVA file organization (one `.cva.ts` per component family)
- Co-location patterns (related files live together)
- Hook orchestrator pattern (each level has `hooks.ts`)
- Testing requirements for new code (tests before commit)
- File naming conventions (`Component.hook.ts`, `Component.cva.ts`, etc.)
- Import aliases (use `@/*` instead of relative paths from `src/`)
- Layout primitives for spacing (Section, Container, Stack)
- Type guards over type assertions (use `src/utils/typeGuards.ts`)
- 3-layer architecture: primitives (domain-free) → features (domain-specific) →
  pages
- Primitives interface with Tailwind; features/pages interface with primitives
  only
- Ad-hoc classes in features/pages indicate missing primitives - refactor
  required
- Component props must be semantic, never Tailwind pass-through (e.g.,
  columns="3" not "2fr 140px 3fr")

### P2 Rules (USE JUDGMENT)

- Coverage percentages: Utils 100%, Hooks 90%, Components 80%
- Optional file creation thresholds (3+ items)
- Documentation style preferences
- Opportunistic refactoring

---

## Architecture Overview

**Stack:**

- Astro 5.14.7 with View Transitions
- Tailwind CSS v4 + inline utility classes
- 3-layer color token architecture (OKLCH → theme mappings → semantic tokens)
- class-variance-authority (CVA)
- TypeScript 5+, Vitest, ESLint, Prettier, Husky

**Component Organization:**

```txt
src/components/
├── ui/              # Generic, reusable UI components
│   └── hooks.ts     # UI hooks orchestrator
├── features/        # Feature-specific components
│   └── hooks.ts     # Feature hooks orchestrator
├── pages/           # Page-level components
└── hooks.ts         # Main hooks orchestrator
```

---

## Common Commands

```bash
npm run dev          # Start dev server
npm run autofix      # Auto-fix formatting + linting
npm run ci           # Full CI pipeline (REQUIRED before commit)
git commit           # Commit (hooks run automatically, never use --no-verify)
```

---

## Summary

**For ANY task:**

1. Check Documentation Map - load relevant docs FIRST
2. Search for examples - use Glob/Grep patterns
3. Follow patterns EXACTLY - don't deviate from P0/P1 without approval
4. Run checks before committing - `npm run autofix && npm run ci`
5. Ask when uncertain - better to ask than to guess

**Last Updated:** 2025-10-26
