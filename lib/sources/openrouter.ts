// OpenRouter — LLM command bar backend
// Docs: https://openrouter.ai/docs
const BASE = 'https://openrouter.ai/api/v1'

const SYSTEM_PROMPT = `You are CORTEX, the Bloomberg Terminal for the AI agent economy.
You have access to real-time data on:
- AI agent performance, risk scores (ARS 0-1000), and economic output
- aGDP: aggregate economic output across Virtuals, Bittensor, Olas, x402, DeFAI
- AAI-50: top 50 AI agents index (like S&P 500 but for agents)
- x402 flow: agent-to-agent micropayment volumes ($0.001/request protocol)
- DeFAI yields: agent-managed positions across Aave, Compound, Curve, Morpho, etc
- Agent mortality: survival rates, causes of death, zombie agents
- Consensus layer: multi-agent predictions on assets
- Turing Spread: agent performance delta vs base model

Answer queries concisely. Use terminal-style formatting.
Numbers: use $ for USD, % for percentages, K/M/B suffixes.
If asked about a specific agent, include their ARS score and framework.
If asked about yields, include APY and TVL.
Keep responses under 200 words unless asked for detail.`

export interface CommandResponse {
  content: string
  model: string
  inputTokens: number
  outputTokens: number
}

export async function runCommand(query: string): Promise<CommandResponse> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not configured')
  }

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'CORTEX Terminal',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',  // fast + cheap for command bar
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: query },
      ],
      max_tokens: 400,
      temperature: 0.3,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${err}`)
  }

  const json = await res.json()
  const choice = json.choices?.[0]

  return {
    content:      String(choice?.message?.content ?? ''),
    model:        String(json.model ?? ''),
    inputTokens:  Number(json.usage?.prompt_tokens ?? 0),
    outputTokens: Number(json.usage?.completion_tokens ?? 0),
  }
}
