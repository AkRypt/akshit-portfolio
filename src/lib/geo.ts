import type { NextRequest } from "next/server"

export type GeoInfo = {
  city?: string
  region?: string
  country?: string
  countryCode?: string
  label: string
}

function clean(value: string | null | undefined) {
  if (!value) return undefined
  const decoded = decodeURIComponent(value).trim()
  if (!decoded || decoded === "null" || decoded === "undefined") return undefined
  return decoded
}

/** Approximate location from Vercel/CDN headers. City/region/country only — no precise IP stored. */
export function geoFromRequest(request: NextRequest): GeoInfo {
  const city =
    clean(request.headers.get("x-vercel-ip-city")) ||
    clean(request.headers.get("cf-ipcity"))
  const region =
    clean(request.headers.get("x-vercel-ip-country-region")) ||
    clean(request.headers.get("x-vercel-ip-region"))
  const countryCode =
    clean(request.headers.get("x-vercel-ip-country")) ||
    clean(request.headers.get("cf-ipcountry"))
  const country = countryCode // ISO code is enough for a portfolio dashboard

  const parts = [city, region, country].filter(Boolean) as string[]
  const label = parts.length ? parts.join(", ") : "Unknown"

  return { city, region, country, countryCode, label }
}
