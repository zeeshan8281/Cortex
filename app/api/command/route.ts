import { NextRequest } from 'next/server'
import { runCommand } from '@/lib/sources/openrouter'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: 'OPENROUTER_API_KEY not configured. Add it to .env.local to enable the command bar.' },
      { status: 503 }
    )
  }

  let query: string
  try {
    const body = await req.json()
    query = String(body.query ?? '').trim()
    if (!query) return Response.json({ error: 'Empty query' }, { status: 400 })
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const result = await runCommand(query)
    return Response.json({
      response:     result.content,
      model:        result.model,
      inputTokens:  result.inputTokens,
      outputTokens: result.outputTokens,
    })
  } catch (err) {
    console.error('[command] OpenRouter error:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Command failed' },
      { status: 500 }
    )
  }
}
