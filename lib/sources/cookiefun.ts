// Virtuals Protocol public API — replaces Cookie.fun entirely
// api.virtuals.io/api/virtuals is fully public, no API key needed
// Same CookieAgent interface preserved so ARS + agents routes need no changes

const VIRTUALS_BASE = 'https://api.virtuals.io'
const VIRTUAL_PRICE_URL = 'https://coins.llama.fi/prices/current/base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'

export interface CookieAgent {
  id: string
  agentName: string
  agentTicker: string
  mindshare: number
  mindshareChange24h: number
  marketCap: number
  price: number
  volume24h: number
  holdersCount: number
  twitterFollowers: number
  contractAddress: string
  chain: string
  agentScore: number   // 0-100
  ageDays: number      // computed from launchedAt / createdAt
  framework: string    // detected from cores / name
}

export interface CookieAgentsResponse {
  agents: CookieAgent[]
  total: number
}

async function getVirtualUsdPrice(): Promise<number> {
  try {
    const res = await fetch(VIRTUAL_PRICE_URL, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4000),
    })
    const d = await res.json()
    return d?.coins?.['base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b']?.price ?? 0.66
  } catch {
    return 0.66
  }
}

function detectFramework(agent: Record<string, unknown>): string {
  const name  = String(agent.name ?? '').toLowerCase()
  const cores = (agent.cores as { name?: string }[] | undefined) ?? []
  const coreNames = cores.map(c => String(c.name ?? '').toLowerCase()).join(' ')

  if (name.includes('eliza') || coreNames.includes('eliza'))         return 'ElizaOS'
  if (name.includes('game') || coreNames.includes('game'))           return 'G.A.M.E.'
  if (name.includes('olas') || name.includes('autonolas'))           return 'Olas'
  if (name.includes('crew') || coreNames.includes('crew'))           return 'CrewAI'
  if (name.includes('goat') || coreNames.includes('goat'))           return 'GOAT'
  if ((agent.chain as string)?.toUpperCase() === 'BASE')             return 'G.A.M.E.'
  return 'Custom'
}

export async function fetchTopAgents(limit = 50): Promise<CookieAgentsResponse> {
  // Virtuals API pagination is broken — all pages return the same top-10 results.
  // We fetch by different sort keys to get diverse agent data (top by mindshare,
  // top by volume, top by mcap) and deduplicate by id.
  const sorts = ['mindshare%3Adesc', 'volume24h%3Adesc', 'mcapInVirtual%3Adesc']
  const pagesNeeded = Math.ceil(limit / 10)

  const [pageResults, virtualPrice] = await Promise.all([
    Promise.all(
      sorts.slice(0, pagesNeeded).map(sort =>
        fetch(
          `${VIRTUALS_BASE}/api/virtuals?sort%5B0%5D=${sort}&pageSize=10&page=1`,
          { cache: 'no-store', signal: AbortSignal.timeout(10000) }
        ).then(r => { if (!r.ok) throw new Error(`Virtuals API ${r.status}`); return r.json() })
      )
    ),
    getVirtualUsdPrice(),
  ])

  // Deduplicate by id, preserving order (mindshare sort first = highest priority)
  const seen = new Set<string>()
  const items: Record<string, unknown>[] = []
  for (const page of pageResults) {
    for (const agent of (page?.data ?? [])) {
      const id = String((agent as Record<string,unknown>).id ?? (agent as Record<string,unknown>).uid ?? '')
      if (!seen.has(id)) { seen.add(id); items.push(agent as Record<string, unknown>) }
    }
  }
  const total: number = pageResults[0]?.meta?.pagination?.total ?? items.length

  const agents: CookieAgent[] = items.map(a => {
    const mcapInVirtual = Number(a.mcapInVirtual ?? 0)
    const marketCapUsd  = mcapInVirtual * virtualPrice

    // Age in days from launch date or creation date
    const launchMs = a.launchedAt
      ? Date.parse(String(a.launchedAt))
      : a.createdAt
      ? Date.parse(String(a.createdAt))
      : Date.now()
    const ageDays = Math.max(1, Math.floor((Date.now() - launchMs) / 86_400_000))

    // agentScore: 0-100, derived from level (1-3) + mindshare normalised
    const level      = Number(a.level ?? 1)
    const mindshare  = Number(a.mindshare ?? 0)
    const agentScore = Math.min(100, level * 25 + Math.min(25, mindshare * 10))

    return {
      id:                String(a.id ?? ''),
      agentName:         String(a.name ?? ''),
      agentTicker:       String(a.symbol ?? ''),
      mindshare,
      mindshareChange24h:Number(a.priceChangePercent24h ?? 0),
      marketCap:         marketCapUsd,
      price:             Number(a.virtualTokenValue ?? 0) * virtualPrice,
      volume24h:         Number(a.volume24h ?? 0),
      holdersCount:      Number(a.holderCount ?? 0),
      twitterFollowers:  0,
      contractAddress:   String(a.tokenAddress ?? ''),
      chain:             String(a.chain ?? 'BASE').toLowerCase(),
      agentScore,
      ageDays,
      framework:         detectFramework(a),
    }
  })

  return { agents, total }
}

// Legacy compat — not used in current routes but kept for safety
export async function fetchAgentById(_id: string): Promise<CookieAgent | null> {
  return null
}
