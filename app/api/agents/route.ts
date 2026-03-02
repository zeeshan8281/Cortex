import { fetchTopAgents } from '@/lib/sources/cookiefun'
import { computeARS, cookieAgentToARSInput } from '@/lib/ars'
import { mockAAI50, mockTopBar } from '@/lib/mock'
import type { AAI50Entry } from '@/types'

export const dynamic = 'force-dynamic'

let cache: { data: object; at: number } | null = null
const CACHE_MS = 60_000

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const { agents, total } = await fetchTopAgents(50)

    const aai50: AAI50Entry[] = agents.slice(0, 50).map((a, i) => {
      const arsInput  = cookieAgentToARSInput(a)
      const ars       = computeARS(arsInput)
      const mcapRank  = 1000 - i * 10
      const mindshareScore = Math.min(100, a.mindshare * 1000)
      const composite = Math.round(mcapRank * 0.4 + mindshareScore * 3 + ars.score * 0.3)

      return {
        rank:      i + 1,
        name:      a.agentName,
        ticker:    a.agentTicker,
        score:     composite,
        change:    Math.round(a.mindshareChange24h * 10) / 10,
        direction: a.mindshareChange24h > 1 ? 'up' : a.mindshareChange24h < -1 ? 'down' : 'flat',
      } as AAI50Entry
    })

    const indexValue  = aai50.reduce((s, e) => s + e.score, 0) / Math.max(1, aai50.length)
    const indexChange = aai50.reduce((s, e) => s + e.change, 0) / Math.max(1, aai50.length)

    const data = {
      aai50,
      topBar: {
        totalAgents: total,
        aai50:       Math.round(indexValue * 10) / 10,
        aai50Change: Math.round(indexChange * 10) / 10,
      },
    }
    cache = { data, at: Date.now() }
    return Response.json(data)
  } catch (err) {
    console.warn('[agents] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json({
      aai50:  mockAAI50,
      topBar: {
        totalAgents: mockTopBar.totalAgents,
        aai50:       mockTopBar.aai50,
        aai50Change: mockTopBar.aai50Change,
      },
    })
  }
}
