import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const html = `<!DOCTYPE html><html><head><title>CORTEX</title><style>body{background:#0a0a0a;color:#0f0;font-family:monospace;padding:40px}h1{font-size:48px}</style></head><body><h1>CORTEX Terminal</h1><p>TEE: LIVE | EigenCompute: Connected</p></body></html>`

app.get('/', (_req, res) => res.send(html))

// API Routes - Return mock data
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/prices', (_req, res) => {
  res.json({
    eth: 3412.50,
    ethChange24h: 2.3,
    virtual: 0.66,
    virtualChange24h: -1.2,
  })
})

app.get('/api/agents', (_req, res) => {
  res.json({
    aai50: [
      { rank: 1, name: 'AIXBT', ticker: 'AIXBT', score: 847, change: 2.1, direction: 'up' },
      { rank: 2, name: 'LUNA', ticker: 'LUNA', score: 791, change: -0.5, direction: 'down' },
      { rank: 3, name: 'GAME', ticker: 'GAME', score: 723, change: 1.8, direction: 'up' },
      { rank: 4, name: 'OLAS', ticker: 'OLAS', score: 698, change: 0.3, direction: 'flat' },
      { rank: 5, name: 'PIPPIN', ticker: 'PIPPIN', score: 623, change: -2.1, direction: 'down' },
    ],
    topBar: {
      totalAgents: 47231,
      aai50: 1247.3,
      aai50Change: 2.3,
    },
  })
})

app.get('/api/agdp', (_req, res) => {
  res.json({
    agdpM: 479,
    agdpChange: 5.2,
    totalAgents: 47231,
  })
})

app.get('/api/yields', (_req, res) => {
  res.json([
    { name: 'Aave v3', apy: 4.2, aum: 2100000, trend: 'up' },
    { name: 'Compound', apy: 3.8, aum: 1800000, trend: 'flat' },
    { name: 'Curve', apy: 8.1, aum: 890000, trend: 'up' },
    { name: 'Uniswap', apy: 2.9, aum: 3200000, trend: 'flat' },
    { name: 'Morpho', apy: 6.7, aum: 445000, trend: 'up' },
  ])
})

app.get('/api/ars', (_req, res) => {
  res.json([
    { id: 'ag_001', name: 'AIXBT', score: 847, label: 'STRONG', framework: 'ElizaOS', frameworkVersion: '1.2.1', audited: true, incidents: 0, capital: 22000000, x402Reliability: 99.3 },
    { id: 'ag_002', name: 'LUNA', score: 791, label: 'GOOD', framework: 'ElizaOS', frameworkVersion: '1.2.0', audited: true, incidents: 0, capital: 15000000, x402Reliability: 98.1 },
    { id: 'ag_003', name: 'PIPPIN', score: 623, label: 'MEDIUM', framework: 'Custom', frameworkVersion: 'N/A', audited: false, incidents: 2, capital: 3200000, x402Reliability: 87.5 },
    { id: 'ag_004', name: 'TRUTH', score: 441, label: 'LOW', framework: 'Unknown', frameworkVersion: 'N/A', audited: false, incidents: 5, capital: 890000, x402Reliability: 62.3 },
  ])
})

app.get('/api/x402', (_req, res) => {
  res.json({
    flows: [
      { from: 'Griffin agents', to: 'Data layer', amount: 41000, barWidth: 32 },
      { from: 'Orbit agents', to: 'Yield oracle', amount: 29000, barWidth: 23 },
      { from: 'MoltLeague', to: 'OpenRouter', amount: 12000, barWidth: 9 },
      { from: 'AIXBT', to: 'Market oracle', amount: 8200, barWidth: 6 },
      { from: 'LUNA', to: 'Content gen', amount: 3100, barWidth: 2 },
    ],
    total: 127441,
    trend7d: 34,
    largest: 2300,
  })
})

app.get('/api/tokens', (_req, res) => {
  res.json([
    { symbol: 'ETH', name: 'Ethereum', price: 3412.50, change24h: 2.3, marketCapM: 410000, coingeckoId: 'ethereum' },
    { symbol: 'VIRTUAL', name: 'Virtuals Protocol', price: 0.66, change24h: -1.2, marketCapM: 432, coingeckoId: 'virtual-protocol' },
    { symbol: 'TAO', name: 'Bittensor', price: 185.77, change24h: 5.4, marketCapM: 1980, coingeckoId: 'bittensor' },
    { symbol: 'OLAS', name: 'Autonolas', price: 2.34, change24h: -3.2, marketCapM: 156, coingeckoId: 'autonolas' },
    { symbol: 'FET', name: 'Fetch.ai', price: 0.78, change24h: 1.1, marketCapM: 650, coingeckoId: 'fetch-ai' },
  ])
})

app.get('/api/network', (_req, res) => {
  res.json({
    chains: [
      { chain: 'Ethereum', gasPriceGwei: 18.5, status: 'ok', latencyMs: 234 },
      { chain: 'Base', gasPriceGwei: 0.12, status: 'ok', latencyMs: 156 },
      { chain: 'Solana', gasPriceGwei: 0.001, status: 'ok', latencyMs: 89 },
      { chain: 'Arbitrum', gasPriceGwei: 0.08, status: 'ok', latencyMs: 178 },
    ],
    checkedAt: Date.now(),
  })
})

app.get('/api/news', (_req, res) => {
  res.json([
    { title: 'Virtuals Protocol Launches x402 Integration', source: 'CoinDesk', timestamp: new Date().toISOString(), url: '#' },
    { title: 'Bittensor Subnet 36 Sees Record Activity', source: 'The Block', timestamp: new Date().toISOString(), url: '#' },
    { title: 'ElizaOS Reaches 1B Market Cap', source: 'Decrypt', timestamp: new Date().toISOString(), url: '#' },
  ])
})

app.get('/api/history', (_req, res) => {
  const history = []
  const now = new Date()
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    history.push({
      date: date.toISOString().split('T')[0],
      value: 1100 + Math.random() * 200 - i * 2,
    })
  }
  res.json(history)
})

app.get('/api/attestations', (_req, res) => {
  res.json([
    { timestamp: new Date().toISOString(), type: 'Virtuals', agent: 'AIXBT', action: 'job_complete', hash: '0xabc123', sig: 'kms:xyz', chain: 'Base', value: 0.0019 },
    { timestamp: new Date().toISOString(), type: 'PoAA', agent: 'agent_0x3f2a', action: 'yield_opt', hash: '0xdef456', sig: 'kms:abc', chain: 'Gnosis' },
  ])
})

const PORT = parseInt(process.env.PORT || '3000', 10)
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   CORTEX Terminal                              ║
║   Running on http://localhost:${PORT}             ║
║                                                  ║
║   API Endpoints:                                ║
║   /api/prices, /api/agents, /api/agdp          ║
║   /api/yields, /api/ars, /api/x402             ║
║   /api/tokens, /api/network, /api/news         ║
╚══════════════════════════════════════════════════╝
  `)
})
