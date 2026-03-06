'use client'
import { useMemo } from 'react'
import { usePolling } from './usePolling'
import { useAttestationStream } from './useSSE'
import {
  mockTopBar, mockAAI50, mockARS, mockX402,
  mockDeFAI, mockMortality, mockConsensus, mockTuringSpread,
  mockAttestations, mockTokens, mockNetwork, mockActuarial,
  mockAAI50History,
} from '@/lib/mock'
import type { TopBarData, AAI50Entry, ARSAgent, X402Flow, DeFAIProtocol, Attestation, TokenWatch, NetworkHealth, AAI50DataPoint, MortalityData, TuringSpread, ActuarialRow } from '@/types'
import type { NewsItem } from '@/lib/sources/rss'

interface PricesResponse {
  eth: number; ethChange24h: number
  virtual: number; virtualChange24h: number
}

interface AgentsResponse {
  aai50: AAI50Entry[]
  topBar: { totalAgents: number; aai50: number; aai50Change: number }
}

interface AGDPResponse {
  agdpM: number; agdpChange: number; totalAgents: number
}

interface X402Response {
  flows: X402Flow[]; total: number; trend7d: number; largest: number
}

interface SnapshotResponse {
  commitment: string
  postedAt: string
}

export function useTerminalData() {
  const news    = usePolling<NewsItem[]>('/api/news', 180_000, [])
  const prices  = usePolling<PricesResponse | null>('/api/prices',  30_000, null)
  const agents  = usePolling<AgentsResponse | null>('/api/agents',  60_000, null)
  const agdp    = usePolling<AGDPResponse  | null>('/api/agdp',    60_000, null)
  const yields  = usePolling<DeFAIProtocol[]>('/api/yields',       60_000, mockDeFAI)
  const ars     = usePolling<ARSAgent[]>('/api/ars',               120_000, mockARS)
  const x402    = usePolling<X402Response | null>('/api/x402',     30_000, null)
  const tokens  = usePolling<TokenWatch[]>('/api/tokens',              30_000, mockTokens)
  const network   = usePolling<NetworkHealth | null>('/api/network',         20_000, null)
  const history   = usePolling<AAI50DataPoint[]>('/api/history',             600_000, mockAAI50History)
  const snapshot  = usePolling<SnapshotResponse | null>('/api/snapshot',      30_000, null)
  const mortality = usePolling<MortalityData>('/api/mortality',              120_000, mockMortality)
  const turing    = usePolling<TuringSpread[]>('/api/turing',                120_000, mockTuringSpread)
  const actuarial = usePolling<ActuarialRow[]>('/api/actuarial',             300_000, mockActuarial)
  const sseAtts   = useAttestationStream(8)

  const teeStatus = useMemo<TopBarData['teeStatus']>(() => {
    // EIGENCOMPUTE_ATTESTED is injected by EigenCompute runtime as a public env var
    if (process.env.NEXT_PUBLIC_EIGENCOMPUTE_ATTESTED === 'true') return 'LIVE'
    if (snapshot.data) return 'DEGRADED'  // proxy reachable but not in TEE
    return 'DOWN'
  }, [snapshot.data])

  const topBar = useMemo<TopBarData>(() => ({
    teeStatus,
    totalAgents: agents.data?.topBar.totalAgents ?? agdp.data?.totalAgents ?? mockTopBar.totalAgents,
    aGDP:        agdp.data?.agdpM      ?? mockTopBar.aGDP,
    aGDPChange:  agdp.data?.agdpChange ?? mockTopBar.aGDPChange,
    ethPrice:    prices.data?.eth      ?? mockTopBar.ethPrice,
    virtualPrice:prices.data?.virtual  ?? mockTopBar.virtualPrice,
    aai50:       agents.data?.topBar.aai50       ?? mockTopBar.aai50,
    aai50Change: agents.data?.topBar.aai50Change ?? mockTopBar.aai50Change,
    blobRef:     snapshot.data?.commitment ?? undefined,
  }), [teeStatus, prices.data, agents.data, agdp.data, snapshot.data])

  const attestations: Attestation[] = sseAtts.length > 0 ? sseAtts : mockAttestations

  return {
    topBar,
    aai50:       agents.data?.aai50 ?? mockAAI50,
    ars:         ars.data,
    x402Flows:   x402.data?.flows ?? mockX402,
    x402Total:   x402.data?.total ?? mockX402.reduce((s, f) => s + f.amount, 0),
    x402Trend7d: x402.data?.trend7d ?? 34,
    x402Largest: x402.data?.largest ?? 2300,
    yields:      yields.data,
    attestations,
    mortality:   mortality.data,
    consensus:   mockConsensus,
    turingSpread:turing.data,
    tokens:          tokens.data,
    network:         network.data ?? mockNetwork,
    actuarial:       actuarial.data,
    aai50History:    history.data,
    news:            news.data,
  }
}
