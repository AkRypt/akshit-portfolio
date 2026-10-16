import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/analytics'

function authorized(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const header = request.headers.get('x-admin-password')
  return header === password
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const summary = await getAnalyticsSummary(200)
    return NextResponse.json(summary)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching analytics'
    return NextResponse.json(
      {
        error: 'Failed to read analytics',
        configured: true,
        totals: {},
        recent: [],
        chats: [],
        topLinks: [],
        message,
      },
      { status: 500 }
    )
  }
}
