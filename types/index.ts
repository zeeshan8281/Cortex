export interface Agent {
  id: string
  name: string
  ticker: string
  framework: string
  chain: string
  ars: number
  arsLabel: 'STRONG' | 'GOOD' | 'MEDIUM' | 'LOW' | 'CRITICAL'
  capital: number
  change24h: number
  age: number // days
  alive: boolean
}

export interface ARSBreakdown {
  framework: number
  incidents: number
  onchain: number
  capital: number
  devRep: number
  x402: number
  poaa: number
  age: number
}

export interface ARSAgent {
  id: string
  name: string
  score: number
  label: 'STRONG' | 'GOOD' | 'MEDIUM' | 'LOW' | 'CRITICAL'
  breakdown: ARSBreakdown
  framework: string
  frameworkVersion: string
  audited: boolean
  incidents: number
  capital: number
  x402Reliability: number
}

export interface AAI50Entry {
  rank: number
  name: string
  ticker: string
  score: number
  change: number
  direction: 'up' | 'down' | 'flat'
}

export interface X402Flow {
  from: string
  to: string
  amount: number
  barWidth: number
}

export interface DeFAIProtocol {
  name: string
  apy: number
  aum: number
  trend: 'up' | 'down' | 'flat'
}

export interface Attestation {
  timestamp: string
  type: 'PoAA' | 'Virtuals' | 'Griffin' | 'Orbit' | 'Wayfinder'
  agent: string
  action: string
  hash: string
  sig: string
  chain: string
  value?: number
}

export interface MortalityData {
  diedThisMonth: number
  causes: { label: string; pct: number }[]
  lifespanByFramework: { framework: string; days: number; maxDays: number }[]
  zombies: number
  zombieValue: number
  survivalAt90: { ecosystem: string; pct: number }[]
}

export interface ConsensusPrediction {
  agent: string
  value: number
  confidence: number
  signal: 'BULLISH' | 'NEUTRAL' | 'BEARISH'
}

export interface ConsensusData {
  question: string
  predictions: ConsensusPrediction[]
  consensus: number
  range: number
  agreementLevel: 'HIGH' | 'MODERATE' | 'LOW'
  historicalAccuracy10: number
  historicalAccuracy5: number
  brierScore: number
  n: number
}

export interface TopBarData {
  teeStatus: 'LIVE' | 'DEGRADED' | 'DOWN'
  totalAgents: number
  aGDP: number
  aGDPChange: number
  ethPrice: number
  virtualPrice: number
  aai50: number
  aai50Change: number
}

export interface TuringSpread {
  agent: string
  baseModel: string
  modelBaseline: number
  agentActual: number
  spread: number
  spreadTrend: number
  direction: 'expanding' | 'contracting' | 'flat'
}

export interface TokenWatch {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCapM: number // millions
  coingeckoId: string
}

export interface ChainHealth {
  chain: string
  gasPriceGwei: number
  status: 'ok' | 'slow' | 'down'
  latencyMs: number
}

export interface NetworkHealth {
  chains: ChainHealth[]
  checkedAt: number
}

export interface AAI50DataPoint {
  date: string   // 'YYYY-MM-DD'
  value: number
}

export interface ActuarialRow {
  framework: string
  ageBucket: string   // '0-30d' '31-90d' '91-180d' '180d+'
  audited: boolean
  loss30d: number     // percentage
  loss90d: number     // percentage
  n: number           // sample size
}
