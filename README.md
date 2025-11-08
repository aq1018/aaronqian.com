# aaronqian.com

Personal website built with Astro 5, featuring View Transitions, a robust
component architecture, and comprehensive testing.

🌐 **Live Site**: [aaronqian.com](https://aaronqian.com)

## ✨ Features

- **🚀 Astro 5** - Modern static site generation with View Transitions
- **🎨 Tailwind CSS v4** - Utility-first styling with custom design tokens
- **🧩 Component Architecture** - Modular UI components with CVA variants
- **✅ Type-Safe** - Full TypeScript coverage with strict mode
- **🧪 Comprehensive Testing** - Vitest + Testing Library (698 passing tests)
- **📐 Layout Primitives** - Section, Container, Stack for consistent spacing
- **🎯 oxlint + Prettier** - Enforced code quality and formatting
- **🔄 View Transitions** - Smooth page transitions with proper lifecycle
  management
- **♿ Accessible** - WCAG AA compliant with semantic HTML

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── ui/              # Generic UI components (Button, Link, Badge)
│   │   ├── features/        # Feature components (Navigation, ThemeToggle)
│   │   └── pages/           # Page-level components (HomeHero, BlogIndex)
│   ├── content/
│   │   ├── blog/            # Blog posts (Markdown + frontmatter)
│   │   ├── projects/        # Project metadata
│   │   └── projectLogs/     # Project development logs
│   ├── layouts/             # Page layouts
│   ├── pages/               # Astro pages (file-based routing)
│   └── styles/              # Global styles
├── docs/                    # Documentation for AI agents
│   ├── components.md        # Component patterns and architecture
│   ├── hooks.md             # Hook patterns and View Transitions
│   ├── styling.md           # Styling philosophy and design tokens
│   ├── testing.md           # Testing guidelines and TDD
│   ├── git-workflow.md      # Git workflow and CI/CD
│   ├── finding-examples.md  # How to find examples in codebase
│   └── troubleshooting.md   # Common issues and solutions
└── AGENTS.md                # Core rules for AI agents
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/aq1018/aaronqian.com.git
cd aaronqian.com

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see your site.

## 🧞 Commands

| Command                | Action                                                     |
| :--------------------- | :--------------------------------------------------------- |
| `npm install`          | Install dependencies                                       |
| `npm run dev`          | Start dev server at `localhost:4321`                       |
| `npm run build`        | Build production site to `./dist/`                         |
| `npm run preview`      | Preview build locally before deploying                     |
| `npm run test`         | Run tests in watch mode                                    |
| `npm run test:run`     | Run tests once (CI mode)                                   |
| `npm run lint`         | Check linting                                              |
| `npm run lint:fix`     | Fix linting issues                                         |
| `npm run format`       | Format code with Prettier                                  |
| `npm run format:check` | Check code formatting                                      |
| `npm run type-check`   | Check TypeScript types                                     |
| `npm run autofix`      | Auto-fix formatting + linting                              |
| `npm run ci`           | Run full CI pipeline (test + format + type + lint + build) |

## 🏗️ Component Architecture

This project follows strict architectural patterns documented in `AGENTS.md` and
`docs/`:

### Component Types

- **UI Components** (`src/components/ui/`) - Generic, reusable components
- **Feature Components** (`src/components/features/`) - Feature-specific
  components
- **Page Components** (`src/components/pages/`) - Page-level layouts

### File Organization

Each component follows co-location principles:

```text
Component.astro          # Template and markup
Component.cva.ts         # CVA variant definitions (if needed)
Component.hook.ts        # Global lifecycle management (if needed)
Component.test.ts        # Component tests (required)
Component.utils.ts       # Utility functions (if 3+)
Component.config.ts      # Configuration (if 3+)
Component.types.ts       # Type definitions (if 3+)
```

### Example Components

- **Button** - Element polymorphism, CVA variants, accessibility
- **Link** - External link handling, security
- **Section/Container/Stack** - Layout primitives for consistent spacing
- **ThemeToggle** - View Transitions lifecycle, state management
- **PillToggle** - Toggle UI with animated slider

See `docs/finding-examples.md` to learn how to search for examples in the
codebase.

## 🎨 Styling Philosophy

1. **Tailwind inline classes** - Primary styling method
2. **`<style>` blocks** - Component-specific CSS and animations
3. **`Component.css` files** - Rare, for shared CSS across component family

### Layout Primitives

Always use layout primitives for spacing:

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

See `docs/styling.md` for complete styling guidelines.

## 🧪 Testing

This project maintains high test coverage with strict requirements:

- **698 passing tests** across components, hooks, and utilities
- **Coverage targets**: Utils 100%, Hooks 90%+, Components 80%+
- **TDD workflow** recommended for new features

All new code requires tests before commit. See `docs/testing.md` for guidelines.

## 🔄 View Transitions

All interactive components support Astro View Transitions with proper lifecycle
management:

```typescript
// Hook pattern with cleanup to prevent memory leaks
export function setupComponent(): void {
  initializeComponent()
  document.addEventListener('astro:page-load', initializeComponent)
  document.addEventListener('astro:before-preparation', () => cleanup?.())
}
```

See `docs/hooks.md` for complete hook patterns.

## 🤖 AI-Friendly Codebase

This project is optimized for AI agent collaboration with comprehensive
documentation:

- **AGENTS.md** - Compact core rules (P0/P1 priorities)
- **docs/** - Detailed patterns loaded on-demand
- **50%+ context savings** - Modular docs reduce AI context usage
- **Reference implementations** - Study actual code examples

AI agents should read `AGENTS.md` and load relevant `docs/` files before
working.

## 📦 Tech Stack

- **Framework**: Astro 5.14.7
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript 5+
- **Testing**: Vitest + Testing Library
- **Code Quality**: oxlint + Prettier + Husky
- **Component Variants**: class-variance-authority (CVA)

## 🚢 Deployment

Built as a static site and deployed via your preferred hosting provider. The
build output is in `./dist/`.

```bash
npm run build    # Generate production build
npm run preview  # Preview build locally
```

## 📝 Content Management

- **Blog posts**: Markdown files in `src/content/blog/`
- **Projects**: Metadata in `src/content/projects/`
- **Project logs**: Development logs in `src/content/projectLogs/`

All content uses Astro's Content Collections with type-safe frontmatter.

## 🔧 Development Workflow

Before committing:

```bash
# Auto-fix issues and run full CI pipeline
npm run autofix && npm run ci
```

Pre-commit hooks automatically run tests, linting, and type-checking on staged
files.

**Never use** `git commit --no-verify` - hooks are mandatory for code quality.

See `docs/git-workflow.md` for complete workflow.

## 📚 Documentation

- **AGENTS.md** - Core architecture rules for AI agents
- **docs/components.md** - Component patterns and organization
- **docs/hooks.md** - Hook patterns and View Transitions
- **docs/styling.md** - Styling philosophy and design tokens
- **docs/testing.md** - Testing requirements and best practices
- **docs/git-workflow.md** - Git workflow and CI/CD
- **docs/finding-examples.md** - Guide to finding examples in codebase
- **docs/troubleshooting.md** - Common issues and solutions

## 📄 License

MIT

## 🙏 Acknowledgments

Built with [Astro](https://astro.build) - The web framework for content-driven
websites.
