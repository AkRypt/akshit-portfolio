import { ensureAnalyticsSchema, getSql, databaseConfigured } from "./db"
import type { GeoInfo } from "./geo"

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
  city?: string
  region?: string
  country?: string
  location?: string
}

const MAX_EVENTS = 2000

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function withGeo(
  meta: Record<string, string | number | boolean | null | undefined> | undefined,
  geo?: GeoInfo
) {
  if (!geo) return meta
  return {
    ...(meta || {}),
    city: geo.city ?? null,
    region: geo.region ?? null,
    country: geo.countryCode || geo.country || null,
    location: geo.label,
  }
}

export async function trackEvent(input: {
  name: string
  label?: string
  path?: string
  href?: string
  meta?: Record<string, string | number | boolean | null | undefined>
  geo?: GeoInfo
}): Promise<{ ok: boolean; reason?: string }> {
  const sql = getSql()
  if (!sql) return { ok: false, reason: "database_not_configured" }

  const meta = withGeo(input.meta, input.geo)
  const event: AnalyticsEvent = {
    id: id(),
    name: input.name,
    label: input.label?.slice(0, 200),
    path: input.path?.slice(0, 300),
    href: input.href?.slice(0, 500),
    meta,
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

export async function logChatQuestion(
  question: string,
  meta?: { source?: string },
  geo?: GeoInfo
) {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] Question: ${question.slice(0, 200)}`)

  await trackEvent({
    name: "chat_message",
    label: question.slice(0, 120),
    meta: {
      question: question.slice(0, 2000),
      source: meta?.source ?? null,
    },
    geo,
  })
}

export type LocationStat = {
  location: string
  country?: string
  city?: string
  count: number
}

export type AnalyticsSummary = {
  configured: boolean
  totals: Record<string, number>
  recent: AnalyticsEvent[]
  chats: Array<{ id: string; ts: string; question: string; location?: string }>
  topLinks: Array<{ label: string; count: number }>
  locations: LocationStat[]
  message: string
}

function eventLocation(meta: Record<string, unknown> | null | undefined) {
  if (!meta) return undefined
  if (typeof meta.location === "string" && meta.location) return meta.location
  const parts = [meta.city, meta.region, meta.country].filter((p) => typeof p === "string" && p)
  return parts.length ? parts.join(", ") : undefined
}

export async function getAnalyticsSummary(limit = 150): Promise<AnalyticsSummary> {
  if (!databaseConfigured()) {
    return {
      configured: false,
      totals: {},
      recent: [],
      chats: [],
      topLinks: [],
      locations: [],
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
      locations: [],
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

    const locationRows = (await sql`
      SELECT
        COALESCE(NULLIF(meta->>'location', ''), 'Unknown') AS location,
        NULLIF(meta->>'country', '') AS country,
        NULLIF(meta->>'city', '') AS city,
        COUNT(*)::int AS count
      FROM analytics_events
      GROUP BY 1, 2, 3
      ORDER BY count DESC
      LIMIT 25
    `) as Array<{ location: string; country: string | null; city: string | null; count: number }>

    const totals: Record<string, number> = {}
    for (const row of countRows) totals[row.name] = row.count

    const recent: AnalyticsEvent[] = recentRows.map((row) => {
      const location = eventLocation(row.meta)
      return {
        id: row.id,
        name: row.name,
        label: row.label ?? undefined,
        path: row.path ?? undefined,
        href: row.href ?? undefined,
        meta: (row.meta ?? undefined) as AnalyticsEvent["meta"],
        ts: typeof row.ts === "string" ? row.ts : new Date(row.ts).toISOString(),
        city: typeof row.meta?.city === "string" ? row.meta.city : undefined,
        region: typeof row.meta?.region === "string" ? row.meta.region : undefined,
        country: typeof row.meta?.country === "string" ? row.meta.country : undefined,
        location,
      }
    })

    const chats = recent
      .filter((e) => e.name === "chat_message")
      .map((e) => ({
        id: e.id,
        ts: e.ts,
        question: String(e.meta?.question || e.label || ""),
        location: e.location,
      }))
      .filter((c) => c.question)

    return {
      configured: true,
      totals,
      recent,
      chats,
      topLinks: linkRows.map((r) => ({ label: r.label, count: r.count })),
      locations: locationRows.map((r) => ({
        location: r.location,
        country: r.country ?? undefined,
        city: r.city ?? undefined,
        count: r.count,
      })),
      message: `Loaded ${recent.length} recent events from Neon`,
    }
  } catch (error) {
    console.error("getAnalyticsSummary failed:", error)
    const detail = error instanceof Error ? error.message : "unknown error"
    throw new Error(`Neon read failed: ${detail}`)
  }
}
