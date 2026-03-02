import { fetchProtocolYields } from '@/lib/sources/defillama'
import { mockDeFAI } from '@/lib/mock'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const yields = await fetchProtocolYields()
    if (!yields.length) return Response.json(mockDeFAI)

    return Response.json(
      yields.map(p => ({
        name:  p.name,
        apy:   p.apy,
        aum:   p.tvlUsd,
        trend: p.trend,
      }))
    )
  } catch (err) {
    console.warn('[yields] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json(mockDeFAI)
  }
}
