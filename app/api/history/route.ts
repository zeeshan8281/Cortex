// 30-day VIRTUAL token price history from DeFiLlama chart endpoint
// Used as AAI-50 index proxy (VIRTUAL is the base asset for all Virtuals Protocol agents)
// Index scale: virtual_price × 1500 → keeps values in the ~800-2000 range

import { mockAAI50History } from '@/lib/mock'
import type { AAI50DataPoint } from '@/types'

const VIRTUAL_KEY = 'base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'
const INDEX_SCALE = 1500

export const dynamic = 'force-dynamic'

let cache: { data: AAI50DataPoint[]; at: number } | null = null
const CACHE_MS = 10 * 60_000  // 10 min — history doesn't change frequently

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const start = Math.floor(Date.now() / 1000) - 30 * 86_400
    const url   = `https://coins.llama.fi/chart/${VIRTUAL_KEY}?start=${start}&span=30&period=1d`

    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`DeFiLlama chart ${res.status}`)

    const json  = await res.json()
    const raw: { timestamp: number; price: number }[] =
      json?.coins?.[VIRTUAL_KEY]?.prices ?? []

    if (raw.length < 5) throw new Error('insufficient history points')

    const data: AAI50DataPoint[] = raw.map(p => ({
      date:  new Date(p.timestamp * 1000).toISOString().slice(0, 10),
      value: Math.round(p.price * INDEX_SCALE * 10) / 10,
    }))

    cache = { data, at: Date.now() }
    return Response.json(data)
  } catch (err) {
    console.warn('[history] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json(mockAAI50History)
  }
}
