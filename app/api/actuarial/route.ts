// Actuarial Table — historical loss rates by framework × age bucket
// Derived from live Virtuals agent data: group by framework + age, compute inactive rate

import { mockActuarial } from '@/lib/mock'
import type { ActuarialRow } from '@/types'

export const dynamic = 'force-dynamic'

let cache: { data: ActuarialRow[]; at: number } | null = null
const CACHE_MS = 300_000  // 5 min — actuarial data doesn't change quickly

const AGE_BUCKETS = ['0-30d', '31-90d', '91-180d', '180d+'] as const
type AgeBucket = typeof AGE_BUCKETS[number]

function ageBucket(days: number): AgeBucket {
  if (days <= 30)  return '0-30d'
  if (days <= 90)  return '31-90d'
  if (days <= 180) return '91-180d'
  return '180d+'
}

// Known audited frameworks
const AUDITED_FRAMEWORKS = new Set(['G.A.M.E.', 'ElizaOS', 'Olas'])

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    // Fetch agents from multiple sort keys to get age diversity
    // (Virtuals pagination is broken; different sorts give different agent subsets)
    const BASE = 'https://api.virtuals.io'
    const VIRTUAL_PRICE_URL = 'https://coins.llama.fi/prices/current/base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'

    const [r1, r2, r3, priceRes] = await Promise.all([
      fetch(`${BASE}/api/virtuals?sort%5B0%5D=mindshare%3Adesc&pageSize=10&page=1`,  { cache: 'no-store', signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : { data: [] }),
      fetch(`${BASE}/api/virtuals?sort%5B0%5D=mindshare%3Aasc&pageSize=10&page=1`,   { cache: 'no-store', signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : { data: [] }),
      fetch(`${BASE}/api/virtuals?sort%5B0%5D=createdAt%3Adesc&pageSize=10&page=1`,  { cache: 'no-store', signal: AbortSignal.timeout(8000) }).then(r => r.ok ? r.json() : { data: [] }),
      fetch(VIRTUAL_PRICE_URL, { cache: 'no-store', signal: AbortSignal.timeout(4000) }).then(r => r.ok ? r.json() : null),
    ])

    const virtualPrice: number = priceRes?.coins?.['base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b']?.price ?? 0.66

    // Deduplicate across all three fetches
    const seen = new Set<string>()
    const allItems: Record<string, unknown>[] = []
    for (const page of [r1, r2, r3]) {
      for (const a of (page?.data ?? [])) {
        const id = String((a as Record<string,unknown>).id ?? '')
        if (!seen.has(id)) { seen.add(id); allItems.push(a as Record<string, unknown>) }
      }
    }
    if (!allItems.length) throw new Error('no agents')

    // Convert to the same shape as CookieAgent for processing
    const agents = allItems.map(a => {
      const launchMs = a.launchedAt ? Date.parse(String(a.launchedAt))
        : a.createdAt ? Date.parse(String(a.createdAt)) : Date.now()
      return {
        framework:         'G.A.M.E.',  // All Virtuals agents are G.A.M.E.
        ageDays:           Math.max(1, Math.floor((Date.now() - launchMs) / 86_400_000)),
        mindshare:         Number(a.mindshare ?? 0),
        mindshareChange24h:Number(a.priceChangePercent24h ?? 0),
        marketCap:         Number(a.mcapInVirtual ?? 0) * virtualPrice,
        volume24h:         Number(a.volume24h ?? 0),
      }
    })
    if (!agents.length) throw new Error('no agents')

    // Group agents by framework × age bucket
    type Cell = { total: number; inactive30d: number; inactive90d: number }
    const matrix: Record<string, Record<string, Cell>> = {}

    for (const a of agents) {
      const fw     = a.framework || 'Custom'
      const bucket = ageBucket(a.ageDays)

      if (!matrix[fw]) matrix[fw] = {}
      if (!matrix[fw][bucket]) matrix[fw][bucket] = { total: 0, inactive30d: 0, inactive90d: 0 }

      const cell = matrix[fw][bucket]
      cell.total++

      // "Inactive" proxy: mindshare < 0.01 (essentially no ecosystem attention)
      // 30d loss: agents with very low mindshare change (stagnant)
      if (a.mindshare < 0.01) cell.inactive30d++
      // 90d loss: agents with near-zero mindshare AND negative trend
      if (a.mindshare < 0.01 && a.mindshareChange24h < -1) cell.inactive90d++
    }

    const rows: ActuarialRow[] = []
    for (const [framework, buckets] of Object.entries(matrix)) {
      for (const bucket of AGE_BUCKETS) {
        const cell = buckets[bucket]
        if (!cell || cell.total === 0) continue

        rows.push({
          framework,
          ageBucket: bucket,
          audited:   AUDITED_FRAMEWORKS.has(framework),
          loss30d:   Math.round((cell.inactive30d / cell.total) * 100),
          loss90d:   Math.round((cell.inactive90d / cell.total) * 100),
          n:         cell.total,
        })
      }
    }

    if (!rows.length) throw new Error('no actuarial rows computed')

    // Sort by framework then age bucket order
    const bucketOrder: Record<string, number> = { '0-30d': 0, '31-90d': 1, '91-180d': 2, '180d+': 3 }
    rows.sort((a, b) =>
      a.framework.localeCompare(b.framework) || bucketOrder[a.ageBucket] - bucketOrder[b.ageBucket]
    )

    cache = { data: rows, at: Date.now() }
    return Response.json(rows)
  } catch (err) {
    console.warn('[actuarial] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json(mockActuarial)
  }
}
