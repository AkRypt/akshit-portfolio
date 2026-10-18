import { NextRequest, NextResponse } from 'next/server'
import { getChatResponse, type ChatTurn } from '@/lib/chatbot-service'
import { logChatQuestion } from '@/lib/analytics'
import { geoFromRequest } from '@/lib/geo'
import { visitorHashFromRequest } from '@/lib/visitor'

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const turns: ChatTurn[] = Array.isArray(history) ? history : []
    const response = await getChatResponse([...turns, { role: 'user', content: message }])

    logChatQuestion(
      message,
      { source: response.source },
      geoFromRequest(request),
      visitorHashFromRequest(request)
    ).catch((err) => console.error('Logging failed:', err))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
