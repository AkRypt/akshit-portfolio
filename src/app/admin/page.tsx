"use client"

import { useEffect, useMemo, useState } from "react"

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
}

type Summary = {
  configured: boolean
  totals: Record<string, number>
  recent: AnalyticsEvent[]
  chats: Array<{ id: string; ts: string; question: string; location?: string }>
  topLinks: Array<{ label: string; count: number }>
  locations: Array<{ location: string; country?: string; city?: string; count: number }>
  message: string
  error?: string
}

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page views",
  resume_download: "Resume downloads",
  chat_open: "Chat opens",
  chat_message: "Chat messages",
  link_click: "Link clicks",
  site_toggle: "Site toggles",
}

function flagEmoji(country?: string) {
  if (!country || country.length !== 2) return "🌐"
  const code = country.toUpperCase()
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)))
}

function prettyEvent(name: string) {
  return EVENT_LABELS[name] || name.replace(/_/g, " ")
}

export default function AdminPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password")
    if (saved) {
      setPassword(saved)
      setIsAuthenticated(true)
      void fetchAnalytics(saved)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchAnalytics = async (pwd: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/analytics", {
        headers: { "x-admin-password": pwd },
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          sessionStorage.removeItem("admin_password")
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
  }

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
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_password", password)
      setAuthError("")
      await fetchAnalytics(password)
    } catch {
      setAuthError("Authentication failed")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_password")
    setPassword("")
    setSummary(null)
  }

  const maxLocation = Math.max(1, ...(summary?.locations || []).map((l) => l.count))
  const cards = useMemo(() => {
    const counts = summary?.totals || {}
    return [
      "page_view",
      "resume_download",
      "chat_open",
      "chat_message",
      "link_click",
      "site_toggle",
    ].map((key) => ({ key, label: prettyEvent(key), value: counts[key] || 0 }))
  }, [summary?.totals])

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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#19e6ff]">Dashboard</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Site analytics</h1>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              {summary?.message || "Custom Neon analytics. Locations are approximate (city / region / country)."}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchAnalytics(password)}
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

        {loading && <div className="py-20 text-center text-white/40">Loading…</div>}

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

        {!loading && summary && (
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

            <div className="mb-6 grid gap-6 lg:grid-cols-5">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-3">
                <div className="mb-5 flex items-baseline justify-between gap-3">
                  <h2 className="text-xl font-bold">Where people are</h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Approximate
                  </span>
                </div>
                {(summary.locations || []).length === 0 ? (
                  <p className="text-sm text-white/40">
                    No location data yet. After deploy on Vercel, new visits will show city / country.
                    Localhost usually shows as Unknown.
                  </p>
                ) : (
                  <ul className="space-y-3">
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

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
                <h2 className="mb-5 text-xl font-bold">Top links</h2>
                {(summary.topLinks || []).length === 0 ? (
                  <p className="text-sm text-white/40">No outbound clicks yet.</p>
                ) : (
                  <ul className="space-y-2">
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
              </section>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-5 text-xl font-bold">Chat questions</h2>
                {(summary.chats || []).length === 0 ? (
                  <p className="text-sm text-white/40">No chat messages logged yet.</p>
                ) : (
                  <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {summary.chats.map((c) => (
                      <div key={c.id} className="rounded-xl border border-white/5 bg-black/25 p-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/40">
                          <span>{new Date(c.ts).toLocaleString()}</span>
                          <span className="rounded-full border border-white/10 px-2 py-0.5 text-white/55">
                            {c.location || "Unknown"}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm text-white/90">{c.question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="mb-5 text-xl font-bold">Recent activity</h2>
                {(summary.recent || []).length === 0 ? (
                  <p className="text-sm text-white/40">Nothing tracked yet.</p>
                ) : (
                  <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                    {summary.recent.map((e) => (
                      <div
                        key={e.id}
                        className="grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 text-sm"
                      >
                        <span className="pt-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ff2a8a]">
                          {e.name.replace(/_/g, " ")}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-white/85">
                            {e.label || String(e.meta?.question || e.href || e.path || "—")}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/35">
                            {e.location || "Unknown"} · {new Date(e.ts).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-base leading-none">{flagEmoji(e.country)}</span>
                      </div>
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
