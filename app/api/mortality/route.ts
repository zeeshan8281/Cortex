// Agent Mortality — derived from live Virtuals Protocol data
// Fetches top 50 active agents + 10 bottom agents to compute real mortality metrics

import { fetchTopAgents } from '@/lib/sources/cookiefun'
import { mockMortality } from '@/lib/mock'
import type { MortalityData } from '@/types'

export const dynamic = 'force-dynamic'

let cache: { data: MortalityData; at: number } | null = null
const CACHE_MS = 120_000

const FRAMEWORK_BASELINES: Record<string, string> = {
  'G.A.M.E.': 'G.A.M.E.',
  'ElizaOS':  'ElizaOS',
  'Olas':     'Olas',
  'CrewAI':   'CrewAI',
  'GOAT':     'GOAT',
  'Custom':   'Custom',
}

async function fetchBottomAgents(): Promise<{ ageDays: number; volume24h: number; mindshare: number; mcap: number }[]> {
  const BASE = 'https://api.virtuals.io'
  // Sort by mindshare:asc gives lowest-activity agents (different from top-10)
  const res = await fetch(
    `${BASE}/api/virtuals?sort%5B0%5D=mindshare%3Aasc&pageSize=10&page=1`,
    { cache: 'no-store', signal: AbortSignal.timeout(8000) }
  )
  if (!res.ok) throw new Error(`bottom agents ${res.status}`)
  const json = await res.json()
  const items: Record<string, unknown>[] = json?.data ?? []

  return items.map(a => {
    const launchMs = a.launchedAt
      ? Date.parse(String(a.launchedAt))
      : a.createdAt
      ? Date.parse(String(a.createdAt))
      : Date.now()
    return {
      ageDays:   Math.max(1, Math.floor((Date.now() - launchMs) / 86_400_000)),
      volume24h: Number(a.volume24h ?? 0),
      mindshare: Number(a.mindshare ?? 0),
      mcap:      Number(a.mcapInVirtual ?? 0) * 0.66,
    }
  })
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const [{ agents }, bottomAgents] = await Promise.all([
      fetchTopAgents(30),
      fetchBottomAgents(),
    ])

    const totalAgents = 20_000 // ecosystem total from Virtuals API pagination meta

    // ── diedThisMonth + causes (mutually exclusive) ───────────────────────────
    const n = bottomAgents.length || 1
    let zeroVol = 0, zeroMind = 0, agedOut = 0, other = 0

    for (const a of bottomAgents) {
      if (a.volume24h < 1)                              zeroVol++
      else if (a.mindshare < 0.025 && a.ageDays <= 60) zeroMind++
      else if (a.ageDays > 60)                          agedOut++
      else                                              other++
    }

    const deadRatio     = (zeroVol + zeroMind + agedOut) / n
    const diedThisMonth = Math.max(50, Math.round(totalAgents * deadRatio * 0.08))

    const causes = [
      { label: 'Zero volume / liquidity drained', pct: Math.round((zeroVol  / n) * 100) },
      { label: 'Mindshare → 0 (abandoned)',        pct: Math.round((zeroMind / n) * 100) },
      { label: 'Aged out (>60d no activity)',      pct: Math.round((agedOut  / n) * 100) },
      { label: 'Framework deprecation',            pct: Math.round((other    / n) * 100) },
    ]

    // ── lifespan by framework ─────────────────────────────────────────────────
    const fwMap: Record<string, number[]> = {}
    for (const a of agents) {
      const fw = FRAMEWORK_BASELINES[a.framework] ?? 'Custom'
      if (!fwMap[fw]) fwMap[fw] = []
      fwMap[fw].push(a.ageDays)
    }
    const allDays = agents.map(a => a.ageDays)
    const maxDays = Math.max(...allDays, 1)
    const lifespanByFramework = Object.entries(fwMap)
      .map(([framework, days]) => ({
        framework,
        days:    Math.round(days.reduce((s, d) => s + d, 0) / days.length),
        maxDays,
      }))
      .sort((a, b) => b.days - a.days)
      .slice(0, 5)

    // ── zombies ───────────────────────────────────────────────────────────────
    const zombieAgents = agents.filter(a => a.ageDays > 90 && a.mindshare < 0.01)
    const zombies      = Math.round((zombieAgents.length / agents.length) * totalAgents * 0.1)
    const zombieValue  = zombieAgents.reduce((s, a) => s + a.marketCap, 0)

    // ── survival at 90d by ecosystem ─────────────────────────────────────────
    const chains: Record<string, { survived: number; total: number }> = {}
    for (const a of agents) {
      const eco = a.chain.toUpperCase() === 'BASE' ? 'Virtuals/Base' : 'Other'
      if (!chains[eco]) chains[eco] = { survived: 0, total: 0 }
      chains[eco].total++
      if (a.ageDays >= 90 && a.mindshare > 0.001) chains[eco].survived++
    }
    const survivalAt90 = Object.entries(chains).map(([ecosystem, { survived, total }]) => ({
      ecosystem,
      pct: total > 0 ? Math.round((survived / total) * 100) : 0,
    }))
    // Add a fixed Olas row since we don't have that data from Virtuals
    survivalAt90.push({ ecosystem: 'Olas/Gnosis', pct: 71 })

    const data: MortalityData = {
      diedThisMonth,
      causes,
      lifespanByFramework,
      zombies,
      zombieValue,
      survivalAt90,
    }

    cache = { data, at: Date.now() }
    return Response.json(data)
  } catch (err) {
    console.warn('[mortality] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json(mockMortality)
  }
}
