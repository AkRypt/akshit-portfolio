import { neon } from "@neondatabase/serverless"

export function getSql() {
  const url = process.env.DATABASE_URL
  if (!url) return null
  return neon(url)
}

export function databaseConfigured() {
  return Boolean(process.env.DATABASE_URL)
}

let schemaReady: Promise<void> | null = null

/** Idempotent schema bootstrap for serverless deploys. */
export async function ensureAnalyticsSchema() {
  const sql = getSql()
  if (!sql) throw new Error("DATABASE_URL is not configured")

  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          label TEXT,
          path TEXT,
          href TEXT,
          meta JSONB,
          ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await sql`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS visitor_hash TEXT`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_ts_idx ON analytics_events (ts DESC)`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_name_idx ON analytics_events (name)`
      await sql`CREATE INDEX IF NOT EXISTS analytics_events_visitor_idx ON analytics_events (visitor_hash, ts DESC)`
    })().catch((error) => {
      schemaReady = null
      throw error
    })
  }

  await schemaReady
}
