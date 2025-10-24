---
date: 2024-11-20T11:30:00-08:00
title: 'Notion CMS integrated'
tags:
  - cms
  - content
project: 'linweisbruch'
---

Client wanted to edit listings without touching code. Built Notion → Next.js
sync.

Setup:

- Notion database for listings (address, price, photos, description)
- API pulls data at build time
- Incremental Static Regeneration (ISR) for updates

Client workflow:

1. Add/edit row in Notion
2. Wait ~60s for rebuild
3. Changes live

No GitHub, no Vercel dashboard. Just Notion.

Client loves it. Update frequency went from monthly → weekly.
