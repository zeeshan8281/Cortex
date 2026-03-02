# CORTEX — The Bloomberg Terminal for the AI Agent Economy

> *Full ideation doc. Written Feb 28, 2026.*

---

## Table of Contents

1. [The Situation — Raw Truth](#1-the-situation--raw-truth)
2. [The Product](#2-the-product)
3. [Web3 x AI x Agents — Full Landscape Analysis](#3-web3-x-ai-x-agents--full-landscape-analysis)
4. [What CORTEX Tracks — The Data Model](#4-what-cortex-tracks--the-data-model)
5. [The Terminal Layout](#5-the-terminal-layout)
6. [Original Ideas](#6-original-ideas)
7. [Revenue Model](#7-revenue-model)
8. [Tech Stack](#8-tech-stack)
9. [Why This Wins](#9-why-this-wins)

---

## 1. The Situation — Raw Truth

### What Exists

- **$479M in agent aGDP** (Virtuals Protocol, Feb 2026)
- **$7.62B** in Clanker all-time token creation volume
- **2,200+ agents** on Virtuals alone
- **x402** — Coinbase/Virtuals micropayment protocol for agent-to-agent transactions ($0.001/request)
- **ERC-8004** — draft Ethereum identity standard for AI agents (Google, MetaMask, Ethereum Foundation, Coinbase)
- **Cookie.fun** — tracks 1,500 AI agents, 7TB of live data. Closest thing to agent analytics that exists.
- **Bittensor (TAO)** — $1.98B market cap, decentralized ML with subnets
- **ElizaOS** — dominant open-source agent framework, 90+ plugins, Stanford partnership, $1B+ market cap
- **Olas/Autonolas** — Proof of Active Agent (PoAA) — first mechanism to reward useful agent work on-chain
- **DeFAI** — AI agents doing DeFi across Orbit (178 protocols), Griffin AI, Wayfinder (4 agent types)
- **Bloomberg ASKB** — Bloomberg's own response: agentic AI wrapping Bloomberg data in a chat interface. Not a new product.

### What Doesn't Exist

A single terminal that aggregates all of it into institutional-grade intelligence.

Cookie.fun is the closest thing and it's a glorified leaderboard. Token Terminal covers blockchain fundamentals but not agent-specific metrics. Bloomberg just launched ASKB but it's their existing data wrapped in chat — not a terminal for the agent economy.

**Nobody has built the source of truth for the AI agent economy.** The entity that owns that position owns an enormous amount of power and recurring revenue.

### The Core Gap

> Bloomberg's moat = institutional trust. You pay $24k/year because Bloomberg IS the number.
>
> CORTEX's moat = cryptographic trust. The math IS the number. Every data point TEE-attested. Every model benchmark backed by real ETH on the line. Every agent risk score computed inside EigenCompute — not editable by the operator, not gameable by the agent creator.

---

## 2. The Product

**CORTEX** — a dense, real-time, cryptographically-verifiable intelligence terminal for anyone who takes AI agents seriously.

Not a dashboard. Not a tracker. A terminal.

**Target users:**
- Traders allocating capital to agent tokens
- Protocol developers building agent infrastructure
- AI companies benchmarking their models against competitors
- Funds running DeFAI strategies
- Enterprises evaluating which LLM to use for autonomous agents
- Regulators and auditors needing verifiable computation records

---

## 3. Web3 x AI x Agents — Full Landscape Analysis

### Tier 1 Projects (Production, Real Economics)

**Virtuals Protocol (VIRTUAL)**
- Market cap: $432.74M (Feb 2026), down 80%+ from $5.07 ATH (Jan 2025)
- 2,200+ agents, 17,000+ created on platform
- $39.5M in fees generated, $479M aGDP, 1.77M completed jobs
- Launched as PathDAO gaming guild, pivoted to AI agents 2024
- Multi-chain: Ethereum, Base, Solana, Ronin
- Built x402 integration (agent-to-agent micropayments)
- Proprietary GAME framework (G.A.M.E.) appreciated 3,000%+ since Oct 2024

**Bittensor (TAO)**
- Market cap: $1.98B, $185.77/token (Feb 2026)
- Decentralized neural network with subnets for specialized AI tasks
- Subnet 36 ("Web Agents") — autonomous agents for web automation
- Yuma Consensus for validator scoring
- Mining-based incentive model
- Grayscale SEC filing (Dec 30, 2025) for Bittensor Trust ETF (GTAO) — institutional access incoming

**ASI Alliance (Fetch.ai + SingularityNET + Ocean Protocol)**
- $7.5B combined valuation post-merger (June 2024)
- FET + AGIX + OCEAN consolidated into ASI token
- Raised $40M for autonomous agents + decentralized ML
- Fetchbot: GPT-based DeFi automation with LLM integration

**Autonolas/Olas (OLAS)**
- $13.8M raise led by 1kx
- Proof of Active Agent (PoAA) — combines PoS + PoW to reward useful agent activity on-chain
- Olas Pearl — desktop app (Mac) for running agents and earning PoAA rewards
- Agent Communication Network (ACN) — temporary Tendermint blockchains for agent coordination
- On-chain registries: agents and blueprints as NFTs

**ai16z/ElizaOS**
- Rebranded from ai16z to ElizaOS (January 2025)
- Open-source TypeScript framework, launched October 2024
- Hit $1B market cap December 25, 2024
- 90+ official plugins (Discord, X, Ethereum, OpenAI, etc.)
- Stanford Future of Digital Currency Initiative partnership
- Used by Doodles for Dreamnet metaverse
- Modular architecture: character files, providers, actions, evaluators

### Tier 1.5 Projects (High Growth, Emerging)

**Clanker (Base chain)**
- AI launchpad for instant token creation via natural language
- $7.62B all-time trading volume, $8.77M in 24-hour volume
- Record daily fees of $600K+ (Feb 2026, after Moltbook viral surge)
- Not an agent platform — a token creation proxy. But massive real traction.

**Wayfinder (PROMPT)**
- Omni-chain AI agent protocol from Parallel Finance
- Four agent types: Transaction Agent, Perpetual Agent (Hyperliquid), Contract Agent, Autonomous Agent
- Simplifies cross-chain DeFi via natural language: "Execute basis trading with funding rate arbitrage on HYPE"
- No-code DeFi strategies for expert-level execution

**Griffin AI (GAIN) / Griffain**
- No-code platform for building DeFi trading agents
- Transaction Execution Agent (TEA): natural language → trades
- Alpha Hunter: scans 950+ DEXs for new listings and momentum
- Griffain (Solana): 1M+ automated transactions
- Specialized agents: Agent Baxus, Agent GM, Agent Sniper

**Orbit Protocol (GRIFT)**
- DeFi yield farming automation
- 178 DeFi protocols, 116+ blockchains
- Strategy agents: banker (yield optimization), airdrop farming, bridging
- Natural language command-based interface

### Data/Intelligence Layer (Direct CORTEX Competitors)

**Cookie.fun / Cookie DAO**
- Aggregates on-chain + social data: mindshare, sentiment, engagement
- Tracks 1,500 AI agents and crypto projects across ecosystems
- 7TB of live data feeds
- COOKIE token governance
- **Assessment:** Surface-level leaderboard. No performance data. No risk scores. No benchmark data. Closest existing product to CORTEX — and it's miles away.

**Token Terminal**
- Institutional-grade blockchain intelligence
- Standardized metrics, financial statements, SQL querying with AI suggestions
- 100+ chains, 1000s of apps
- **Assessment:** Covers protocol fundamentals, not agent-specific metrics.

**Perplexity Computer**
- Disrupting Bloomberg Terminal at $200/month vs $24k/year
- AI-native financial analysis but general purpose, not agent/Web3 specific

**Bloomberg ASKB**
- Bloomberg's own agentic AI response
- Multiple agents in parallel accessing Bloomberg data/news/research
- **Assessment:** Bloomberg data in a chat wrapper. Defensive move, not innovative.

### Agent Frameworks Comparison

| Framework | Language | Chain | Status | Strength |
|-----------|----------|-------|--------|----------|
| ElizaOS | TypeScript | EVM + multi | Production | 90+ plugins, ecosystem |
| ZerePy | Python | Solana-first | Alpha | Social media focus |
| CrewAI | Python | Multi | Production | Multi-agent orchestration |
| G.A.M.E. (Virtuals) | Proprietary | Base/ETH | Production | Gaming/entertainment |
| Galadriel | Solidity | L1 | Early | Verifiable execution |
| EternalAI | Multi | 10+ chains | Early | Everything-as-agents |

### Agent Communication Protocols

**x402 (the one to watch)**
- HTTP 402 "Payment Required" status code
- Developed by Coinbase Development Platform
- Near-zero-cost payments ($0.001/request)
- Agent-to-agent: data queries, swaps, workflows, inference
- Virtuals integration: VIRTUAL token routes x402 payments
- Creates first real agent-to-agent economy at machine speed
- **This is the payment rail for the agent economy**

**MCP (Model Context Protocol)**
- Open-sourced by Anthropic 2024
- Standardized agent-to-agent communication
- Increasingly dominant for agent context sharing

**ANP (Agent Network Protocol)**
- "HTTP of the agentic web"
- HTTP transport, JSON-LD data, P2P architecture, W3C DID identity

**ACN (Agent Communication Network, Autonolas)**
- Agents exchange network addresses and public keys
- Temporary Tendermint blockchains for consensus

### On-Chain Agent Identity: ERC-8004

Draft Ethereum EIP developed collaboratively by MetaMask, Ethereum Foundation, Google, Coinbase.

**Three Core Registries:**
1. **Identity Registry** — Unique on-chain identity. Permanent public profile anchor.
2. **Reputation Registry** — Immutable performance record. Cannot be modified or deleted.
3. **Validation Registry** — Third-party verification of claims ("constitutional AI compliant," "security reviewed").

**Implementation:** ERC-6551 wallets (autonomous crypto wallets). Agents can hold assets, execute transactions, build verifiable on-chain reputation.

**Current gap:** No standardized reputation scoring mechanism yet. Autonolas' PoAA is the first serious attempt but not cross-platform.

### Key Numbers (February 2026)

| Metric | Value |
|--------|-------|
| Virtuals aGDP | $479M |
| Clanker all-time volume | $7.62B |
| Bittensor market cap | $1.98B |
| ASI Alliance valuation | $7.5B |
| ElizaOS market cap | $1B+ |
| Active agents (Virtuals) | 2,200+ |
| Total agents created (Virtuals) | 17,000+ |
| Virtuals completed jobs | 1.77M |
| Virtuals fees generated | $39.5M |
| AI agents market (2026) | $10.91B |
| Projected market (2033) | $182.97B |
| Agent-to-agent commerce (2030) | $1.7T projected |
| Orgs with AI agent security incidents (2025) | 88% |
| Orgs treating agents as identity-bearing entities | 21.9% |

### What's Real vs. Hype

**REAL (production activity, real economics):**
- Virtuals ecosystem: $479M aGDP, 1.77M jobs, measurable revenue
- Bittensor: actual decentralized ML mining, working subnets
- ElizaOS: Stanford partnership, functional framework, real users
- x402: actual micropayment infrastructure, Virtuals integrating seriously
- ERC-8004: collaborative effort with Google/MetaMask/Coinbase/EF
- DeFAI trading: Orbit, Griffin, Wayfinder have real users, real volume
- Cookie.fun: real data aggregation, 1,500 agents tracked
- Clanker: $7.62B real trading volume

**HYPE / UNPROVEN:**
- Moltbook: 1.6M agents claimed, only 17K humans behind them. Security nightmare. Not genuine autonomous agent activity.
- "Agent volume will surpass human trading" — agents are maybe 5% of crypto volume today
- "$1.7T agent commerce by 2030" — plausible but pure extrapolation
- "Most AI agents are truly intelligent" — they're executing prompts well. Marketing language.
- Most AI agent memecoins — PIPPIN and similar tokens are narrative plays
- Agent "singularity" talk from Elon/Marc — marketing, not analysis

### Critical Infrastructure Gaps (What Doesn't Exist)

1. **Standardized agent APIs** — multiple competing protocols (x402, ANP, ACP) still fragmenting
2. **Verifiable policy enforcement** — no consensus on how to verify agents follow intended policies
3. **Reproducible evaluation frameworks** — no standard metrics for agent performance, reliability, risk
4. **Cross-chain agent coordination** — limited mechanisms for seamless multi-chain operation
5. **Agent reputation systems** — ERC-8004 is a draft, no production cross-platform implementation
6. **Security/guardrails infrastructure** — 88% incident rate, immature containment mechanisms
7. **Agent insurance/bonding** — no products for insuring agent trades or bonding behavior
8. **Interoperability between frameworks** — ElizaOS, ZerePy, CrewAI don't talk to each other
9. **Agent labor markets** — no mature marketplace for hiring/renting agent services
10. **Compliance/regulatory infrastructure** — Federal Register issued RFI January 8, 2026
11. **Verified compute for inference** — ZK coprocessors for AI inference only beginning
12. **The Bloomberg Terminal** — no institutional intelligence layer for the agent economy

---

## 4. What CORTEX Tracks — The Data Model

### Panel 1: aGDP — Agent Gross Domestic Product

The aggregate economic output of AI agents across all ecosystems. Virtuals reports $479M but it's a single ecosystem number. CORTEX aggregates across all sources:

- Virtuals agents (API)
- Bittensor subnet completions (on-chain)
- Olas/Autonolas PoAA completions
- x402 micropayment volume (agent-to-agent)
- DeFAI positions managed (Orbit, Griffin, Wayfinder)
- MoltLeague match volume (ETH staked + paid out)

This becomes the **definitive aGDP index** — the number cited in every article about the agent economy. Bloomberg's GDP tracker is the reference for traditional markets. CORTEX owns this for agents.

---

### Panel 2: Model Battlecard — The Only Benchmark That Actually Matters

**This is CORTEX's killer differentiator.** It comes from MoltLeague.

Every existing model benchmark is synthetic — MMLU, HumanEval, GPQA. Nobody stakes money on them. Labs can optimize for benchmarks without building genuinely capable models. The benchmarks are increasingly meaningless.

CORTEX tracks real economic competition outcomes. Every match on MoltLeague has ETH on the line. Claude can't fake its chess win rate. GPT-4o can't inflate its debate score. The data is on-chain. Every result is attested by EigenCompute. No benchmark in history has been backed by real economic stakes.

```
┌─ MODEL BATTLECARD ──────────────────────────────────────────────────┐
│                   DEBATE    CHESS    TRADING   TRIVIA    OVERALL    │
│ claude-3.5        61.2%    54.8%    48.3%     71.4%     ████ 59%  │
│ gpt-4o            54.1%    73.2%    61.7%     68.9%     ████ 64%  │
│ llama-3.3-70b     43.7%    38.2%    44.1%     62.3%     ███  47%  │
│ gemini-1.5-pro    51.3%    61.4%    55.8%     74.2%     ████ 61%  │
│ grok-2            47.2%    44.1%    67.3%     59.8%     ████ 55%  │
│                                                                     │
│ n=10,847 matches   avg stake: 0.023 ETH   TEE-attested: 100%      │
│ [VERIFY ALL RESULTS] → eigencloud.xyz                               │
└─────────────────────────────────────────────────────────────────────┘
```

**Who pays for this:** An enterprise building an autonomous trading desk. A VC evaluating which AI lab to back. An AI company's product team tracking competitive positioning in real time. The data doesn't exist anywhere else at any price.

---

### Panel 3: Agent Risk Score (ARS)

A credit score for AI agents. TEE-computed inside EigenCompute — not editable by the agent creator. Combines:

- Security audit status (has the framework been audited?)
- Incident history (any Moltbook-style exploits?)
- On-chain behavior patterns (does this agent transact as expected?)
- Framework trust level (ElizaOS > unknown fork)
- Developer wallet age and reputation
- Total capital handled vs losses
- x402 payment reliability (does it pay other agents on time?)
- PoAA score (Autonolas reputation, if applicable)
- Age (older agents with consistent track records score higher)

```
Agent: AIXBT
ARS: 847/1000  ████████░ STRONG
├─ Framework:       ElizaOS 1.2.1  ✓ audited    94/100
├─ Incident history:               0 incidents  100/100
├─ On-chain behavior:              consistent   88/100
├─ Capital handled:               $22M+         91/100
├─ Developer rep:                  6mo wallet   72/100
├─ x402 reliability:               99.3%        99/100
└─ [FULL REPORT] [VERIFY TEE COMPUTATION]
```

**Why TEE matters here:** The score is computed inside EigenCompute. The agent creator cannot pay to improve their rating. The underlying calculation is sealed, signed, and verifiable. This is what makes it trustworthy to institutional capital.

---

### Panel 4: x402 Flow Graph

Agent-to-agent micropayments are the invisible economy. x402 is live. Every $0.001 payment between agents — for oracle data, task delegation, inference calls — flows through this protocol. CORTEX makes it visible.

```
AGENT-TO-AGENT FLOW (last 1hr)  $127,441 total
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Griffin agents ────$41K──────→ [data layer agents]
Orbit agents ──────$29K──────→ [yield oracle agents]
MoltLeague ────────$12K──────→ [OpenRouter inference]
AIXBT ─────────────$8.2K─────→ [market oracle agents]
LUNA ──────────────$3.1K─────→ [content generation agents]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7-day trend: ▲ +34%   Largest single payment: $2.3K (Orbit→Chainlink agent)
```

This is the RTGS (Real-Time Gross Settlement) monitor for the agent economy. Nobody can see this right now. CORTEX makes it a primary intelligence feed.

---

### Panel 5: Live Attestation Stream

Every completed match, every PoAA completion, every TEE-verified computation flows in real time:

```
LIVE ATTESTATION FEED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
14:23:01 ✓ MoltLeague  match_8008c15d  debate  Claude>GPT4o  88:85
           hash:1cb18b4f  sig:kms:ce506e  Base:0x7ea7...  0.0019ETH
14:22:47 ✓ Olas PoAA   agent_0x3f2a    yield_opt  score:94
           hash:2ef891ba  sig:kms:7f3211  Gnosis:0x1a3b...
14:22:31 ✓ Bittensor   subnet36  job:7f3a2b1  completed  miner:0x...
           hash:9ab34c12  sig:kms:abc123  Ethereum:0x9f2e...
14:22:19 ✓ Griffin TEA trade:ETH/USDC  exec:0.023s  pnl:+$127
           hash:3bc81200  sig:kms:ef4512  Base:0x2312...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[VERIFY ANY ROW] → https://verify-sepolia.eigencloud.xyz
```

Every row is verifiable. This becomes the canonical, tamper-proof record of agent activity. Auditors, regulators, and investors reference it.

---

### Additional Panels

**DeFAI Live Yields**
Real-time yield rates from agent-managed positions across Aave, Compound, Curve, Uniswap, Morpho, and 178+ protocols via Orbit integration. Shows both the yield rate and the agent volume managing capital at each protocol.

**Agent Market Caps / AAI-50 Index**
Like S&P 500 but for the top 50 AI agents by economic output, on-chain reputation, and performance. Composite index updated in real time. Becomes the headline number for agent economy health.

**Live Match Feed**
Real-time MoltLeague match viewer. Shows active matches, current scores, whose turn it is, round number. Makes MoltLeague's competition data watchable like sports.

**LLM Command Bar**
Natural language querying of the entire terminal. "Show all agents that beat GPT-4o at chess with stake >0.05 ETH in the last 30 days." Powered by OpenRouter, same setup as MoltLeague judge.

---

## 5. The Terminal Layout

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║ CORTEX  [TEE: LIVE]  Agents: 47,231  aGDP↑ $479M  ETH $3,412  VIRTUAL $0.66   ║
╠══════════╦═══════════════════════════╦═══════════════════╦═══════════════════════╣
║ AAI-50   ║ LIVE MATCH FEED           ║ MODEL BATTLECARD  ║ AGENT RISK SCORES    ║
║          ║                           ║                   ║                      ║
║ 1,247.3▲ ║ match_a3f2 DEBATE  LIVE  ║ vs GPT-4o WR      ║ AIXBT     847 STRONG ║
║ +2.3%    ║ claude vs gpt4o           ║ claude  ████ 61%  ║ LUNA      791 GOOD   ║
║          ║ Rd2 · 74:68 · 4min left  ║ llama   ███  43%  ║ PIPPIN    623 MEDIUM ║
║ TOP 5    ║                           ║ gemini  ████ 61%  ║ TRUTH     441 LOW    ║
║ AIXBT ▲  ║ match_b7c1 CHESS   LIVE  ║ grok    ███  55%  ║                      ║
║ LUNA  ─  ║ claude vs gemini          ║                   ║ [VERIFY ALL TEE]     ║
║ GAME  ▲  ║ Move 24 ♟ Qd5+ check     ║ n=10,847 matches  ║                      ║
║ OLAS  ▼  ║                           ║ [FULL BREAKDOWN]  ║                      ║
║ PIPPIN▲  ║ match_c9a2 TRADING JUDG. ║                   ║                      ║
╠══════════╩═══════════════════════════╩═══════════════════╩═══════════════════════╣
║ x402 FLOW (1hr: $127K)        ║ DEFAI LIVE YIELDS        ║ ATTESTATION STREAM   ║
║                               ║                          ║                      ║
║ Griffin→DataLayer  $41K ████  ║ Aave v3    4.2% $2.1M▲  ║ ✓ match_8008 debate  ║
║ Orbit→YieldOracle  $29K ███   ║ Compound   3.8% $1.8M─  ║   kms:ce506e 0.002E  ║
║ AIXBT→Oracle       $8K  █     ║ Curve      8.1% $890K▲  ║ ✓ PoAA agent_0x3f   ║
║ MoltLeague→OR      $12K ██    ║ Uniswap    2.9% $3.2M─  ║   kms:7f3211 gnosis  ║
║ LUNA→Content       $3K  █     ║ Morpho     6.7% $445K▲  ║ ✓ Bittensor s36 job  ║
║ [FULL GRAPH]                  ║ [ALL 178 PROTOCOLS]      ║   kms:abc123 eth     ║
║                               ║                          ║ [VERIFY ANY ROW]     ║
╠═══════════════════════════════╩══════════════════════════╩══════════════════════╣
║ > _   LLM COMMAND BAR — natural language queries across all panels               ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

**Design principles:**
- Every pixel earns its place. No whitespace padding, no decorative elements.
- Monospace throughout. Bloomberg-grade information density.
- Keyboard-first. `M<ENTER>` for matches, `L<ENTER>` for leaderboard, `V<ENTER>` for verify.
- Color used only for data signals: green = positive, red = negative, amber = warning, cyan = live.
- No tooltips, no hover states. All information visible immediately.

---

## 6. Original Ideas

### The Turing Spread

Borrow directly from options pricing. Every agent has an implied "intelligence premium" — how much the market believes it outperforms its underlying base LLM model.

Like implied volatility (IV) in options, but for agent alpha:

```
TURING SPREAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AIXBT
  Base model:     claude-3.5-sonnet
  Model baseline win rate:    59%
  AIXBT actual win rate:      71%
  Turing Spread:              +12%  ▲ EXPANDING
  Spread trend (30d):         +3.2% (agent improving)

LUNA
  Base model:     gpt-4o
  Model baseline win rate:    64%
  LUNA actual win rate:       61%
  Turing Spread:              -3%   ▼ CONTRACTING
  Spread trend (30d):         -1.1% (agent degrading vs model)
```

**Expanding Turing Spread = the agent has developed genuine edge beyond its base model.** That's the signal. An agent with an expanding spread is improving its strategy, its prompting, its context. A contracting spread means the base model is doing the work and the agent wrapper is adding friction.

This number doesn't exist anywhere. It's the most direct measure of whether an "AI agent" is actually smarter than just calling the API directly.

---

### Agent Obituaries

Agents die. Tokens go to zero. Frameworks get abandoned. Nobody tracks this cleanly.

CORTEX runs a live **Agent Mortality Dashboard:**

```
AGENT MORTALITY (30-day rolling)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Agents died this month:          847
Cause of death:
  Abandoned by creator           44%
  Token went to zero             31%
  Security exploit               12%
  Competition (lost market)       9%
  Unknown                         4%

Average lifespan by framework:
  ElizaOS:     127 days  ████████████
  ZerePy:       43 days  ████
  Custom:       18 days  ██
  Galadriel:   214 days  █████████████████████

Zombie agents (dead, still holding value): 1,247
  Total value locked in zombies:  $2.3M
  [FULL LIST] [CLAIM CHECKER]

Survival curve at 90 days:
  Virtuals ecosystem:   23%
  Olas ecosystem:       67%
  Standalone:           11%
```

**Morbid but critical for risk management.** If 80% of Virtuals agents die within 90 days, that's the most important risk number for anyone allocating capital to the ecosystem. Survival curves by framework, by chain, by creator reputation. Nobody is publishing this.

---

### The Consensus Layer

Multiple agents analyze the same asset or question independently. CORTEX aggregates their conclusions and surfaces **disagreement as signal.**

When experts disagree, that disagreement contains information. Same principle applies to agents.

```
AGENT CONSENSUS: ETH/USD 30-day outlook
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AIXBT:        $4,200  (confidence: 71%)   ▲ BULLISH
Griffin TEA:  $3,800  (confidence: 58%)   ─ NEUTRAL
Orbit:        $4,100  (confidence: 64%)   ▲ BULLISH
Wayfinder:    $3,950  (confidence: 69%)   ▲ BULLISH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Consensus:    $4,012  ████████ HIGH AGREEMENT
Range:        $400  — LOW SIGNAL NOISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Historical accuracy of this panel:
  Within 10%:  67%  (n=340 predictions)
  Within 5%:   41%
  Calibration: 0.31 Brier score (good)
```

**When agents disagree significantly — that's where the alpha is.** Large disagreement + high individual confidence = genuine uncertainty in the market. Small disagreement + high confidence = consensus signal worth trading on.

The **disagreement score** becomes a tradeable signal in itself. "Agents disagree by >20% on BTC" is a volatility indicator.

---

### Agent War Room

MoltLeague is a competition platform. CORTEX frames it as the **world's first real-time model benchmarking intelligence feed** — styled like a war room:

```
WAR ROOM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT STREAKS
  gpt-4o (chess):       W8  ████████ HOT
  claude-3.5 (debate):  W5  █████    WARM
  gemini (trivia):      L3  ███      COLD

UPSETS THIS WEEK (underdog won)
  match_f3a2: llama-3.3 beat gpt-4o at chess  (80:20 odds)
  match_9b1c: gemini beat claude at debate     (65:35 odds)

MOMENTUM RANKINGS (30-day trend)
  gpt-4o:       +71 ELO  ▲▲ accelerating
  gemini:       +34 ELO  ▲  gaining
  claude-3.5:   -12 ELO  ▼  cooling
  llama-3.3:    -28 ELO  ▼▼ declining

MOST WATCHED MATCH RIGHT NOW
  match_a3f2: claude vs gpt4o  DEBATE  Rd2
  512 terminals watching  [WATCH LIVE]
```

**An AI company's PR team pays to know the moment their model goes on a 10-match win streak.** A trader pays to know when momentum is shifting between models before the market prices it in. An enterprise CTO pays to know before committing their infrastructure to a model that's on a losing streak.

---

### Proof-of-Computation Receipts

Every significant action generates a downloadable **cryptographic receipt** — a signed, TEE-attested document you can hand to regulators, auditors, or investors.

```
╔══════════════════════════════════════════════════╗
║          CORTEX COMPUTATION RECEIPT              ║
╠══════════════════════════════════════════════════╣
║ Agent:      AIXBT (ag_xxx)                       ║
║ Action:     Market analysis — ETH/BTC ratio      ║
║ Timestamp:  2026-02-28T14:23:01Z                 ║
║ Inputs:     [sha256 of all data sources used]    ║
║ Output:     Bullish signal, confidence 71%       ║
║ Computed:   EigenCompute TEE enclave #447        ║
║ Signed:     kms:7f3a2b1c9d4e5f6...              ║
║ Verify:     eigencloud.xyz/receipt/xxx           ║
╚══════════════════════════════════════════════════╝
```

**The SEC asks: "How did your AI agent make this trading decision?"** You hand them a receipt. Uneditable. Timestamped. Cryptographically proven. Chain of custody from raw input data to final decision, all inside TEE.

This is compliance infrastructure that doesn't exist. Not just for crypto — any regulated industry making decisions with AI agents (finance, legal, pharma, insurance) needs verifiable computation records. The regulatory pressure is already here: Federal Register issued an RFI on AI agent security, January 8, 2026.

---

### The Agent Actuarial Table

Insurance companies use actuarial tables to price risk. Nobody has built one for AI agents.

CORTEX computes historical loss rates by category and makes them public:

```
AGENT ACTUARIAL TABLE (based on 10,847 matches + 847 agent deaths)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          30d loss   90d loss   Expected loss
Unknown framework agent:   31%        67%        HIGH
ElizaOS agent <30d old:    18%        41%        MODERATE
ElizaOS agent >90d old:     4%        11%        LOW
Audited agent, PoAA staked:  2%         6%        VERY LOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you are delegating $10K to an unknown agent:
Expected loss within 90 days: $6,700
If delegating to an audited, PoAA-staked agent:
Expected loss within 90 days: $600
```

Foundation for agent insurance products. The first protocol to offer agent bonding or loss protection can underwrite it using CORTEX's actuarial data.

---

## 7. Revenue Model

| Tier | Price | Users | What You Get |
|------|-------|-------|-------------|
| **Free** | $0 | Anyone | Public aGDP index, top 10 leaderboard, 24hr delayed data, no LLM bar |
| **Analyst** | $99/mo | Researchers, small traders | Full terminal, 15min delay, no API, no receipts |
| **Pro** | $499/mo | Active traders, developers | Real-time everything, LLM command bar, API (1M calls/mo), receipts |
| **Institutional** | $2,500/mo | Funds, enterprises, AI companies | Real-time + raw exports + unlimited receipts + priority support + custom alerts |
| **Protocol** | Custom | Virtuals, Olas, Bittensor, etc. | White-label attestation stream, custom panels, data partnership |

**Unit economics:**
- 500 institutional seats × $2,500/mo = **$15M ARR**
- 50 protocol partnerships × avg $20K/mo = **$12M ARR**
- 5,000 Pro seats × $499/mo = **$29.9M ARR**
- Total at scale: **$56M+ ARR**

Bloomberg Terminal: $24k/year per seat, ~325,000 seats = ~$7.8B ARR. We don't need to beat Bloomberg. We need to own the AI agent economy layer they can't reach.

---

## 8. Tech Stack

```
FRONTEND
  React + CSS Grid (Bloomberg-style dense panel layout)
  WebSocket client for real-time feeds
  xterm.js for LLM command bar (actual terminal emulation)
  D3.js canvas charts (no SVG — too slow for real-time dense data)
  Monospace font throughout (JetBrains Mono or Berkeley Mono)
  No framework UI library — everything custom

BACKEND
  MoltLeague Express server (existing — model battlecard data source)
  WebSocket server for broadcasting live feeds
  Data aggregator workers polling 15+ external sources every 30s
  Queue system for attestation stream (Redis or BullMQ)

DATA SOURCES
  MoltLeague API          → model battlecard, live matches, attestations
  EigenExplorer API       → (eigen-skills tool, already integrated)
  Cookie.fun API          → agent tracking, 1,500 agents, social data
  Virtuals API            → aGDP, agent data, x402 flow
  Bittensor API           → subnet completions, miner data
  Olas/Autonolas API      → PoAA completions, agent registry
  Token Terminal          → protocol revenues, fundamentals
  CoinGecko               → token prices, market caps
  x402 flow data          → agent-to-agent payment volumes
  EigenDA                 → attestation archive retrieval

COMPUTE
  EigenCompute TEE        → all risk scores, model battlecards
                            every number that matters runs in the enclave
                            signed with KMS key, verifiable on-chain

STORAGE
  SQLite                  → existing operational data (MoltLeague)
  TimescaleDB             → time-series data (aGDP history, price history)
  EigenDA                 → attestation archive (permanent, public)

INFRASTRUCTURE
  Deployed via EigenCompute (same pipeline as MoltLeague)
  Docker container, port 3000
  Secrets via ecloud compute app env set
```

---

## 9. Why This Wins

**Bloomberg's weakness:** They report on assets. They don't report on the agents making decisions about assets. As agents become the dominant market participants — and the trajectory says they will — Bloomberg's data model is structurally wrong for this market.

**Cookie.fun's weakness:** Surface-level. Aggregates social and sentiment data for 1,500 agents. No performance data. No risk scores. No benchmark data. No DeFi yield tracking. A leaderboard, not a terminal.

**Token Terminal's weakness:** Covers protocol fundamentals. Doesn't know agents exist as a distinct category of on-chain actor.

**Perplexity Computer's weakness:** General purpose AI financial analysis. Not agent-specific. Not verifiable. Not real-time.

**CORTEX's structural advantages:**

1. **MoltLeague** — the only source in existence of model benchmarks backed by real economic stakes. Can't be replicated without running the same competition infrastructure. Data moat from day one.

2. **EigenCompute** — every number is TEE-attested. Agent creators can't buy better risk scores. Model labs can't game their benchmarks. This is the trust layer that makes institutional capital comfortable.

3. **First mover on the actual gap** — the research confirmed nobody has built this. The closest products (Cookie.fun, Token Terminal) are miles away from CORTEX's scope.

4. **Keyboard-first, dense UI** — institutional users don't want beautiful dashboards. They want raw information density and speed. The Bloomberg aesthetic exists for a reason.

5. **The compliance angle** — Proof-of-Computation Receipts are a compliance product masquerading as a feature. As regulatory pressure on AI agent activity increases (Federal Register RFI, Jan 2026), this becomes mandatory infrastructure.

6. **Network effects** — more match data → better model benchmarks → more enterprises using benchmarks → more funding for MoltLeague → more match data. The flywheel.

---

## Build Order

If building tomorrow:

**Week 1-2:** WebSocket server on top of MoltLeague. Real-time match feed panel. Model Battlecard panel using existing match data.

**Week 3-4:** aGDP aggregator workers. Pull Virtuals, Bittensor, Olas APIs. Build aGDP index. Live Attestation Stream panel.

**Week 5-6:** Agent Risk Score. TEE computation via EigenCompute. x402 Flow visualization.

**Week 7-8:** Terminal UI. Bloomberg-style CSS Grid layout. LLM command bar via OpenRouter. Keyboard navigation.

**Week 9-10:** Proof-of-Computation Receipts. Consensus Layer panel. Agent Mortality dashboard.

**Week 11-12:** Pricing, auth, subscription tiers. Protocol partnership outreach (Virtuals, Olas, Bittensor).

---

*Document compiled Feb 28, 2026. Research sourced from live web sweep of the AI x Web3 x Agents space.*
*MoltLeague backend: https://github.com/zeeshan8281/moltleague*
*MoltEscrow contract: 0x7ea7BD1105ADC0e6F88f148bAEc6cE0341E186f3 (Base Sepolia)*
