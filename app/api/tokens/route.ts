import { NextResponse } from 'next/server'
import { mockTokens } from '@/lib/mock'
import type { TokenWatch } from '@/types'

// DeFiLlama coins API — free, no key, no rate limits
// Supports: base:{address}, ethereum:{address}, coingecko:{id}
const LLAMA = 'https://coins.llama.fi'

const TOKENS: { symbol: string; name: string; key: string }[] = [
  { symbol: 'VIRTUAL', name: 'Virtuals Protocol', key: 'base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'   },
  { symbol: 'OLAS',    name: 'Autonolas',          key: 'coingecko:autonolas'                               },
  { symbol: 'TAO',     name: 'Bittensor',           key: 'coingecko:bittensor'                              },
  { symbol: 'AIXBT',   name: 'AIXBT by Virtuals',   key: 'base:0x4F9Fd6Be4a90f2620860d680c0d4d5Fb53d1A825' },
  { symbol: 'COOKIE',  name: 'Cookie DAO',          key: 'coingecko:cookie-dao'                             },
]

const KEYS_PARAM = TOKENS.map(t => t.key).join(',')

// Compute 24h change: (currentPrice - price24hAgo) / price24hAgo * 100
async function fetch24hChange(): Promise<Record<string, number>> {
  const ts24h = Math.floor(Date.now() / 1000) - 86_400
  try {
    const res = await fetch(
      `${LLAMA}/prices/historical/${ts24h}/${KEYS_PARAM}`,
      { cache: 'no-store', signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return {}
    const d = await res.json()
    return d?.coins ?? {}
  } catch {
    return {}
  }
}

let cache: { data: TokenWatch[]; at: number } | null = null
const CACHE_MS = 60_000

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json(cache.data)
  }

  try {
    const [currentRes, hist24h] = await Promise.all([
      fetch(`${LLAMA}/prices/current/${KEYS_PARAM}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(6000),
      }),
      fetch24hChange(),
    ])

    if (!currentRes.ok) throw new Error(`DeFiLlama ${currentRes.status}`)
    const current = await currentRes.json()
    const coins: Record<string, { price: number; symbol?: string; mcap?: number }> = current?.coins ?? {}

    const tokens: TokenWatch[] = TOKENS.map((t, i) => {
      const live  = coins[t.key]
      const hist  = hist24h[t.key] as { price?: number } | undefined
      const price = live?.price ?? mockTokens[i].price

      const change24h = hist?.price && hist.price > 0
        ? ((price - hist.price) / hist.price) * 100
        : mockTokens[i].change24h

      // mcap from DeFiLlama is raw USD — convert to millions
      const marketCapM = live?.mcap && live.mcap > 0
        ? Math.round(live.mcap / 1_000_000)
        : mockTokens[i].marketCapM

      return {
        symbol:      t.symbol,
        name:        t.name,
        price,
        change24h:   Math.round(change24h * 10) / 10,
        marketCapM,
        coingeckoId: t.key,
      }
    })

    cache = { data: tokens, at: Date.now() }
    return NextResponse.json(tokens)
  } catch (err) {
    console.warn('[tokens] falling back to mock:', err instanceof Error ? err.message : err)
    return NextResponse.json(mockTokens)
  }
}
