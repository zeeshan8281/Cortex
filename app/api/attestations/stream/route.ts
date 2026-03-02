import { fetchPoAACompletions } from '@/lib/sources/olas'
import { mockAttestations } from '@/lib/mock'
import type { Attestation } from '@/types'

export const dynamic = 'force-dynamic'

// Simulated agent names / actions for mock stream
const MOCK_AGENTS = ['Griffin TEA', 'Orbit banker', 'AIXBT', 'Wayfinder', 'LUNA']
const MOCK_TYPES: Attestation['type'][] = ['PoAA', 'Virtuals', 'Griffin', 'Orbit', 'Wayfinder']
const MOCK_CHAINS = ['Base', 'Gnosis', 'Ethereum', 'Arbitrum']
const MOCK_ACTIONS = [
  'yield_opt', 'trade:ETH/USDC', 'task_complete', 'rebalance:Aave',
  'cross_chain_swap', 'subnet36_job', 'poaa_checkpoint', 'trade:BTC/USDC',
]

function randomHex(len: number) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function generateAttestation(): Attestation {
  const type = MOCK_TYPES[Math.floor(Math.random() * MOCK_TYPES.length)]
  const now = new Date()
  return {
    timestamp: now.toISOString().slice(11, 19),
    type,
    agent:     MOCK_AGENTS[Math.floor(Math.random() * MOCK_AGENTS.length)].replace(' ', '_'),
    action:    MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)],
    hash:      randomHex(8),
    sig:       `kms:${randomHex(6)}`,
    chain:     MOCK_CHAINS[Math.floor(Math.random() * MOCK_CHAINS.length)],
    value:     Math.random() > 0.5 ? Math.round(Math.random() * 2000 + 50) : undefined,
  }
}

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Attestation) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch {
          // client disconnected
        }
      }

      // Send initial batch from Olas (TheGraph public subgraph — no key needed)
      try {
        const completions = await fetchPoAACompletions(5)
        for (const c of completions) {
          send({
            timestamp: new Date(c.timestamp * 1000).toISOString().slice(11, 19),
            type:      'PoAA',
            agent:     c.agentAddress.slice(0, 12),
            action:    c.action,
            hash:      c.txHash.slice(2, 10),
            sig:       `kms:${c.id.slice(0, 6)}`,
            chain:     c.chain,
            value:     undefined,
          })
        }
      } catch {
        mockAttestations.forEach(send)
      }

      // Continuously stream new attestations every 3-6 seconds
      const tick = () => {
        try {
          send(generateAttestation())
        } catch {
          clearInterval(interval)
        }
      }

      const interval = setInterval(tick, 3000 + Math.random() * 3000)

      // Cleanup if client disconnects
      return () => clearInterval(interval)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
