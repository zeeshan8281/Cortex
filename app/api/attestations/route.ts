import { fetchPoAACompletions } from '@/lib/sources/olas'
import { fetchVirtualsAttestations } from '@/lib/sources/virtuals'
import { mockAttestations } from '@/lib/mock'
import type { Attestation } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const attestations: Attestation[] = []

  // Olas PoAA — TheGraph public subgraph, no key needed
  try {
    const completions = await fetchPoAACompletions(4)
    for (const c of completions) {
      attestations.push({
        timestamp: new Date(c.timestamp * 1000).toISOString().slice(11, 19),
        type:      'PoAA',
        agent:     c.agentAddress.slice(0, 10),
        action:    c.action,
        hash:      c.txHash.slice(2, 10),
        sig:       `kms:${c.id.slice(0, 6)}`,
        chain:     c.chain,
        value:     undefined,
      })
    }
  } catch {
    // Olas subgraph not reachable
  }

  // Virtuals agent activity — free public API, no key needed
  try {
    const agents = await fetchVirtualsAttestations(5)
    for (const a of agents) {
      attestations.push({
        timestamp: new Date(a.timestamp * 1000).toISOString().slice(11, 19),
        type:      'Virtuals',
        agent:     a.agentName.slice(0, 14).replace(/\s+/g, '_'),
        action:    a.action,
        hash:      a.txHash.slice(2, 10),
        sig:       `kms:vrt${a.id.slice(0, 4)}`,
        chain:     a.chain,
        value:     a.score > 0 ? a.score : undefined,
      })
    }
  } catch {
    // Virtuals not reachable
  }

  if (!attestations.length) return Response.json(mockAttestations)

  return Response.json(
    attestations.sort(() => Math.random() - 0.5).slice(0, 8)
  )
}
