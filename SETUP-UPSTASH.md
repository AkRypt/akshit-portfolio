# Analytics setup (Neon Postgres)

`/admin` and event tracking use **Neon Postgres**, not Upstash Redis / Vercel Analytics.

## Required env vars

```
DATABASE_URL=postgresql://...          # pooled — from `neon env pull`
DATABASE_URL_UNPOOLED=postgresql://... # optional, for migrations
NEON_BRANCH=production
ADMIN_PASSWORD=your-long-password
GROQ_API_KEY=...                       # chatbot
```

Local: already pulled into `.env.local` via `neon deploy` / `neon env pull`.  
Production: add the same vars in Vercel → Project → Settings → Environment Variables, then redeploy.

## What gets tracked

| Event | When |
| --- | --- |
| `page_view` | Route changes |
| `resume_download` | Resume PDF clicks |
| `link_click` | External / mailto links |
| `chat_open` | Chat widget opened |
| `chat_message` | Each user message to the AI |
| `site_toggle` | 3D ↔ Classic switch |

View at `/admin` with `ADMIN_PASSWORD`.

## Healthcheck

```bash
node scripts/check-neon.mjs
```

## Old Redis vars

`KV_*` / `REDIS_URL` / Upstash tokens are unused now. Safe to delete from `.env.local` and Vercel.
