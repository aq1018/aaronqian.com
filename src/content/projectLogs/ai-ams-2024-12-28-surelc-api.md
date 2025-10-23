---
date: 2024-12-28T13:45:00-08:00
title: 'SureLC API exploration'
tags: ['api', 'integration']
project: 'ai-ams'
---

Digging into SureLC's API docs. Not great. REST-ish, but inconsistent.

Endpoints found:

- `/clients` - CRUD for client records
- `/policies` - List policies, update status
- `/commissions` - Read-only (good for reconciliation)

Authentication: OAuth 2.0 (Client Credentials flow).

No webhook support. Need to poll for changes.

Rate limit: 100 req/min. Should be fine for small agencies.

Next: Build proof-of-concept sync script (SureLC → Google Sheets).
