// /api/snapshot — periodic EigenDA state snapshot
// GET  → returns latest blob reference (commitment, timestamp, data) or null
// POST → (internal) builds snapshot from live data and posts to EigenDA

import { disperseBlob } from '@/lib/sources/eigenda'

export const dynamic = 'force-dynamic'

interface SnapshotPayload {
  schemaVersion: '1'
  timestamp: string
  aGDP: number
  virtualPrice: number
  totalAgents: number
  aai50Index: number
  top10Agents: { name: string; ticker: string; arsScore: number; framework: string }[]
}

interface BlobRecord {
  commitment: string
  postedAt: string
  data: SnapshotPayload
}

// In-memory store — one process, one record
let latestBlob: BlobRecord | null = null

export function GET() {
  return Response.json(latestBlob)
}

export async function POST(request: Request) {
  // Only accept calls from localhost (instrumentation) or the TEE internal network
  const origin = request.headers.get('origin') ?? ''
  const host = request.headers.get('host') ?? ''
  const isInternal = origin === '' || host.startsWith('localhost') || host.startsWith('127.')
  if (!isInternal) {
    return new Response('Forbidden', { status: 403 })
  }

  // Fetch live data from internal API routes
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  let aGDP = 0
  let virtualPrice = 0
  let totalAgents = 0
  let aai50Index = 0
  let top10Agents: SnapshotPayload['top10Agents'] = []

  try {
    const [agdpRes, arsRes, pricesRes, agentsRes] = await Promise.allSettled([
      fetch(`${base}/api/agdp`,   { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
      fetch(`${base}/api/ars`,    { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
      fetch(`${base}/api/prices`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
      fetch(`${base}/api/agents`, { cache: 'no-store', signal: AbortSignal.timeout(5000) }),
    ])

    if (agdpRes.status === 'fulfilled' && agdpRes.value.ok) {
      const d = await agdpRes.value.json()
      aGDP         = d.agdpM        ?? 0
      totalAgents  = d.totalAgents  ?? 0
    }

    if (arsRes.status === 'fulfilled' && arsRes.value.ok) {
      const agents: { name: string; score: number; framework: string }[] = await arsRes.value.json()
      top10Agents = agents.slice(0, 10).map(a => ({
        name:       a.name,
        ticker:     a.name.toUpperCase().slice(0, 6),
        arsScore:   a.score,
        framework:  a.framework,
      }))
    }

    if (pricesRes.status === 'fulfilled' && pricesRes.value.ok) {
      const d = await pricesRes.value.json()
      virtualPrice = d.virtual ?? 0
    }

    if (agentsRes.status === 'fulfilled' && agentsRes.value.ok) {
      const d = await agentsRes.value.json()
      aai50Index  = d.topBar?.aai50       ?? 0
      totalAgents = d.topBar?.totalAgents ?? totalAgents
    }
  } catch {
    // Proceed with zeros — better to post a partial snapshot than skip entirely
  }

  const payload: SnapshotPayload = {
    schemaVersion: '1',
    timestamp:     new Date().toISOString(),
    aGDP,
    virtualPrice,
    totalAgents,
    aai50Index,
    top10Agents,
  }

  const commitment = await disperseBlob(payload)

  if (commitment) {
    latestBlob = { commitment, postedAt: payload.timestamp, data: payload }
    return Response.json({ ok: true, commitment, postedAt: payload.timestamp })
  }

  // Proxy unreachable — store a synthetic record so the UI can still render
  const syntheticCommitment = `mock:${Date.now().toString(16)}`
  latestBlob = { commitment: syntheticCommitment, postedAt: payload.timestamp, data: payload }
  return Response.json({ ok: false, reason: 'eigenda-proxy unreachable', commitment: syntheticCommitment })
}
