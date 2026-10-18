import { NextRequest, NextResponse } from "next/server"
import { getAnalyticsSummary } from "@/lib/analytics"

function authorized(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const header = request.headers.get("x-admin-password")
  return header === password
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const summary = await getAnalyticsSummary({
      limit: 250,
      preset: searchParams.get("range"),
      from: searchParams.get("from"),
      to: searchParams.get("to"),
      visitor: searchParams.get("visitor"),
    })
    return NextResponse.json(summary)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error fetching analytics"
    return NextResponse.json(
      {
        error: "Failed to read analytics",
        configured: true,
        range: { from: null, to: null },
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
      },
      { status: 500 }
    )
  }
}
