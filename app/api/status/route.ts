// /api/status — validates every data source live
// Shows: endpoint reachable, data shape valid, sample value, latency

export const dynamic = 'force-dynamic'

interface SourceStatus {
  name: string
  keyEnv: string | null
  keyPresent: boolean
  reachable: boolean
  valid: boolean
  sampleValue: string
  latencyMs: number
  error: string | null
  mode: 'LIVE' | 'MOCK'
}

async function check(
  name: string,
  keyEnv: string | null,
  fn: () => Promise<string>
): Promise<SourceStatus> {
  const keyPresent = keyEnv == null || !!process.env[keyEnv]
  const t0 = Date.now()
  let reachable = false
  let valid = false
  let sampleValue = ''
  let error: string | null = null

  if (!keyPresent) {
    error = `${keyEnv} not set`
  } else {
    try {
      sampleValue = await fn()
      reachable = true
      valid = true
    } catch (e) {
      reachable = false
      error = e instanceof Error ? e.message : String(e)
    }
  }

  return {
    name,
    keyEnv,
    keyPresent,
    reachable,
    valid,
    sampleValue,
    latencyMs: Date.now() - t0,
    error,
    mode: valid ? 'LIVE' : 'MOCK',
  }
}

export async function GET() {
  const results = await Promise.all([

    check('Virtuals Protocol', null, async () => {
      const res = await fetch(
        'https://api.virtuals.io/api/virtuals?pageSize=1',
        { cache: 'no-store', signal: AbortSignal.timeout(6000) }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const total = d?.meta?.pagination?.total ?? 0
      const first = d?.data?.[0]
      if (!first) throw new Error('agents array empty')
      return `${total} agents · top: ${first.virtualName ?? first.name}`
    }),

    check('DeFiLlama (yields)', null, async () => {
      const res = await fetch('https://yields.llama.fi/pools', {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const pools = d?.data ?? []
      if (!pools.length) throw new Error('pools array empty')
      const aave = pools.find((p: { project?: string }) => p.project?.includes('aave'))
      return aave
        ? `Aave APY=${aave.apy?.toFixed(2)}% · ${pools.length} pools`
        : `${pools.length} pools`
    }),

    check('DeFiLlama (prices)', null, async () => {
      const key = 'base:0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b'
      const res = await fetch(`https://coins.llama.fi/prices/current/${key}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const price = d?.coins?.[key]?.price
      if (!price) throw new Error('price missing')
      return `VIRTUAL = $${price.toFixed(4)}`
    }),

    check('Binance (ETH/TAO)', null, async () => {
      const res = await fetch(
        'https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT',
        { cache: 'no-store', signal: AbortSignal.timeout(5000) }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const price = Number(d?.lastPrice ?? 0)
      if (!price) throw new Error('lastPrice missing')
      return `ETH = $${price.toLocaleString()}`
    }),

    check('Olas subgraph', null, async () => {
      const res = await fetch(
        'https://api.thegraph.com/subgraphs/name/autonolas/autonolas-registry-gnosis',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '{ agents(first:1) { id agentId } }' }),
          cache: 'no-store',
          signal: AbortSignal.timeout(6000),
        }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const agents = d?.data?.agents ?? []
      if (!agents.length) throw new Error('agents array empty')
      return `agent id=${agents[0].agentId}`
    }),

    check('RSS / News', null, async () => {
      const res = await fetch('https://cointelegraph.com/rss', {
        cache: 'no-store',
        signal: AbortSignal.timeout(6000),
        headers: { 'User-Agent': 'CORTEX/1.0' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const xml = await res.text()
      const titles = xml.match(/<title[^>]*>([\s\S]*?)<\/title>/gi) ?? []
      if (titles.length < 2) throw new Error('no items found')
      const sample = titles[1].replace(/<[^>]+>/g, '').replace(/<!\[CDATA\[|\]\]>/g, '').trim()
      return `"${sample.slice(0, 50)}…"`
    }),

    check('OpenRouter', 'OPENROUTER_API_KEY', async () => {
      const res = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      const count = d?.data?.length ?? 0
      return `${count} models available`
    }),

    check('EigenDA proxy', null, async () => {
      const proxyUrl = process.env.EIGENDA_PROXY_URL ?? 'http://localhost:4242'
      const res = await fetch(`${proxyUrl}/health`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return `proxy reachable at ${proxyUrl}`
    }),

  ])

  const live  = results.filter(r => r.mode === 'LIVE').length
  const total = results.length

  return Response.json({
    summary: { live, mock: total - live, total },
    sources: results,
    checkedAt: new Date().toISOString(),
  })
}
