import { ensureAnalyticsSchema, getSql, databaseConfigured } from "./db"

export type AnalyticsEventName =
  | "page_view"
  | "chat_open"
  | "chat_message"
  | "resume_download"
  | "link_click"
  | "site_toggle"

export type AnalyticsEvent = {
  id: string
  name: AnalyticsEventName | string
  label?: string
  path?: string
  href?: string
  meta?: Record<string, string | number | boolean | null | undefined>
  ts: string
}

const MAX_EVENTS = 2000

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export async function trackEvent(input: {
  name: string
  label?: string
  path?: string
  href?: string
  meta?: Record<string, string | number | boolean | null | undefined>
}): Promise<{ ok: boolean; reason?: string }> {
  const sql = getSql()
  if (!sql) return { ok: false, reason: "database_not_configured" }

  const event: AnalyticsEvent = {
    id: id(),
    name: input.name,
    label: input.label?.slice(0, 200),
    path: input.path?.slice(0, 300),
    href: input.href?.slice(0, 500),
    meta: input.meta,
    ts: new Date().toISOString(),
  }

  try {
    await ensureAnalyticsSchema()
    await sql`
      INSERT INTO analytics_events (id, name, label, path, href, meta, ts)
      VALUES (
        ${event.id},
        ${event.name},
        ${event.label ?? null},
        ${event.path ?? null},
        ${event.href ?? null},
        ${JSON.stringify(event.meta ?? {})},
        ${event.ts}
      )
    `

    // Keep table bounded
    await sql`
      DELETE FROM analytics_events
      WHERE id IN (
        SELECT id FROM (
          SELECT id FROM analytics_events
          ORDER BY ts DESC
          OFFSET ${MAX_EVENTS}
        ) old
      )
    `

    return { ok: true }
  } catch (error) {
    console.error("trackEvent failed:", error)
    return { ok: false, reason: "database_write_failed" }
  }
}

export async function logChatQuestion(question: string, meta?: { source?: string }) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] Question: ${question.slice(0, 200)}`)

  await trackEvent({
    name: "chat_message",
    label: question.slice(0, 120),
    meta: {
      question: question.slice(0, 2000),
      source: meta?.source ?? null,
    },
  })
}

export type AnalyticsSummary = {
  configured: boolean
  totals: Record<string, number>
  recent: AnalyticsEvent[]
  chats: Array<{ id: string; ts: string; question: string }>
  topLinks: Array<{ label: string; count: number }>
  message: string
}

export async function getAnalyticsSummary(limit = 150): Promise<AnalyticsSummary> {
  if (!databaseConfigured()) {
    return {
      configured: false,
      totals: {},
      recent: [],
      chats: [],
      topLinks: [],
      message:
        "Neon DATABASE_URL is not configured. Add it to .env.local and Vercel (neon env pull / neon deploy).",
    }
  }

  const sql = getSql()
  if (!sql) {
    return {
      configured: false,
      totals: {},
      recent: [],
      chats: [],
      topLinks: [],
      message: "DATABASE_URL is not configured.",
    }
  }

  try {
    await ensureAnalyticsSchema()

    const recentRows = (await sql`
      SELECT id, name, label, path, href, meta, ts
      FROM analytics_events
      ORDER BY ts DESC
      LIMIT ${limit}
    `) as Array<{
      id: string
      name: string
      label: string | null
      path: string | null
      href: string | null
      meta: Record<string, unknown> | null
      ts: string
    }>

    const countRows = (await sql`
      SELECT name, COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY name
    `) as Array<{ name: string; count: number }>

    const linkRows = (await sql`
      SELECT COALESCE(label, href, 'unknown') AS label, COUNT(*)::int AS count
      FROM analytics_events
      WHERE name = 'link_click'
      GROUP BY 1
      ORDER BY count DESC
      LIMIT 20
    `) as Array<{ label: string; count: number }>

    const totals: Record<string, number> = {}
    for (const row of countRows) totals[row.name] = row.count

    const recent: AnalyticsEvent[] = recentRows.map((row) => ({
      id: row.id,
      name: row.name,
      label: row.label ?? undefined,
      path: row.path ?? undefined,
      href: row.href ?? undefined,
      meta: (row.meta ?? undefined) as AnalyticsEvent["meta"],
      ts: typeof row.ts === "string" ? row.ts : new Date(row.ts).toISOString(),
    }))

    const chats = recent
      .filter((e) => e.name === "chat_message")
      .map((e) => ({
        id: e.id,
        ts: e.ts,
        question: String(e.meta?.question || e.label || ""),
      }))
      .filter((c) => c.question)

    return {
      configured: true,
      totals,
      recent,
      chats,
      topLinks: linkRows.map((r) => ({ label: r.label, count: r.count })),
      message: `Loaded ${recent.length} recent events from Neon`,
    }
  } catch (error) {
    console.error("getAnalyticsSummary failed:", error)
    const detail = error instanceof Error ? error.message : "unknown error"
    throw new Error(`Neon read failed: ${detail}`)
  }
}
