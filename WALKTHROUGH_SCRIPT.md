# CORTEX — Video Walkthrough Script
**Target length:** ~5:10 | **Style:** Technical, fast-paced, terminal aesthetic

---

## [0:00 – 0:20] COLD OPEN

**[SCREEN]** Terminal boots from black. CORTEX loads at `localhost:3000`. All panels populate with live data.

**[VOICE]**
> "This is CORTEX — a Bloomberg Terminal for the AI agent economy.
> Next.js 15, TypeScript, zero UI libraries, one API key.
> Every number you see is pulled live. Let me show you how it works."

---

## [0:20 – 1:15] UI OVERVIEW — THE LAYOUT

**[SCREEN]** Zoom out to show the full terminal. Pan slowly left to right, top to bottom.

**[VOICE]**
> "Six-row CSS Grid. Top bar, 16-pixel network strip, two content rows of five panels each,
> a news column spanning both content rows on the right, and a command bar at the bottom."

**[SCREEN]** Hover over top bar — ETH price ticking, aGDP number, agent count, purple DA chip.

> "Top bar: ETH spot from Binance, aGDP — the aggregate market cap of every Virtuals
> Protocol agent summed in real time — and a purple chip showing the latest EigenDA blob
> commitment. Click it, you land on EigenExplorer with the raw blob."

**[SCREEN]** Point to the 16px network health strip.

> "Network strip — three public RPC calls every 20 seconds:
> Ethereum mainnet via publicnode.com, Base via mainnet.base.org,
> Arbitrum via arbitrum.publicnode.com. Green is under threshold, amber is congested, red is down."

**[SCREEN]** Highlight top row left to right: AAI-50 → Mortality → ARS → Consensus → Token Watchlist.

> "Top row left to right: AAI-50 index with a 30-day price chart —
> Agent Mortality tracking churn and zombies across the ecosystem —
> ARS reliability scores for the top ten agents —
> Consensus layer showing agent price predictions —
> and a live token watchlist: VIRTUAL, OLAS, TAO, AIXBT, COOKIE from DeFiLlama."

**[SCREEN]** Highlight bottom row: Turing Spread → Actuarial → x402 → DeFAI → Attestation stream.

> "Bottom row: Turing Spread comparing each agent's actual performance against its
> base model baseline — Actuarial loss rates grouped by framework and age —
> x402 payment flows from real agent volume data —
> DeFAI protocol APYs from DeFiLlama —
> and a live SSE stream of on-chain attestations."

---

## [1:15 – 2:00] DATA SOURCES

**[SCREEN]** Open `localhost:3000/api/status`. Show the JSON. Scroll through `sources` array.

**[VOICE]**
> "Hit `/api/status` — a health check across all eight data sources. Latency, mode, sample value.
> Seven of them are completely free, no key required."

**[SCREEN]** Scroll past each `"mode": "LIVE"` entry.

> "Virtuals Protocol — public REST API, 20,000-plus G.A.M.E. agents, no key.
> This is the backbone: AAI-50, ARS, aGDP, Mortality, Turing Spread, Actuarial, and x402
> are all derived from this one source.

> DeFiLlama — two endpoints. The yields API for DeFAI APYs, the coins API for
> token prices and 30-day VIRTUAL price history. No key, no rate limits.

> Binance public ticker for ETH and TAO spot prices.

> Olas on TheGraph — a public GraphQL subgraph for PoAA checkpoint attestations.

> CoinTelegraph RSS for the news feed.

> Three public RPCs — publicnode and base.org — for the network health strip.

> EigenDA proxy on port 3100 for state snapshots.

> And OpenRouter — the only key in the project. That's the command bar LLM."

---

## [2:00 – 3:10] CODE ARCHITECTURE

**[SCREEN]** Open `/app/api/` in the file tree — show 15 routes.

**[VOICE]**
> "Fifteen API routes, all server-side. Every one of them follows the same pattern:
> server-side in-memory cache, fetch from the free source, fall back to mock on error.
> The UI never sees a broken panel."

**[SCREEN]** Open `app/api/agdp/route.ts`. Highlight the cache block and fallback.

> "aGDP route. 60-second cache. Virtuals returns zero or throws — fall back to mock.
> The cache key is just a module-level variable. No Redis, no database."

**[SCREEN]** Open `lib/sources/virtuals.ts`. Show `fetchStats()`.

> "aGDP: fetch top 200 agents by mcap sorted descending, sum `mcapInVirtual`,
> multiply by the live VIRTUAL/USD price from DeFiLlama. That's the ecosystem GDP."

**[SCREEN]** Open `lib/ars.ts`. Show the `WEIGHTS` object.

> "ARS — Agent Reliability Score. Eight weighted inputs, fully deterministic, no ML.
> Framework maturity, incident count, on-chain behavior, capital, developer wallet age,
> x402 reliability, PoAA attestation score, and agent age.
> Each scores 0 to 100, weighted, summed to 1000."

**[SCREEN]** Open `app/api/mortality/route.ts`. Show the two fetches: mindshare:desc + mindshare:asc.

> "Mortality pulls two samples from Virtuals in parallel — top agents by mindshare
> and bottom agents by mindshare. Bottom agents with near-zero volume and activity
> are the dead ones. We count them, bucket by cause, scale to the 20,000-agent ecosystem.
> Real churn from real data."

**[SCREEN]** Open `app/api/snapshot/route.ts`. Show the EigenDA write.

> "Every five minutes — server startup via `instrumentation.ts` — we serialize
> the current agent state, ARS scores, and aGDP to JSON and POST it to the EigenDA proxy.
> The blob commitment comes back and lands in the top bar.
> Tamper-evident, on-chain, verifiable — no signed transaction required."

---

## [3:10 – 3:55] CHARTS & UI DETAILS

**[SCREEN]** Click into the AAI-50 panel. Toggle 7D / 30D.

**[VOICE]**
> "Charts are hand-rolled SVG — no chart library at all.
> Catmull-Rom spline for the smooth curve, filled area path below it,
> hover crosshair with a live tooltip.
> The 30-day data is VIRTUAL token price history from DeFiLlama, normalized to an index scale."

**[SCREEN]** Hover slowly across the chart. Show tooltip flip near the right edge.

> "Tooltip auto-flips at 60 pixels from the right edge. Small thing —
> but Bloomberg traders notice when it clips off screen."

**[SCREEN]** Point to Turing Spread panel — show diverging green and red bars.

> "Turing Spread is pure CSS. No SVG, no canvas.
> Green bars extend right — agent outperforming its base model.
> Red extend left — underperforming. Width is proportional to spread magnitude.
> The baseline per framework is fixed: G.A.M.E. agents are compared against GPT-4o-mini,
> Olas agents against Gemini Pro. All derived from Virtuals agentScore in real time."

**[SCREEN]** Press `1`, `3`, `8` — cyan outlines jump between panels.

> "Keys 1 through 0 focus each panel with a cyan outline.
> S opens the live status overlay. Slash drops into the command bar.
> N focuses the news column. No mouse needed."

---

## [3:55 – 4:45] COMMAND BAR DEMO

**[SCREEN]** Press `/`. Command bar activates.

**[VOICE]**
> "Natural language query layer. Claude Haiku via OpenRouter —
> fast enough to feel instant, cheap enough to leave running."

**[SCREEN]** Type: `Which agents have the highest Turing spread right now?` → Enter. Wait.

> "The system prompt is seeded with the live terminal state —
> current ARS scores, top agents, aGDP, framework distribution.
> The model knows what's on screen."

**[SCREEN]** Response card appears. Point to model name + token count in footer.

> "Response formatted for monospace. Model and token count in the footer.
> Tab autocompletes from suggestions. Arrow keys scroll query history."

**[SCREEN]** Press Esc — card dismisses cleanly.

---

## [4:45 – 5:00] EIGENCOMPUTE DEPLOYMENT

**[SCREEN]** Show `Dockerfile` — highlight `linux/amd64`, `standalone`, `USER root`.

**[VOICE]**
> "Ships as a multi-stage linux/amd64 image — the architecture EigenCompute TEE nodes run on.
> Next.js standalone output means no node_modules at runtime.
> Push the image, run `ecloud compute app upgrade`, and you're live inside a verified enclave."

**[SCREEN]** Show the purple DA chip in TopBar. Click it — EigenExplorer opens.

> "Every deploy is pinned to an immutable tag — v0.1.0, v0.2.0.
> Every state snapshot is anchored to EigenDA.
> The terminal proves its own data."

---

## [5:00 – 5:10] CLOSE

**[SCREEN]** Zoom out to full terminal. Hold 3 seconds — numbers ticking live.

**[VOICE]**
> "CORTEX. One API key. Zero UI libraries. All real data."

**[SCREEN]** Fade to black.

---

## PRODUCTION NOTES

| Segment | Duration | Screen action |
|---|---|---|
| Cold open | 0:20 | Terminal boot, all panels populate |
| UI overview | 0:55 | Pan top-bar → network strip → top row → bottom row |
| Data sources | 0:45 | `/api/status` in browser, scroll sources array |
| Code architecture | 1:10 | 5 files: agdp · virtuals · ars · mortality · snapshot |
| Charts & UI details | 0:45 | AAI-50 hover + flip, Turing bars, keyboard nav |
| Command bar demo | 0:50 | Live query, response card, Esc dismiss |
| EigenCompute | 0:15 | Dockerfile + DA chip → EigenExplorer |
| Close | 0:10 | Full terminal hold, fade |
| **Total** | **5:10** | |

### Key files to have open/ready
```
app/api/agdp/route.ts              ← cache + fallback pattern (the template)
lib/sources/virtuals.ts            ← aGDP, x402 flows, attestations
lib/ars.ts                         ← 8 weighted inputs, deterministic scoring
app/api/mortality/route.ts         ← top+bottom agent samples → real churn
app/api/snapshot/route.ts          ← EigenDA write path
instrumentation.ts                 ← 5-min snapshot loop on server startup
components/Terminal/LineChart.tsx  ← hand-rolled SVG, Catmull-Rom spline
hooks/useTerminalData.ts           ← polling + SSE → single data object
```

### Live vs simulated at recording time
| Panel | Source | Status |
|---|---|---|
| TopBar (ETH, aGDP, AAI-50, DA chip) | Binance + Virtuals + DeFiLlama + EigenDA | **LIVE** |
| NetworkHealthBar (ETH/BASE/ARB) | publicnode.com + base.org | **LIVE** |
| AAI-50 chart + leaderboard | Virtuals (top 10 by mindshare) | **LIVE** |
| ARS Panel | Virtuals via computeARS() | **LIVE** |
| Token Watchlist | DeFiLlama coins API | **LIVE** |
| DeFAI Yields | DeFiLlama yields API | **LIVE** |
| Mortality | Virtuals (top + bottom by mindshare) | **LIVE** |
| Turing Spread | Virtuals agentScore vs framework baselines | **LIVE** |
| Actuarial | Virtuals (3 sort keys → age buckets) | **LIVE** |
| x402 Flows | Virtuals volume24h:desc | **LIVE** |
| Attestation stream | Virtuals activity (+ Olas when subgraph returns data) | **LIVE** |
| News | CoinTelegraph RSS | **LIVE** |
| Consensus | — | simulated (no public source for agent price predictions) |

### Data sources at a glance
| Source | Key | Used for |
|---|---|---|
| Virtuals Protocol (api.virtuals.io) | None | AAI-50, ARS, aGDP, Mortality, Turing, Actuarial, x402, Attestations |
| DeFiLlama yields.llama.fi | None | DeFAI APYs |
| DeFiLlama coins.llama.fi | None | Token watchlist, VIRTUAL price, 30d history |
| Binance api.binance.com | None | ETH + TAO spot prices |
| Olas / TheGraph | None | PoAA attestations |
| CoinTelegraph RSS | None | News feed |
| ethereum.publicnode.com + base.org + arbitrum.publicnode.com | None | Gas prices (network strip) |
| EigenDA proxy :3100 | None (local) | State snapshot blobs |
| OpenRouter openrouter.ai | **OPENROUTER_API_KEY** | Command bar (Claude Haiku) |

### Terminal recording setup
- Font: JetBrains Mono — confirm it's rendering sharp before hitting record
- Browser zoom: 80% to fit full terminal without scroll
- Resolution: 1920×1080 minimum, record at 2× for retina
- Have `/api/status` in a second tab ready to flip to for the data sources segment

### Tone
Dense and fast. Viewer knows React and APIs.
Lead with the interesting decisions, not the obvious ones:
why Virtuals API is the backbone of seven different panels,
why the pagination is broken so we use three sort keys instead,
why SSE over WebSocket, why deterministic ARS over ML,
why EigenDA instead of a database, why one key for the whole project.
