"use client"

type TrackPayload = {
  name: string
  label?: string
  path?: string
  href?: string
  meta?: Record<string, string | number | boolean | null | undefined>
}

export function track(payload: TrackPayload) {
  if (typeof window === 'undefined') return

  const body = JSON.stringify({
    ...payload,
    path: payload.path ?? window.location.pathname,
  })

  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {})
}
