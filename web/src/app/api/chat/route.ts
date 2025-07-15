import { NextRequest, NextResponse } from 'next/server'
import { generateResponse } from '@/lib/agent'
import type { ChatRequest, ChatResponse } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userId }: ChatRequest = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    const threadId = conversationId || "default-thread"
    const resourceId = userId || "default-user"

    // Generate AI response using the Romeo agent
    const response = await generateResponse(message, resourceId, threadId)

    const chatResponse: ChatResponse = {
      response,
      conversationId: threadId,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(chatResponse)
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: '',
        conversationId: 'default-thread',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 