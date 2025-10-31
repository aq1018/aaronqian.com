# Git Commit Workflow & CI

> Git workflow, pre-commit checks, and CI pipeline

## 🚨 P0 Rule 🚨

**NEVER use `git commit --no-verify`**

Pre-commit hooks are mandatory.

## Per-File Validation (P0)

**After EVERY file Edit/Write, validate immediately:**

1. Hook auto-runs: `eslint --fix` → `prettier --write` → `eslint` verification
2. YOU verify: `npx tsc --noEmit <file>` or `astro check`
3. If errors: fix and repeat

See AGENTS.md Per-File Validation section.

## Pre-Commit Sequence

**Run checks BEFORE committing:**

| File Type                                    | Workflow                                |
| -------------------------------------------- | --------------------------------------- |
| **Code** (`.ts`, `.astro`, `.css`)           | `npm run autofix && npm run ci`         |
| **Root docs** (AGENTS.md, README.md)         | `npm run autofix`                       |
| **Content markdown** (`src/content/**/*.md`) | `npm run autofix && npm run type-check` |

**Order matters:** Run `autofix` BEFORE `ci` to fix auto-fixable issues first.

## CI Pipeline

```bash
npm run ci
# Runs:
# - npm run test:run
# - npm run format:check
# - npm run type-check
# - npm run lint
# - npm run build
```

All must pass.

## Pre-commit Hooks (Husky)

Automatically run on staged files when you `git commit`.

**For `*.{ts,astro}` files:**

1. Prettier (format)
2. Astro check (type-check)
3. ESLint (lint)

**For `*.{css,json,md}` files:**

1. Prettier (format)

**If hooks fail:**

1. Read error message
2. Fix the issue
3. Stage fix: `git add <file>`
4. Try committing again

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Code Quality (Run BEFORE committing)
npm run autofix      # Auto-fix formatting + linting
npm run ci           # Full CI pipeline (REQUIRED)

# Individual Checks (use ci instead)
npm run lint         # Check linting
npm run lint:fix     # Fix linting
npm run format       # Format code
npm run format:check # Check formatting
npm run type-check   # Check TypeScript
npm run test         # Run tests (watch)
npm run test:run     # Run tests (once)
npm run build        # Build for production

# Git (Never use --no-verify!)
git add .
git commit -m "message"  # Hooks run automatically
git push
```

## Commit Workflow

```bash
# 1. Make changes

# 2. Run checks BEFORE committing
npm run autofix && npm run ci

# 3. If all pass, stage and commit
git add .
git commit -m "Your commit message"

# 4. Hooks run automatically - if they fail, fix and repeat
```

## Commit Message Format

Use conventional commits:

```text
<type>: <description>

[optional body]
```

**Types:** `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `style:`, `chore:`

**Examples:**

```bash
git commit -m "feat: add dark mode toggle to navigation"
git commit -m "fix: resolve memory leak in ThemeToggle hook"
git commit -m "refactor: extract Button variants to CVA file"
```

## Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes

**Examples:**

- `feature/add-dropdown-component`
- `fix/theme-toggle-memory-leak`
- `refactor/extract-button-variants`

## GitHub CI Pipeline

Runs on push. All must pass before merging:

1. Tests (`npm run test:run`)
2. Format check (`npm run format:check`)
3. Type check (`npm run type-check`)
4. Linting (`npm run lint`)
5. Build (`npm run build`)

**Run locally first:** `npm run autofix && npm run ci`

## Troubleshooting

See docs/troubleshooting.md for:

- Pre-commit hook failing repeatedly
- Tests pass locally but fail in CI
- ESLint errors
- Build failing but dev works

## Best Practices

```bash
# Before every commit
npm run autofix && npm run ci
git add .
git commit -m "your message"
```

**Never:**

- Use `--no-verify`
- Run `ci` before `autofix`
- Only run individual commands instead of full `ci`
- Accumulate days of changes without committing

**Always:**

- Commit frequently
- Keep commits small and focused
- Write clear commit messages
- Fix issues locally before pushing
