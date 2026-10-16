import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics'

const ALLOWED = new Set([
  'page_view',
  'chat_open',
  'chat_message',
  'resume_download',
  'link_click',
  'site_toggle',
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name : ''
    if (!ALLOWED.has(name)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 })
    }

    const result = await trackEvent({
      name,
      label: typeof body.label === 'string' ? body.label : undefined,
      path: typeof body.path === 'string' ? body.path : undefined,
      href: typeof body.href === 'string' ? body.href : undefined,
      meta: typeof body.meta === 'object' && body.meta ? body.meta : undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Track API error:', error)
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 })
  }
}
