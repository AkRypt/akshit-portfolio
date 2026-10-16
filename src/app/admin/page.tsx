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
}

type Summary = {
  configured: boolean
  totals: Record<string, number>
  recent: AnalyticsEvent[]
  chats: Array<{ id: string; ts: string; question: string }>
  topLinks: Array<{ label: string; count: number }>
  message: string
  error?: string
}

const empty: Summary = {
  configured: false,
  totals: {},
  recent: [],
  chats: [],
  topLinks: [],
  message: "",
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

  const counts = summary?.totals || empty.totals
  const cards = useMemo(
    () => [
      { label: "Page views", value: counts.page_view || 0 },
      { label: "Resume downloads", value: counts.resume_download || 0 },
      { label: "Chat opens", value: counts.chat_open || 0 },
      { label: "Chat messages", value: counts.chat_message || 0 },
      { label: "Link clicks", value: counts.link_click || 0 },
      { label: "Site toggles", value: counts.site_toggle || 0 },
    ],
    [counts]
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <div className="mx-auto mt-20 max-w-md">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-8">
            <h1 className="mb-6 text-center text-2xl font-bold">Admin Access</h1>
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:border-pink-500 focus:outline-none"
                placeholder="Enter admin password"
              />
              {authError && <div className="text-sm text-red-400">{authError}</div>}
              <button
                onClick={handleLogin}
                disabled={!password.trim()}
                className="w-full rounded-lg bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 px-4 py-2 text-white disabled:opacity-50"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Site analytics</h1>
            <p className="mt-1 text-sm text-gray-400">{summary?.message || "Custom Neon analytics — not Vercel."}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchAnalytics(password)}
              className="rounded-lg bg-gradient-to-r from-pink-500 via-violet-500 to-cyan-500 px-4 py-2"
            >
              Refresh
            </button>
            <button onClick={handleLogout} className="rounded-lg bg-gray-700 px-4 py-2 hover:bg-gray-600">
              Logout
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-16 text-center text-gray-400">Loading analytics…</div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-700 bg-red-950/50 p-4 text-red-200">
            <p className="font-semibold">Error</p>
            <p className="mt-1 text-sm">{error}</p>
            {!summary?.configured && (
              <p className="mt-3 text-sm text-red-100/80">
                Add <code className="text-pink-300">DATABASE_URL</code> from Neon (
                <code className="text-pink-300">neon env pull</code>) to Vercel and{" "}
                <code className="text-pink-300">.env.local</code>, then redeploy.
              </p>
            )}
          </div>
        )}

        {!loading && summary && !summary.configured && (
          <div className="mb-6 rounded-lg border border-amber-700/50 bg-amber-950/40 p-5 text-amber-100">
            <p className="font-semibold">Neon DATABASE_URL is not configured</p>
            <p className="mt-2 text-sm text-amber-100/80">
              Run <code className="text-pink-300">neon env pull</code> locally and add{" "}
              <code className="text-pink-300">DATABASE_URL</code> + <code className="text-pink-300">ADMIN_PASSWORD</code>{" "}
              in Vercel. See <code className="text-pink-300">SETUP-UPSTASH.md</code>.
            </p>
          </div>
        )}

        {!loading && summary && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {cards.map((c) => (
                <div key={c.label} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-400">{c.label}</p>
                  <p className="mt-2 text-3xl font-bold text-pink-400">{c.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                <h2 className="mb-4 text-xl font-semibold">Chat questions</h2>
                {summary.chats.length === 0 ? (
                  <p className="text-sm text-gray-500">No chat messages logged yet.</p>
                ) : (
                  <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
                    {summary.chats.map((c) => (
                      <div key={c.id} className="rounded-md border border-gray-800 bg-black/40 p-3">
                        <p className="text-xs text-gray-500">{new Date(c.ts).toLocaleString()}</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-white">{c.question}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-gray-800 bg-gray-900 p-5">
                <h2 className="mb-4 text-xl font-semibold">Top link clicks</h2>
                {summary.topLinks.length === 0 ? (
                  <p className="text-sm text-gray-500">No outbound link clicks yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {summary.topLinks.map((l) => (
                      <li key={l.label} className="flex items-center justify-between gap-3 border-b border-gray-800 py-2 text-sm">
                        <span className="truncate text-gray-200">{l.label}</span>
                        <span className="font-mono text-cyan-400">{l.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            <section className="mt-6 rounded-lg border border-gray-800 bg-gray-900 p-5">
              <h2 className="mb-4 text-xl font-semibold">Recent activity</h2>
              {summary.recent.length === 0 ? (
                <p className="text-sm text-gray-500">Nothing tracked yet. Browse the site, download the resume, use chat.</p>
              ) : (
                <div className="max-h-[32rem] overflow-x-auto overflow-y-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="sticky top-0 bg-gray-900 text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="py-2 pr-3">When</th>
                        <th className="py-2 pr-3">Event</th>
                        <th className="py-2 pr-3">Label</th>
                        <th className="py-2">Path / URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recent.map((e) => (
                        <tr key={e.id} className="border-t border-gray-800 align-top">
                          <td className="py-2 pr-3 whitespace-nowrap text-gray-500">{new Date(e.ts).toLocaleString()}</td>
                          <td className="py-2 pr-3 font-mono text-pink-300">{e.name}</td>
                          <td className="py-2 pr-3 text-gray-200">{e.label || String(e.meta?.question || "—")}</td>
                          <td className="py-2 text-gray-400 break-all">{e.href || e.path || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}
