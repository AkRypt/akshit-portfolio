import { ensureAnalyticsSchema, getSql, databaseConfigured } from "./db"
import type { GeoInfo } from "./geo"
import { shortVisitorId } from "./visitor"

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
  visitorHash?: string
  city?: string
  region?: string
  country?: string
  location?: string
}

export type DateRangeInput = {
  from?: string | null
  to?: string | null
}

export type DailyPoint = {
  date: string
  pageViews: number
  events: number
  visitors: number
}

export type VisitorSummary = {
  hash: string
  shortId: string
  events: number
  pageViews: number
  firstSeen: string
  lastSeen: string
  location?: string
  country?: string
}

export type LocationStat = {
  location: string
  country?: string
  city?: string
  count: number
}

export type AnalyticsSummary = {
  configured: boolean
  range: { from: string | null; to: string | null }
  totals: Record<string, number>
  uniqueVisitors: number
  daily: DailyPoint[]
  visitors: VisitorSummary[]
  recent: AnalyticsEvent[]
  chats: Array<{ id: string; ts: string; question: string; location?: string; visitorHash?: string }>
  topLinks: Array<{ label: string; count: number }>
  locations: LocationStat[]
  selectedVisitor?: {
    hash: string
    shortId: string
    location?: string
    country?: string
    firstSeen: string
    lastSeen: string
    events: number
    timeline: AnalyticsEvent[]
  } | null
  message: string
}

const MAX_EVENTS = 5000

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

function eventLocation(meta: Record<string, unknown> | null | undefined) {
  if (!meta) return undefined
  if (typeof meta.location === "string" && meta.location) return meta.location
  const parts = [meta.city, meta.region, meta.country].filter((p) => typeof p === "string" && p)
  return parts.length ? parts.join(", ") : undefined
}

function toIso(value: Date) {
  return value.toISOString()
}

/** Parse range query into inclusive-ish bounds (from inclusive, to exclusive end-of-day+1ms as ISO). */
export function resolveDateRange(input: DateRangeInput & { preset?: string | null }): {
  from: string | null
  to: string | null
} {
  const now = new Date()
  if (input.from || input.to) {
    const from = input.from ? new Date(input.from) : null
    const to = input.to ? new Date(input.to) : null
    // Treat date-only `to` as end of that day
    if (to && /^\d{4}-\d{2}-\d{2}$/.test(input.to || "")) {
      to.setUTCHours(23, 59, 59, 999)
    }
    return {
      from: from && !Number.isNaN(from.getTime()) ? toIso(from) : null,
      to: to && !Number.isNaN(to.getTime()) ? toIso(to) : null,
    }
  }

  const preset = (input.preset || "7d").toLowerCase()
  if (preset === "all") return { from: null, to: null }

  if (preset === "today") {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    return { from: toIso(start), to: toIso(now) }
  }

  const days =
    preset === "1d" || preset === "2d" || preset === "7d" || preset === "30d"
      ? Number(preset.replace("d", ""))
      : 7

  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  return { from: toIso(start), to: toIso(now) }
}

type EventRow = {
  id: string
  name: string
  label: string | null
  path: string | null
  href: string | null
  meta: Record<string, unknown> | null
  ts: string | Date
  visitor_hash: string | null
}

function mapEvent(row: EventRow): AnalyticsEvent {
  const meta = row.meta ?? undefined
  const location = eventLocation(meta)
  const visitorHash =
    row.visitor_hash ||
    (typeof meta?.visitorHash === "string" ? meta.visitorHash : undefined) ||
    undefined

  return {
    id: row.id,
    name: row.name,
    label: row.label ?? undefined,
    path: row.path ?? undefined,
    href: row.href ?? undefined,
    meta: meta as AnalyticsEvent["meta"],
    ts: typeof row.ts === "string" ? row.ts : new Date(row.ts).toISOString(),
    visitorHash,
    city: typeof meta?.city === "string" ? meta.city : undefined,
    region: typeof meta?.region === "string" ? meta.region : undefined,
    country: typeof meta?.country === "string" ? meta.country : undefined,
    location,
  }
}

export async function trackEvent(input: {
  name: string
  label?: string
  path?: string
  href?: string
  meta?: Record<string, string | number | boolean | null | undefined>
  geo?: GeoInfo
  visitorHash?: string
}): Promise<{ ok: boolean; reason?: string }> {
  const sql = getSql()
  if (!sql) return { ok: false, reason: "database_not_configured" }

  const meta = {
    ...withGeo(input.meta, input.geo),
    ...(input.visitorHash ? { visitorHash: input.visitorHash } : {}),
  }

  const event: AnalyticsEvent = {
    id: id(),
    name: input.name,
    label: input.label?.slice(0, 200),
    path: input.path?.slice(0, 300),
    href: input.href?.slice(0, 500),
    meta,
    ts: new Date().toISOString(),
    visitorHash: input.visitorHash,
  }

  try {
    await ensureAnalyticsSchema()
    await sql`
      INSERT INTO analytics_events (id, name, label, path, href, meta, ts, visitor_hash)
      VALUES (
        ${event.id},
        ${event.name},
        ${event.label ?? null},
        ${event.path ?? null},
        ${event.href ?? null},
        ${JSON.stringify(event.meta ?? {})},
        ${event.ts},
        ${event.visitorHash ?? null}
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
  geo?: GeoInfo,
  visitorHash?: string
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
    visitorHash,
  })
}

function emptySummary(message: string, range: { from: string | null; to: string | null }): AnalyticsSummary {
  return {
    configured: false,
    range,
    totals: {},
    uniqueVisitors: 0,
    daily: [],
    visitors: [],
    recent: [],
    chats: [],
    topLinks: [],
    locations: [],
    selectedVisitor: null,
    message,
  }
}

export async function getAnalyticsSummary(options: {
  limit?: number
  from?: string | null
  to?: string | null
  preset?: string | null
  visitor?: string | null
} = {}): Promise<AnalyticsSummary> {
  const range = resolveDateRange({
    from: options.from,
    to: options.to,
    preset: options.preset,
  })
  const limit = options.limit ?? 200
  const visitorFilter = options.visitor?.trim() || null

  if (!databaseConfigured()) {
    return emptySummary(
      "Neon DATABASE_URL is not configured. Add it to .env.local and Vercel (neon env pull / neon deploy).",
      range
    )
  }

  const sql = getSql()
  if (!sql) {
    return emptySummary("DATABASE_URL is not configured.", range)
  }

  try {
    await ensureAnalyticsSchema()

    const from = range.from
    const to = range.to

    // Neon HTTP driver: keep filters as simple parameterized fragments
    const recentRows = (await sql`
      SELECT id, name, label, path, href, meta, ts, visitor_hash
      FROM analytics_events
      WHERE (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
      ORDER BY ts DESC
      LIMIT ${limit}
    `) as EventRow[]

    const countRows = (await sql`
      SELECT name, COUNT(*)::int AS count
      FROM analytics_events
      WHERE (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
      GROUP BY name
    `) as Array<{ name: string; count: number }>

    const uniqueRow = (await sql`
      SELECT COUNT(DISTINCT visitor_hash)::int AS count
      FROM analytics_events
      WHERE visitor_hash IS NOT NULL
        AND (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
    `) as Array<{ count: number }>

    const dailyRows = (await sql`
      SELECT
        to_char(date_trunc('day', ts AT TIME ZONE 'UTC'), 'YYYY-MM-DD') AS date,
        COUNT(*) FILTER (WHERE name = 'page_view')::int AS page_views,
        COUNT(*)::int AS events,
        COUNT(DISTINCT visitor_hash)::int AS visitors
      FROM analytics_events
      WHERE (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
      GROUP BY 1
      ORDER BY 1 ASC
    `) as Array<{ date: string; page_views: number; events: number; visitors: number }>

    const visitorRows = (await sql`
      SELECT
        visitor_hash AS hash,
        COUNT(*)::int AS events,
        COUNT(*) FILTER (WHERE name = 'page_view')::int AS page_views,
        MIN(ts) AS first_seen,
        MAX(ts) AS last_seen,
        COALESCE(NULLIF((array_agg(meta->>'location' ORDER BY ts DESC))[1], ''), 'Unknown') AS location,
        NULLIF((array_agg(meta->>'country' ORDER BY ts DESC))[1], '') AS country
      FROM analytics_events
      WHERE visitor_hash IS NOT NULL
        AND (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
      GROUP BY visitor_hash
      ORDER BY MAX(ts) DESC
      LIMIT 60
    `) as Array<{
      hash: string
      events: number
      page_views: number
      first_seen: string | Date
      last_seen: string | Date
      location: string | null
      country: string | null
    }>

    const linkRows = (await sql`
      SELECT COALESCE(label, href, 'unknown') AS label, COUNT(*)::int AS count
      FROM analytics_events
      WHERE name = 'link_click'
        AND (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
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
      WHERE (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
        AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
      GROUP BY 1, 2, 3
      ORDER BY count DESC
      LIMIT 25
    `) as Array<{ location: string; country: string | null; city: string | null; count: number }>

    const totals: Record<string, number> = {}
    for (const row of countRows) totals[row.name] = row.count

    const recent = recentRows.map(mapEvent)

    const chats = recent
      .filter((e) => e.name === "chat_message")
      .map((e) => ({
        id: e.id,
        ts: e.ts,
        question: String(e.meta?.question || e.label || ""),
        location: e.location,
        visitorHash: e.visitorHash,
      }))
      .filter((c) => c.question)

    let selectedVisitor: AnalyticsSummary["selectedVisitor"] = null
    if (visitorFilter) {
      const timelineRows = (await sql`
        SELECT id, name, label, path, href, meta, ts, visitor_hash
        FROM analytics_events
        WHERE visitor_hash = ${visitorFilter}
          AND (${from}::timestamptz IS NULL OR ts >= ${from}::timestamptz)
          AND (${to}::timestamptz IS NULL OR ts <= ${to}::timestamptz)
        ORDER BY ts ASC
        LIMIT 400
      `) as EventRow[]

      const timeline = timelineRows.map(mapEvent)
      if (timeline.length) {
        selectedVisitor = {
          hash: visitorFilter,
          shortId: shortVisitorId(visitorFilter),
          location: timeline[timeline.length - 1]?.location,
          country: timeline[timeline.length - 1]?.country,
          firstSeen: timeline[0].ts,
          lastSeen: timeline[timeline.length - 1].ts,
          events: timeline.length,
          timeline,
        }
      } else {
        selectedVisitor = {
          hash: visitorFilter,
          shortId: shortVisitorId(visitorFilter),
          firstSeen: "",
          lastSeen: "",
          events: 0,
          timeline: [],
        }
      }
    }

    return {
      configured: true,
      range,
      totals,
      uniqueVisitors: uniqueRow[0]?.count ?? 0,
      daily: dailyRows.map((r) => ({
        date: r.date,
        pageViews: r.page_views,
        events: r.events,
        visitors: r.visitors,
      })),
      visitors: visitorRows.map((r) => ({
        hash: r.hash,
        shortId: shortVisitorId(r.hash),
        events: r.events,
        pageViews: r.page_views,
        firstSeen: typeof r.first_seen === "string" ? r.first_seen : new Date(r.first_seen).toISOString(),
        lastSeen: typeof r.last_seen === "string" ? r.last_seen : new Date(r.last_seen).toISOString(),
        location: r.location || undefined,
        country: r.country || undefined,
      })),
      recent,
      chats,
      topLinks: linkRows.map((r) => ({ label: r.label, count: r.count })),
      locations: locationRows.map((r) => ({
        location: r.location,
        country: r.country ?? undefined,
        city: r.city ?? undefined,
        count: r.count,
      })),
      selectedVisitor,
      message: `Loaded ${recent.length} events · ${uniqueRow[0]?.count ?? 0} visitors in range`,
    }
  } catch (error) {
    console.error("getAnalyticsSummary failed:", error)
    const detail = error instanceof Error ? error.message : "unknown error"
    throw new Error(`Neon read failed: ${detail}`)
  }
}
