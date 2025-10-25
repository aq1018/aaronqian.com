# Git Commit Workflow & CI

> Complete guide for git workflow, pre-commit checks, and CI pipeline.

## 🚨 MANDATORY (P0) 🚨

**NEVER use `git commit --no-verify`**

Pre-commit hooks are mandatory and exist to prevent broken code from being
committed.

## Pre-Commit Sequence

**Run ALL checks locally BEFORE committing to avoid hook failure loops.**

| File Type                                    | Workflow                                |
| -------------------------------------------- | --------------------------------------- |
| **Code** (`.ts`, `.astro`, `.css`)           | `npm run autofix && npm run ci`         |
| **Root docs** (AGENTS.md, README.md)         | `npm run autofix`                       |
| **Content markdown** (`src/content/**/*.md`) | `npm run autofix && npm run type-check` |

### Why This Order Matters

1. **`npm run autofix`** - Auto-fixes formatting and linting issues
2. **`npm run ci`** - Runs full test suite, type-check, and build

Running `ci` AFTER `autofix` ensures all auto-fixable issues are resolved before
running the expensive full pipeline.

## `npm run ci` Pipeline

Runs the complete CI pipeline locally:

```bash
npm run ci
# Equivalent to:
npm run test:run &&
npm run format:check &&
npm run type-check &&
npm run lint &&
npm run build
```

All commands must pass. If any fail, fix the issues before committing.

## Pre-commit Hooks (Husky)

Automatically run on staged files when you run `git commit`:

### What Runs

**For `*.{ts,astro}` files**:

1. Prettier (format)
2. Astro check (type-check)
3. ESLint (lint)

**For `*.{css,json,md}` files**:

1. Prettier (format)

### Hook Behavior

- ✅ Hooks run automatically on `git commit`
- ✅ Only run on **staged files** (files you're committing)
- ✅ Hooks must pass for commit to succeed
- ❌ **NEVER** bypass with `--no-verify`

### If Hooks Fail

1. **Read the error message** - It tells you what's wrong
2. **Fix the issue** - Edit the file(s) to resolve the error
3. **Stage the fix**: `git add <file>`
4. **Try committing again**: `git commit`

**Common mistakes**:

- ❌ Running `git commit --no-verify` to skip hooks
- ❌ Not running `npm run ci` before committing
- ❌ Only running individual commands instead of full `ci` pipeline

**Correct workflow**:

```bash
# 1. Make changes
# 2. Run checks BEFORE committing
npm run autofix && npm run ci

# 3. If all pass, stage and commit
git add .
git commit -m "Your commit message"

# 4. Hooks run automatically - if they fail, fix and repeat
```

## Common Commands

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
npm run test         # Run tests (watch mode)
npm run test:run     # Run tests (once)
npm run build        # Build for production

# Git (Never use --no-verify!)
git add .
git commit -m "message"  # Commit (hooks run automatically)
git push
```

## CI Pipeline (GitHub Actions)

When you push to GitHub, the full CI pipeline runs:

1. **Tests** - Vitest (`npm run test:run`) ← **MUST PASS**
2. **Format check** - Prettier (`npm run format:check`)
3. **Type check** - Astro check (`npm run type-check`)
4. **Linting** - ESLint (`npm run lint`)
5. **Build** - Astro build (`npm run build`)

All must pass before merging. No exceptions.

### Why Run CI Locally First?

Running `npm run ci` locally BEFORE pushing:

- ✅ Catches issues before they reach CI
- ✅ Faster feedback loop (no waiting for GitHub Actions)
- ✅ Prevents broken builds
- ✅ Saves CI minutes

## Commit Message Guidelines

**Format**: Use conventional commits when possible

```text
<type>: <description>

[optional body]

[optional footer]
```

**Types**:

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring (no behavior change)
- `test:` - Adding or updating tests
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `chore:` - Maintenance tasks (dependencies, config, etc.)

**Examples**:

```bash
git commit -m "feat: add dark mode toggle to navigation"
git commit -m "fix: resolve memory leak in ThemeToggle hook"
git commit -m "refactor: extract Button variants to CVA file"
git commit -m "test: add comprehensive tests for PillToggle hook"
```

## Working with Branches

### Creating a Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Or
git switch -c feature/your-feature-name
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation changes

**Examples**:

- `feature/add-dropdown-component`
- `fix/theme-toggle-memory-leak`
- `refactor/extract-button-variants`
- `docs/update-testing-guide`

### Merging Branches

```bash
# Switch to main
git checkout main

# Merge feature branch
git merge feature/your-feature-name

# Delete merged branch
git branch -d feature/your-feature-name
```

## Troubleshooting

### Pre-commit hook failing repeatedly?

**Problem**: Hooks keep failing even though you ran `npm run ci`

**Solution**:

1. Make sure you ran `npm run autofix` FIRST
2. Then run `npm run ci` to verify everything passes
3. Stage ALL changes: `git add .`
4. Try committing again

**Common cause**: Autofix made changes but you didn't stage them.

### Tests pass locally but fail in CI?

**Problem**: `npm run test` passes but CI fails

**Solution**:

- Run `npm run test:run` (not `npm run test`)
- Or better: Run `npm run ci` which includes `test:run`

**Why**: Watch mode (`npm run test`) may cache results. CI runs fresh.

### ESLint errors that autofix can't fix?

**Solution**: See docs/troubleshooting.md for ESLint-specific fixes.

Most ESLint errors require proper typing, not disable comments.

### Type errors from Astro check?

**Solution**:

1. Check the error message for the file and line number
2. Fix the TypeScript type issue
3. Re-run `npm run type-check` to verify
4. Stage and commit the fix

**Never**: Use `@ts-ignore` or `@ts-expect-error` unless absolutely necessary

### Build failing but dev works?

**Problem**: `npm run dev` works but `npm run build` fails

**Common causes**:

- Import errors (case sensitivity on Linux/CI)
- Missing dependencies
- Environment variable issues
- TypeScript errors ignored in dev mode

**Solution**:

1. Run `npm run build` locally
2. Fix the error shown
3. Verify build passes before committing

## Best Practices

### Before Every Commit

```bash
# 1. Auto-fix what can be auto-fixed
npm run autofix

# 2. Run full CI pipeline
npm run ci

# 3. If all pass, commit
git add .
git commit -m "your message"
```

### Daily Workflow

```bash
# Morning: Pull latest changes
git pull

# During work: Run dev server
npm run dev

# Before commit: Run checks
npm run autofix && npm run ci

# Commit and push
git add .
git commit -m "your message"
git push
```

### Working on Large Features

For complex features (4+ files, see AGENTS.md for delegation guidance):

1. Create feature branch
2. Work in small commits (each passing CI)
3. Merge back to main when complete
4. Delete feature branch

**Never**: Accumulate days of changes without committing. Commit frequently,
keep commits small.

## Git Commands Quick Reference

```bash
# Status and changes
git status                  # Show working tree status
git diff                    # Show unstaged changes
git diff --staged           # Show staged changes

# Staging
git add <file>              # Stage specific file
git add .                   # Stage all changes
git reset <file>            # Unstage specific file

# Committing
git commit -m "message"     # Commit with message
git commit --amend          # Amend last commit (use sparingly)

# Branches
git branch                  # List branches
git checkout <branch>       # Switch branch
git checkout -b <branch>    # Create and switch to new branch
git branch -d <branch>      # Delete branch (merged)
git branch -D <branch>      # Force delete branch

# Remote
git pull                    # Pull latest changes
git push                    # Push commits to remote
git push -u origin <branch> # Push new branch and set upstream

# History
git log                     # Show commit history
git log --oneline           # Compact commit history
git log --graph             # Visual branch history
```

## Summary

1. **Always run `npm run autofix && npm run ci` before committing**
2. **Never use `--no-verify`**
3. **Keep commits small and focused**
4. **Write clear commit messages**
5. **Fix issues locally before pushing**

Following this workflow ensures code quality and prevents CI failures.
