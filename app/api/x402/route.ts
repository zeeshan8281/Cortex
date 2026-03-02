import { fetchX402Flows } from '@/lib/sources/virtuals'
import { mockX402 } from '@/lib/mock'
import type { X402Flow } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!process.env.VIRTUALS_API_KEY) {
    const total = mockX402.reduce((s, f) => s + f.amount, 0)
    return Response.json({ flows: mockX402, total, trend7d: 34, largest: 2300 })
  }

  try {
    const raw = await fetchX402Flows()
    if (!raw.length) throw new Error('empty')

    // Aggregate by from-agent
    const byFrom: Record<string, { to: string; amount: number; txCount: number }[]> = {}
    for (const f of raw) {
      if (!byFrom[f.from]) byFrom[f.from] = []
      byFrom[f.from].push({ to: f.to, amount: f.amount, txCount: f.txCount })
    }

    const total = raw.reduce((s, f) => s + f.amount, 0)
    const maxAmount = Math.max(...raw.map(f => f.amount), 1)

    const flows: X402Flow[] = Object.entries(byFrom)
      .map(([from, flows]) => {
        const topFlow = flows.sort((a, b) => b.amount - a.amount)[0]
        const amount = flows.reduce((s, f) => s + f.amount, 0)
        return {
          from,
          to:       topFlow.to,
          amount,
          barWidth: Math.round((amount / maxAmount) * 90),
        }
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)

    const largest = Math.max(...raw.map(f => f.amount))

    return Response.json({ flows, total, trend7d: 0, largest })
  } catch (err) {
    console.warn('[x402] falling back to mock:', err instanceof Error ? err.message : err)
    const total = mockX402.reduce((s, f) => s + f.amount, 0)
    return Response.json({ flows: mockX402, total, trend7d: 34, largest: 2300 })
  }
}
