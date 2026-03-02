import type {
  TopBarData, AAI50Entry, ARSAgent, X402Flow,
  DeFAIProtocol, Attestation, MortalityData, ConsensusData, TuringSpread,
  TokenWatch, NetworkHealth, ActuarialRow, AAI50DataPoint,
} from '@/types'

export const mockTopBar: TopBarData = {
  teeStatus: 'LIVE',
  totalAgents: 47231,
  aGDP: 479,
  aGDPChange: 2.3,
  ethPrice: 3412,
  virtualPrice: 0.66,
  aai50: 1247.3,
  aai50Change: 2.3,
}

export const mockAAI50: AAI50Entry[] = [
  { rank: 1,  name: 'AIXBT',     ticker: 'AIXBT',   score: 1847, change: 2.1,  direction: 'up'   },
  { rank: 2,  name: 'LUNA',      ticker: 'LUNA',    score: 1791, change: 0.0,  direction: 'flat' },
  { rank: 3,  name: 'GAME',      ticker: 'GAME',    score: 1683, change: 1.4,  direction: 'up'   },
  { rank: 4,  name: 'OLAS',      ticker: 'OLAS',    score: 1612, change: -0.8, direction: 'down' },
  { rank: 5,  name: 'GRIFFAIN',  ticker: 'GAIN',    score: 1544, change: 3.2,  direction: 'up'   },
  { rank: 6,  name: 'WAYFINDER', ticker: 'PROMPT',  score: 1487, change: 1.1,  direction: 'up'   },
  { rank: 7,  name: 'PIPPIN',    ticker: 'PIPPIN',  score: 1341, change: -2.1, direction: 'down' },
  { rank: 8,  name: 'ORBIT',     ticker: 'GRIFT',   score: 1298, change: 0.6,  direction: 'up'   },
  { rank: 9,  name: 'TRUTH',     ticker: 'TRUTH',   score: 1187, change: -1.3, direction: 'down' },
  { rank: 10, name: 'BITTENSOR', ticker: 'TAO',     score: 1143, change: 4.7,  direction: 'up'   },
]

export const mockARS: ARSAgent[] = [
  {
    id: 'aixbt',
    name: 'AIXBT',
    score: 847,
    label: 'STRONG',
    framework: 'ElizaOS 1.2.1',
    frameworkVersion: '1.2.1',
    audited: true,
    incidents: 0,
    capital: 22000000,
    x402Reliability: 99.3,
    breakdown: {
      framework: 94,
      incidents: 100,
      onchain: 88,
      capital: 91,
      devRep: 72,
      x402: 99,
      poaa: 84,
      age: 81,
    },
  },
  {
    id: 'luna',
    name: 'LUNA',
    score: 791,
    label: 'GOOD',
    framework: 'G.A.M.E. 2.1',
    frameworkVersion: '2.1',
    audited: true,
    incidents: 1,
    capital: 14500000,
    x402Reliability: 97.1,
    breakdown: {
      framework: 88,
      incidents: 82,
      onchain: 91,
      capital: 84,
      devRep: 79,
      x402: 97,
      poaa: 76,
      age: 73,
    },
  },
  {
    id: 'pippin',
    name: 'PIPPIN',
    score: 623,
    label: 'MEDIUM',
    framework: 'ElizaOS 1.0.4',
    frameworkVersion: '1.0.4',
    audited: false,
    incidents: 2,
    capital: 3200000,
    x402Reliability: 91.2,
    breakdown: {
      framework: 71,
      incidents: 64,
      onchain: 67,
      capital: 61,
      devRep: 55,
      x402: 91,
      poaa: 58,
      age: 62,
    },
  },
  {
    id: 'truth',
    name: 'TRUTH',
    score: 441,
    label: 'LOW',
    framework: 'Custom',
    frameworkVersion: '?',
    audited: false,
    incidents: 4,
    capital: 890000,
    x402Reliability: 82.4,
    breakdown: {
      framework: 31,
      incidents: 42,
      onchain: 51,
      capital: 44,
      devRep: 38,
      x402: 82,
      poaa: 0,
      age: 47,
    },
  },
]

export const mockX402: X402Flow[] = [
  { from: 'Griffin agents',  to: 'data layer',      amount: 41000, barWidth: 90 },
  { from: 'Orbit agents',    to: 'yield oracles',   amount: 29000, barWidth: 64 },
  { from: 'AIXBT',           to: 'market oracles',  amount: 8200,  barWidth: 18 },
  { from: 'Wayfinder',       to: 'cross-chain',     amount: 6700,  barWidth: 15 },
  { from: 'LUNA',            to: 'content agents',  amount: 3100,  barWidth: 7  },
]

export const mockDeFAI: DeFAIProtocol[] = [
  { name: 'Aave v3',    apy: 4.2, aum: 2100000, trend: 'up'   },
  { name: 'Compound',   apy: 3.8, aum: 1800000, trend: 'flat' },
  { name: 'Curve',      apy: 8.1, aum: 890000,  trend: 'up'   },
  { name: 'Uniswap v3', apy: 2.9, aum: 3200000, trend: 'flat' },
  { name: 'Morpho',     apy: 6.7, aum: 445000,  trend: 'up'   },
  { name: 'Pendle',     apy: 11.4, aum: 320000, trend: 'up'   },
  { name: 'Yearn',      apy: 5.3, aum: 670000,  trend: 'down' },
]

export const mockAttestations: Attestation[] = [
  { timestamp: '14:23:01', type: 'PoAA',      agent: 'agent_0x3f2a', action: 'yield_opt',       hash: '2ef891ba', sig: 'kms:7f3211', chain: 'Gnosis',   value: undefined },
  { timestamp: '14:22:47', type: 'Virtuals',  agent: 'AIXBT_by_Virt', action: 'inference_surge_3.2pct', hash: '9ab34c12', sig: 'kms:vrt012', chain: 'Base', value: 142 },
  { timestamp: '14:22:31', type: 'Griffin',   agent: 'TEA_0x2312',   action: 'trade:ETH/USDC',  hash: '3bc81200', sig: 'kms:ef4512', chain: 'Base',     value: 127 },
  { timestamp: '14:22:19', type: 'Orbit',     agent: 'banker_0x1a3b',action: 'rebalance:Aave',  hash: '1cb18b4f', sig: 'kms:ce506e', chain: 'Arbitrum', value: 2300 },
  { timestamp: '14:22:03', type: 'PoAA',      agent: 'agent_0x8f1c', action: 'task_complete',   hash: 'f3a29101', sig: 'kms:bb2233', chain: 'Gnosis',   value: undefined },
  { timestamp: '14:21:47', type: 'Wayfinder', agent: 'wa_0x7e3d',    action: 'cross_chain_swap', hash: 'a1b2c3d4', sig: 'kms:dd4455', chain: 'Base',    value: 450 },
]

export const mockMortality: MortalityData = {
  diedThisMonth: 847,
  causes: [
    { label: 'Abandoned by creator', pct: 44 },
    { label: 'Token went to zero',   pct: 31 },
    { label: 'Security exploit',     pct: 12 },
    { label: 'Lost market',          pct: 9  },
    { label: 'Unknown',              pct: 4  },
  ],
  lifespanByFramework: [
    { framework: 'Galadriel', days: 214, maxDays: 214 },
    { framework: 'ElizaOS',   days: 127, maxDays: 214 },
    { framework: 'ZerePy',    days: 43,  maxDays: 214 },
    { framework: 'Custom',    days: 18,  maxDays: 214 },
  ],
  zombies: 1247,
  zombieValue: 2300000,
  survivalAt90: [
    { ecosystem: 'Olas',       pct: 67 },
    { ecosystem: 'Virtuals',   pct: 23 },
    { ecosystem: 'Standalone', pct: 11 },
  ],
}

export const mockConsensus: ConsensusData = {
  question: 'ETH/USD 30-day outlook',
  predictions: [
    { agent: 'AIXBT',       value: 4200, confidence: 71, signal: 'BULLISH'  },
    { agent: 'Griffin TEA', value: 3800, confidence: 58, signal: 'NEUTRAL'  },
    { agent: 'Orbit',       value: 4100, confidence: 64, signal: 'BULLISH'  },
    { agent: 'Wayfinder',   value: 3950, confidence: 69, signal: 'BULLISH'  },
  ],
  consensus: 4012,
  range: 400,
  agreementLevel: 'HIGH',
  historicalAccuracy10: 67,
  historicalAccuracy5: 41,
  brierScore: 0.31,
  n: 340,
}

export const mockTuringSpread: TuringSpread[] = [
  { agent: 'AIXBT', baseModel: 'claude-3.5-sonnet', modelBaseline: 59, agentActual: 71, spread: 12,  spreadTrend: 3.2,  direction: 'expanding'   },
  { agent: 'LUNA',  baseModel: 'gpt-4o',            modelBaseline: 64, agentActual: 61, spread: -3,  spreadTrend: -1.1, direction: 'contracting' },
  { agent: 'GAME',  baseModel: 'gemini-1.5-pro',    modelBaseline: 61, agentActual: 68, spread: 7,   spreadTrend: 1.4,  direction: 'expanding'   },
  { agent: 'OLAS',  baseModel: 'claude-3.5-sonnet', modelBaseline: 59, agentActual: 55, spread: -4,  spreadTrend: -0.8, direction: 'contracting' },
]

export const mockTokens: TokenWatch[] = [
  { symbol: 'VIRTUAL', name: 'Virtuals Protocol', price: 0.66,   change24h:  3.2,  marketCapM: 640,  coingeckoId: 'virtual-protocol'   },
  { symbol: 'OLAS',    name: 'Autonolas',          price: 1.24,   change24h: -1.1,  marketCapM: 312,  coingeckoId: 'autonolas'           },
  { symbol: 'TAO',     name: 'Bittensor',           price: 387.50, change24h:  5.8,  marketCapM: 2720, coingeckoId: 'bittensor'           },
  { symbol: 'AIXBT',   name: 'AIXBT by Virtuals',   price: 0.31,   change24h:  2.1,  marketCapM: 310,  coingeckoId: 'aixbt-by-virtuals'   },
  { symbol: 'COOKIE',  name: 'Cookie DAO',          price: 0.048,  change24h: -4.3,  marketCapM: 48,   coingeckoId: 'cookie-dao'          },
]

export const mockNetwork: NetworkHealth = {
  chains: [
    { chain: 'ETH',  gasPriceGwei: 12.4, status: 'ok',   latencyMs: 210 },
    { chain: 'BASE', gasPriceGwei: 0.003, status: 'ok',   latencyMs: 95  },
    { chain: 'ARB',  gasPriceGwei: 0.1,  status: 'ok',   latencyMs: 140 },
  ],
  checkedAt: Date.now(),
}

export const mockActuarial: ActuarialRow[] = [
  { framework: 'ElizaOS',   ageBucket: '0-30d',   audited: false, loss30d: 18.4, loss90d: 41.2, n: 312 },
  { framework: 'ElizaOS',   ageBucket: '0-30d',   audited: true,  loss30d: 6.1,  loss90d: 14.8, n: 88  },
  { framework: 'ElizaOS',   ageBucket: '31-90d',  audited: false, loss30d: 9.2,  loss90d: 23.7, n: 248 },
  { framework: 'ElizaOS',   ageBucket: '31-90d',  audited: true,  loss30d: 3.4,  loss90d: 9.1,  n: 71  },
  { framework: 'ElizaOS',   ageBucket: '91d+',    audited: false, loss30d: 4.7,  loss90d: 12.3, n: 190 },
  { framework: 'ElizaOS',   ageBucket: '91d+',    audited: true,  loss30d: 1.8,  loss90d: 5.2,  n: 54  },
  { framework: 'G.A.M.E.',  ageBucket: '0-30d',   audited: false, loss30d: 14.1, loss90d: 33.8, n: 97  },
  { framework: 'G.A.M.E.',  ageBucket: '0-30d',   audited: true,  loss30d: 4.9,  loss90d: 11.2, n: 31  },
  { framework: 'G.A.M.E.',  ageBucket: '31-90d',  audited: false, loss30d: 7.3,  loss90d: 18.4, n: 84  },
  { framework: 'G.A.M.E.',  ageBucket: '91d+',    audited: true,  loss30d: 2.1,  loss90d: 6.4,  n: 28  },
  { framework: 'Custom',    ageBucket: '0-30d',   audited: false, loss30d: 31.7, loss90d: 67.4, n: 441 },
  { framework: 'Custom',    ageBucket: '31-90d',  audited: false, loss30d: 16.2, loss90d: 38.9, n: 203 },
  { framework: 'Custom',    ageBucket: '91d+',    audited: false, loss30d: 8.4,  loss90d: 21.1, n: 89  },
]

// 31 daily closes ending at today (index 30 = today = 1247.3)
const AAI50_CLOSES = [
  1048.2, 1063.7, 1079.1, 1071.4, 1088.6,
  1101.2, 1092.8, 1107.5, 1124.3, 1138.9,
  1142.1, 1129.7, 1136.4, 1152.8, 1161.3,
  1155.9, 1168.4, 1181.7, 1176.2, 1191.4,
  1205.8, 1198.3, 1213.6, 1227.4, 1221.9,
  1231.8, 1239.4, 1244.1, 1236.7, 1218.7,
  1247.3,
]

export const mockAAI50History: AAI50DataPoint[] = AAI50_CLOSES.map((value, i) => {
  const d = new Date(Date.now() - (30 - i) * 86_400_000)
  return { date: d.toISOString().slice(0, 10), value }
})
