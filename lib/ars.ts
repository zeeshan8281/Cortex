// Agent Risk Score (ARS) — 0-1000
// Rule-based computation. TEE attestation added later via EigenCompute.

import type { ARSAgent, ARSBreakdown } from '@/types'
import type { CookieAgent } from './sources/cookiefun'

// ─── Scoring functions (each returns 0-100) ──────────────────────────────────

const KNOWN_FRAMEWORKS: Record<string, number> = {
  'elizaos':   94,
  'eliza':     94,
  'game':      88,
  'g.a.m.e.':  88,
  'zereppy':   72,
  'crewai':    75,
  'galadriel': 90,
  'autonolas': 92,
  'olas':      92,
}

function scoreFramework(framework: string, audited: boolean): number {
  const key = framework.toLowerCase()
  const base = Object.entries(KNOWN_FRAMEWORKS).find(([k]) => key.includes(k))?.[1] ?? 30
  return Math.min(100, audited ? base : Math.round(base * 0.75))
}

function scoreIncidents(count: number): number {
  if (count === 0) return 100
  if (count === 1) return 78
  if (count === 2) return 55
  if (count === 3) return 38
  return Math.max(0, 30 - count * 5)
}

function scoreCapital(usd: number): number {
  if (usd >= 20_000_000) return 95
  if (usd >= 10_000_000) return 88
  if (usd >= 5_000_000)  return 80
  if (usd >= 1_000_000)  return 70
  if (usd >= 500_000)    return 60
  if (usd >= 100_000)    return 48
  if (usd >= 10_000)     return 35
  return 20
}

function scoreDeveloper(walletAgeDays: number): number {
  if (walletAgeDays >= 730)  return 96
  if (walletAgeDays >= 365)  return 88
  if (walletAgeDays >= 180)  return 78
  if (walletAgeDays >= 90)   return 65
  if (walletAgeDays >= 30)   return 50
  if (walletAgeDays >= 7)    return 35
  return 20
}

function scoreX402(reliabilityPct: number): number {
  return Math.round(Math.pow(reliabilityPct / 100, 3) * 100)
}

function scorePoAA(score: number | null): number {
  if (score == null) return 50  // no data, neutral
  return Math.min(100, Math.max(0, score))
}

function scoreAge(ageDays: number): number {
  if (ageDays >= 365) return 98
  if (ageDays >= 180) return 88
  if (ageDays >= 90)  return 76
  if (ageDays >= 30)  return 60
  if (ageDays >= 7)   return 40
  return 20
}

function scoreOnchain(behaviorScore: number): number {
  return Math.min(100, Math.max(0, behaviorScore))
}

// ─── Weights ─────────────────────────────────────────────────────────────────

const WEIGHTS: Record<keyof ARSBreakdown, number> = {
  framework: 0.15,
  incidents: 0.15,
  onchain:   0.15,
  capital:   0.10,
  devRep:    0.10,
  x402:      0.10,
  poaa:      0.10,
  age:       0.15,
}

function computeTotal(breakdown: ARSBreakdown): number {
  return Math.round(
    (Object.entries(WEIGHTS) as [keyof ARSBreakdown, number][])
      .reduce((sum, [key, w]) => sum + breakdown[key] * w * 10, 0)
  )
}

function labelFromScore(score: number): ARSAgent['label'] {
  if (score >= 750) return 'STRONG'
  if (score >= 600) return 'GOOD'
  if (score >= 450) return 'MEDIUM'
  if (score >= 300) return 'LOW'
  return 'CRITICAL'
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export interface ARSInput {
  id: string
  name: string
  framework: string
  audited: boolean
  incidentCount: number
  capitalHandledUsd: number
  developerWalletAgeDays: number
  x402ReliabilityPct: number      // 0-100
  poaaScore: number | null        // 0-100 or null
  ageDays: number
  onchainBehaviorScore: number    // 0-100
}

export function computeARS(input: ARSInput): Omit<ARSAgent, 'frameworkVersion'> {
  const breakdown: ARSBreakdown = {
    framework: scoreFramework(input.framework, input.audited),
    incidents: scoreIncidents(input.incidentCount),
    onchain:   scoreOnchain(input.onchainBehaviorScore),
    capital:   scoreCapital(input.capitalHandledUsd),
    devRep:    scoreDeveloper(input.developerWalletAgeDays),
    x402:      scoreX402(input.x402ReliabilityPct),
    poaa:      scorePoAA(input.poaaScore),
    age:       scoreAge(input.ageDays),
  }

  const score = Math.min(1000, Math.max(0, computeTotal(breakdown)))

  return {
    id:              input.id,
    name:            input.name,
    score,
    label:           labelFromScore(score),
    framework:       input.framework,
    audited:         input.audited,
    incidents:       input.incidentCount,
    capital:         input.capitalHandledUsd,
    x402Reliability: input.x402ReliabilityPct,
    breakdown,
  }
}

// ─── Convert Cookie.fun agent to ARS input ────────────────────────────────────

export function cookieAgentToARSInput(agent: CookieAgent): ARSInput {
  return {
    id:                    agent.id,
    name:                  agent.agentName,
    framework:             agent.framework ?? 'Custom',
    audited:               agent.agentScore > 70,
    incidentCount:         0,
    capitalHandledUsd:     agent.marketCap * 0.1,
    developerWalletAgeDays:Math.min(730, agent.ageDays ?? 90),
    x402ReliabilityPct:    85 + Math.min(14, agent.holdersCount / 1000),
    poaaScore:             null,
    ageDays:               agent.ageDays ?? 30,
    onchainBehaviorScore:  agent.agentScore,
  }
}
