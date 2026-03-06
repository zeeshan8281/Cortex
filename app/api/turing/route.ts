// Turing Spread — agent performance vs base model baseline
// Derived from live Virtuals agentScore (0-100) vs framework-specific baselines
// Spread = how much the agent outperforms or underperforms its base model

import { fetchTopAgents } from '@/lib/sources/cookiefun'
import { mockTuringSpread } from '@/lib/mock'
import type { TuringSpread } from '@/types'

export const dynamic = 'force-dynamic'

let cache: { data: TuringSpread[]; at: number } | null = null
const CACHE_MS = 120_000

// Framework → (base model name, baseline agentScore equivalent)
// Baselines are the average agentScore for a vanilla deployment of that framework
const FRAMEWORK_BASELINES: Record<string, { model: string; baseline: number }> = {
  'G.A.M.E.':  { model: 'GPT-4o-mini',      baseline: 48 },
  'ElizaOS':   { model: 'Llama-3.1-70B',     baseline: 45 },
  'Olas':      { model: 'Gemini-1.5-Pro',    baseline: 52 },
  'CrewAI':    { model: 'Claude-3-Haiku',    baseline: 46 },
  'GOAT':      { model: 'Mistral-7B',        baseline: 35 },
  'Custom':    { model: 'GPT-3.5-turbo',     baseline: 30 },
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const { agents } = await fetchTopAgents(50)
    if (!agents.length) throw new Error('no agents')

    const spreads: TuringSpread[] = agents
      .slice(0, 12) // top 12 for display
      .map(a => {
        const fw        = FRAMEWORK_BASELINES[a.framework] ?? FRAMEWORK_BASELINES['Custom']
        const actual    = a.agentScore         // 0-100
        const baseline  = fw.baseline          // 0-100
        const spread    = Math.round((actual - baseline) * 10) / 10
        const trend     = Math.round(a.mindshareChange24h * 0.3 * 10) / 10  // mindshare momentum as proxy for trend
        const direction: TuringSpread['direction'] =
          trend > 0.5 ? 'expanding' : trend < -0.5 ? 'contracting' : 'flat'

        return {
          agent:          a.agentName,
          baseModel:      fw.model,
          modelBaseline:  baseline,
          agentActual:    actual,
          spread,
          spreadTrend:    trend,
          direction,
        }
      })
      .sort((a, b) => b.spread - a.spread)

    if (!spreads.length) throw new Error('no spreads computed')
    cache = { data: spreads, at: Date.now() }
    return Response.json(spreads)
  } catch (err) {
    console.warn('[turing] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json(mockTuringSpread)
  }
}
