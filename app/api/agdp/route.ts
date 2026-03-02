import { fetchStats as fetchVirtualsStats } from '@/lib/sources/virtuals'
import { mockTopBar } from '@/lib/mock'

export const dynamic = 'force-dynamic'

let cache: { data: object; at: number } | null = null
const CACHE_MS = 60_000

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return Response.json(cache.data)
  }

  try {
    const v = await fetchVirtualsStats()

    if (!v.aGDP) throw new Error('aGDP computed as 0')

    const agdpM = Math.round(v.aGDP / 1_000_000)

    const data = {
      agdp:        v.aGDP,
      agdpM,
      agdpChange:  mockTopBar.aGDPChange,  // no historical endpoint yet
      totalAgents: v.totalAgents,
      virtualPrice:v.virtualPrice,
    }
    cache = { data, at: Date.now() }
    return Response.json(data)
  } catch (err) {
    console.warn('[agdp] falling back to mock:', err instanceof Error ? err.message : err)
    return Response.json({
      agdp:        mockTopBar.aGDP * 1_000_000,
      agdpM:       mockTopBar.aGDP,
      agdpChange:  mockTopBar.aGDPChange,
      totalAgents: mockTopBar.totalAgents,
      virtualPrice:0.66,
    })
  }
}
