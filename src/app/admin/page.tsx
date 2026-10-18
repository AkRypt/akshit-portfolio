"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

type AnalyticsEvent = {
  id: string
  name: string
  label?: string
  path?: string
  href?: string
  meta?: Record<string, unknown>
  ts: string
  location?: string
  country?: string
  city?: string
  visitorHash?: string
}

type DailyPoint = {
  date: string
  pageViews: number
  events: number
  visitors: number
}

type VisitorSummary = {
  hash: string
  shortId: string
  events: number
  pageViews: number
  firstSeen: string
  lastSeen: string
  location?: string
  country?: string
}

type Summary = {
  configured: boolean
  range: { from: string | null; to: string | null }
  totals: Record<string, number>
  uniqueVisitors: number
  daily: DailyPoint[]
  visitors: VisitorSummary[]
  recent: AnalyticsEvent[]
  chats: Array<{ id: string; ts: string; question: string; location?: string; visitorHash?: string }>
  topLinks: Array<{ label: string; count: number }>
  locations: Array<{ location: string; country?: string; city?: string; count: number }>
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
  error?: string
}

type RangePreset = "today" | "1d" | "2d" | "7d" | "30d" | "all" | "custom"

const ADMIN_KEY = "admin_password"

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page views",
  resume_download: "Resume downloads",
  chat_open: "Chat opens",
  chat_message: "Chat messages",
  link_click: "Link clicks",
  site_toggle: "Site toggles",
}

const PRESETS: Array<{ id: RangePreset; label: string }> = [
  { id: "today", label: "Today" },
  { id: "1d", label: "24h" },
  { id: "2d", label: "2d" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "all", label: "All" },
  { id: "custom", label: "Custom" },
]

function flagEmoji(country?: string) {
  if (!country || country.length !== 2) return "🌐"
  const code = country.toUpperCase()
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
}

function prettyEvent(name: string) {
  return EVENT_LABELS[name] || name.replace(/_/g, " ")
}

function formatWhen(ts: string) {
  if (!ts) return "—"
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatDay(date: string) {
  const d = new Date(`${date}T12:00:00Z`)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function eventDetail(e: AnalyticsEvent) {
  if (e.name === "page_view") return e.path || "/"
  if (e.name === "chat_message") return String(e.meta?.question || e.label || "Chat message")
  return e.label || e.href || e.path || "—"
}

function VisitsChart({ daily }: { daily: DailyPoint[] }) {
  const max = Math.max(1, ...daily.map((d) => Math.max(d.pageViews, d.visitors)))
  const width = 640
  const height = 180
  const pad = { top: 16, right: 12, bottom: 28, left: 28 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const n = Math.max(daily.length, 1)
  const gap = daily.length > 20 ? 2 : 6
  const barW = Math.max(4, (innerW - gap * (n - 1)) / n)

  if (!daily.length) {
    return <p className="py-10 text-center text-sm text-white/40">No visits in this range yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full min-w-[320px]">
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.top + innerH * (1 - t)
          return (
            <g key={t}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">
                {Math.round(max * t)}
              </text>
            </g>
          )
        })}
        {daily.map((d, i) => {
          const x = pad.left + i * (barW + gap)
          const hViews = (d.pageViews / max) * innerH
          const hVisitors = (d.visitors / max) * innerH
          const showLabel = daily.length <= 14 || i % Math.ceil(daily.length / 8) === 0
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={pad.top + innerH - hViews}
                width={barW}
                height={Math.max(hViews, d.pageViews ? 2 : 0)}
                rx={2}
                fill="url(#barPink)"
                opacity={0.9}
              >
                <title>{`${d.date}: ${d.pageViews} page views, ${d.visitors} visitors`}</title>
              </rect>
              <rect
                x={x + barW * 0.55}
                y={pad.top + innerH - hVisitors}
                width={Math.max(2, barW * 0.35)}
                height={Math.max(hVisitors, d.visitors ? 2 : 0)}
                rx={1}
                fill="#19e6ff"
                opacity={0.85}
              />
              {showLabel && (
                <text
                  x={x + barW / 2}
                  y={height - 8}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.35)"
                  fontSize="9"
                >
                  {formatDay(d.date)}
                </text>
              )}
            </g>
          )
        })}
        <defs>
          <linearGradient id="barPink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff2a8a" />
            <stop offset="100%" stopColor="#8b5cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-2 flex gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-[#ff2a8a]" /> Page views
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-sm bg-[#19e6ff]" /> Unique visitors
        </span>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [range, setRange] = useState<RangePreset>("7d")
  const [customFrom, setCustomFrom] = useState("")
  const [customTo, setCustomTo] = useState("")
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null)
  const [bootstrapped, setBootstrapped] = useState(false)

  const buildQuery = useCallback(
    (visitor?: string | null) => {
      const params = new URLSearchParams()
      if (range === "custom") {
        if (customFrom) params.set("from", customFrom)
        if (customTo) params.set("to", customTo)
      } else {
        params.set("range", range)
      }
      if (visitor) params.set("visitor", visitor)
      const q = params.toString()
      return q ? `?${q}` : ""
    },
    [range, customFrom, customTo]
  )

  const fetchAnalytics = useCallback(
    async (pwd: string, visitor?: string | null) => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/analytics${buildQuery(visitor)}`, {
          headers: { "x-admin-password": pwd },
        })
        const data = await response.json()
        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false)
            localStorage.removeItem(ADMIN_KEY)
            setAuthError("Invalid password")
            return
          }
          setError(data.message || data.error || "Failed to fetch analytics")
          setSummary(data)
          return
        }
        setSummary(data)
      } catch {
        setError("Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    },
    [buildQuery]
  )

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_KEY)
    if (saved) {
      setPassword(saved)
      setIsAuthenticated(true)
    }
    setBootstrapped(true)
  }, [])

  useEffect(() => {
    if (!bootstrapped || !isAuthenticated || !password) return
    if (range === "custom" && !customFrom && !customTo) return
    void fetchAnalytics(password, selectedVisitor)
  }, [bootstrapped, range, customFrom, customTo, selectedVisitor, isAuthenticated, password, fetchAnalytics])

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        setAuthError("Invalid password")
        return
      }
      localStorage.setItem(ADMIN_KEY, password)
      setAuthError("")
      setIsAuthenticated(true)
    } catch {
      setAuthError("Authentication failed")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem(ADMIN_KEY)
    setPassword("")
    setSummary(null)
    setSelectedVisitor(null)
  }

  const maxLocation = Math.max(1, ...(summary?.locations || []).map((l) => l.count))
  const cards = useMemo(() => {
    const counts = summary?.totals || {}
    return [
      { key: "visitors", label: "Unique visitors", value: summary?.uniqueVisitors || 0 },
      ...["page_view", "resume_download", "chat_open", "chat_message", "link_click"].map((key) => ({
        key,
        label: prettyEvent(key),
        value: counts[key] || 0,
      })),
    ]
  }, [summary?.totals, summary?.uniqueVisitors])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05040d] p-8 text-white">
        <div className="mx-auto mt-20 max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#ff2a8a]">Private</p>
            <h1 className="mb-6 text-3xl font-bold tracking-tight">Analytics</h1>
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none ring-[#19e6ff] focus:ring-2"
                placeholder="Admin password"
              />
              {authError && <div className="text-sm text-red-400">{authError}</div>}
              <button
                onClick={handleLogin}
                disabled={!password.trim()}
                className="w-full rounded-xl bg-[#ff2a8a] px-4 py-3 font-semibold text-black disabled:opacity-50"
              >
                Enter
              </button>
              <p className="text-center text-xs text-white/35">Stays signed in on this device until you log out.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05040d] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,42,138,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(25,230,255,0.08),_transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#19e6ff]">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Site analytics</h1>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              {summary?.message || "Custom Neon analytics. Visitors are anonymous hashes — no raw IPs stored."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchAnalytics(password, selectedVisitor)}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm hover:border-[#19e6ff] hover:text-[#19e6ff]"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-white/10 px-5 py-2 text-sm text-white/60 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setRange(p.id)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition ${
                  range === p.id
                    ? "bg-[#ff2a8a] font-semibold text-black"
                    : "border border-white/10 text-white/55 hover:border-white/30 hover:text-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {range === "custom" && (
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-white/60">
                From
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-white outline-none focus:border-[#19e6ff]"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60">
                To
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-white outline-none focus:border-[#19e6ff]"
                />
              </label>
            </div>
          )}
        </div>

        {loading && !summary && <div className="py-20 text-center text-white/40">Loading…</div>}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-red-100">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm opacity-80">{error}</p>
          </div>
        )}

        {!loading && summary && !summary.configured && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/30 p-5 text-amber-50">
            <p className="font-semibold">Neon DATABASE_URL is not configured</p>
            <p className="mt-2 text-sm opacity-80">
              Add <code className="text-pink-300">DATABASE_URL</code> in Vercel and redeploy.
            </p>
          </div>
        )}

        {summary && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {cards.map((c) => (
                <div
                  key={c.key}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[#ff2a8a]/40"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">{c.label}</p>
                  <p className="mt-3 text-3xl font-black text-white">{c.value}</p>
                </div>
              ))}
            </div>

            <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-bold">Visits over time</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                  {loading ? "Updating…" : "UTC days"}
                </span>
              </div>
              <VisitsChart daily={summary.daily || []} />
            </section>

            <div className="mb-6 grid gap-6 lg:grid-cols-5">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-3">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold">Visitors & flows</h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Hashed IP · click for timeline
                  </span>
                </div>

                {(summary.visitors || []).length === 0 ? (
                  <p className="text-sm text-white/40">
                    No hashed visitors yet. New traffic after deploy will show here. Localhost may lack a
                    usable IP.
                  </p>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                      {summary.visitors.map((v) => {
                        const active = selectedVisitor === v.hash
                        return (
                          <li key={v.hash}>
                            <button
                              onClick={() => setSelectedVisitor(active ? null : v.hash)}
                              className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                                active
                                  ? "border-[#19e6ff]/50 bg-[#19e6ff]/10"
                                  : "border-white/5 bg-black/20 hover:border-white/20"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-sm text-white">
                                  {flagEmoji(v.country)} {v.shortId}
                                </span>
                                <span className="font-mono text-xs text-[#ff2a8a]">{v.events} events</span>
                              </div>
                              <p className="mt-1 truncate text-[11px] text-white/45">
                                {v.location || "Unknown"} · {v.pageViews} pages
                              </p>
                              <p className="mt-0.5 text-[11px] text-white/30">
                                Last {formatWhen(v.lastSeen)}
                              </p>
                            </button>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="rounded-xl border border-white/10 bg-black/25 p-4">
                      {!selectedVisitor || !summary.selectedVisitor ? (
                        <p className="py-10 text-center text-sm text-white/40">
                          Select a visitor to see their activity timeline.
                        </p>
                      ) : summary.selectedVisitor.events === 0 ? (
                        <p className="py-10 text-center text-sm text-white/40">
                          No events for this visitor in the selected range.
                        </p>
                      ) : (
                        <>
                          <div className="mb-4 border-b border-white/10 pb-3">
                            <p className="font-mono text-sm text-[#19e6ff]">{summary.selectedVisitor.shortId}</p>
                            <p className="mt-1 text-xs text-white/45">
                              {summary.selectedVisitor.location || "Unknown"} ·{" "}
                              {summary.selectedVisitor.events} events
                            </p>
                            <p className="mt-1 text-[11px] text-white/30">
                              {formatWhen(summary.selectedVisitor.firstSeen)} →{" "}
                              {formatWhen(summary.selectedVisitor.lastSeen)}
                            </p>
                          </div>
                          <ol className="max-h-[22rem] space-y-0 overflow-y-auto pr-1">
                            {summary.selectedVisitor.timeline.map((e, i) => (
                              <li key={e.id} className="relative flex gap-3 pb-4 pl-1">
                                <div className="flex flex-col items-center">
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ff2a8a] shadow-[0_0_8px_#ff2a8a]" />
                                  {i < summary.selectedVisitor!.timeline.length - 1 && (
                                    <span className="mt-1 w-px flex-1 bg-white/10" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ff2a8a]">
                                      {e.name.replace(/_/g, " ")}
                                    </span>
                                    <time className="font-mono text-[10px] text-white/35">
                                      {new Date(e.ts).toLocaleString()}
                                    </time>
                                  </div>
                                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-white/85">
                                    {eventDetail(e)}
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
                <div className="mb-5 flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold">Where people are</h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Approximate
                  </span>
                </div>
                {(summary.locations || []).length === 0 ? (
                  <p className="text-sm text-white/40">No location data in this range.</p>
                ) : (
                  <ul className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {(summary.locations || []).map((l) => (
                      <li key={`${l.location}-${l.country}-${l.city}`}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="text-base">{flagEmoji(l.country)}</span>
                            <span className="truncate text-white/90">{l.location}</span>
                          </span>
                          <span className="shrink-0 font-mono text-[#19e6ff]">{l.count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#ff2a8a] to-[#19e6ff]"
                            style={{ width: `${Math.max(8, (l.count / maxLocation) * 100)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-5 text-xl font-bold">Chat questions</h2>
                {(summary.chats || []).length === 0 ? (
                  <p className="text-sm text-white/40">No chat messages in this range.</p>
                ) : (
                  <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {summary.chats.map((c) => (
                      <div key={c.id} className="rounded-xl border border-white/5 bg-black/25 p-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/40">
                          <span>{new Date(c.ts).toLocaleString()}</span>
                          <div className="flex gap-2">
                            {c.visitorHash && (
                              <button
                                onClick={() => setSelectedVisitor(c.visitorHash!)}
                                className="rounded-full border border-white/10 px-2 py-0.5 text-white/55 hover:border-[#19e6ff] hover:text-[#19e6ff]"
                              >
                                Open flow
                              </button>
                            )}
                            <span className="rounded-full border border-white/10 px-2 py-0.5 text-white/55">
                              {c.location || "Unknown"}
                            </span>
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap text-sm text-white/90">{c.question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-5 text-xl font-bold">Top links</h2>
                {(summary.topLinks || []).length === 0 ? (
                  <p className="mb-6 text-sm text-white/40">No outbound clicks in this range.</p>
                ) : (
                  <ul className="mb-6 space-y-2">
                    {summary.topLinks.map((l) => (
                      <li
                        key={l.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-sm"
                      >
                        <span className="truncate text-white/80">{l.label}</span>
                        <span className="font-mono text-[#ff2a8a]">{l.count}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <h3 className="mb-3 text-sm font-semibold text-white/70">Recent activity</h3>
                {(summary.recent || []).length === 0 ? (
                  <p className="text-sm text-white/40">Nothing tracked in this range.</p>
                ) : (
                  <div className="max-h-[18rem] space-y-2 overflow-y-auto pr-1">
                    {summary.recent.slice(0, 40).map((e) => (
                      <button
                        key={e.id}
                        onClick={() => e.visitorHash && setSelectedVisitor(e.visitorHash)}
                        className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-left text-sm hover:border-white/15"
                      >
                        <span className="pt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff2a8a]">
                          {e.name.replace(/_/g, " ")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-white/85">{eventDetail(e)}</p>
                          <p className="mt-0.5 text-[11px] text-white/35">
                            {e.location || "Unknown"} · {formatWhen(e.ts)}
                          </p>
                        </div>
                        <span className="text-base leading-none">{flagEmoji(e.country)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
