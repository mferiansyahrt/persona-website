---
title: Feri Site API
emoji: 🤖
colorFrom: yellow
colorTo: red
sdk: docker
app_port: 7860
pinned: false
---

# Feri Personal Site — Backend API

FastAPI + agno (OpenRouter) — talk-to-data AI assistant + agent endpoints tentang Feri.

- Swagger: `/docs` · Health: `/api/health`
- Knowledge base: agentic file retrieval (`knowledge/*.md`)
- Persistensi: Turso (libSQL)

## Secrets (set di Space Settings → Variables and secrets)
- `OPENROUTER_API_KEY`
- `DEFAULT_MODEL` (mis. `deepseek/deepseek-v4-pro:nitro`)
- `DB_BACKEND=turso`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `CORS_ORIGINS` (URL frontend Netlify, mis. `https://feri.netlify.app`)
