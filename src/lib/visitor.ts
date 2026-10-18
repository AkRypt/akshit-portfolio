import { createHash } from "crypto"
import type { NextRequest } from "next/server"

/** Best-effort client IP from reverse-proxy headers. Never persisted raw. */
export function clientIp(request: NextRequest): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }

  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    undefined
  )
}

/**
 * Stable anonymous visitor id from IP + server salt.
 * Raw IP is never returned or stored — only this hash.
 */
export function visitorHashFromRequest(request: NextRequest): string | undefined {
  const ip = clientIp(request)
  if (!ip) return undefined

  const salt =
    process.env.ANALYTICS_SALT ||
    process.env.ADMIN_PASSWORD ||
    "akshit-portfolio-analytics"

  return createHash("sha256").update(`${salt}|${ip}`).digest("hex").slice(0, 32)
}

export function shortVisitorId(hash: string) {
  return `v_${hash.slice(0, 8)}`
}
