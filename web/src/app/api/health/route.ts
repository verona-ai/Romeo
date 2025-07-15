import { NextResponse } from 'next/server'
import { generateResponse } from '@/lib/agent'
import type { HealthResponse } from '@/lib/types'

export async function GET() {
  try {
    // Test the agent with a simple message
    const testResponse = await generateResponse(
      "Hello, this is a health check.",
      "health-check-user",
      "health-check-thread"
    )

    const healthResponse: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    }

    return NextResponse.json({
      ...healthResponse,
      message: "Chat system is operational",
      testResponse: testResponse.substring(0, 100) + "...", // Truncate for brevity
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    const healthResponse: HealthResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    }

    return NextResponse.json({
      ...healthResponse,
      message: "Chat system is not operational",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
} 