# aaronqian.com

Personal website built with Astro 5, featuring View Transitions and a robust
component architecture.

🌐 **Live Site**:
[aaronqian.com](https://aaronqian.com/?utm_source=github&utm_medium=social&utm_campaign=brand-evergreen-2025&utm_content=website-repo)

## ✨ Features

- **🚀 Astro 5** - Modern static site generation with View Transitions
- **⚡ Vanilla JavaScript** - Zero React/framework overhead, just TypeScript
- **☁️ Cloudflare Workers** - Automated CI/CD deployment pipeline
- **🎨 Tailwind CSS v4** - Utility-first styling with custom design tokens
- **🧩 Modular Architecture** - CVA variants, layout primitives, type-safe
  components
- **✅ Type-Safe** - Full TypeScript coverage with strict mode
- **🧪 Comprehensive Testing** - Vitest + Testing Library with high coverage
  standards

## 🚀 Getting Started

**Prerequisites**: Node.js 22.20.0+

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` to see your site.

## 🧞 Commands

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm install`     | Install dependencies                 |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run preview` | Preview production build locally     |
| `npm run autofix` | Auto-fix formatting and linting      |
| `npm run ci`      | Run full CI pipeline                 |

## 🚢 Deployment

Deployed to **Cloudflare Workers** via automated CI/CD pipeline on push to
`main`.

## 📚 Documentation

Architecture patterns and development guidelines:

- **[AGENTS.md](AGENTS.md)** - Core architectural rules and mandatory compliance
- **[docs/components.md](docs/components.md)** - Component patterns and
  organization
- **[docs/styling.md](docs/styling.md)** - Styling philosophy and design tokens
- **[docs/hooks.md](docs/hooks.md)** - Hook patterns and View Transitions
- **[docs/testing.md](docs/testing.md)** - Testing requirements and best
  practices
- **[docs/git-workflow.md](docs/git-workflow.md)** - Git workflow and CI/CD
  pipeline
- **[docs/finding-examples.md](docs/finding-examples.md)** - Guide to finding
  examples in codebase
- **[docs/troubleshooting.md](docs/troubleshooting.md)** - Common issues and
  solutions

## 📄 License

MIT
