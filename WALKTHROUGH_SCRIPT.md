# CORTEX — Video Walkthrough Script
**Target length:** ~4:45 | **Style:** Technical, fast-paced, terminal aesthetic

---

## [0:00 – 0:20] COLD OPEN

**[SCREEN]** Terminal boots from black. CORTEX loads at `localhost:3000`. All panels populate.

**[VOICE]**
> "This is CORTEX — a Bloomberg Terminal for the AI agent economy.
> Built with Next.js 15, TypeScript, zero UI libraries, zero paid API keys.
> Everything you see is real live data. Let me show you how it works."

---

## [0:20 – 1:10] UI OVERVIEW — THE LAYOUT

**[SCREEN]** Zoom out to show full terminal. Slowly pan across each panel.

**[VOICE]**
> "The layout is a CSS Grid — two rows of five panels each, with a persistent news
> column on the right spanning both rows."

**[SCREEN]** Hover over top bar — show ETH price, aGDP, agent count, AAI-50 ticking.

> "The top bar gives you the macro pulse: ETH price from Binance's public API,
> aGDP — the aggregate market cap of all Virtuals Protocol agents — updated live,
> and the AAI-50 index, which tracks the top 50 AI agents like an equity index."

**[SCREEN]** Point to network health bar (the thin 16px strip below the top bar).

> "Below that — a 16-pixel network health strip. Three RPCs polled every 20 seconds:
> Ethereum mainnet, Base, Arbitrum. Green, amber, red based on gas price thresholds."

**[SCREEN]** Quickly swipe through the 10 panels. Pause on: AAI-50 chart, ARS scores, Attestation stream.

> "Ten panels across two rows. The AAI-50 has a real 30-day price chart.
> ARS — Agent Reliability Score — is a rule-based 0-to-1000 composite score.
> And the bottom-right panel is a live SSE stream of on-chain attestations."

---

## [1:10 – 2:00] DATA SOURCES — ALL FREE

**[SCREEN]** Open browser tab to `localhost:3000/api/status`. Show the JSON response.

**[VOICE]**
> "Every data source in CORTEX is a free public API. Hit `/api/status` and you see
> a live health check across all seven sources."

**[SCREEN]** Scroll through the `sources` array, highlight each `"mode": "LIVE"`.

> "Virtuals Protocol — public REST API, no key, gives us 1,400-plus agents with
> mindshare, market cap, and volume.

> DeFiLlama — two endpoints. The yields API for DeFAI protocol APYs, and the coins
> API for token prices and market caps. No key, no rate limits.

> Binance public ticker for ETH and TAO prices.

> Olas on TheGraph — a public GraphQL subgraph for PoAA checkpoint attestations.

> CoinTelegraph RSS for the news feed.

> And OpenRouter for the LLM command bar — that's the only key in the whole project."

---

## [2:00 – 3:00] CODE ARCHITECTURE

**[SCREEN]** Open VS Code (or file tree). Show `/app/api/` directory. Expand it.

**[VOICE]**
> "The codebase follows Next.js App Router conventions. Fifteen API routes, all
> server-side. Each one fetches from a free source, applies a server-side cache,
> and falls back to mock data on error — so the terminal never shows a broken panel."

**[SCREEN]** Open `app/api/agdp/route.ts`. Highlight the cache block and the fallback.

> "Here's the aGDP route. Server-side in-memory cache — 60 seconds. If the Virtuals
> fetch fails or returns zero, it throws and we return mock. Clean, no drama."

**[SCREEN]** Open `lib/sources/virtuals.ts`. Show `fetchStats()`.

> "The aGDP calculation: fetch top 200 agents across two pages, sum their
> `mcapInVirtual` field, multiply by the live VIRTUAL/USD price from DeFiLlama.
> That's the ecosystem's aggregate GDP."

**[SCREEN]** Open `lib/ars.ts`. Show `computeARS()` function and the weighted inputs.

> "ARS scoring is deterministic — no ML. Six weighted inputs: framework maturity,
> audit status, agent age, developer wallet age, x402 reliability, and mindshare
> momentum. Each scored 0 to 1, multiplied by weights, summed to 1000."

**[SCREEN]** Open `app/api/attestations/stream/route.ts`. Show the ReadableStream block.

> "The attestation stream is Server-Sent Events — a `ReadableStream` pushed over
> HTTP. On connect, it flushes real Olas PoAA checkpoints from the TheGraph
> subgraph, then generates synthetic events every 3 to 6 seconds to simulate
> live network activity. The client never polls — it just listens."

---

## [3:00 – 3:45] SVG CHARTS & UI DETAILS

**[SCREEN]** Click into the AAI-50 panel. Toggle 7D / 30D.

**[VOICE]**
> "The charts are hand-rolled SVG — no chart library. Catmull-Rom spline for smooth
> curves, a filled area path, hover crosshair with a flipping tooltip.
> The 30-day history comes from DeFiLlama's chart endpoint for the VIRTUAL token,
> normalized to an index scale."

**[SCREEN]** Hover slowly across the chart. Show the tooltip flip near the right edge.

> "The tooltip auto-flips when within 60 pixels of the right edge — small detail,
> but it's the kind of thing that makes a terminal feel polished."

**[SCREEN]** Point to Turing Spread panel — show the diverging bars.

> "Turing Spread uses a pure CSS diverging bar layout. No SVG, no canvas.
> Green bars extend right for agents outperforming their base model.
> Red bars extend left for underperformers. Width is proportional to spread magnitude."

**[SCREEN]** Press keys `1`, `3`, `8` — show cyan focus outlines jumping between panels.

> "Keyboard shortcuts. `1` through `0` focus each panel with a cyan outline.
> `S` opens the status overlay. `/` drops you into the command bar.
> Bloomberg-terminal muscle memory."

---

## [3:45 – 4:30] COMMAND BAR DEMO

**[SCREEN]** Press `/`. Command bar input activates.

**[VOICE]**
> "The command bar takes natural language queries. Backed by Claude Haiku via
> OpenRouter — fast, cheap, context-aware."

**[SCREEN]** Type: `Show agents with ARS above 800` → hit Enter. Wait for response.

> "It knows the data model — ARS scores, frameworks, aGDP, x402 flows, mortality rates."

**[SCREEN]** Response card appears with terminal-formatted output. Show the model name at bottom.

> "Response comes back formatted for a monospace terminal. Model, token count,
> all in the footer. Tab autocompletes from a preset suggestion list,
> arrow keys scroll history."

**[SCREEN]** Press `Esc` — card dismisses. Command bar clears.

---

## [4:30 – 4:45] CLOSE

**[SCREEN]** Zoom out to full terminal view. Let it sit for 3 seconds — data ticking.

**[VOICE]**
> "CORTEX. Next.js 15, TypeScript, zero paid data keys, zero UI libraries.
> All real data. All open."

**[SCREEN]** Fade to black. Optional: show GitHub URL or domain.

---

## PRODUCTION NOTES

| Segment | Duration | Screen action |
|---|---|---|
| Cold open | 0:20 | Terminal boot animation |
| UI overview | 0:50 | Full-screen pan, panel highlights |
| Data sources | 0:50 | `/api/status` JSON in browser |
| Code architecture | 1:00 | VS Code: 4 files, highlight key lines |
| Charts & UI details | 0:45 | AAI-50 hover, Turing bars, keyboard |
| Command bar demo | 0:45 | Live query + response |
| Close | 0:15 | Full terminal, fade |
| **Total** | **4:45** | |

### Key files to have open/ready
```
app/api/agdp/route.ts         ← caching + fallback pattern
lib/sources/virtuals.ts       ← aGDP calculation
lib/ars.ts                    ← ARS scoring algorithm
app/api/attestations/stream/  ← SSE stream
components/Terminal/LineChart.tsx  ← SVG chart
hooks/useTerminalData.ts      ← data orchestration
```

### Terminal font / zoom
- Font: JetBrains Mono — make sure it's rendering sharp in the recording
- Browser zoom: 80% to show full terminal without scrolling
- Resolution: 1920×1080 minimum; record at 2× for retina if possible

### Tone
Dense and fast. Assume the viewer knows React and APIs. Skip the basics,
go straight to the interesting decisions: why no chart library, why SSE over
WebSocket, why rule-based ARS over ML, why no paid APIs.
