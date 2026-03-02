import { fetchPrices } from '@/lib/sources/coingecko'
import { mockTopBar } from '@/lib/mock'

export const dynamic = 'force-dynamic'

let cache: { data: object; at: number } | null = null
const CACHE_MS = 20_000   // 20s server-side cache — Binance has no rate limit, VIRTUAL once per 20s is fine

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const prices = await fetchPrices()
    const data = {
      eth:              prices.eth             || mockTopBar.ethPrice,
      ethChange24h:     prices.ethChange24h,
      virtual:          prices.virtual         || mockTopBar.virtualPrice,
      virtualChange24h: prices.virtualChange24h,
      tao:              prices.tao,
      taoChange24h:     prices.taoChange24h,
    }
    cache = { data, at: Date.now() }
    return Response.json(data)
  } catch (err) {
    console.warn('[prices] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json({
      eth:              mockTopBar.ethPrice,
      ethChange24h:     0,
      virtual:          mockTopBar.virtualPrice,
      virtualChange24h: 0,
      tao:              185.77,
      taoChange24h:     0,
    })
  }
}
