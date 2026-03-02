// aGDP — Agent Gross Domestic Product
// Aggregates economic output across all ecosystems

export interface AGDPBreakdown {
  virtuals: number    // Virtuals Protocol reported aGDP
  bittensor: number   // Bittensor subnet emissions (USD equiv)
  olas: number        // Olas PoAA completion value
  x402: number        // x402 agent-to-agent payment volume
  defai: number       // DeFAI positions managed (Orbit, Griffin, Wayfinder AUM)
}

export interface AGDPResult {
  total: number               // USD
  breakdown: AGDPBreakdown
  change24h: number           // %
  change7d: number            // %
  totalAgents: number
  timestamp: string
}

export function aggregateAGDP(breakdown: Partial<AGDPBreakdown>, totalAgents?: number): AGDPResult {
  const b: AGDPBreakdown = {
    virtuals:  breakdown.virtuals  ?? 0,
    bittensor: breakdown.bittensor ?? 0,
    olas:      breakdown.olas      ?? 0,
    x402:      breakdown.x402      ?? 0,
    defai:     breakdown.defai     ?? 0,
  }

  const total = b.virtuals + b.bittensor + b.olas + b.x402 + b.defai

  return {
    total,
    breakdown: b,
    change24h: 0,   // TODO: compute from time-series once DB is wired
    change7d: 0,
    totalAgents: totalAgents ?? 0,
    timestamp: new Date().toISOString(),
  }
}

// Convert Bittensor emission to approximate USD
export function bittensorEmissionToUSD(emissionRao: number, taoPrice: number): number {
  const tao = emissionRao / 1e9  // 1 TAO = 1e9 rao
  return tao * taoPrice
}
