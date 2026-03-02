// DeFiLlama API — no auth required
// Docs: https://defillama.com/docs/api
const BASE = 'https://yields.llama.fi'

const TARGET_PROTOCOLS = ['aave-v3', 'aave', 'compound', 'compound-v3', 'curve', 'uniswap-v3', 'morpho', 'pendle', 'yearn']
const TARGET_CHAINS = ['Ethereum', 'Arbitrum', 'Base', 'Optimism', 'Polygon']

export interface DefiLlamaPool {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apyBase: number
  apyReward: number | null
  apy: number
  apyPct1D: number | null
  apyPct7D: number | null
}

export async function fetchYields(): Promise<DefiLlamaPool[]> {
  const res = await fetch(`${BASE}/pools`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`DeFiLlama ${res.status}`)
  const json = await res.json()
  const pools: DefiLlamaPool[] = json?.data ?? []

  // Filter to target protocols and chains with reasonable TVL
  return pools
    .filter(p =>
      TARGET_PROTOCOLS.some(proto => p.project?.toLowerCase().includes(proto)) &&
      TARGET_CHAINS.includes(p.chain) &&
      p.tvlUsd > 100_000 &&
      p.apy > 0
    )
    .sort((a, b) => b.tvlUsd - a.tvlUsd)
    .slice(0, 20)
}

// Aggregate by protocol — one row per protocol showing best pool
export interface ProtocolYield {
  name: string
  apy: number
  tvlUsd: number
  trend: 'up' | 'down' | 'flat'
}

export async function fetchProtocolYields(): Promise<ProtocolYield[]> {
  const pools = await fetchYields()

  const byProject: Record<string, DefiLlamaPool[]> = {}
  for (const p of pools) {
    const key = p.project
    if (!byProject[key]) byProject[key] = []
    byProject[key].push(p)
  }

  const protocols: ProtocolYield[] = Object.entries(byProject).map(([project, ps]) => {
    const totalTvl = ps.reduce((s, p) => s + p.tvlUsd, 0)
    const avgApy = ps.reduce((s, p) => s + p.apy, 0) / ps.length
    const trend1d = ps[0]?.apyPct1D
    return {
      name: formatProtocolName(project),
      apy: Math.round(avgApy * 10) / 10,
      tvlUsd: totalTvl,
      trend: trend1d == null ? 'flat' : trend1d > 0.5 ? 'up' : trend1d < -0.5 ? 'down' : 'flat',
    }
  })

  return protocols.sort((a, b) => b.tvlUsd - a.tvlUsd).slice(0, 8)
}

function formatProtocolName(project: string): string {
  const names: Record<string, string> = {
    'aave-v3': 'Aave v3',
    'aave': 'Aave',
    'compound': 'Compound',
    'compound-v3': 'Compound v3',
    'curve': 'Curve',
    'uniswap-v3': 'Uniswap v3',
    'morpho': 'Morpho',
    'pendle': 'Pendle',
    'yearn': 'Yearn',
  }
  return names[project] ?? project.charAt(0).toUpperCase() + project.slice(1)
}
