import { NextRequest, NextResponse } from 'next/server'
import { getAnalyticsSummary } from '@/lib/analytics'

function authorized(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const header = request.headers.get('x-admin-password')
  return header === password
}

/** @deprecated Prefer /api/analytics — kept so the old admin client still works. */
export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const summary = await getAnalyticsSummary(100)
    return NextResponse.json({
      questions: summary.chats.map((c) => ({
        id: c.id,
        timestamp: c.ts,
        question: c.question,
      })),
      total: summary.chats.length,
      message: summary.message,
      configured: summary.configured,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error fetching questions from database'
    return NextResponse.json(
      {
        error: 'Failed to read questions',
        questions: [],
        total: 0,
        message,
      },
      { status: 500 }
    )
  }
}
