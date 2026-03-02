import { fetchTopAgents } from '@/lib/sources/cookiefun'
import { computeARS, cookieAgentToARSInput } from '@/lib/ars'
import { mockARS } from '@/lib/mock'
import type { ARSAgent } from '@/types'

export const dynamic = 'force-dynamic'

let cache: { data: ARSAgent[]; at: number } | null = null
const CACHE_MS = 120_000

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const { agents } = await fetchTopAgents(20)

    const arsAgents: ARSAgent[] = agents
      .slice(0, 10)
      .map(a => {
        const input = cookieAgentToARSInput(a)
        return { ...computeARS(input), frameworkVersion: '?' }
      })
      .sort((a, b) => b.score - a.score)

    if (!arsAgents.length) return Response.json(mockARS)
    cache = { data: arsAgents, at: Date.now() }
    return Response.json(arsAgents)
  } catch (err) {
    console.warn('[ars] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json(mockARS)
  }
}
