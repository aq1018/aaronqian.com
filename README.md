# aaronqian.com

Personal website built with [Hugo](https://gohugo.io/) and deployed to
[Cloudflare Pages](https://pages.cloudflare.com/).

This site was previously built with Astro. I wanted to focus on writing instead
of updating dependencies and waiting for long builds, so I dropped the
Astro/TypeScript/ESLint/MDX stack and simplified it to plain HTML/CSS with Hugo.
If you are looking for the old Astro-based code, check out the
[`legacy-astro`](https://github.com/aq1018/aaronqian.com/tree/legacy-astro) tag.

## Development

```
hugo server -D
```

## Build

```
hugo
```

## Deploy

The site is deployed as a Cloudflare Pages static asset. The built output lives
in `public/`.
