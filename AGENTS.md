# AGENTS.md

> Architecture documentation and rules for AI agents working on this codebase.

## ⚠️ CRITICAL: Mandatory Compliance

**ALL rules, patterns, and conventions documented in this file are MANDATORY and
MUST be strictly followed.**

Failure to follow these rules will result in:

- ❌ Code that breaks View Transitions
- ❌ Memory leaks and duplicate event listeners
- ❌ Inconsistent component architecture
- ❌ Failed CI/CD pipeline and blocked merges
- ❌ Untested code that will break in production
- ❌ Technical debt and maintenance issues

**Before making ANY changes:**

1. ✅ Read and understand the relevant sections below
2. ✅ **Check the Documentation Map** - Load detailed docs BEFORE working
3. ✅ Follow the documented patterns EXACTLY
4. ✅ Run `npm run autofix && npm run ci` before committing
5. ✅ NEVER use `git commit --no-verify`

**When in doubt:**

1. 🔍 **Look at actual implementation first** - Search the codebase for similar
   patterns
2. 📖 **Study reference implementations** - See docs/references.md
3. 📚 **Read detailed documentation** - Load relevant docs from Documentation
   Map below
4. ❓ **If still uncertain, STOP and ASK** - Do NOT guess or make up patterns

---

## 📖 Documentation Map

**Load detailed documentation BEFORE starting work on any task:**

| Working On...                       | Read Documentation          |
| ----------------------------------- | --------------------------- |
| Creating components, naming, CVA    | **docs/components.md**      |
| Hooks, lifecycle, View Transitions  | **docs/hooks.md**           |
| Styling, layout primitives, tokens  | **docs/styling.md**         |
| Writing tests, TDD, coverage        | **docs/testing.md**         |
| Git workflow, commits, CI pipeline  | **docs/git-workflow.md**    |
| Reference implementations, examples | **docs/references.md**      |
| Troubleshooting common issues       | **docs/troubleshooting.md** |

**These docs contain:**

- Detailed patterns and examples
- Complete implementation guides
- Reference code locations
- Common pitfalls and solutions

---

## Priority Levels & Agent Behavior

This codebase uses a three-tier priority system to help agents understand what's
absolute vs. what requires judgment.

### P0 - NEVER VIOLATE (System breaks if ignored)

**These rules are absolute. Violating them causes production failures.**

- ✅ **View Transitions lifecycle patterns** - Must implement cleanup functions
  to prevent memory leaks → See docs/hooks.md
- ✅ **Memory leak prevention** - Always remove event listeners in cleanup
  functions → See docs/hooks.md
- ✅ **No `git commit --no-verify`** - Pre-commit hooks are mandatory → See
  docs/git-workflow.md
- ✅ **Run `npm run autofix && npm run ci` BEFORE committing** - Fix ALL errors
  locally → See docs/git-workflow.md
- ✅ **`data-*` attributes for hook selectors** - Never use CSS classes as hook
  selectors → See docs/hooks.md
- ✅ **Never modify ESLint config or use disable comments** - Fix errors with
  proper typing → See docs/troubleshooting.md

### P1 - FOLLOW STRICTLY (Required for consistency)

**These rules maintain architecture consistency. Follow them exactly unless you
ask for approval to deviate.**

- ✅ **Component structure & naming conventions** - PascalCase, subcomponent
  prefixes → See docs/components.md
- ✅ **CVA file organization** - One `.cva.ts` per component family → See
  docs/components.md
- ✅ **Co-location patterns** - Related files live together → See
  docs/components.md
- ✅ **Hook orchestrator pattern** - Each level has `hooks.ts` and `hooks.css` →
  See docs/hooks.md
- ✅ **Testing requirements for new code** - New features must have tests before
  commit → See docs/testing.md
- ✅ **File naming conventions** - `Component.hook.ts`, `Component.cva.ts`, etc.
  → See docs/components.md
- ✅ **Import aliases** - Use `@/*` instead of relative paths from `src/` → See
  docs/components.md
- ✅ **Layout primitives for spacing** - Use Section, Container, Stack → See
  docs/styling.md
- ✅ **Type guards over type assertions** - Use or extend
  `src/utils/typeGuards.ts` → See docs/troubleshooting.md

### P2 - USE JUDGMENT (Best practices, ask if deviating)

**These are recommendations. Use good judgment, but ask for approval before
deviating.**

- ✅ **Specific test coverage percentages** - Target: Utils 100%, Hooks 90%,
  Components 80% → See docs/testing.md
- ✅ **Optional file creation thresholds** - When to create `.config.ts`,
  `.types.ts`, `.utils.ts` → See docs/components.md
- ✅ **Documentation style preferences** - Comment formatting, README structure
- ✅ **Opportunistic refactoring** - Improving existing code while working on
  related features

### How Priority Affects Agent Behavior

| Priority | Can Deviate? | If Deviating...                                        |
| -------- | ------------ | ------------------------------------------------------ |
| **P0**   | ❌ Never     | Do not proceed. Ask user to clarify requirements.      |
| **P1**   | ⚠️ Rarely    | Ask for approval BEFORE deviating. Explain reasoning.  |
| **P2**   | ✅ Sometimes | Use judgment. Ask if uncertain whether deviation fits. |

---

## When to Ask vs. Proceed

Understanding when to work autonomously vs. when to ask for guidance is critical
for velocity.

### Proceed Autonomously (No Approval Needed)

**You can proceed directly when:**

- ✅ **Following documented P1 patterns exactly** - Implementing components
  using established patterns
- ✅ **Bug fixes within existing architecture** - Fixing issues without changing
  patterns
- ✅ **Adding tests to existing components** - Improving test coverage
- ✅ **Refactoring that preserves behavior** - Code cleanup without functional
  changes
- ✅ **Documentation updates** - Improving clarity without changing meaning
- ✅ **Styling adjustments** - Using existing design tokens and patterns

### Ask for Approval FIRST

**Stop and ask when:**

- ❓ **Deviating from any P0 or P1 rule** - Need explicit permission
- ❓ **Creating new architectural patterns** - New component types, new file
  structures
- ❓ **Unsure if change qualifies as "complex"** - When delegation threshold is
  unclear
- ❓ **Touching >10 files** - High risk of unintended consequences
- ❓ **Breaking changes to public APIs** - Component props, hook signatures
- ❓ **Changes affecting build process** - Package.json, config files
- ❓ **Uncertain about requirements** - User intent is ambiguous

### Use Delegation (TodoWrite + Task Tool)

**Delegate to sub-agents when:**

- 📋 **Creating new component families** - Multiple related files (parent +
  subcomponents + tests + hooks + CVA)
- 📋 **4+ file changes with complex logic** - Risk of context overflow
- 📋 **Large refactoring across multiple components** - Need coordination and
  oversight
- 📋 **Any task where context might overflow** - Better to delegate than lose
  track

### Work Directly (No Delegation)

**Work directly for:**

- 🔨 **1-3 file edits** - Small enough to manage in main context
- 🔨 **Simple bug fixes** - Straightforward changes
- 🔨 **Documentation updates** - Low complexity
- 🔨 **Adding tests to existing code** - Clear, focused task

---

## AI Context Preservation

**CRITICAL**: Preserve your context window to maintain code quality and avoid
incomplete implementations.

### The Pattern: Planning → Todo List → Delegate

For complex tasks, use this workflow to prevent context overflow:

1. **Enter Planning Mode** - Break down the task into smaller steps
2. **Create Todo List** - Use TodoWrite to track all sub-tasks
3. **Delegate Each Todo** - Use Task tool to delegate each item to a sub-agent
4. **Coordinate Results** - Your main context stays clean for oversight

### When to Use This Pattern

**Use planning mode + delegation for:**

- Creating new component families (multiple related files)
- Large refactoring across multiple components
- Migrating patterns across the codebase
- Any task requiring **4+ file operations OR complex logic**
- Complex multi-step features

**Work directly for:**

- Single file edits
- Quick bug fixes
- Documentation updates
- Simple refactoring (1-3 files)

### Example Workflow

```text
User: "Create a new Dropdown component following our patterns"

Step 1: Enter planning mode, create todo list
[TodoWrite]
- Research PillToggle pattern (delegate to sub-agent)
- Create Dropdown.astro + tests (delegate to sub-agent)
- Create DropdownItem.astro + tests (delegate to sub-agent)
- Create Dropdown.cva.ts with variants (delegate to sub-agent)
- Create Dropdown.hook.ts + tests (delegate to sub-agent)
- Integrate into ui/hooks.ts (do directly - simple)
- Run CI and verify (do directly)

Step 2: Delegate complex sub-tasks
[Task tool] "Research PillToggle pattern and document key patterns"
[Task tool] "Create Dropdown.astro following PillToggle pattern with tests"
[Task tool] "Create DropdownItem.astro subcomponent with tests"
... etc

Step 3: Your context stays clean for coordination and final integration
```

### Why This Matters

**Without delegation:**

- ❌ Context fills up with implementation details
- ❌ Lose track of overall requirements
- ❌ Forget to create necessary files
- ❌ Incomplete implementations

**With delegation:**

- ✅ Main context preserved for high-level coordination
- ✅ Each sub-agent focuses on one clear task
- ✅ Better quality control and oversight
- ✅ Can handle much larger tasks

### Simple Rule

If a task requires more than **4 files OR complex logic**, use planning mode +
todo list + delegation.

---

## Architecture Overview

This is an Astro 5 website using:

- **Framework**: Astro 5.14.7 with View Transitions
- **Styling**: Tailwind CSS v4 + inline utility classes
- **Component Variants**: class-variance-authority (CVA)
- **Type Safety**: TypeScript 5+
- **Testing**: Vitest + Testing Library
- **Quality**: ESLint + Prettier + Husky pre-commit hooks

### Component Organization

```txt
src/components/
├── ui/              # Generic, reusable UI components (Button, Link, Badge, etc.)
│   ├── hooks.ts     # UI hooks orchestrator
│   └── hooks.css    # UI Tailwind directives orchestrator
├── features/        # Feature-specific components (Navigation, ThemeToggle, etc.)
│   ├── hooks.ts     # Feature hooks orchestrator
│   └── hooks.css    # Feature Tailwind directives orchestrator
├── pages/           # Page-level components (HomeHero, BlogIndex, etc.)
├── hooks.ts         # Main hooks orchestrator (imports ui & features)
└── hooks.css        # Main CSS orchestrator (imports ui & features)
```

**Hierarchy**:

- `ui/` → Generic components used across the entire app
- `features/` → Feature-specific components (can import from `ui/`)
- `pages/` → Page-level layouts (can import from `ui/` and `features/`)

**For detailed patterns, see docs/components.md, docs/hooks.md,
docs/styling.md**

---

## Quick Reference

### Creating a New Component

1. **Load docs FIRST**: Read docs/components.md, docs/hooks.md (if interactive),
   docs/styling.md, docs/testing.md
2. **Study references**: See docs/references.md for similar patterns
3. **Tests**: TDD recommended; must have tests before commit → docs/testing.md
4. **Files**: Create `.astro`, `.cva.ts` (if variants), `.hook.ts` (if
   interactive), `.utils.ts`/`.config.ts`/`.types.ts` (if 3+ items)
5. **Implement**: Add to `hooks.ts` orchestrator, support `class` prop
6. **Subcomponents**: Prefix with parent name, import parent's CVA →
   docs/components.md
7. **Before commit**: `npm run autofix && npm run ci` → docs/git-workflow.md
8. **Commit when**: All tests pass, CI passes, coverage targets met

**Critical P0/P1 Rules**:

- ❌ No `--no-verify`, no CSS class selectors in hooks, no separate subcomponent
  CVA files
- ✅ Use `data-*` for hooks, `cn()` for class merging, layout primitives for
  spacing

### Common Commands

```bash
# Development
npm run dev          # Start dev server

# Code Quality (Run BEFORE committing)
npm run autofix      # Auto-fix formatting + linting
npm run ci           # Full CI pipeline (REQUIRED before commit)

# Individual Checks (Use ci instead for pre-commit)
npm run lint         # Check linting
npm run lint:fix     # Fix linting
npm run format       # Format code
npm run format:check # Check formatting
npm run type-check   # Check TypeScript
npm run test         # Run tests (watch)
npm run test:run     # Run tests (once)
npm run build        # Build for production

# Git (Never use --no-verify!)
git commit           # Commit (hooks run automatically)
```

### Priority Reference

| Rule                              | Priority | Can Deviate?    | See Docs                |
| --------------------------------- | -------- | --------------- | ----------------------- |
| View Transitions lifecycle        | P0       | ❌ Never        | docs/hooks.md           |
| Run autofix && ci before commit   | P0       | ❌ Never        | docs/git-workflow.md    |
| No `--no-verify`                  | P0       | ❌ Never        | docs/git-workflow.md    |
| No ESLint config edits or disable | P0       | ❌ Never        | docs/troubleshooting.md |
| Component naming conventions      | P1       | ⚠️ Ask first    | docs/components.md      |
| CVA file organization             | P1       | ⚠️ Ask first    | docs/components.md      |
| Use `cn()` for class merging      | P1       | ⚠️ Ask first    | docs/components.md      |
| Layout primitives for spacing     | P1       | ⚠️ Ask first    | docs/styling.md         |
| Testing for new code              | P1       | ⚠️ Ask first    | docs/testing.md         |
| Type guards over assertions       | P1       | ⚠️ Ask first    | docs/troubleshooting.md |
| Specific coverage percentages     | P2       | ✅ Use judgment | docs/testing.md         |
| Optional file creation thresholds | P2       | ✅ Use judgment | docs/components.md      |

### Decision Flowchart

**Delegate?** 4+ files OR complex logic = Yes. 1-3 simple files = No.

**Ask approval?** Deviating from P0/P1 = Yes. Following patterns = No.

**Layout?** Section/Container/Stack for layout. Inline for component-internal. →
docs/styling.md

**.hook.css?** Tailwind directives = Yes. Regular CSS = `<style>` in .astro. →
docs/styling.md

**`.hook.ts`?** View Transitions + multiple pages = Yes. One-off = `<script>`. →
docs/hooks.md

**Which doc to load?** See Documentation Map at top of this file.

---

## Summary

This codebase values strict adherence to patterns, co-location, type safety,
testing discipline, memory safety (cleanup functions), and accessibility.

**Remember**: These strict patterns prevent production failures, memory leaks,
and technical debt.

**When working on ANY task:**

1. ✅ **Check Documentation Map** - Load relevant detailed docs FIRST
2. ✅ **Study reference implementations** - See docs/references.md
3. ✅ **Follow patterns EXACTLY** - Don't deviate from P0/P1 without approval
4. ✅ **Run checks before committing** - `npm run autofix && npm run ci`
5. ✅ **Ask when uncertain** - Better to ask than to guess

---

**Last Updated**: 2025-10-24 **Maintained By**: AI Agents working on this
codebase
