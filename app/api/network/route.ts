import { NextResponse } from 'next/server'
import { mockNetwork } from '@/lib/mock'
import type { NetworkHealth, ChainHealth } from '@/types'

const CHAINS = [
  { chain: 'ETH',  rpc: 'https://ethereum.publicnode.com' },
  { chain: 'BASE', rpc: 'https://mainnet.base.org'        },
  { chain: 'ARB',  rpc: 'https://arbitrum.publicnode.com'  },
]

async function fetchGas(chain: string, rpc: string): Promise<ChainHealth> {
  const t0 = Date.now()
  try {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_gasPrice', params: [] }),
      signal: AbortSignal.timeout(4000),
    })
    const json = await res.json()
    const latencyMs = Date.now() - t0
    const weiHex: string = json.result ?? '0x0'
    const gwei = parseInt(weiHex, 16) / 1e9
    const status: ChainHealth['status'] = gwei > 200 ? 'slow' : 'ok'
    return { chain, gasPriceGwei: gwei, status, latencyMs }
  } catch {
    return { chain, gasPriceGwei: 0, status: 'down', latencyMs: Date.now() - t0 }
  }
}

let cache: { data: NetworkHealth; at: number } | null = null
const CACHE_MS = 20_000

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json(cache.data)
  }

  try {
    const results = await Promise.all(CHAINS.map(c => fetchGas(c.chain, c.rpc)))
    const data: NetworkHealth = { chains: results, checkedAt: Date.now() }
    cache = { data, at: Date.now() }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(mockNetwork)
  }
}
